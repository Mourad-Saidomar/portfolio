"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { TAGS } from "@/lib/data/tags";
import {
  cvSchema,
  emptyToNull,
  messageStatusSchema,
  profileSchema,
  reorderSchema,
  skillCategorySchema,
  skillSchema,
  testimonialSchema,
  timelineSchema,
} from "@/lib/validation/admin";
import { type ActionResult, dbError, invalid, runAdminAction } from "./run";

/** « 2024-01 » → « 2024-01-01 » (colonne date). */
const toDate = (value: string) => (value ? (value.length === 7 ? `${value}-01` : value) : null);

// ─── Parcours ───────────────────────────────────────────────────────

export async function saveTimelineEntry(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAdminAction<{ id: string }>(async ({ supabase }) => {
    const parsed = timelineSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const e = parsed.data;
    const row = {
      kind: e.kind,
      title: e.title,
      organization: e.organization,
      location: e.location,
      start_date: toDate(e.startDate),
      end_date: e.isCurrent ? null : toDate(e.endDate),
      is_current: e.isCurrent,
      date_precision: e.datePrecision,
      description: e.description,
      highlights: e.highlights,
      published: e.published,
    };
    const query = e.id
      ? supabase.from("timeline_entries").update(row).eq("id", e.id).select("id").single()
      : supabase.from("timeline_entries").insert(row).select("id").single();
    const { data, error } = await query;
    if (error) return dbError("parcours", error);
    updateTag(TAGS.timeline);
    return { ok: true, data: { id: data.id }, message: "Étape enregistrée." };
  });
}

export async function deleteTimelineEntry(idInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("timeline_entries").delete().eq("id", z.uuid().parse(idInput));
    if (error) return dbError("parcours", error);
    updateTag(TAGS.timeline);
    return { ok: true, message: "Étape supprimée." };
  });
}

export async function setTimelinePublished(idInput: unknown, publishedInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const published = z.boolean().parse(publishedInput);
    const { error } = await supabase
      .from("timeline_entries")
      .update({ published })
      .eq("id", z.uuid().parse(idInput));
    if (error) return dbError("parcours", error);
    updateTag(TAGS.timeline);
    return { ok: true, message: published ? "Étape visible sur le site." : "Étape masquée." };
  });
}

// ─── Compétences ────────────────────────────────────────────────────

export async function saveSkillCategory(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAdminAction<{ id: string }>(async ({ supabase }) => {
    const parsed = skillCategorySchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const { id, name, description } = parsed.data;

    let result;
    if (id) {
      result = await supabase.from("skill_categories").update({ name, description }).eq("id", id).select("id").single();
    } else {
      const { count } = await supabase.from("skill_categories").select("id", { count: "exact", head: true });
      result = await supabase
        .from("skill_categories")
        .insert({ name, description, position: count ?? 0 })
        .select("id")
        .single();
    }
    if (result.error) return dbError("catégorie", result.error);
    updateTag(TAGS.skills);
    return { ok: true, data: { id: result.data.id }, message: "Catégorie enregistrée." };
  });
}

export async function deleteSkillCategory(idInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("skill_categories").delete().eq("id", z.uuid().parse(idInput));
    if (error) return dbError("catégorie", error);
    updateTag(TAGS.skills);
    return { ok: true, message: "Catégorie supprimée." };
  });
}

export async function addSkill(input: unknown): Promise<ActionResult<{ id: string; name: string }>> {
  return runAdminAction<{ id: string; name: string }>(async ({ supabase }) => {
    const parsed = skillSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const { categoryId, name } = parsed.data;
    const { count } = await supabase
      .from("skills")
      .select("id", { count: "exact", head: true })
      .eq("category_id", categoryId);
    const { data, error } = await supabase
      .from("skills")
      .insert({ category_id: categoryId, name, position: count ?? 0 })
      .select("id, name")
      .single();
    if (error) {
      if (error.code === "23505") return { ok: false, error: "Cette compétence existe déjà dans la catégorie." };
      return dbError("compétence", error);
    }
    updateTag(TAGS.skills);
    return { ok: true, data, message: `« ${name} » ajoutée.` };
  });
}

export async function deleteSkill(idInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("skills").delete().eq("id", z.uuid().parse(idInput));
    if (error) return dbError("compétence", error);
    updateTag(TAGS.skills);
    return { ok: true, message: "Compétence supprimée." };
  });
}

// ─── Avis ───────────────────────────────────────────────────────────

export async function saveTestimonial(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAdminAction<{ id: string }>(async ({ supabase }) => {
    const parsed = testimonialSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const t = parsed.data;
    const row = {
      quote: t.quote,
      author_name: t.authorName,
      author_role: t.authorRole,
      organization: t.organization,
      published: t.published,
    };

    let result;
    if (t.id) {
      result = await supabase.from("testimonials").update(row).eq("id", t.id).select("id").single();
    } else {
      // Nouvel avis : ajouté en fin de liste.
      const { count } = await supabase.from("testimonials").select("id", { count: "exact", head: true });
      result = await supabase
        .from("testimonials")
        .insert({ ...row, position: count ?? 0 })
        .select("id")
        .single();
    }
    if (result.error) return dbError("avis", result.error);
    updateTag(TAGS.testimonials);
    return { ok: true, data: { id: result.data.id }, message: "Avis enregistré." };
  });
}

export async function deleteTestimonial(idInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", z.uuid().parse(idInput));
    if (error) return dbError("avis", error);
    updateTag(TAGS.testimonials);
    return { ok: true, message: "Avis supprimé." };
  });
}

// ─── Réordonnancement (glisser-déposer) ─────────────────────────────

const REORDER_TAGS = {
  projects: TAGS.projects,
  project_images: TAGS.projects,
  skill_categories: TAGS.skills,
  skills: TAGS.skills,
  timeline_entries: TAGS.timeline,
  testimonials: TAGS.testimonials,
} as const;

export async function reorder(input: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = reorderSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const { error } = await supabase.rpc("reorder_rows", { target_table: parsed.data.table, ids: parsed.data.ids });
    if (error) return dbError("ordre", error);
    updateTag(REORDER_TAGS[parsed.data.table]);
    return { ok: true, message: "Nouvel ordre enregistré." };
  });
}

// ─── Profil ─────────────────────────────────────────────────────────

export async function saveProfile(input: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const p = parsed.data;
    const { error } = await supabase.from("profile").upsert({
      id: 1,
      full_name: p.fullName,
      headline: p.headline,
      tagline: p.tagline,
      intro: p.intro,
      bio: p.bio,
      availability: p.availability,
      location: p.location,
      email: p.email,
      phone: emptyToNull(p.phone),
      show_phone: p.showPhone,
      photo_path: p.photoPath,
      photo_alt: p.photoAlt,
      github_url: emptyToNull(p.githubUrl),
      linkedin_url: emptyToNull(p.linkedinUrl),
      website_url: emptyToNull(p.websiteUrl),
      core_values: p.values,
      differentiators: p.differentiators,
      languages: p.languages,
      interests: p.interests,
    });
    if (error) return dbError("profil", error);
    updateTag(TAGS.profile);
    return { ok: true, message: "Profil enregistré : le site est à jour." };
  });
}

/** Enregistre le nouveau CV (déjà téléversé dans Storage) et supprime l'ancien fichier. */
export async function replaceCv(input: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = cvSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const { data: current } = await supabase.from("profile").select("cv_path").eq("id", 1).maybeSingle();
    const { error } = await supabase
      .from("profile")
      .update({ cv_path: parsed.data.path, cv_updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) return dbError("CV", error);
    if (current?.cv_path && current.cv_path !== parsed.data.path) {
      await supabase.storage.from("documents").remove([current.cv_path]);
    }
    updateTag(TAGS.profile);
    return { ok: true, message: "CV remplacé : le bouton de téléchargement pointe vers la nouvelle version." };
  });
}

// ─── Messages ───────────────────────────────────────────────────────

export async function setMessageStatus(input: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = messageStatusSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const { error } = await supabase.from("messages").update({ status: parsed.data.status }).eq("id", parsed.data.id);
    if (error) return dbError("message", error);
    return { ok: true };
  });
}

export async function deleteMessage(idInput: unknown): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("messages").delete().eq("id", z.uuid().parse(idInput));
    if (error) return dbError("message", error);
    return { ok: true, message: "Message supprimé." };
  });
}
