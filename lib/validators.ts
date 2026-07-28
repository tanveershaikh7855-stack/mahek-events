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

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone,
  email: optionalEmail,
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

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone,
  email: optionalEmail,
  address: z.string().trim().min(5, "Address is required"),
  city: z.string().trim().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  state: z.string().trim().min(2, "State is required"),
  paymentMethod: z.enum(["COD", "UPI", "CARD"]),
  couponCode: z.string().trim().optional(),
  billingSameAsShipping: z.boolean().default(true),
  notes: z.string().max(1000).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
