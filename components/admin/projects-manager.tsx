"use client";

import { Eye, Pencil, Star, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject, setProjectFeatured, setProjectStatus } from "@/lib/actions/admin/projects";
import { reorder } from "@/lib/actions/admin/content";
import { cn } from "@/lib/utils";
import { SortableList } from "./sortable-list";
import { useToast } from "./toaster";
import { Badge } from "./ui";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: "draft" | "published";
  featured: boolean;
  coverUrl: string | null;
};

export function ProjectsManager({ initial }: { initial: ProjectRow[] }) {
  const [projects, setProjects] = useState(initial);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function run(task: () => Promise<{ ok: boolean; error?: string; message?: string }>, rollback?: () => void) {
    startTransition(async () => {
      const result = await task();
      if (result.ok) {
        if (result.message) toast(result.message);
        router.refresh();
      } else {
        rollback?.();
        toast(result.error ?? "Échec.", "error");
      }
    });
  }

  function handleReorder(next: ProjectRow[]) {
    const previous = projects;
    setProjects(next);
    run(() => reorder({ table: "projects", ids: next.map((p) => p.id) }), () => setProjects(previous));
  }

  function patch(id: string, changes: Partial<ProjectRow>) {
    setProjects((all) => all.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }

  return (
    <div aria-busy={pending}>
      <SortableList
        items={projects}
        getId={(p) => p.id}
        getLabel={(p) => p.title}
        onReorder={handleReorder}
        className="divide-y divide-line rounded-(--radius-lg) border border-line bg-surface"
        itemClassName="bg-surface first:rounded-t-(--radius-lg) last:rounded-b-(--radius-lg)"
        renderItem={(project, handle, index) => (
          <div className="flex items-center gap-3 p-3 sm:gap-4">
            {handle}
            <span className="hidden w-6 font-mono text-meta text-subtle sm:block">{String(index + 1).padStart(2, "0")}</span>
            <div className="relative hidden aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-(--radius-sm) bg-sunken sm:block">
              {project.coverUrl && <Image src={project.coverUrl} alt="" fill sizes="96px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/projets/${project.id}`} className="font-medium hover:text-accent">
                  {project.title}
                </Link>
                <Badge tone={project.status === "published" ? "success" : "neutral"}>
                  {project.status === "published" ? "Publié" : "Brouillon"}
                </Badge>
                {project.featured && <Badge tone="accent">Mis en avant</Badge>}
              </div>
              <p className="mt-0.5 truncate text-sm text-muted">{project.summary || "—"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <IconButton
                label={project.featured ? `Retirer « ${project.title} » de la mise en avant` : `Mettre « ${project.title} » en avant`}
                pressed={project.featured}
                onClick={() => {
                  patch(project.id, { featured: !project.featured });
                  run(() => setProjectFeatured(project.id, !project.featured), () => patch(project.id, { featured: project.featured }));
                }}
              >
                <Star className={cn("size-4", project.featured && "fill-current text-accent")} aria-hidden />
              </IconButton>
              <button
                type="button"
                onClick={() => {
                  const next = project.status === "published" ? "draft" : "published";
                  patch(project.id, { status: next });
                  run(() => setProjectStatus(project.id, next), () => patch(project.id, { status: project.status }));
                }}
                className="hidden min-h-11 rounded-full px-3 text-sm text-muted hover:bg-sunken hover:text-ink md:inline-flex md:items-center"
              >
                {project.status === "published" ? "Dépublier" : "Publier"}
                <span className="sr-only"> « {project.title} »</span>
              </button>
              <Link
                href={`/admin/projets/${project.id}/apercu`}
                className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
                aria-label={`Aperçu de « ${project.title} »`}
              >
                <Eye className="size-4" aria-hidden />
              </Link>
              <Link
                href={`/admin/projets/${project.id}`}
                className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
                aria-label={`Modifier « ${project.title} »`}
              >
                <Pencil className="size-4" aria-hidden />
              </Link>
              <IconButton
                label={`Supprimer « ${project.title} »`}
                danger
                onClick={() => {
                  if (!window.confirm(`Supprimer définitivement « ${project.title} » et ses images ?`)) return;
                  const previous = projects;
                  setProjects((all) => all.filter((p) => p.id !== project.id));
                  run(() => deleteProject(project.id), () => setProjects(previous));
                }}
              >
                <Trash className="size-4" aria-hidden />
              </IconButton>
            </div>
          </div>
        )}
      />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
  pressed,
  danger,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  pressed?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-sunken",
        danger ? "hover:text-danger" : "hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
