import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { TimelineForm } from "@/components/admin/timeline-form";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getTimelineEntry } from "@/lib/data/admin";
import { timelineToForm } from "@/lib/data/admin-forms";

export const metadata: Metadata = { title: "Modifier l'étape" };

export default async function EditTimelinePage({ params }: PageProps<"/admin/parcours/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const entry = await getTimelineEntry(supabase, id);
  if (!entry) notFound();

  return (
    <>
      <AdminHeader eyebrow={<Link href="/admin/parcours" className="hover:text-ink">← Parcours</Link>} title={entry.title} />
      <div className="mt-8">
        <TimelineForm key={entry.updated_at} initial={timelineToForm(entry)} />
      </div>
    </>
  );
}
