import "server-only";
import Stripe from "stripe";
import { env, features } from "./env";

/**
 * Stripe was in package.json with keys in .env, but there was no payment code
 * anywhere in the project. This is the single client; it stays null when the
 * keys are absent so a COD-only deployment still boots.
 */
export const stripe = features.stripe
  ? new Stripe(env.STRIPE_SECRET_KEY!, {
      // Pin the version so a Stripe-side upgrade cannot change payload shapes
      // underneath the webhook handler.
      apiVersion: "2025-10-29.clover" as Stripe.LatestApiVersion,
      typescript: true,
      appInfo: { name: "Mahek Balloon", version: "1.0.0" },
    })
  : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
    );
  }
  return stripe;
}

/** Stripe works in the smallest currency unit — paise for INR. */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function fromPaise(paise: number): number {
  return Math.round(paise) / 100;
}
