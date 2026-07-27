import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  event: z.string().min(1, "Select event type"),
  venue: z.string().min(3, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  budget: z.string().optional(),
  instructions: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  message: z.string().min(5, "Message is required"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  image: z.string(),
  variant: z.string().optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  state: z.string().min(2, "State is required"),
  paymentMethod: z.enum(["COD", "UPI", "CARD"]),
  couponCode: z.string().optional(),
  billingSameAsShipping: z.boolean().default(true),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
