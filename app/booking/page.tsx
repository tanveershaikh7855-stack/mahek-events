import type { Metadata } from "next";
import { BookingPageClient } from "@/components/booking/booking-page-client";
import { bookingPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Book Decoration Service | ${business.name}`,
  description: bookingPage.subtitle,
};

export default function BookingPage() {
  return <BookingPageClient />;
}