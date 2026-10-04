import "server-only";
import type { AdminSession } from "@/lib/auth";
import type { Tables } from "@/lib/supabase/database.types";
import { isTodo } from "@/lib/utils";
import { richTextToPlain } from "@/lib/rich-text";
import type { RichText } from "@/lib/types";

/** Lectures de l'espace admin : jamais mises en cache, toujours sous la session (RLS admin). */

type Client = AdminSession["supabase"];

export async function listProjects(supabase: Client) {
  const { data } = await supabase
    .from("projects")
    .select("id, slug, title, summary, status, featured, position, cover_path, updated_at")
    .order("position");
  return data ?? [];
}

export async function getProjectWithImages(supabase: Client, id: string) {
  const { data } = await supabase.from("projects").select("*, project_images(*)").eq("id", id).maybeSingle();
  if (!data) return null;
  const { project_images, ...project } = data;
  return { project, images: [...(project_images ?? [])].sort((a, b) => a.position - b.position) };
}

export async function listTimeline(supabase: Client) {
  const { data } = await supabase
    .from("timeline_entries")
    .select("*")
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false, nullsFirst: true })
    .order("position");
  return data ?? [];
}

export async function getTimelineEntry(supabase: Client, id: string) {
  const { data } = await supabase.from("timeline_entries").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function listSkillCategories(supabase: Client) {
  const [categories, skills] = await Promise.all([
    supabase.from("skill_categories").select("*").order("position"),
    supabase.from("skills").select("*").order("position"),
  ]);
  return (categories.data ?? []).map((category) => ({
    ...category,
    skills: (skills.data ?? []).filter((s) => s.category_id === category.id),
  }));
}

export async function listTestimonials(supabase: Client) {
  const { data } = await supabase.from("testimonials").select("*").order("position");
  return data ?? [];
}

export async function getTestimonial(supabase: Client, id: string) {
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getProfileRow(supabase: Client) {
  const { data } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  return data;
}

export async function listMessages(supabase: Client, status: Tables<"messages">["status"]) {
  const { data } = await supabase
    .from("messages")
    .select("id, name, email, message, status, created_at")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

export async function countMessages(supabase: Client) {
  const count = async (status: Tables<"messages">["status"]) =>
    (await supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", status)).count ?? 0;
  const [unread, read, archived] = await Promise.all([count("new"), count("read"), count("archived")]);
  return { new: unread, read, archived };
}

export type TodoItem = { label: string; href: string };

/** Repère les contenus marqués « À COMPLÉTER » et les manques importants (CV, LinkedIn…). */
export async function findTodos(supabase: Client): Promise<TodoItem[]> {
  const [profile, timeline, projects, testimonials] = await Promise.all([
    getProfileRow(supabase),
    listTimeline(supabase),
    supabase.from("projects").select("id, title, summary, context, problem, role, solution, results, demo_url, repo_url"),
    listTestimonials(supabase),
  ]);
  const todos: TodoItem[] = [];

  if (profile) {
    if (!profile.cv_path) todos.push({ label: "Téléverser le CV (PDF)", href: "/admin/profil#cv" });
    if (!profile.linkedin_url) todos.push({ label: "Ajouter le lien LinkedIn", href: "/admin/profil#liens" });
    if (isTodo(profile.availability)) todos.push({ label: "Préciser les dates de disponibilité", href: "/admin/profil" });
    if (JSON.stringify(profile.languages).includes("À COMPLÉTER"))
      todos.push({ label: "Confirmer les niveaux de langue", href: "/admin/profil#langues" });
  } else {
    todos.push({ label: "Créer le profil", href: "/admin/profil" });
  }

  for (const entry of timeline) {
    if ([entry.title, entry.organization, entry.description].some(isTodo)) {
      todos.push({ label: `Parcours : ${entry.title.replace(/ — À COMPLÉTER/, "")}`, href: `/admin/parcours/${entry.id}` });
    }
  }

  for (const project of projects.data ?? []) {
    const texts = [project.context, project.problem, project.role, project.solution, project.results].map((doc) =>
      richTextToPlain(doc as RichText | null),
    );
    if ([project.summary, ...texts].some(isTodo)) {
      todos.push({ label: `Projet : ${project.title}`, href: `/admin/projets/${project.id}` });
    }
  }

  testimonials.forEach((item, index) => {
    if ([item.quote, item.author_name, item.author_role].some(isTodo)) {
      todos.push({ label: `Avis n° ${index + 1} : remplacer l'emplacement`, href: `/admin/avis/${item.id}` });
    }
  });
  return todos;
}
