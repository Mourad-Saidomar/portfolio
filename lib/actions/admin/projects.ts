"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { TAGS } from "@/lib/data/tags";
import type { Json } from "@/lib/supabase/database.types";
import { emptyToNull, projectSchema, publishIntent } from "@/lib/validation/admin";
import { type ActionResult, dbError, invalid, runAdminAction } from "./run";

function revalidateProject(...slugs: (string | null | undefined)[]) {
  updateTag(TAGS.projects);
  for (const slug of new Set(slugs)) if (slug) updateTag(TAGS.project(slug));
}

/** Crée ou met à jour un projet complet (fiche, étude de cas, images) puis le publie ou le garde en brouillon. */
export async function saveProject(
  input: unknown,
  intentInput: unknown,
): Promise<ActionResult<{ id: string; slug: string; status: "draft" | "published" }>> {
  return runAdminAction<{ id: string; slug: string; status: "draft" | "published" }>(async ({ supabase }) => {
    const parsed = projectSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const status = publishIntent.parse(intentInput);
    const p = parsed.data;

    const { data: existing } = await supabase.from("projects").select("slug, position").eq("id", p.id).maybeSingle();

    let position = existing?.position;
    if (position === undefined) {
      const { data: last } = await supabase
        .from("projects")
        .select("position")
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
      position = (last?.position ?? -1) + 1;
    }

    const { error } = await supabase.from("projects").upsert({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      period: p.period,
      stack: p.stack,
      demo_url: emptyToNull(p.demoUrl),
      repo_url: emptyToNull(p.repoUrl),
      featured: p.featured,
      cover_path: p.coverPath,
      cover_alt: p.coverAlt,
      context: p.context as Json,
      problem: p.problem as Json,
      role: p.role as Json,
      solution: p.solution as Json,
      results: p.results as Json,
      status,
      position,
    });
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Ce slug est déjà utilisé.", fieldErrors: { slug: "Ce slug est déjà utilisé par un autre projet." } };
      }
      return dbError("projet", error);
    }

    // Images : on remplace la liste (ordre = ordre du formulaire).
    const keepIds = p.images.map((i) => i.id).filter((id): id is string => Boolean(id));
    const removal = supabase.from("project_images").delete().eq("project_id", p.id);
    const { error: deleteError } = keepIds.length
      ? await removal.not("id", "in", `(${keepIds.join(",")})`)
      : await removal;
    if (deleteError) return dbError("images", deleteError);

    if (p.images.length) {
      const { error: imageError } = await supabase.from("project_images").upsert(
        p.images.map((image, index) => ({
          ...(image.id ? { id: image.id } : {}),
          project_id: p.id,
          path: image.path,
          alt: image.alt,
          caption: image.caption,
          width: image.width,
          height: image.height,
          position: index,
        })),
      );
      if (imageError) return dbError("images", imageError);
    }

    revalidateProject(p.slug, existing?.slug);
    return {
      ok: true,
      data: { id: p.id, slug: p.slug, status },
      message: status === "published" ? "Projet publié : il est en ligne." : "Brouillon enregistré.",
    };
  });
}

export async function setProjectStatus(idInput: unknown, statusInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const id = z.uuid().parse(idInput);
    const status = publishIntent.parse(statusInput);
    const { data, error } = await supabase.from("projects").update({ status }).eq("id", id).select("slug").single();
    if (error) return dbError("statut", error);
    revalidateProject(data.slug);
    return { ok: true, message: status === "published" ? "Projet publié." : "Projet repassé en brouillon." };
  });
}

export async function setProjectFeatured(idInput: unknown, featuredInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const id = z.uuid().parse(idInput);
    const featured = z.boolean().parse(featuredInput);
    const { data, error } = await supabase.from("projects").update({ featured }).eq("id", id).select("slug").single();
    if (error) return dbError("mise en avant", error);
    revalidateProject(data.slug);
    return { ok: true, message: featured ? "Projet mis en avant." : "Projet retiré de la mise en avant." };
  });
}

export async function deleteProject(idInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const id = z.uuid().parse(idInput);
    const { data: project } = await supabase.from("projects").select("slug").eq("id", id).maybeSingle();

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return dbError("suppression", error);

    // Nettoyage des fichiers du projet (couverture et captures), sans bloquer en cas d'échec.
    const folder = `projects/${id}`;
    const { data: files } = await supabase.storage.from("media").list(folder, { limit: 100 });
    if (files?.length) {
      await supabase.storage.from("media").remove(files.map((f) => `${folder}/${f.name}`));
    }

    revalidateProject(project?.slug);
    return { ok: true, message: "Projet supprimé." };
  });
}
