import "server-only";
import { env, features } from "../env";

/**
 * WhatsApp Cloud API client.
 *
 * The previous implementation did `fetch("https://wa.me/<own-number>", { method: "HEAD" })`.
 * wa.me is a click-to-chat redirect meant for humans in a browser — a HEAD
 * request to it delivers no message to anyone. It also ignored the customer's
 * phone number entirely and pointed at the shop's own number, so even the
 * intent was wrong. This talks to the real Graph API endpoint instead.
 */

const GRAPH_VERSION = "v21.0";

/** Normalises an Indian number to the E.164 digits Graph expects (no leading +). */
function toWaId(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 13 && digits.startsWith("091")) return digits.slice(1);
  return digits;
}

type SendResult = { ok: true; id: string } | { ok: false; error: string };

async function send(body: Record<string, unknown>): Promise<SendResult> {
  if (!features.whatsapp) {
    return { ok: false, error: "WhatsApp is not configured" };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
        // Never let a slow Meta endpoint hold a checkout request open.
        signal: AbortSignal.timeout(8000),
      },
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = json?.error?.message ?? `HTTP ${res.status}`;
      console.error("[whatsapp] send failed:", error);
      return { ok: false, error };
    }

    return { ok: true, id: json?.messages?.[0]?.id ?? "unknown" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp] send threw:", message);
    return { ok: false, error: message };
  }
}

/**
 * Plain text message. Only deliverable inside the 24-hour customer service
 * window; outside it Meta requires an approved template (see sendTemplate).
 */
export function sendText(phone: string, text: string): Promise<SendResult> {
  return send({
    to: toWaId(phone),
    type: "text",
    text: { preview_url: false, body: text },
  });
}

/**
 * Approved message template. Use this for order/booking confirmations, which
 * are business-initiated and therefore outside the 24-hour window.
 */
export function sendTemplate(
  phone: string,
  templateName: string,
  variables: string[],
  languageCode = "en",
): Promise<SendResult> {
  return send({
    to: toWaId(phone),
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: variables.length
        ? [
            {
              type: "body",
              parameters: variables.map((text) => ({ type: "text", text })),
            },
          ]
        : undefined,
    },
  });
}

/** Click-to-chat link for the shop — this is the only legitimate use of wa.me. */
export function whatsappLink(message: string): string {
  const number = (env.WHATSAPP_BUSINESS_NUMBER ?? "").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
