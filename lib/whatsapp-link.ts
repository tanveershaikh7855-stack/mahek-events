/**
 * Builds wa.me click-to-chat URLs.
 *
 * This is the one WhatsApp path that works WITHOUT the paid Meta Cloud API:
 * staff tap the link and their own WhatsApp opens with the message pre-filled
 * to the customer. Used by the admin orders and bookings tables so the shop can
 * message customers today, while `lib/notifications/whatsapp.ts` stays wired for
 * automated sends once WHATSAPP_API_TOKEN is configured.
 */

const SHOP_MAPS_URL = "https://maps.app.goo.gl/8WdoEqNAuCB9Qzwf7";

/**
 * Normalises an Indian phone number to a wa.me-safe id.
 *
 * Numbers reach us in several shapes ("9876543210", "+91 98765 43210",
 * "091-9876543210"). Stripping non-digits first is what makes the link work —
 * the bookings table previously interpolated the raw value straight after "91",
 * so any formatted number produced a dead link.
 */
export function waId(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  // Drop a leading trunk "0" (0XXXXXXXXXX) before country-code handling.
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/** wa.me deep link with an optional pre-filled message. */
export function waLink(phone: string, message?: string): string {
  const base = `https://wa.me/${waId(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Status-appropriate message for an order. */
export function orderWaMessage(o: {
  orderNumber: string;
  customerName: string | null;
  status: string;
  pickupDate: string | null;
  pickupTime: string | null;
}): string {
  const name = o.customerName || "there";
  const pickup =
    o.pickupDate &&
    new Date(o.pickupDate).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  switch (o.status) {
    case "CONFIRMED":
      return (
        `Hi ${name}, your Mahek Balloons order ${o.orderNumber} is confirmed! ` +
        (pickup
          ? `Pickup on ${pickup}${o.pickupTime ? ` at ${o.pickupTime}` : ""} from our Saras Baug shop. `
          : "") +
        `Maps: ${SHOP_MAPS_URL}`
      );
    case "READY_FOR_PICKUP":
      return `Hi ${name}, your Mahek Balloons order ${o.orderNumber} is ready to collect from our Saras Baug shop! Maps: ${SHOP_MAPS_URL}`;
    case "COMPLETED":
      return `Hi ${name}, thank you for collecting order ${o.orderNumber} from Mahek Balloons! A Google review would mean a lot to us. 🎈`;
    case "CANCELLED":
      return `Hi ${name}, your Mahek Balloons order ${o.orderNumber} has been cancelled. Any advance paid will be refunded.`;
    default:
      return `Hi ${name}, this is Mahek Balloons regarding your order ${o.orderNumber}.`;
  }
}

/** Status-appropriate message for a decoration booking (set up at the customer's venue). */
export function bookingWaMessage(b: {
  bookingNumber: string;
  customerName: string | null;
  eventType: string;
  eventDate: string | null;
  eventTime: string | null;
  quotedAmount: number | null;
  status: string;
}): string {
  const name = b.customerName || "there";
  const when =
    b.eventDate &&
    new Date(b.eventDate).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  const slot = when ? `${when}${b.eventTime ? ` (${b.eventTime})` : ""}` : "your event date";

  switch (b.status) {
    case "NEW":
      return `Hi ${name}, Mahek Balloons here about your ${b.eventType} decoration enquiry (${b.bookingNumber}). Could you confirm the venue and setup time for ${slot}?`;
    case "FOLLOW_UP":
      return (
        `Hi ${name}, following up on your ${b.eventType} decoration (${b.bookingNumber}) for ${slot}. ` +
        (b.quotedAmount
          ? `Our quote is ₹${b.quotedAmount.toLocaleString("en-IN")}, and a 50% advance confirms the date. `
          : "") +
        `Shall we go ahead?`
      );
    case "CONFIRMED":
      return (
        `Hi ${name}, your ${b.eventType} decoration booking ${b.bookingNumber} is confirmed for ${slot}. ` +
        `Our team will reach the venue ahead of time to set up. Thank you! 🎈`
      );
    case "COMPLETED":
      return `Hi ${name}, thank you for choosing Mahek Balloons for your ${b.eventType} (${b.bookingNumber})! We'd love a Google review if you enjoyed the setup. 🎈`;
    case "CANCELLED":
      return `Hi ${name}, your ${b.eventType} decoration booking ${b.bookingNumber} has been cancelled. Any advance paid will be refunded.`;
    default:
      return `Hi ${name}, this is Mahek Balloons regarding your booking ${b.bookingNumber}.`;
  }
}
