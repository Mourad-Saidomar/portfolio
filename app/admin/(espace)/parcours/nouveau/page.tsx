import type { Metadata } from "next";
import Link from "next/link";
import { TimelineForm } from "@/components/admin/timeline-form";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { timelineToForm } from "@/lib/data/admin-forms";

export const metadata: Metadata = { title: "Nouvelle étape" };

export default async function NewTimelinePage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader eyebrow={<Link href="/admin/parcours" className="hover:text-ink">← Parcours</Link>} title="Nouvelle étape" />
      <div className="mt-8">
        <TimelineForm initial={timelineToForm(null)} />
      </div>
    </>
  );
}
