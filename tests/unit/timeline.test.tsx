import { fireEvent, render, screen, within } from "@testing-library/react";
import { LazyMotion, domAnimation } from "motion/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "@/components/site/timeline";
import type { TimelineEntry } from "@/lib/types";

const entry = (id: string, kind: TimelineEntry["kind"], title: string): TimelineEntry => ({
  id,
  kind,
  title,
  organization: "Structure",
  location: "Mamoudzou",
  startDate: "2024-01-01",
  endDate: "2024-02-01",
  isCurrent: false,
  datePrecision: "month",
  description: "",
  highlights: [],
});

const entries = [
  entry("1", "experience", "Stage DGFiP"),
  entry("2", "education", "BTS SIO"),
  entry("3", "experience", "Stage mairie"),
];

function setup() {
  return render(
    <LazyMotion features={domAnimation}>
      <Timeline entries={entries} />
    </LazyMotion>,
  );
}

describe("Timeline", () => {
  it("affiche toutes les étapes avec leurs compteurs", () => {
    setup();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    const group = screen.getByRole("group", { name: "Filtrer le parcours" });
    expect(within(group).getByRole("button", { name: /Tout\s*3/ })).toHaveAttribute("aria-pressed", "true");
    expect(within(group).getByRole("button", { name: /Expériences\s*2/ })).toBeInTheDocument();
  });

  it("filtre par type et annonce le résultat", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Formations/ }));
    expect(screen.getByRole("button", { name: /Formations/ })).toHaveAttribute("aria-pressed", "true");
    expect(await screen.findByText("1 étape affichée")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "BTS SIO" })).toBeInTheDocument();
  });

  it("formate les périodes en français", () => {
    setup();
    expect(screen.getAllByText("janv. 2024 – févr. 2024")).toHaveLength(3);
  });
});
