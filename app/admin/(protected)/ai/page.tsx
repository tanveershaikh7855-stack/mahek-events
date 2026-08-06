import type { Metadata } from "next";
import { PageShell } from "@/components/admin/shell/page-shell";
import { AIStudio } from "@/components/admin/ai-studio";

export const metadata: Metadata = {
  title: "AI Assistant | Mahek Admin",
  robots: "noindex",
};
export const dynamic = "force-dynamic";

export default function AIStudioPage() {
  return (
    <PageShell title="AI Assistant">
      <AIStudio />
    </PageShell>
  );
}
