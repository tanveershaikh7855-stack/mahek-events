"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import {
  bookingSchema,
  contactSchema,
  checkoutSchema,
  subscribeSchema,
  type CartItem,
} from "./validators";
import { generateBookingNumber, generateOrderNumber } from "./formatters";
import { priceCart, PricingError } from "./pricing";
import * as email from "./notifications/email";
import * as whatsapp from "./notifications/whatsapp";
import { formatPrice } from "./formatters";
import { DELIVERY_MIN_SUBTOTAL } from "./constants";
import { googleCalendarUrl, parseISTDateTime } from "./calendar-link";

/**
 * Strips angle brackets from free-text fields before they are stored and later
 * rendered into emails. Not a substitute for output escaping — the email layer
 * escapes too — but it keeps obvious markup out of the database.
 */
function sanitize(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export type ActionState<T = object> =
  | ({ success: true } & T)
  | { success: false; errors: Record<string, string[]> };

function fieldErrors(errors: Record<string, string[] | undefined>) {
  const clean: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(errors)) {
    if (value?.length) clean[key] = value;
  }
  return clean;
}

function formError(message: string) {
  return { success: false as const, errors: { form: [message] } };
}

/**
 * Notifications must never fail a transaction that already committed. Each is
 * fired independently and its failure is logged, not thrown.
 */
async function notify(tasks: Promise<unknown>[]): Promise<void> {
  const results = await Promise.allSettled(tasks);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[notify] delivery failed:", result.reason);
    }
  }
}

// ── BOOKINGS ──────────────────────────────────────────────────

export async function submitBooking(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionState<{ bookingNumber: string; bookingId: string; advanceAmount: number }>> {
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { success: false, errors: fieldErrors(parsed.error.flatten().fieldErrors) };
  }

  const data = parsed.data;

  // 50% advance on the stated budget/total, so a product booking can collect it
  // online before the WhatsApp hand-off.
  const budgetNum = data.budget ? Number(data.budget) : 0;
  const advanceAmount = budgetNum > 0 ? Math.round(budgetNum * 0.5) : 0;

  try {
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        eventType: data.event,
        venue: sanitize(data.venue),
        eventDate: data.date ? new Date(data.date) : null,
        eventTime: data.time,
        budget: data.budget ? new Prisma.Decimal(data.budget) : null,
        advanceAmount: advanceAmount > 0 ? new Prisma.Decimal(advanceAmount) : null,
        instructions: data.instructions ? sanitize(data.instructions) : null,
        customerName: sanitize(data.name),
        customerPhone: data.phone,
        customer: {
          connectOrCreate: {
            where: { phone: data.phone },
            create: {
              name: sanitize(data.name),
              phone: data.phone,
              email: data.email || undefined,
            },
          },
        },
      },
    });

    await notify([
      email.sendBookingReceivedEmail({
        bookingNumber: booking.bookingNumber,
        customerName: data.name,
        customerEmail: data.email || null,
        eventType: data.event,
        eventDate: data.date,
        eventTime: data.time,
        venue: data.venue,
      }),
      email.sendAdminAlert(
        `New booking ${booking.bookingNumber}`,
        [
          `Customer: ${data.name} (${data.phone})`,
          `Event: ${data.event} on ${data.date} at ${data.time}`,
          `Venue: ${data.venue}`,
          data.budget ? `Budget: ${formatPrice(Number(data.budget))}` : "Budget: not stated",
        ],
        data.date
          ? {
              calendarUrl: googleCalendarUrl({
                title: `${data.event} — ${data.name} (${booking.bookingNumber})`,
                startIST: parseISTDateTime(data.date, data.time) ?? new Date(`${data.date}T10:00:00+05:30`),
                details: `Booking ${booking.bookingNumber}\nCustomer: ${data.name} — ${data.phone}\nVenue: ${data.venue}${data.budget ? `\nBudget: ${formatPrice(Number(data.budget))}` : ""}`,
                location: data.venue,
              }),
            }
          : undefined,
      ),
      whatsapp.sendText(
        data.phone,
        `Hi ${data.name}, Mahek Balloons has received your ${data.event} decoration request (${booking.bookingNumber}). ` +
          `Our team will call you shortly with a quote. Bookings are confirmed once a 50% advance is paid.`,
      ),
    ]);

    revalidatePath("/admin");

    return {
      success: true,
      bookingNumber: booking.bookingNumber,
      bookingId: booking.id,
      advanceAmount,
    };
  } catch (error) {
    // The previous version returned `success: true` with a freshly generated
    // booking number whenever the database threw — telling the customer they
    // were booked while nothing had been saved.
    console.error("[submitBooking] failed:", error);
    return formError(
      "We could not save your booking just now. Please call us on +91 8087867988 and we will take the details directly.",
    );
  }
}

// ── CUSTOMER ACCOUNTS ─────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name"),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Enter a 10-digit phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strip();

/**
 * Creates a storefront shopper account.
 *
 * A Customer row may already exist from a guest checkout or booking (they are
 * upserted by phone), in which case this claims that record by setting a
 * password rather than failing on the unique phone constraint — otherwise a
 * returning customer could never register.
 */
export async function registerCustomer(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, errors: fieldErrors(parsed.error.flatten().fieldErrors) };
  }
  const data = parsed.data;

  try {
    const existing = await prisma.customer.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });

    if (existing?.password) {
      return formError("An account with that email or phone already exists. Please sign in.");
    }

    const hash = await bcrypt.hash(data.password, 10);

    if (existing) {
      await prisma.customer.update({
        where: { id: existing.id },
        data: {
          name: sanitize(data.name),
          email: data.email,
          phone: data.phone,
          password: hash,
        },
      });
    } else {
      await prisma.customer.create({
        data: {
          name: sanitize(data.name),
          email: data.email,
          phone: data.phone,
          password: hash,
        },
      });
    }

    await notify([
      email.sendWelcomeEmail({
        customerName: data.name,
        customerEmail: data.email,
      }),
      email.sendAdminAlert("New customer registered", [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
      ]),
    ]);

    return { success: true };
  } catch (error) {
    console.error("[registerCustomer] failed:", error);
    return formError("Could not create your account. Please try again.");
  }
}

// ── CONTACT ───────────────────────────────────────────────────

export async function submitContact(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { success: false, errors: fieldErrors(parsed.error.flatten().fieldErrors) };
  }

  const data = parsed.data;

  try {
    await prisma.customer.upsert({
      where: { phone: data.phone },
      update: { name: sanitize(data.name), email: data.email || undefined },
      create: {
        name: sanitize(data.name),
        phone: data.phone,
        email: data.email || undefined,
      },
    });

    await notify([
      email.sendAdminAlert("New contact enquiry", [
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email || "not given"}`,
        `Message: ${sanitize(data.message)}`,
      ]),
    ]);

    return { success: true };
  } catch (error) {
    // Previously this swallowed every DB error and still returned success, so
    // enquiries vanished without anyone knowing.
    console.error("[submitContact] failed:", error);
    return formError("We could not send your message. Please try again or call us.");
  }
}

// ── NEWSLETTER ────────────────────────────────────────────────

export async function subscribe(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionState> {
  const parsed = subscribeSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { success: false, errors: fieldErrors(parsed.error.flatten().fieldErrors) };
  }

  try {
    await prisma.subscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      update: { isActive: true },
      create: { email: parsed.data.email.toLowerCase() },
    });
    return { success: true };
  } catch (error) {
    console.error("[subscribe] failed:", error);
    return formError("Could not subscribe you right now. Please try again.");
  }
}

// ── COUPON PREVIEW ────────────────────────────────────────────

/**
 * Live coupon check for the checkout page. Prices the cart with and without the
 * code (authoritatively, from DB prices) so the customer sees the real discount
 * before placing the order. submitCheckout re-validates the same code, so this
 * is only for display — a tampered response cannot change what is charged.
 */
export async function previewCoupon(
  code: string,
  items: CartItem[],
): Promise<
  | { ok: true; code: string; discount: number; total: number; advanceAmount: number }
  | { ok: false; error: string }
> {
  if (!code.trim()) return { ok: false, error: "Enter a coupon code" };
  try {
    const priced = await priceCart({ items, couponCode: code });
    if (!priced.couponCode || priced.discount <= 0) {
      return {
        ok: false,
        error: "That code is invalid, expired, or doesn't apply to this cart.",
      };
    }
    return {
      ok: true,
      code: priced.couponCode,
      discount: priced.discount,
      total: priced.total,
      advanceAmount: priced.advanceAmount,
    };
  } catch (error) {
    if (error instanceof PricingError) return { ok: false, error: error.message };
    console.error("[previewCoupon] failed:", error);
    return { ok: false, error: "Could not check that code. Please try again." };
  }
}

// ── CUSTOMER REVIEWS ──────────────────────────────────────────

const reviewSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().optional(),
  name: z.string().trim().min(2, "Please enter your name"),
  rating: z.coerce.number().int().min(1, "Select a rating").max(5),
  comment: z.string().trim().max(1000).optional(),
});

/**
 * Public review submission. Saved as unverified — it appears on the product page
 * only after an admin approves it in Admin → Reviews. This is what "let
 * customers post reviews" needs, reusing the existing Review moderation flow.
 */
export async function submitReview(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, errors: fieldErrors(parsed.error.flatten().fieldErrors) };
  }
  const d = parsed.data;
  try {
    const product = await prisma.product.findUnique({
      where: { id: d.productId },
      select: { id: true },
    });
    if (!product) return formError("That product no longer exists.");

    await prisma.review.create({
      data: {
        productId: d.productId,
        rating: d.rating,
        comment: d.comment ? sanitize(d.comment) : null,
        authorName: sanitize(d.name),
        isVerified: false,
      },
    });

    await email
      .sendAdminAlert(`New review awaiting approval`, [
        `Product ID: ${d.productId}`,
        `By: ${d.name} — ${d.rating}★`,
        d.comment ? `Comment: ${d.comment}` : "No comment",
        `Approve it in Admin → Reviews.`,
      ])
      .catch(() => {});

    if (d.slug) revalidatePath(`/shop/${d.slug}`);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("[submitReview] failed:", error);
    return formError("We could not save your review just now. Please try again.");
  }
}

// ── CHECKOUT ──────────────────────────────────────────────────

export type CheckoutSuccess = {
  orderId: string;
  orderNumber: string;
  total: number;
  advanceAmount: number;
  balanceDue: number;
  requiresPayment: boolean;
};

/**
 * Creates an order.
 *
 * Prices are recomputed from the database (see lib/pricing.ts); the `items`
 * argument contributes product IDs and quantities only. Stock is decremented
 * inside the same transaction that writes the order, using a conditional
 * update so two concurrent checkouts cannot oversell the last unit.
 */
export async function submitCheckout(
  formData: FormData,
  items: CartItem[],
): Promise<ActionState<CheckoutSuccess>> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse({
    ...raw,
    billingSameAsShipping:
      raw.billingSameAsShipping === "on" || raw.billingSameAsShipping === "true",
    setupRequested:
      raw.setupRequested === "on" || raw.setupRequested === "true",
  });

  if (!parsed.success) {
    return { success: false, errors: fieldErrors(parsed.error.flatten().fieldErrors) };
  }

  const data = parsed.data;

  let pricing;
  try {
    pricing = await priceCart({ items, couponCode: data.couponCode });
  } catch (error) {
    if (error instanceof PricingError) return formError(error.message);
    console.error("[submitCheckout] pricing failed:", error);
    return formError("We could not price your cart. Please refresh and try again.");
  }

  // Delivery is only unlocked at DELIVERY_MIN_SUBTOTAL. If the client posted
  // DELIVERY while the cart is below the threshold, silently fall back to
  // PICKUP rather than half-charging — the UI already prevents this.
  const deliveryType =
    data.deliveryType === "DELIVERY" && pricing.subtotal >= DELIVERY_MIN_SUBTOTAL
      ? "DELIVERY"
      : "PICKUP";

  const orderNumber = generateOrderNumber();
  const address = {
    name: sanitize(data.name),
    phone: data.phone,
    email: data.email || "",
    address: sanitize(data.address || ""),
    city: sanitize(data.city || "Pune"),
    pincode: data.pincode || "",
    state: sanitize(data.state || "Maharashtra"),
  };
  // Parse pickup date at local midnight — the string "yyyy-mm-dd" alone
  // becomes UTC midnight, which slips a day on IST. Only set when PICKUP.
  const pickupDate =
    deliveryType === "PICKUP" && data.pickupDate
      ? new Date(`${data.pickupDate}T00:00:00+05:30`)
      : null;

  // On-site setup add-on (IST-safe date, same as pickup).
  const setupRequested = data.setupRequested === true;
  const setupDate =
    setupRequested && data.setupDate
      ? new Date(`${data.setupDate}T00:00:00+05:30`)
      : null;

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Conditional decrement: `stock: { gte: qty }` in the WHERE clause means
      // the update matches zero rows if someone else bought the stock first.
      for (const line of pricing.lines) {
        const updated = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (updated.count === 0) {
          throw new PricingError(
            `"${line.name}" just went out of stock`,
            "INSUFFICIENT_STOCK",
          );
        }
      }

      if (pricing.couponId) {
        await tx.coupon.update({
          where: { id: pricing.couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber,
          subtotal: new Prisma.Decimal(pricing.subtotal),
          discount: new Prisma.Decimal(pricing.discount),
          deliveryCharge: new Prisma.Decimal(pricing.deliveryCharge),
          gst: new Prisma.Decimal(pricing.gst),
          total: new Prisma.Decimal(pricing.total),
          advancePercent: pricing.advancePercent,
          advanceAmount: new Prisma.Decimal(pricing.advanceAmount),
          balanceDue: new Prisma.Decimal(pricing.balanceDue),
          paymentMethod: data.paymentMethod,
          shippingAddress: address,
          billingAddress: data.billingSameAsShipping ? Prisma.JsonNull : address,
          notes: data.notes ? sanitize(data.notes) : null,
          deliveryType,
          pickupDate,
          pickupTime: deliveryType === "PICKUP" ? data.pickupTime : null,
          setupRequested,
          setupAddress: setupRequested ? sanitize(data.setupAddress) : null,
          setupDate,
          setupTime: setupRequested ? data.setupTime : null,
          customerName: sanitize(data.name),
          customerPhone: data.phone,
          coupon: pricing.couponId
            ? { connect: { id: pricing.couponId } }
            : undefined,
          customer: {
            connectOrCreate: {
              where: { phone: data.phone },
              create: {
                name: sanitize(data.name),
                phone: data.phone,
                email: data.email || undefined,
              },
            },
          },
          items: {
            create: pricing.lines.map((line) => ({
              productId: line.productId,
              name: line.name,
              price: new Prisma.Decimal(line.unitPrice),
              quantity: line.quantity,
              // `{}` was written here before, which is a JSON object rather than
              // SQL NULL and made "no variant" indistinguishable from an empty one.
              variant: line.variant ? { label: line.variant } : Prisma.JsonNull,
            })),
          },
        },
      });
    });

    const pickupHuman = pickupDate
      ? pickupDate.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

    const setupHuman = setupDate
      ? setupDate.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

    await notify([
      email.sendOrderPlacedEmail({
        orderNumber: order.orderNumber,
        customerName: data.name,
        customerEmail: data.email || null,
        items: pricing.lines.map((l) => ({
          name: l.name,
          quantity: l.quantity,
          price: l.unitPrice,
        })),
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        deliveryCharge: pricing.deliveryCharge,
        gst: pricing.gst,
        total: pricing.total,
        advanceAmount: pricing.advanceAmount,
        balanceDue: pricing.balanceDue,
        paymentMethod: data.paymentMethod,
        pickupDate: deliveryType === "PICKUP" ? pickupHuman : null,
        pickupTime: deliveryType === "PICKUP" ? data.pickupTime : null,
      }),
      email.sendAdminAlert(
        `New order ${order.orderNumber}`,
        [
          `Customer: ${data.name} (${data.phone})`,
          deliveryType === "PICKUP"
            ? `Pickup: ${pickupHuman} at ${data.pickupTime}`
            : `Delivery: ${address.address}, ${address.city} ${address.pincode}`,
          ...(setupRequested
            ? [
                `⚑ ON-SITE SETUP REQUESTED — call with quote`,
                `Setup venue: ${sanitize(data.setupAddress)}`,
                `Setup on: ${setupHuman} at ${data.setupTime}`,
              ]
            : []),
          `Total: ${formatPrice(pricing.total)}`,
          `Advance due: ${formatPrice(pricing.advanceAmount)}`,
          `Payment: ${data.paymentMethod}`,
        ],
        pickupDate && data.pickupTime
          ? {
              calendarUrl: googleCalendarUrl({
                title: `Order ${order.orderNumber} pickup — ${data.name}`,
                startIST: parseISTDateTime(data.pickupDate!, data.pickupTime) ?? pickupDate,
                durationMinutes: 30,
                details: `Order ${order.orderNumber}\nCustomer: ${data.name} — ${data.phone}\nTotal: ${formatPrice(pricing.total)}`,
                location: "Mahek Balloons, Opposite Saras Baug Garden, Pune 411004",
              }),
            }
          : undefined,
      ),
      whatsapp.sendText(
        data.phone,
        `Hi ${data.name}, Mahek Balloons has received order ${order.orderNumber} for ${formatPrice(pricing.total)}. ` +
          (deliveryType === "PICKUP"
            ? `Please collect from our shop opposite Saras Baug Garden on ${pickupHuman} at ${data.pickupTime}. `
            : `We'll deliver to your address; our team will call to confirm the slot. `) +
          (setupRequested
            ? `You've also requested on-site setup on ${setupHuman} at ${data.setupTime} — our team will call with a setup quote. `
            : "") +
          `Pay the ${pricing.advancePercent}% advance of ${formatPrice(pricing.advanceAmount)} to confirm; ` +
          `${formatPrice(pricing.balanceDue)} on ${deliveryType === "PICKUP" ? "pickup" : "delivery"}.`,
      ),
    ]);

    revalidatePath("/admin");

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: pricing.total,
      advanceAmount: pricing.advanceAmount,
      balanceDue: pricing.balanceDue,
      // COD still needs the advance, but it is collected by hand rather than
      // through Stripe.
      // Every order now collects the advance online before it is confirmed —
      // including "Cash at Shop", where only the remaining balance is paid in
      // cash at pickup/delivery. So payment is required whenever an advance is due.
      requiresPayment: pricing.advanceAmount > 0,
    };
  } catch (error) {
    if (error instanceof PricingError) return formError(error.message);
    // Previously this returned `success: true` with an invented order number on
    // any failure, so customers saw a confirmation for an order that was never
    // written and never fulfilled.
    console.error("[submitCheckout] failed:", error);
    return formError(
      "We could not place your order. No payment has been taken — please try again or call +91 8087867988.",
    );
  }
}
