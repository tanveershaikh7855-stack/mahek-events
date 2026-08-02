import { z } from "zod";

/** Indian mobile numbers: 10 digits starting 6-9. */
const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number");

/** Optional email that also tolerates an empty string from an untouched input. */
const optionalEmail = z
  .union([z.email("Invalid email"), z.literal("")])
  .optional();

/**
 * Email is required wherever we owe the customer a confirmation.
 *
 * Automated WhatsApp needs Meta Cloud API credentials that are not configured,
 * so email is the only channel that reaches the customer by itself. While this
 * was optional, anyone who left it blank silently received no confirmation at
 * all for their booking or order.
 */
const requiredEmail = z
  .string()
  .trim()
  .min(1, "Email is required so we can send your confirmation")
  .pipe(z.email("Enter a valid email address"));

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone,
  email: requiredEmail,
  event: z.string().min(1, "Select event type"),
  venue: z.string().trim().min(3, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  // Was a free-form string, so "abc" reached `Number(...)` and stored NaN.
  budget: z
    .union([z.coerce.number().min(0, "Budget cannot be negative"), z.literal("")])
    .optional(),
  instructions: z.string().max(2000).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone,
  email: optionalEmail,
  message: z.string().trim().min(5, "Message is required").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const subscribeSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;

/**
 * The client-side cart shape.
 *
 * `price` is carried for display only. The server re-reads every price from the
 * database in lib/pricing.ts and never trusts this field for money.
 */
export const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(50),
  image: z.string(),
  variant: z.string().optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required"),
    phone,
    email: requiredEmail,
    deliveryType: z.enum(["PICKUP", "DELIVERY"]).default("PICKUP"),
    // Address only required for DELIVERY; validated conditionally below.
    address: z.string().trim().optional().default(""),
    city: z.string().trim().optional().default("Pune"),
    pincode: z.string().optional().default(""),
    state: z.string().trim().optional().default("Maharashtra"),
    // Pickup slot required for PICKUP orders; validated conditionally below.
    pickupDate: z.string().optional().default(""),
    pickupTime: z.string().trim().optional().default(""),
    paymentMethod: z.enum(["COD", "UPI", "CARD"]),
    couponCode: z.string().trim().optional(),
    billingSameAsShipping: z.boolean().default(true),
    notes: z.string().max(1000).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.deliveryType === "PICKUP") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v.pickupDate)) {
        ctx.addIssue({ code: "custom", path: ["pickupDate"], message: "Select a pickup date" });
      } else {
        const d = new Date(v.pickupDate + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (d.getTime() < today.getTime()) {
          ctx.addIssue({ code: "custom", path: ["pickupDate"], message: "Pickup date cannot be in the past" });
        }
      }
      if (!v.pickupTime) {
        ctx.addIssue({ code: "custom", path: ["pickupTime"], message: "Select a pickup time" });
      }
    } else {
      if (v.address.length < 5) {
        ctx.addIssue({ code: "custom", path: ["address"], message: "Delivery address is required" });
      }
      if (!/^\d{6}$/.test(v.pincode)) {
        ctx.addIssue({ code: "custom", path: ["pincode"], message: "Enter a valid 6-digit pincode" });
      }
      if (v.city.length < 2) {
        ctx.addIssue({ code: "custom", path: ["city"], message: "City is required" });
      }
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
