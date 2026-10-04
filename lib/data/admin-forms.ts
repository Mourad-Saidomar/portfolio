import type { Tables } from "@/lib/supabase/database.types";
import type { Language, RichText, TitledText } from "@/lib/types";
import type {
  ProfileFormValues,
  ProjectFormValues,
  TestimonialFormValues,
  TimelineFormValues,
} from "@/lib/validation/admin";

/** Conversions ligne SQL → valeurs de formulaire admin. */

const doc = (value: unknown) =>
  value && typeof value === "object" && (value as RichText).type === "doc" ? (value as ProjectFormValues["context"]) : null;

export function emptyProject(id: string): ProjectFormValues {
  return {
    id,
    title: "",
    slug: "",
    summary: "",
    period: String(new Date().getFullYear()),
    stack: [],
    demoUrl: "",
    repoUrl: "",
    featured: false,
    coverPath: null,
    coverAlt: "",
    context: null,
    problem: null,
    role: null,
    solution: null,
    results: null,
    images: [],
  };
}

export function projectToForm(project: Tables<"projects">, images: Tables<"project_images">[]): ProjectFormValues {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    period: project.period,
    stack: project.stack,
    demoUrl: project.demo_url ?? "",
    repoUrl: project.repo_url ?? "",
    featured: project.featured,
    coverPath: project.cover_path,
    coverAlt: project.cover_alt,
    context: doc(project.context),
    problem: doc(project.problem),
    role: doc(project.role),
    solution: doc(project.solution),
    results: doc(project.results),
    images: images.map((i) => ({
      id: i.id,
      path: i.path,
      alt: i.alt,
      caption: i.caption,
      width: i.width,
      height: i.height,
    })),
  };
}

export function timelineToForm(entry: Tables<"timeline_entries"> | null): TimelineFormValues {
  return {
    id: entry?.id,
    kind: entry?.kind ?? "experience",
    title: entry?.title ?? "",
    organization: entry?.organization ?? "",
    location: entry?.location ?? "",
    startDate: entry?.start_date?.slice(0, 7) ?? "",
    endDate: entry?.end_date?.slice(0, 7) ?? "",
    isCurrent: entry?.is_current ?? false,
    datePrecision: entry?.date_precision ?? "month",
    description: entry?.description ?? "",
    highlights: entry?.highlights ?? [],
    published: entry?.published ?? true,
  };
}

export function testimonialToForm(row: Tables<"testimonials"> | null): TestimonialFormValues {
  return {
    id: row?.id,
    quote: row?.quote ?? "",
    authorName: row?.author_name ?? "",
    authorRole: row?.author_role ?? "",
    organization: row?.organization ?? "",
    published: row?.published ?? true,
  };
}

const titledList = (value: unknown): TitledText[] =>
  Array.isArray(value)
    ? value.filter((v): v is TitledText => typeof v?.title === "string" && typeof v?.description === "string")
    : [];

const languageList = (value: unknown): Language[] =>
  Array.isArray(value) ? value.filter((v): v is Language => typeof v?.name === "string" && typeof v?.level === "string") : [];

export function profileToForm(profile: Tables<"profile"> | null): ProfileFormValues {
  return {
    fullName: profile?.full_name ?? "",
    headline: profile?.headline ?? "",
    tagline: profile?.tagline ?? "",
    intro: profile?.intro ?? "",
    bio: profile?.bio ?? "",
    availability: profile?.availability ?? "",
    location: profile?.location ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    showPhone: profile?.show_phone ?? false,
    photoPath: profile?.photo_path ?? null,
    photoAlt: profile?.photo_alt ?? "",
    githubUrl: profile?.github_url ?? "",
    linkedinUrl: profile?.linkedin_url ?? "",
    websiteUrl: profile?.website_url ?? "",
    values: titledList(profile?.core_values),
    differentiators: titledList(profile?.differentiators),
    languages: languageList(profile?.languages),
    interests: profile?.interests ?? [],
  };
}
