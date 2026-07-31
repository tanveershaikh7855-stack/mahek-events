import type { Metadata } from "next";
import { getSettings } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { business, socials, seo } from "@/lib/content";

export const metadata: Metadata = { title: "Settings | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const saved = await getSettings();

  // Saved values win; anything never edited falls back to the values currently
  // shipped in lib/content.ts, so the form is never blank on first use.
  const values = {
    businessName: saved.businessName ?? business.name,
    tagline: saved.tagline ?? business.tagline,
    email: saved.email ?? business.email,
    phone: saved.phone ?? business.phoneFormatted,
    whatsapp: saved.whatsapp ?? business.whatsapp,
    address: saved.address ?? business.address,
    instagram: saved.instagram ?? socials.instagram,
    facebook: saved.facebook ?? socials.facebook,
    deliveryRadiusKm: saved.deliveryRadiusKm ?? String(business.deliveryRadiusKm),
    freeDeliveryAbove: saved.freeDeliveryAbove ?? "499",
    seoTitle: saved.seoTitle ?? seo.metaTitle,
    seoDescription: saved.seoDescription ?? seo.metaDescription,
  };

  return (
    <PageShell title="Settings">
      <SettingsForm values={values} />
    </PageShell>
  );
}
