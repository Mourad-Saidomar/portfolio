import type { TablesInsert } from "../../lib/supabase/database.types";
import { profile, projects, skillCategories, testimonials, timeline } from "./content";

export type SeedRows = {
  profile: TablesInsert<"profile">;
  timeline: TablesInsert<"timeline_entries">[];
  skillCategories: (TablesInsert<"skill_categories"> & { id: string })[];
  skills: (TablesInsert<"skills"> & { id: string })[];
  projects: (TablesInsert<"projects"> & { id: string })[];
  projectImages: (TablesInsert<"project_images"> & { id: string })[];
  testimonials: (TablesInsert<"testimonials"> & { id: string })[];
};

/** Identifiant d’enfant dérivé du parent : unique pour chaque couple (parent, index). */
const childId = (parentId: string, index: number) =>
  `${String(index + 1).padStart(8, "0")}${parentId.slice(8)}`;

/** Transforme le contenu éditorial en lignes prêtes à insérer (identifiants stables). */
export function buildSeedRows(): SeedRows {
  const skills = skillCategories.flatMap((category) =>
    category.skills.map((name, index) => ({
      id: childId(category.id, index),
      category_id: category.id,
      name,
      position: index,
    })),
  );

  const projectImages = projects.flatMap((project) =>
    project.images.map((image, index) => ({
      ...image,
      id: childId(project.id, index),
      project_id: project.id,
      position: image.position ?? index,
    })),
  );

  return {
    profile,
    timeline,
    skillCategories: skillCategories.map(({ skills: _skills, ...category }) => category),
    skills,
    projects: projects.map(({ images: _images, ...project }) => project),
    projectImages,
    testimonials,
  };
}
