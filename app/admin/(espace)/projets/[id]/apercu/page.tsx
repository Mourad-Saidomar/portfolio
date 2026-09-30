import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { CaseStudy } from "@/components/site/case-study";
import { requireAdmin } from "@/lib/auth";
import { getProjectWithImages } from "@/lib/data/admin";
import { toProject } from "@/lib/data/mappers";

export const metadata: Metadata = { title: "Aperçu" };

/** Aperçu fidèle de l'étude de cas (même composant que le site), brouillons compris. */
export default async function PreviewProjectPage({ params }: PageProps<"/admin/projets/[id]/apercu">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const result = await getProjectWithImages(supabase, id);
  if (!result) notFound();
  const project = toProject(result.project, result.images);

  return (
    <div className="-mx-5 sm:-mx-8 lg:-mx-12">
      <div
        role="status"
        className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-accent px-5 py-3 text-on-accent sm:px-8 lg:px-12"
      >
        <p className="text-sm">
          <strong>Aperçu</strong> — {project.status === "published" ? "version en ligne" : "brouillon, invisible du public"}
        </p>
        <Link
          href={`/admin/projets/${id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bg px-4 text-sm text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden /> Revenir à l&apos;édition
        </Link>
      </div>
      <div className="rounded-(--radius-lg) bg-bg">
        <CaseStudy project={project} />
      </div>
    </div>
  );
}
