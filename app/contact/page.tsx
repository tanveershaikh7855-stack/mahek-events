import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact/contact-page-client";
import { contactPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Contact Us | ${business.name}`,
  description: contactPage.subtitle,
};

export default function ContactPage() {
  return <ContactPageClient />;
}