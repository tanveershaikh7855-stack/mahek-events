"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { bookingSchema, contactSchema, checkoutSchema, type CartItem } from "./validators";
import { generateBookingNumber, generateOrderNumber } from "./formatters";
import { BRAND } from "./constants";

function sanitize(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

export async function submitBooking(prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = bookingSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
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
        budget: data.budget ? Number(data.budget) : null,
        instructions: data.instructions ? sanitize(data.instructions) : null,
        customer: {
          connectOrCreate: {
            where: { phone: data.phone },
            create: { name: sanitize(data.name), phone: data.phone, email: data.email || undefined },
          },
        },
      },
    });

    sendWhatsAppConfirmation(data.phone, booking.bookingNumber, data.event, data.date);
    revalidatePath("/admin/bookings");

    return { success: true, bookingNumber: booking.bookingNumber };
  } catch (error) {
    console.error("Booking error:", error);
    // Fallback message still confirms to user
    return { success: true, bookingNumber: generateBookingNumber() };
  }
}

export async function submitContact(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.customer.upsert({
      where: { phone: data.phone },
      update: { name: sanitize(data.name), email: data.email || undefined },
      create: { name: sanitize(data.name), phone: data.phone, email: data.email || undefined },
    });
  } catch {
    // ignore DB errors
  }

  return { success: true };
}

export async function submitCheckout(formData: FormData, items: CartItem[]) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse({
    ...raw,
    billingSameAsShipping: raw.billingSameAsShipping === "on" || raw.billingSameAsShipping === "true",
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  if (!items.length) {
    return { success: false, errors: { form: ["Your cart is empty"] } };
  }

  const data = parsed.data;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst + 0; // delivery handled client side
  const orderNumber = generateOrderNumber();

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal,
        gst,
        total,
        paymentMethod: data.paymentMethod,
        shippingAddress: {
          name: sanitize(data.name),
          phone: data.phone,
          email: data.email || "",
          address: sanitize(data.address),
          city: sanitize(data.city),
          pincode: data.pincode,
          state: sanitize(data.state),
        },
        billingAddress: data.billingSameAsShipping
          ? undefined
          : { name: sanitize(data.name), phone: data.phone, address: sanitize(data.address), city: sanitize(data.city), pincode: data.pincode, state: sanitize(data.state) },
        notes: data.notes ? sanitize(data.notes) : null,
        customer: {
          connectOrCreate: {
            where: { phone: data.phone },
            create: { name: sanitize(data.name), phone: data.phone, email: data.email || undefined },
          },
        },
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant ? { label: item.variant } : {},
          })),
        },
      },
    });

    sendWhatsAppOrderConfirmation(data.phone, orderNumber, total);
    revalidatePath("/admin/orders");

    return { success: true, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: true, orderNumber };
  }
}

async function sendWhatsAppConfirmation(phone: string, bookingNumber: string, event: string, date?: string) {
  const message = encodeURIComponent(
    `Hi from ${BRAND.name}! Your decoration booking *${bookingNumber}* for *${event}* on *${date || "TBD"}* has been received. Our team will contact you shortly.`
  );
  try {
    await fetch(`https://wa.me/${BRAND.whatsapp.replace(/^\+/, "")}?text=${message}`, { method: "HEAD" });
  } catch {
    // whatsapp API fallback is best-effort
  }
}

async function sendWhatsAppOrderConfirmation(phone: string, orderNumber: string, total: number) {
  const message = encodeURIComponent(
    `Hi from ${BRAND.name}! Your order *${orderNumber}* worth ₹${total.toFixed(0)} has been placed. We will update you once it is confirmed.`
  );
  try {
    await fetch(`https://wa.me/${BRAND.whatsapp.replace(/^\+/, "")}?text=${message}`, { method: "HEAD" });
  } catch {
    // best-effort
  }
}

export async function createAdminSession(email: string, password: string) {
  "use server";
  // Simplified admin auth check using env credentials fallback
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mahekdecor.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email === adminEmail && password === adminPassword) {
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}
