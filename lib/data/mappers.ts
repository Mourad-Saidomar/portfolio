import { storageUrl } from "@/lib/media";
import type { Json, Tables } from "@/lib/supabase/database.types";
import type {
  Language,
  Profile,
  Project,
  ProjectSummary,
  RichText,
  SkillCategory,
  TimelineEntry,
  TitledText,
} from "@/lib/types";

type ProjectRow = Tables<"projects">;
type ImageRow = Tables<"project_images">;

function asArray<T>(value: Json, guard: (item: unknown) => item is T): T[] {
  return Array.isArray(value) ? (value as unknown[]).filter(guard) : [];
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const isTitledText = (v: unknown): v is TitledText =>
  isRecord(v) && typeof v.title === "string" && typeof v.description === "string";

const isLanguage = (v: unknown): v is Language =>
  isRecord(v) && typeof v.name === "string" && typeof v.level === "string";

const isRichText = (v: Json | null): v is RichText & Json => isRecord(v) && v.type === "doc";

export function toProfile(row: Tables<"profile">): Profile {
  const photoUrl = storageUrl("media", row.photo_path);
  return {
    fullName: row.full_name,
    headline: row.headline,
    tagline: row.tagline,
    intro: row.intro,
    bio: row.bio,
    availability: row.availability,
    location: row.location,
    email: row.email,
    phone: row.show_phone ? row.phone : null,
    photo: photoUrl ? { url: photoUrl, alt: row.photo_alt } : null,
    cvUrl: storageUrl("documents", row.cv_path),
    cvUpdatedAt: row.cv_updated_at,
    socials: { github: row.github_url, linkedin: row.linkedin_url, website: row.website_url },
    values: asArray(row.core_values, isTitledText),
    differentiators: asArray(row.differentiators, isTitledText),
    languages: asArray(row.languages, isLanguage),
    interests: row.interests,
  };
}

export function toTimelineEntry(row: Tables<"timeline_entries">): TimelineEntry {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    organization: row.organization,
    location: row.location,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    datePrecision: row.date_precision,
    description: row.description,
    highlights: row.highlights,
  };
}

/** Ordre d'affichage : en cours d'abord, puis du plus récent au plus ancien, puis position manuelle. */
export function compareTimeline(a: TimelineEntry & { position?: number }, b: TimelineEntry & { position?: number }) {
  if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
  const aStart = a.startDate ?? "9999";
  const bStart = b.startDate ?? "9999";
  if (aStart !== bStart) return aStart < bStart ? 1 : -1;
  return (a.position ?? 0) - (b.position ?? 0);
}

export function toSkillCategories(
  categories: Tables<"skill_categories">[],
  skills: Tables<"skills">[],
): SkillCategory[] {
  return [...categories]
    .sort((a, b) => a.position - b.position)
    .map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      skills: skills
        .filter((s) => s.category_id === category.id)
        .sort((a, b) => a.position - b.position)
        .map((s) => ({ id: s.id, name: s.name })),
    }));
}

export function toProjectSummary(row: ProjectRow): ProjectSummary {
  const coverUrl = storageUrl("media", row.cover_path);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    period: row.period,
    cover: coverUrl ? { url: coverUrl, alt: row.cover_alt } : null,
    stack: row.stack,
    featured: row.featured,
  };
}

export function toProject(row: ProjectRow, images: ImageRow[]): Project {
  return {
    ...toProjectSummary(row),
    status: row.status,
    context: isRichText(row.context) ? row.context : null,
    problem: isRichText(row.problem) ? row.problem : null,
    role: isRichText(row.role) ? row.role : null,
    solution: isRichText(row.solution) ? row.solution : null,
    results: isRichText(row.results) ? row.results : null,
    demoUrl: row.demo_url,
    repoUrl: row.repo_url,
    images: [...images]
      .sort((a, b) => a.position - b.position)
      .flatMap((image) => {
        const url = storageUrl("media", image.path);
        return url
          ? [
              {
                id: image.id,
                url,
                alt: image.alt,
                caption: image.caption,
                width: image.width ?? undefined,
                height: image.height ?? undefined,
              },
            ]
          : [];
      }),
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}
