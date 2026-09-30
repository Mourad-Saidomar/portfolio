import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProjectWithImages } from "@/lib/data/admin";
import { projectToForm } from "@/lib/data/admin-forms";

export const metadata: Metadata = { title: "Modifier le projet" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projets/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const result = await getProjectWithImages(supabase, id);
  if (!result) notFound();
  const { project, images } = result;

  return (
    <>
      <AdminHeader
        eyebrow={<Link href="/admin/projets" className="hover:text-ink">← Projets</Link>}
        title={project.title}
        actions={
          project.status === "published" ? (
            <a
              href={`/projets/${project.slug}`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-sunken hover:text-ink"
            >
              Voir en ligne <ExternalLink className="size-4" aria-hidden />
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          ) : undefined
        }
      />
      <div className="mt-8">
        <ProjectForm key={project.updated_at} initial={projectToForm(project, images)} status={project.status} isNew={false} />
      </div>
    </>
  );
}
