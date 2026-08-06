import type { Metadata } from "next";
import { getAdminAbout } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { AboutManager } from "@/components/admin/about-manager";

export const metadata: Metadata = {
  title: "About Page | Mahek Admin",
  robots: "noindex",
};
export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  const row = await getAdminAbout();

  const about = {
    title: row.title,
    highlight: row.highlight,
    description: row.description,
    storyImage: row.storyImage,
    story: Array.isArray(row.story)
      ? (row.story as string[]).filter((s): s is string => typeof s === "string")
      : [],
    yearsExperience: row.yearsExperience,
    happyCustomers: row.happyCustomers,
    eventsDecorated: row.eventsDecorated,
    awardsWon: row.awardsWon,
    ctaTitle: row.ctaTitle,
    ctaSubtitle: row.ctaSubtitle,
  };

  return (
    <PageShell title="About Page">
      <AboutManager about={about} />
    </PageShell>
  );
}
