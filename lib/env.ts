import { z } from "zod";

/**
 * Central environment contract.
 *
 * IMPORTANT: this module must never throw at import time. `next build` evaluates
 * it while collecting page data (with NODE_ENV=production and, on a fresh Vercel
 * project, no env vars set yet). A hard throw here fails the whole build. So
 * everything is optional at parse time; missing configuration degrades the
 * relevant feature at runtime (via `features` flags and graceful fallbacks)
 * and is surfaced as a one-time warning rather than a crash.
 *
 * Server-only. Never import from a "use client" file.
 */

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Runtime-required, but optional at parse time so the build never crashes.
  // Absence is handled by lib/prisma.ts + withFallback (serves static content).
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().optional(),

  // Auth. NextAuth needs a secret at runtime; if absent, admin login simply
  // fails (storefront is unaffected).
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().optional(),

  // Admin bootstrap. ADMIN_PASSWORD_HASH is a *bcrypt hash*, not plaintext.
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),

  // Google OAuth (optional). When both are set, "Continue with Google" appears
  // on the customer login/register pages. Absent → the button is hidden.
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  RESEND_WEBHOOK_SECRET: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // WhatsApp Cloud API
  WHATSAPP_API_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_BUSINESS_NUMBER: z.string().optional(),

  // Razorpay. KEY_ID is also exposed publicly because the Checkout modal needs
  // it in the browser; the SECRET signs orders and verifies callbacks server-side
  // and must never be sent to the client.
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Cloudinary
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),

  // Business rules
  ADVANCE_PERCENT: z.coerce.number().int().min(1).max(100).default(50),
  GST_RATE: z.coerce.number().min(0).max(1).default(0.05),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
});

type Env = z.infer<typeof schema>;

/**
 * Parse defensively. Even a malformed coerced value (e.g. ADVANCE_PERCENT="abc")
 * must not crash the build — fall back to schema defaults and warn.
 */
function parseEnv(): Env {
  const parsed = schema.safeParse(process.env);
  if (parsed.success) return parsed.data;

  const issues = parsed.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
  console.warn(`[env] ignoring malformed environment values (${issues})`);

  // Re-parse an empty object so every field resolves to its default.
  return schema.parse({});
}

export const env = parseEnv();

/** Feature flags derived from which credentials are actually present. */
export const features = {
  database: Boolean(env.DATABASE_URL),
  // Card/UPI checkout needs the key pair. The webhook secret is only required
  // for the (recommended) webhook fallback, so it is not gated on here.
  razorpay: Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
  razorpayWebhook: Boolean(env.RAZORPAY_WEBHOOK_SECRET),
  email: Boolean(env.RESEND_API_KEY),
  resendWebhook: Boolean(env.RESEND_WEBHOOK_SECRET),
  whatsapp: Boolean(env.WHATSAPP_API_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID),
  cloudinary: Boolean(env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
  google: Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET),
} as const;

export const authSecret = env.AUTH_SECRET ?? env.NEXTAUTH_SECRET;

/**
 * Warn about missing runtime configuration exactly once per process. Called at
 * import so it runs on server start, but only actually warns in production and
 * never throws — a paused DB or unset key should not take the process down.
 */
function warnMissingConfig(): void {
  if (env.NODE_ENV !== "production") return;

  const missing: string[] = [];
  if (!env.DATABASE_URL) missing.push("DATABASE_URL (database features disabled)");
  if (!authSecret) missing.push("AUTH_SECRET (admin login disabled)");
  if (!env.ADMIN_PASSWORD_HASH && !env.DATABASE_URL) {
    missing.push("ADMIN_PASSWORD_HASH (no admin login path configured)");
  }

  if (missing.length) {
    console.warn(
      "[env] running with incomplete configuration:\n" +
        missing.map((m) => `  - ${m}`).join("\n") +
        "\nSet these in your host's environment variables for full functionality.",
    );
  }
}

warnMissingConfig();
