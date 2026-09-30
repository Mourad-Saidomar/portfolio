import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { ProjectsManager } from "@/components/admin/projects-manager";
import { AdminHeader } from "@/components/admin/ui";
import { EmptyState } from "@/components/site/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { listProjects } from "@/lib/data/admin";
import { storageUrl } from "@/lib/media";

export const metadata: Metadata = { title: "Projets" };

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdmin();
  const projects = await listProjects(supabase);

  return (
    <>
      <AdminHeader
        title="Projets"
        description="Glissez-déposez pour changer l'ordre d'affichage sur le site. L'étoile met un projet en avant sur l'accueil."
        actions={
          <ButtonLink href="/admin/projets/nouveau" size="sm" icon={<Plus className="size-4" />} iconPosition="start">
            Nouveau projet
          </ButtonLink>
        }
      />
      <div className="mt-8">
        {projects.length ? (
          <ProjectsManager
            initial={projects.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              summary: p.summary,
              status: p.status,
              featured: p.featured,
              coverUrl: storageUrl("media", p.cover_path),
            }))}
          />
        ) : (
          <EmptyState title="Aucun projet">Créez votre premier projet : il restera en brouillon jusqu&apos;à sa publication.</EmptyState>
        )}
      </div>
    </>
  );
}
