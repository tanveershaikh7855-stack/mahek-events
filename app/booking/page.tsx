import type { Metadata } from "next";
import { BookingPageClient } from "@/components/booking/booking-page-client";
import { bookingPage, business, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book Balloon Decoration in Pune — Online Booking | Mahek Balloons",
  description:
    "Book premium balloon decoration for birthdays, weddings, baby showers & events in Pune. Free consultation, on-site setup within 70 KM. Confirmation via WhatsApp within 2 hours.",
  alternates: { canonical: "/booking" },
  keywords: [
    "book balloon decoration Pune",
    "balloon decorator booking online",
    "event decoration booking Pune",
    "birthday decoration booking",
  ],
  openGraph: {
    title: "Book Balloon Decoration in Pune | Mahek Balloons",
    description: bookingPage.subtitle,
    url: "/booking",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Book Balloon Decoration" }],
  },
};

export default function BookingPage() {
  return <BookingPageClient />;
}