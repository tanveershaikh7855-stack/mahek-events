import "server-only";
import { Resend } from "resend";
import { env, features } from "../env";
import { formatPrice } from "../formatters";

/**
 * Resend was installed and RESEND_API_KEY was configured, but no email code
 * existed anywhere in the project — no customer ever received anything.
 */

const resend = features.email ? new Resend(env.RESEND_API_KEY) : null;

const FROM = env.EMAIL_FROM ?? "Mahek Balloon <onboarding@resend.dev>";
const BRAND_NAME = "Mahek Balloon";

type SendResult = { ok: true; id: string } | { ok: false; error: string };

async function send(
  to: string | string[],
  subject: string,
  html: string,
): Promise<SendResult> {
  if (!resend) return { ok: false, error: "Email is not configured" };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("[email] send failed:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id ?? "unknown" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[email] send threw:", message);
    return { ok: false, error: message };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(heading: string, inner: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#111">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #ECECEC;border-radius:16px;overflow:hidden">
    <div style="padding:24px;border-bottom:1px solid #ECECEC">
      <h1 style="margin:0;font-size:20px">${escapeHtml(BRAND_NAME)}</h1>
    </div>
    <div style="padding:24px">
      <h2 style="margin:0 0 16px;font-size:18px">${escapeHtml(heading)}</h2>
      ${inner}
    </div>
    <div style="padding:16px 24px;border-top:1px solid #ECECEC;font-size:12px;color:#666">
      Opposite Saras Baug Garden, Pune, Maharashtra &middot; +91 8087867988
    </div>
  </div>
</body></html>`;
}

function row(label: string, value: string, bold = false): string {
  const weight = bold ? "600" : "400";
  return `<tr>
    <td style="padding:6px 0;color:#666;font-size:14px">${escapeHtml(label)}</td>
    <td style="padding:6px 0;text-align:right;font-size:14px;font-weight:${weight}">${escapeHtml(value)}</td>
  </tr>`;
}

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail?: string | null;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  gst: number;
  total: number;
  advanceAmount: number;
  balanceDue: number;
  paymentMethod: string;
};

/** Sent to the customer as soon as the order row is committed. */
export function sendOrderPlacedEmail(data: OrderEmailData): Promise<SendResult> {
  if (!data.customerEmail) {
    return Promise.resolve({ ok: false, error: "No customer email on order" });
  }

  const items = data.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;font-size:14px">${escapeHtml(i.name)} &times; ${i.quantity}</td>
         <td style="padding:6px 0;text-align:right;font-size:14px">${escapeHtml(formatPrice(i.price * i.quantity))}</td></tr>`,
    )
    .join("");

  const html = layout(
    `Order ${data.orderNumber} received`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, thanks for your order.
      To confirm it we collect a <strong>${Math.round((data.advanceAmount / data.total) * 100)}% advance</strong>;
      the balance is payable on delivery.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       ${items}
       <tr><td colspan="2" style="border-top:1px solid #ECECEC;padding-top:8px"></td></tr>
       ${row("Subtotal", formatPrice(data.subtotal))}
       ${data.discount > 0 ? row("Discount", `-${formatPrice(data.discount)}`) : ""}
       ${row("Delivery", data.deliveryCharge === 0 ? "Free" : formatPrice(data.deliveryCharge))}
       ${row("GST", formatPrice(data.gst))}
       ${row("Total", formatPrice(data.total), true)}
       <tr><td colspan="2" style="border-top:1px solid #ECECEC;padding-top:8px"></td></tr>
       ${row("Advance due now", formatPrice(data.advanceAmount), true)}
       ${row("Balance on delivery", formatPrice(data.balanceDue))}
     </table>`,
  );

  return send(data.customerEmail, `Order ${data.orderNumber} received`, html);
}

/** Sent once the Stripe webhook confirms the advance actually cleared. */
export function sendOrderConfirmedEmail(data: OrderEmailData): Promise<SendResult> {
  if (!data.customerEmail) {
    return Promise.resolve({ ok: false, error: "No customer email on order" });
  }

  const html = layout(
    `Order ${data.orderNumber} is confirmed`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, we have received your advance of
      <strong>${escapeHtml(formatPrice(data.advanceAmount))}</strong> and your order is now confirmed.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       ${row("Order total", formatPrice(data.total))}
       ${row("Advance paid", formatPrice(data.advanceAmount))}
       ${row("Balance on delivery", formatPrice(data.balanceDue), true)}
     </table>
     <p style="font-size:14px;line-height:1.6">Our team will be in touch about delivery timing.</p>`,
  );

  return send(data.customerEmail, `Order ${data.orderNumber} confirmed`, html);
}

export type BookingEmailData = {
  bookingNumber: string;
  customerName: string;
  customerEmail?: string | null;
  eventType: string;
  eventDate?: string | null;
  eventTime?: string | null;
  venue?: string | null;
};

export function sendBookingReceivedEmail(
  data: BookingEmailData,
): Promise<SendResult> {
  if (!data.customerEmail) {
    return Promise.resolve({ ok: false, error: "No customer email on booking" });
  }

  const html = layout(
    `Booking ${data.bookingNumber} received`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, we have your decoration request
      and our team will call you shortly with a quote. Bookings are confirmed once a 50% advance is paid.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       ${row("Event", data.eventType)}
       ${data.eventDate ? row("Date", data.eventDate) : ""}
       ${data.eventTime ? row("Time", data.eventTime) : ""}
       ${data.venue ? row("Venue", data.venue) : ""}
     </table>`,
  );

  return send(data.customerEmail, `Booking ${data.bookingNumber} received`, html);
}

/** Internal alert so the shop notices a new order/booking without polling the DB. */
export function sendAdminAlert(subject: string, lines: string[]): Promise<SendResult> {
  if (!env.ADMIN_EMAIL) {
    return Promise.resolve({ ok: false, error: "ADMIN_EMAIL not set" });
  }
  const html = layout(
    subject,
    `<ul style="font-size:14px;line-height:1.8;padding-left:18px">
      ${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}
     </ul>`,
  );
  return send(env.ADMIN_EMAIL, `[Admin] ${subject}`, html);
}
