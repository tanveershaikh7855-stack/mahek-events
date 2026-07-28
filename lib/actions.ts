"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
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
): Promise<ActionState<{ bookingNumber: string }>> {
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { success: false, errors: fieldErrors(parsed.error.flatten().fieldErrors) };
  }

  const data = parsed.data;

  try {
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        eventType: data.event,
        venue: sanitize(data.venue),
        eventDate: data.date ? new Date(data.date) : null,
        eventTime: data.time,
        budget: data.budget ? new Prisma.Decimal(data.budget) : null,
        instructions: data.instructions ? sanitize(data.instructions) : null,
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
      email.sendAdminAlert(`New booking ${booking.bookingNumber}`, [
        `Customer: ${data.name} (${data.phone})`,
        `Event: ${data.event} on ${data.date} at ${data.time}`,
        `Venue: ${data.venue}`,
        data.budget ? `Budget: ${formatPrice(Number(data.budget))}` : "Budget: not stated",
      ]),
      whatsapp.sendText(
        data.phone,
        `Hi ${data.name}, Mahek Balloon has received your ${data.event} decoration request (${booking.bookingNumber}). ` +
          `Our team will call you shortly with a quote. Bookings are confirmed once a 50% advance is paid.`,
      ),
    ]);

    revalidatePath("/admin");

    return { success: true, bookingNumber: booking.bookingNumber };
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

  const orderNumber = generateOrderNumber();
  const address = {
    name: sanitize(data.name),
    phone: data.phone,
    email: data.email || "",
    address: sanitize(data.address),
    city: sanitize(data.city),
    pincode: data.pincode,
    state: sanitize(data.state),
  };

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
          // Must use the relation form, not the `couponId` scalar — mixing a
          // scalar FK with a nested `customer` relation puts Prisma into its
          // "unchecked" input variant, which rejects the relation.
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
      }),
      email.sendAdminAlert(`New order ${order.orderNumber}`, [
        `Customer: ${data.name} (${data.phone})`,
        `Total: ${formatPrice(pricing.total)}`,
        `Advance due: ${formatPrice(pricing.advanceAmount)}`,
        `Payment: ${data.paymentMethod}`,
      ]),
      whatsapp.sendText(
        data.phone,
        `Hi ${data.name}, Mahek Balloon has received order ${order.orderNumber} for ${formatPrice(pricing.total)}. ` +
          `Pay the ${pricing.advancePercent}% advance of ${formatPrice(pricing.advanceAmount)} to confirm it; ` +
          `${formatPrice(pricing.balanceDue)} is due on delivery.`,
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
      requiresPayment: data.paymentMethod !== "COD",
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
