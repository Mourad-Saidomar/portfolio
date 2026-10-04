import { describe, expect, it } from "vitest";
import { splitHighlights, stripHighlights } from "@/lib/highlight";

describe("splitHighlights", () => {
  it("découpe le texte autour des passages entre crochets", () => {
    expect(splitHighlights("Je conçois des [interfaces web] claires et [rapides].")).toEqual([
      { text: "Je conçois des ", highlight: false },
      { text: "interfaces web", highlight: true },
      { text: " claires et ", highlight: false },
      { text: "rapides", highlight: true },
      { text: ".", highlight: false },
    ]);
  });

  it("laisse intact un texte sans crochets", () => {
    expect(splitHighlights("Texte simple")).toEqual([{ text: "Texte simple", highlight: false }]);
  });

  it("ignore les crochets vides ou non fermés", () => {
    expect(splitHighlights("a [] b [c")).toEqual([{ text: "a [] b [c", highlight: false }]);
  });
});

describe("stripHighlights", () => {
  it("retire les crochets en gardant les mots", () => {
    expect(stripHighlights("des [interfaces] [rapides]")).toBe("des interfaces rapides");
  });
});
