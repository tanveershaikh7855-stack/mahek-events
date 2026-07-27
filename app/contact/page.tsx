import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact/contact-page-client";

export const metadata: Metadata = {
  title: "Contact Us | Mahek Decorator",
  description:
    "Get in touch with Mahek Decorator for balloon orders, decoration bookings, or any inquiries. Call, WhatsApp, email or visit us in Mumbai.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}