import "server-only";
import type { Tables } from "@/lib/supabase/database.types";
import { buildSeedRows } from "@/supabase/seed/rows";

/**
 * Source « démo » : les lignes du seed complétées avec les valeurs par défaut de la base.
 * Activée seulement avec DEMO_MODE=1 (développement sans Supabase, tests E2E, audits).
 */

const EPOCH = "2026-09-30T00:00:00.000Z";

export function demoRows() {
  const seed = buildSeedRows();

  const profile: Tables<"profile"> = {
    id: 1,
    intro: "",
    bio: "",
    availability: "",
    location: "",
    phone: null,
    show_phone: false,
    photo_path: null,
    photo_alt: "",
    cv_path: null,
    cv_updated_at: null,
    github_url: null,
    linkedin_url: null,
    website_url: null,
    core_values: [],
    differentiators: [],
    languages: [],
    interests: [],
    updated_at: EPOCH,
    ...seed.profile,
  };

  const timeline: Tables<"timeline_entries">[] = seed.timeline.map((row, index) => ({
    id: row.id ?? `timeline-${index}`,
    location: "",
    start_date: null,
    end_date: null,
    is_current: false,
    date_precision: "year",
    description: "",
    highlights: [],
    published: true,
    position: index,
    created_at: EPOCH,
    updated_at: EPOCH,
    ...row,
  }));

  const skillCategories: Tables<"skill_categories">[] = seed.skillCategories.map((row, index) => ({
    description: "",
    position: index,
    created_at: EPOCH,
    updated_at: EPOCH,
    ...row,
  }));

  const skills: Tables<"skills">[] = seed.skills.map((row) => ({
    position: 0,
    created_at: EPOCH,
    ...row,
  }));

  const projects: Tables<"projects">[] = seed.projects.map((row, index) => ({
    summary: "",
    period: "",
    cover_path: null,
    cover_alt: "",
    context: null,
    problem: null,
    role: null,
    solution: null,
    results: null,
    stack: [],
    demo_url: null,
    repo_url: null,
    status: "draft",
    featured: false,
    position: index,
    published_at: EPOCH,
    created_at: EPOCH,
    updated_at: EPOCH,
    ...row,
  }));

  const projectImages: Tables<"project_images">[] = seed.projectImages.map((row) => ({
    alt: "",
    caption: "",
    width: null,
    height: null,
    position: 0,
    created_at: EPOCH,
    ...row,
  }));

  return { profile, timeline, skillCategories, skills, projects, projectImages };
}
