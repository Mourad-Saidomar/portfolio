import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isDemoMode, isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { Profile, Project, ProjectSummary, SkillCategory, Testimonial, TimelineEntry } from "@/lib/types";
import { demoRows } from "./demo";
import {
  compareTimeline,
  toProfile,
  toProject,
  toProjectSummary,
  toSkillCategories,
  toTestimonial,
  toTimelineEntry,
} from "./mappers";
import { TAGS } from "./tags";

/*
 * Lecture du contenu public, mise en cache et intégrée aux pages statiques.
 * Chaque fonction est taguée : une publication dans l'admin invalide le tag concerné
 * et la page est régénérée à la visite suivante, sans redéploiement.
 */

type Source = "demo" | "supabase" | "none";

function source(): Source {
  if (isDemoMode()) return "demo";
  return isSupabaseConfigured() ? "supabase" : "none";
}

function report(scope: string, error: { message: string } | null): void {
  if (error) console.error(`[data] ${scope} : ${error.message}`);
}

export async function getProfile(): Promise<Profile | null> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.profile);

  const from = source();
  if (from === "demo") return toProfile(demoRows().profile);
  if (from === "none") return null;

  const { data, error } = await createPublicClient().from("profile").select("*").eq("id", 1).maybeSingle();
  report("profil", error);
  return data ? toProfile(data) : null;
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.timeline);

  const from = source();
  let rows =
    from === "demo" ? demoRows().timeline.filter((r) => r.published) : [];
  if (from === "supabase") {
    const { data, error } = await createPublicClient()
      .from("timeline_entries")
      .select("*")
      .eq("published", true);
    report("parcours", error);
    rows = data ?? [];
  }
  return rows
    .map((row) => ({ ...toTimelineEntry(row), position: row.position }))
    .sort(compareTimeline)
    .map(({ position: _position, ...entry }) => entry);
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.skills);

  const from = source();
  if (from === "demo") {
    const { skillCategories, skills } = demoRows();
    return toSkillCategories(skillCategories, skills);
  }
  if (from === "none") return [];

  const client = createPublicClient();
  const [categories, skills] = await Promise.all([
    client.from("skill_categories").select("*"),
    client.from("skills").select("*"),
  ]);
  report("catégories", categories.error);
  report("compétences", skills.error);
  return toSkillCategories(categories.data ?? [], skills.data ?? []);
}

export async function getProjects(): Promise<ProjectSummary[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.projects);

  const from = source();
  let rows = from === "demo" ? demoRows().projects.filter((p) => p.status === "published") : [];
  if (from === "supabase") {
    const { data, error } = await createPublicClient()
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("position");
    report("projets", error);
    rows = data ?? [];
  }
  return [...rows].sort((a, b) => a.position - b.position).map(toProjectSummary);
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.projects, TAGS.project(slug));

  const from = source();
  if (from === "demo") {
    const { projects, projectImages } = demoRows();
    const row = projects.find((p) => p.slug === slug && p.status === "published");
    return row ? toProject(row, projectImages.filter((i) => i.project_id === row.id)) : null;
  }
  if (from === "none") return null;

  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*, project_images(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  report(`projet ${slug}`, error);
  if (!data) return null;
  const { project_images: images, ...row } = data;
  return toProject(row, images ?? []);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.testimonials);

  const from = source();
  let rows = from === "demo" ? demoRows().testimonials.filter((t) => t.published) : [];
  if (from === "supabase") {
    const { data, error } = await createPublicClient()
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("position");
    report("avis", error);
    rows = data ?? [];
  }
  return [...rows].sort((a, b) => a.position - b.position).map(toTestimonial);
}

/** Projets voisins (navigation « projet suivant » en bas d'étude de cas). */
export async function getAdjacentProjects(slug: string) {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length < 2) return { next: null };
  return { next: projects[(index + 1) % projects.length] ?? null };
}
