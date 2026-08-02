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
  pickupDate?: string | null;
  pickupTime?: string | null;
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

  const pickupBox =
    data.pickupDate && data.pickupTime
      ? `<div style="margin:16px 0;padding:14px;border:1px solid #C9E7C9;background:#F0F8F0;border-radius:12px">
           <p style="margin:0 0 4px;font-size:13px;color:#2F5D3A;font-weight:700">📍 Pickup from our shop</p>
           <p style="margin:0;font-size:14px;color:#1F1F1F;line-height:1.5">
             <strong>${escapeHtml(data.pickupDate)}</strong> at <strong>${escapeHtml(data.pickupTime)}</strong><br/>
             Mahek Balloon, Opposite Saras Baug Garden, Pune — 411004
           </p>
         </div>`
      : "";

  const html = layout(
    `Order ${data.orderNumber} received`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, thanks for your order.
      To confirm it we collect a <strong>${Math.round((data.advanceAmount / data.total) * 100)}% advance</strong>;
      the balance is payable when you collect the order from our shop.</p>
     ${pickupBox}
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       ${items}
       <tr><td colspan="2" style="border-top:1px solid #ECECEC;padding-top:8px"></td></tr>
       ${row("Subtotal", formatPrice(data.subtotal))}
       ${data.discount > 0 ? row("Discount", `-${formatPrice(data.discount)}`) : ""}
       ${row("GST", formatPrice(data.gst))}
       ${row("Total", formatPrice(data.total), true)}
       <tr><td colspan="2" style="border-top:1px solid #ECECEC;padding-top:8px"></td></tr>
       ${row("Advance due now", formatPrice(data.advanceAmount), true)}
       ${row("Balance on pickup", formatPrice(data.balanceDue))}
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

/** Sent when staff move a booking to CONFIRMED. */
export function sendBookingConfirmedEmail(data: {
  bookingNumber: string;
  customerName: string;
  customerEmail?: string | null;
  eventType: string;
  eventDate?: string | null;
  quotedAmount?: number | null;
  advanceAmount?: number | null;
}): Promise<SendResult> {
  if (!data.customerEmail) {
    return Promise.resolve({ ok: false, error: "No customer email on booking" });
  }
  const html = layout(
    `Booking ${data.bookingNumber} is confirmed`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, great news — your
      ${escapeHtml(data.eventType)} decoration booking is <strong>confirmed</strong>.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       ${row("Booking", data.bookingNumber)}
       ${data.eventDate ? row("Event date", data.eventDate) : ""}
       ${data.quotedAmount ? row("Quoted amount", formatPrice(data.quotedAmount)) : ""}
       ${data.advanceAmount ? row("Advance", formatPrice(data.advanceAmount), true) : ""}
     </table>
     <p style="font-size:14px;line-height:1.6">Our team will reach out before the event to finalise setup timing.</p>`,
  );
  return send(data.customerEmail, `Booking ${data.bookingNumber} confirmed`, html);
}

/** Sent when an order or booking is cancelled. */
export function sendCancellationEmail(data: {
  reference: string;
  customerName: string;
  customerEmail?: string | null;
  kind: "order" | "booking";
  reason?: string | null;
}): Promise<SendResult> {
  if (!data.customerEmail) {
    return Promise.resolve({ ok: false, error: "No customer email" });
  }
  const noun = data.kind === "order" ? "Order" : "Booking";
  const html = layout(
    `${noun} ${data.reference} cancelled`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, your ${noun.toLowerCase()}
      <strong>${escapeHtml(data.reference)}</strong> has been cancelled.</p>
     ${data.reason ? `<p style="font-size:14px;line-height:1.6">Reason: ${escapeHtml(data.reason)}</p>` : ""}
     <p style="font-size:14px;line-height:1.6">Any advance already paid will be refunded per our refund policy.
      If this was not expected, please call us on +91 8087867988.</p>`,
  );
  return send(data.customerEmail, `${noun} ${data.reference} cancelled`, html);
}

/** Sent when a payment (advance or full) is recorded against an order. */
export function sendPaymentReceivedEmail(data: {
  reference: string;
  customerName: string;
  customerEmail?: string | null;
  amountPaid: number;
  balanceDue?: number | null;
  fullyPaid?: boolean;
}): Promise<SendResult> {
  if (!data.customerEmail) {
    return Promise.resolve({ ok: false, error: "No customer email" });
  }
  const html = layout(
    `Payment received for ${data.reference}`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, we have received your payment of
      <strong>${escapeHtml(formatPrice(data.amountPaid))}</strong>. Thank you.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       ${row("Reference", data.reference)}
       ${row("Amount received", formatPrice(data.amountPaid), true)}
       ${
         data.fullyPaid
           ? row("Status", "Paid in full", true)
           : data.balanceDue != null
             ? row("Balance remaining", formatPrice(data.balanceDue))
             : ""
       }
     </table>`,
  );
  return send(data.customerEmail, `Payment received — ${data.reference}`, html);
}

/** Security notice sent when an admin/staff account signs in. */
export function sendLoginAlertEmail(data: {
  email: string;
  name: string;
  at: Date;
}): Promise<SendResult> {
  const when = data.at.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const html = layout(
    "New sign-in to your admin account",
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.name)}, your Mahek Balloon admin account was
      just signed in.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       ${row("Account", data.email)}
       ${row("Time (IST)", when)}
     </table>
     <p style="font-size:14px;line-height:1.6">If this was you, no action is needed. If not, change the password
      immediately.</p>`,
  );
  return send(data.email, "New sign-in to your Mahek Balloon admin", html);
}

/** Welcome email sent when a shopper creates an account (form or Google). */
export function sendWelcomeEmail(data: {
  customerName: string;
  customerEmail?: string | null;
}): Promise<SendResult> {
  if (!data.customerEmail) {
    return Promise.resolve({ ok: false, error: "No customer email" });
  }
  const html = layout(
    `Welcome to ${BRAND_NAME}!`,
    `<p style="font-size:14px;line-height:1.6">Hi ${escapeHtml(data.customerName)}, thanks for creating your
      ${escapeHtml(BRAND_NAME)} account. You can now track your orders and decoration bookings anytime from your
      account page.</p>
     <p style="font-size:14px;line-height:1.6">We specialise in premium helium &amp; nitrogen balloon decoration
      in Saras Baug, Pune — birthdays, weddings, baby showers and every celebration in between.</p>
     <p style="font-size:14px;line-height:1.6">
       <a href="https://mahekballoons.com/shop" style="color:#0a7d33;font-weight:600;text-decoration:none">Browse balloons &amp; decor &rarr;</a>
     </p>
     <p style="font-size:14px;line-height:1.6">Questions? Call or WhatsApp us on +91 8087867988.</p>`,
  );
  return send(data.customerEmail, `Welcome to ${BRAND_NAME}`, html);
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
