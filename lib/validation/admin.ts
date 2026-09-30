import type { JSONContent } from "@tiptap/core";
import { z } from "zod";

/*
 * Schémas de l'espace admin — partagés par les formulaires (validation immédiate)
 * et les Server Actions (validation faisant foi, côté serveur).
 */

const text = (max: number, message = `${max} caractères maximum.`) => z.string().trim().max(max, message);
const required = (label: string, max: number) =>
  z.string().trim().min(1, `${label} est obligatoire.`).max(max, `${max} caractères maximum.`);

/** URL http(s) facultative : chaîne vide acceptée (convertie en null à l'enregistrement). */
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+/.test(v), "Adresse web invalide (elle doit commencer par https://).");

/** Document Tiptap (JSON). Taille bornée pour éviter les abus. */
export const richTextSchema = z
  .custom<JSONContent>(
    (v) => typeof v === "object" && v !== null && (v as { type?: unknown }).type === "doc",
    "Contenu invalide.",
  )
  .refine((v) => JSON.stringify(v).length < 100_000, "Texte trop long.")
  .nullable();

const storagePath = z
  .string()
  .trim()
  .max(300)
  .regex(/^[a-zA-Z0-9/_.-]+$/, "Chemin de fichier invalide.")
  .refine((p) => !p.startsWith("/") && !p.split("/").includes(".."), "Chemin de fichier invalide.");

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Le slug est obligatoire.")
  .max(80, "80 caractères maximum.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Minuscules, chiffres et tirets uniquement (ex. mon-projet).");

// ─── Projets ────────────────────────────────────────────────────────

export const projectImageSchema = z.object({
  id: z.uuid().optional(),
  path: storagePath,
  alt: required("Le texte alternatif", 250),
  caption: text(250),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
});

export const projectSchema = z
  .object({
    id: z.uuid(),
    title: required("Le titre", 120),
    slug: slugSchema,
    summary: text(320),
    period: text(60),
    stack: z.array(z.string().trim().min(1).max(40)).max(20, "20 technologies maximum."),
    demoUrl: optionalUrl,
    repoUrl: optionalUrl,
    featured: z.boolean(),
    coverPath: storagePath.nullable(),
    coverAlt: text(250),
    context: richTextSchema,
    problem: richTextSchema,
    role: richTextSchema,
    solution: richTextSchema,
    results: richTextSchema,
    images: z.array(projectImageSchema).max(30, "30 images maximum."),
  })
  .refine((p) => !p.coverPath || p.coverAlt.length > 0, {
    path: ["coverAlt"],
    message: "Décrivez l'image de couverture (texte alternatif).",
  });

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const publishIntent = z.enum(["draft", "published"]);

// ─── Parcours ───────────────────────────────────────────────────────

const isoDate = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "Date invalide.");

export const timelineSchema = z
  .object({
    id: z.uuid().optional(),
    kind: z.enum(["experience", "education"]),
    title: required("L'intitulé", 160),
    organization: required("La structure", 160),
    location: text(120),
    startDate: isoDate.or(z.literal("")),
    endDate: isoDate.or(z.literal("")),
    isCurrent: z.boolean(),
    datePrecision: z.enum(["month", "year"]),
    description: text(1200),
    highlights: z.array(z.string().trim().min(1).max(200)).max(12),
    published: z.boolean(),
  })
  .refine((e) => e.isCurrent || !e.startDate || !e.endDate || e.endDate >= e.startDate, {
    path: ["endDate"],
    message: "La date de fin doit suivre la date de début.",
  });

export type TimelineFormValues = z.infer<typeof timelineSchema>;

// ─── Compétences ────────────────────────────────────────────────────

export const skillCategorySchema = z.object({
  id: z.uuid().optional(),
  name: required("Le nom", 80),
  description: text(240),
});

export const skillSchema = z.object({
  categoryId: z.uuid(),
  name: required("La compétence", 60),
});

// ─── Profil ─────────────────────────────────────────────────────────

const titled = z.object({ title: required("Le titre", 80), description: required("La description", 400) });

export const profileSchema = z.object({
  fullName: required("Le nom", 120),
  headline: required("Le métier", 120),
  tagline: required("La proposition de valeur", 220),
  intro: text(500),
  bio: text(4000),
  availability: text(160),
  location: text(120),
  email: z.string().trim().pipe(z.email("Adresse e-mail invalide.")),
  phone: text(30),
  showPhone: z.boolean(),
  photoPath: storagePath.nullable(),
  photoAlt: text(250),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  websiteUrl: optionalUrl,
  values: z.array(titled).max(6),
  differentiators: z.array(titled).max(6),
  languages: z.array(z.object({ name: required("La langue", 60), level: required("Le niveau", 120) })).max(8),
  interests: z.array(z.string().trim().min(1).max(80)).max(12),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const cvSchema = z.object({ path: storagePath.regex(/\.pdf$/i, "Le CV doit être un PDF.") });

// ─── Messages ───────────────────────────────────────────────────────

export const messageStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "read", "archived"]),
});

export const reorderSchema = z.object({
  table: z.enum(["projects", "skill_categories", "skills", "timeline_entries", "project_images"]),
  ids: z.array(z.uuid()).min(1).max(500),
});

/** "" → null pour les colonnes facultatives. */
export const emptyToNull = (value: string): string | null => (value.trim() === "" ? null : value.trim());
