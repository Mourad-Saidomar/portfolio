import { describe, expect, it } from "vitest";
import { formatDate, formatPeriod, slugify } from "@/lib/format";

describe("formatDate", () => {
  it("formate au mois ou à l'année", () => {
    expect(formatDate("2024-01-15", "month")).toBe("janv. 2024");
    expect(formatDate("2023-09-01", "month", true)).toBe("septembre 2023");
    expect(formatDate("2023-09-01", "year")).toBe("2023");
  });
});

describe("formatPeriod", () => {
  const base = { startDate: null, endDate: null, isCurrent: false, datePrecision: "year" as const };

  it("affiche une plage", () => {
    expect(formatPeriod({ ...base, startDate: "2023-01-01", endDate: "2024-01-01" })).toBe("2023 – 2024");
    expect(
      formatPeriod({ ...base, startDate: "2024-01-01", endDate: "2024-02-01", datePrecision: "month" }),
    ).toBe("janv. 2024 – févr. 2024");
  });

  it("gère les étapes en cours, avec ou sans date de début", () => {
    expect(formatPeriod({ ...base, isCurrent: true })).toBe("En cours");
    expect(formatPeriod({ ...base, isCurrent: true, startDate: "2026-02-01", datePrecision: "month" })).toBe(
      "Depuis févr. 2026",
    );
  });

  it("fusionne un début et une fin identiques", () => {
    expect(formatPeriod({ ...base, startDate: "2024-03-01", endDate: "2024-06-01" })).toBe("2024");
  });

  it("renvoie une chaîne vide sans date", () => {
    expect(formatPeriod(base)).toBe("");
  });
});

describe("slugify", () => {
  it.each([
    ["Covoit'May", "covoit-may"],
    ["Move&Go", "move-and-go"],
    ["  Été 2026 — Refonte !  ", "ete-2026-refonte"],
    ["Administration d'un domaine Active Directory", "administration-d-un-domaine-active-directory"],
  ])("%s → %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("produit toujours un slug valide pour la contrainte SQL", () => {
    for (const input of ["---", "ÀÉÎÕÜ", "a  b", "x".repeat(200)]) {
      const slug = slugify(input);
      if (slug) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });
});
