import { z } from "zod";

/**
 * Central environment contract.
 *
 * Anything the server genuinely cannot run without is `required`. Everything
 * else is optional and gated by an `isConfigured` flag, so a missing Stripe or
 * WhatsApp key degrades that one feature instead of crashing the whole app.
 *
 * This module is server-only. Never import it from a "use client" file.
 */

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Required
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),

  // Auth — NEXTAUTH_SECRET must be a real random string in production.
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // Admin bootstrap. ADMIN_PASSWORD_HASH is a *bcrypt hash*, not a plaintext
  // password — the previous code compared a plaintext env var with
  // bcrypt.compare(), which can never return true.
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // WhatsApp Cloud API
  WHATSAPP_API_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_BUSINESS_NUMBER: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Cloudinary
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),

  // Business rules
  ADVANCE_PERCENT: z.coerce.number().int().min(1).max(100).default(50),
  GST_RATE: z.coerce.number().min(0).max(1).default(0.05),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;

/** Feature flags derived from which credentials are actually present. */
export const features = {
  stripe: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET),
  email: Boolean(env.RESEND_API_KEY),
  whatsapp: Boolean(env.WHATSAPP_API_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID),
  cloudinary: Boolean(env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
} as const;

export const authSecret = env.AUTH_SECRET ?? env.NEXTAUTH_SECRET;

if (env.NODE_ENV === "production") {
  if (!authSecret) {
    throw new Error("AUTH_SECRET (or NEXTAUTH_SECRET) must be set in production");
  }
  if (!env.ADMIN_PASSWORD_HASH) {
    // Not fatal — DB-backed users still work — but it is worth screaming about.
    console.warn(
      "[env] ADMIN_PASSWORD_HASH is not set. Admin fallback login is disabled; " +
        "create a User row instead. Generate a hash with: npm run auth:hash -- 'yourpassword'",
    );
  }
}
