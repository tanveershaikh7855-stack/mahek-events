import type { Metadata } from "next";
import { BookingPageClient } from "@/components/booking/booking-page-client";

export const metadata: Metadata = {
  title: "Book Decoration Service | Mahek Decorator",
  description:
    "Book premium decoration services for birthday, wedding, anniversary, baby shower, corporate events, proposals, and more. Free consultation with our expert stylists.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}