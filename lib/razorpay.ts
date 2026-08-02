import "server-only";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { env, features } from "./env";

/**
 * Razorpay replaces the earlier Stripe integration — it settles in INR and
 * supports UPI, cards, netbanking and wallets natively, which suits an Indian
 * shop. This is the single server-side client; it stays null when the keys are
 * absent so a cash-only deployment still boots.
 */
export const razorpay = features.razorpay
  ? new Razorpay({
      key_id: env.RAZORPAY_KEY_ID!,
      key_secret: env.RAZORPAY_KEY_SECRET!,
    })
  : null;

export function requireRazorpay(): Razorpay {
  if (!razorpay) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    );
  }
  return razorpay;
}

/** Razorpay works in the smallest currency unit — paise for INR. */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function fromPaise(paise: number): number {
  return Math.round(paise) / 100;
}

/**
 * Verifies the signature Razorpay Checkout returns to the browser
 * (razorpay_order_id + "|" + razorpay_payment_id, HMAC-SHA256 with the key
 * secret). This proves the success callback genuinely came from a paid Razorpay
 * transaction and was not forged by whoever can open the success URL.
 */
export function verifyCheckoutSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}): boolean {
  if (!env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");
  return timingSafeEqual(expected, params.signature);
}

/**
 * Verifies a Razorpay webhook body against the X-Razorpay-Signature header
 * (HMAC-SHA256 of the raw request body with the webhook secret).
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return timingSafeEqual(expected, signature);
}

/** Constant-time comparison that never throws on length mismatch. */
function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
