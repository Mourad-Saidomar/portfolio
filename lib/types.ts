import type { JSONContent } from "@tiptap/core";
import type { Enums } from "@/lib/supabase/database.types";

/** Document Tiptap (JSON) — format de stockage du texte riche. */
export type RichText = JSONContent;

export type TimelineKind = Enums<"timeline_kind">;
export type DatePrecision = Enums<"date_precision">;
export type PublicationStatus = Enums<"publication_status">;
export type MessageStatus = Enums<"message_status">;

export type Media = { url: string; alt: string; width?: number; height?: number };

export type TitledText = { title: string; description: string };
export type Language = { name: string; level: string };

export type Profile = {
  fullName: string;
  headline: string;
  tagline: string;
  intro: string;
  bio: string;
  availability: string;
  location: string;
  email: string;
  phone: string | null;
  photo: Media | null;
  cvUrl: string | null;
  cvUpdatedAt: string | null;
  socials: { github: string | null; linkedin: string | null; website: string | null };
  values: TitledText[];
  differentiators: TitledText[];
  languages: Language[];
  interests: string[];
};

export type TimelineEntry = {
  id: string;
  kind: TimelineKind;
  title: string;
  organization: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  datePrecision: DatePrecision;
  description: string;
  highlights: string[];
};

export type Skill = { id: string; name: string };
export type SkillCategory = { id: string; name: string; description: string; skills: Skill[] };

export type ProjectSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  period: string;
  cover: Media | null;
  stack: string[];
  featured: boolean;
};

export type Project = ProjectSummary & {
  status: PublicationStatus;
  context: RichText | null;
  problem: RichText | null;
  role: RichText | null;
  solution: RichText | null;
  results: RichText | null;
  demoUrl: string | null;
  repoUrl: string | null;
  images: (Media & { id: string; caption: string })[];
  publishedAt: string | null;
  updatedAt: string;
};
