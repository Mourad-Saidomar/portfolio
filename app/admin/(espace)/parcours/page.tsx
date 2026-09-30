import { BriefcaseBusiness, GraduationCap, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader, Badge } from "@/components/admin/ui";
import { EmptyState } from "@/components/site/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { listTimeline } from "@/lib/data/admin";
import { toTimelineEntry } from "@/lib/data/mappers";
import { formatPeriod } from "@/lib/format";
import { isTodo } from "@/lib/utils";

export const metadata: Metadata = { title: "Parcours" };

export default async function AdminTimelinePage() {
  const { supabase } = await requireAdmin();
  const rows = await listTimeline(supabase);

  return (
    <>
      <AdminHeader
        title="Parcours"
        description="Expériences et formations. L'ordre d'affichage suit automatiquement les dates (étapes en cours en premier)."
        actions={
          <ButtonLink href="/admin/parcours/nouveau" size="sm" icon={<Plus className="size-4" />} iconPosition="start">
            Nouvelle étape
          </ButtonLink>
        }
      />
      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState title="Aucune étape">Ajoutez votre première expérience ou formation.</EmptyState>
        ) : (
          <ul className="divide-y divide-line rounded-(--radius-lg) border border-line bg-surface">
            {rows.map((row) => {
              const entry = toTimelineEntry(row);
              const Icon = entry.kind === "experience" ? BriefcaseBusiness : GraduationCap;
              return (
                <li key={row.id}>
                  <Link href={`/admin/parcours/${row.id}`} className="flex items-center gap-4 p-4 hover:bg-bg">
                    <Icon className="size-5 shrink-0 text-subtle" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{entry.title}</span>
                      <span className="block truncate text-sm text-muted">
                        {entry.organization} · {formatPeriod(entry) || "dates à préciser"}
                      </span>
                    </span>
                    <span className="flex shrink-0 gap-1.5">
                      {[entry.title, entry.organization, entry.description].some(isTodo) && <Badge tone="warning">À compléter</Badge>}
                      <Badge tone={row.published ? "success" : "neutral"}>{row.published ? "Visible" : "Masquée"}</Badge>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
