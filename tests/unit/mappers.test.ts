import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { demoRows } = await import("@/lib/data/demo");
const { compareTimeline, toProfile, toProject, toSkillCategories, toTimelineEntry } = await import("@/lib/data/mappers");
const { isRichTextEmpty, richTextToPlain, rt } = await import("@/lib/rich-text");

describe("mappers", () => {
  const rows = demoRows();

  it("n'expose pas le téléphone tant qu'il n'est pas autorisé", () => {
    expect(toProfile(rows.profile).phone).toBeNull();
    expect(toProfile({ ...rows.profile, show_phone: true }).phone).toBe(rows.profile.phone);
  });

  it("ignore les entrées JSON malformées du profil", () => {
    const profile = toProfile({ ...rows.profile, core_values: [{ title: "ok", description: "ok" }, { title: 1 }, "x"] });
    expect(profile.values).toEqual([{ title: "ok", description: "ok" }]);
  });

  it("ordonne le parcours : en cours d'abord, puis du plus récent au plus ancien", () => {
    const entries = rows.timeline.map((r) => ({ ...toTimelineEntry(r), position: r.position })).sort(compareTimeline);
    expect(entries[0]?.isCurrent).toBe(true);
    const dated = entries.filter((e) => e.startDate).map((e) => e.startDate as string);
    expect(dated).toEqual([...dated].sort().reverse());
  });

  it("rattache et ordonne les compétences par catégorie", () => {
    const categories = toSkillCategories(rows.skillCategories, rows.skills);
    expect(categories[0]?.name).toBe("Front-end");
    expect(categories.every((c) => c.skills.length > 0)).toBe(true);
  });

  it("construit une étude de cas avec images ordonnées et URLs publiques", () => {
    const row = rows.projects.find((p) => p.slug === "move-and-go")!;
    const images = rows.projectImages.filter((i) => i.project_id === row.id).reverse();
    const project = toProject(row, images);
    expect(project.images.map((i) => i.caption)).toEqual(["MLD.", "MPD — schéma MySQL."]);
    expect(project.cover?.url).toMatch(/move-and-go\/mcd\.webp$/);
    expect(project.context?.type).toBe("doc");
  });
});

describe("rich-text", () => {
  it("extrait le texte brut et détecte les documents vides", () => {
    const doc = rt.doc(rt.p("Bonjour"), rt.ul(["un", "deux"]));
    expect(richTextToPlain(doc)).toContain("Bonjour");
    expect(richTextToPlain(doc)).toContain("deux");
    expect(isRichTextEmpty(rt.doc())).toBe(true);
    expect(isRichTextEmpty(null)).toBe(true);
    expect(isRichTextEmpty(doc)).toBe(false);
  });
});
