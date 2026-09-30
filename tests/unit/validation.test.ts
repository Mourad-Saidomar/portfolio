import { describe, expect, it } from "vitest";
import { rt } from "@/lib/rich-text";
import { projectSchema, profileSchema, timelineSchema } from "@/lib/validation/admin";
import { contactSchema } from "@/lib/validation/contact";

const validProject = {
  id: "8b0c7f1e-8f3a-4c4e-9b1a-2f6d5e4c3b2a",
  title: "Mon projet",
  slug: "mon-projet",
  summary: "Résumé",
  period: "2026",
  stack: ["Next.js"],
  demoUrl: "",
  repoUrl: "https://github.com/moi/projet",
  featured: false,
  coverPath: null,
  coverAlt: "",
  context: rt.doc(rt.p("Contexte")),
  problem: null,
  role: null,
  solution: null,
  results: null,
  images: [],
};

describe("contactSchema", () => {
  const base = { name: "Ada Lovelace", email: "ada@example.com", message: "Bonjour, un stage ?", website: "", startedAt: 1 };

  it("accepte un message valide et nettoie les espaces", () => {
    const parsed = contactSchema.parse({ ...base, email: "  ada@example.com  " });
    expect(parsed.email).toBe("ada@example.com");
  });

  it.each([
    ["name", "A", /2 caractères/],
    ["email", "pas-un-email", /invalide/],
    ["message", "court", /10 caractères/],
  ])("refuse un champ %s invalide", (field, value, message) => {
    const result = contactSchema.safeParse({ ...base, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(message);
  });

  it("refuse un honeypot rempli", () => {
    expect(contactSchema.safeParse({ ...base, website: "http://spam" }).success).toBe(false);
  });
});

describe("projectSchema", () => {
  it("accepte un projet complet", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it("exige un slug au bon format", () => {
    const result = projectSchema.safeParse({ ...validProject, slug: "Mon Projet" });
    expect(result.error?.issues[0]?.path).toEqual(["slug"]);
  });

  it("refuse une URL sans protocole", () => {
    const result = projectSchema.safeParse({ ...validProject, demoUrl: "monsite.fr" });
    expect(result.error?.issues[0]?.path).toEqual(["demoUrl"]);
  });

  it("exige un texte alternatif pour la couverture et chaque capture", () => {
    const withCover = projectSchema.safeParse({ ...validProject, coverPath: "projects/x/cover.webp", coverAlt: "" });
    expect(withCover.error?.issues[0]?.path).toEqual(["coverAlt"]);

    const withImage = projectSchema.safeParse({
      ...validProject,
      images: [{ path: "projects/x/a.webp", alt: "", caption: "", width: 10, height: 10 }],
    });
    expect(withImage.error?.issues[0]?.path).toEqual(["images", 0, "alt"]);
  });

  it("refuse un chemin de fichier suspect", () => {
    const result = projectSchema.safeParse({ ...validProject, coverPath: "../../etc/passwd", coverAlt: "x" });
    expect(result.success).toBe(false);
  });

  it("refuse un texte riche qui n'est pas un document Tiptap", () => {
    expect(projectSchema.safeParse({ ...validProject, context: { type: "paragraph" } }).success).toBe(false);
  });
});

describe("timelineSchema", () => {
  const entry = {
    kind: "experience" as const,
    title: "Stage",
    organization: "DGFiP",
    location: "Mamoudzou",
    startDate: "2024-01",
    endDate: "2024-02",
    isCurrent: false,
    datePrecision: "month" as const,
    description: "",
    highlights: [],
    published: true,
  };

  it("accepte une étape valide", () => {
    expect(timelineSchema.safeParse(entry).success).toBe(true);
  });

  it("refuse une fin antérieure au début", () => {
    const result = timelineSchema.safeParse({ ...entry, endDate: "2023-12" });
    expect(result.error?.issues[0]?.path).toEqual(["endDate"]);
  });

  it("ignore la date de fin d'une étape en cours", () => {
    expect(timelineSchema.safeParse({ ...entry, isCurrent: true, endDate: "2020-01" }).success).toBe(true);
  });
});

describe("profileSchema", () => {
  it("exige l'identité minimale", () => {
    const result = profileSchema.safeParse({
      fullName: "",
      headline: "",
      tagline: "",
      intro: "",
      bio: "",
      availability: "",
      location: "",
      email: "x",
      phone: "",
      showPhone: false,
      photoPath: null,
      photoAlt: "",
      githubUrl: "",
      linkedinUrl: "",
      websiteUrl: "",
      values: [],
      differentiators: [],
      languages: [],
      interests: [],
    });
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["fullName", "headline", "tagline", "email"]));
  });
});
