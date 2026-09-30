/** Tags de cache des données publiques — invalidés par l'admin à chaque publication. */
export const TAGS = {
  profile: "profile",
  timeline: "timeline",
  skills: "skills",
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
} as const;
