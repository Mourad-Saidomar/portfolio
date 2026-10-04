import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Typewriter } from "@/components/site/typewriter";

const WORDS = ["dev", "admin"];

/** Texte tapé (partie animée, masquée des lecteurs d'écran). */
const typed = (container: HTMLElement) => container.querySelector("p > span[aria-hidden] > span")?.textContent;
const caret = (container: HTMLElement) => container.querySelector<HTMLElement>("p > span[aria-hidden] > span:last-child");

describe("Typewriter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    delete document.documentElement.dataset.motion;
  });

  it("lit la phrase complète une seule fois aux lecteurs d'écran ; la ligne part vide", () => {
    const { container } = render(<Typewriter prefix="Je suis" words={WORDS} />);
    expect(container.querySelector(".sr-only")?.textContent).toBe("Je suis dev, admin.");
    expect(typed(container)).toBe("");
  });

  it("attend la fin de l'entrée du hero avant la première frappe", () => {
    const { container } = render(<Typewriter prefix="Je suis" words={WORDS} startDelay={1000} />);
    act(() => vi.advanceTimersByTime(999));
    expect(typed(container)).toBe("");
    act(() => vi.advanceTimersByTime(1));
    expect(typed(container)).toBe("d");
  });

  it("tape le mot lettre par lettre, l'efface lettre par lettre, puis tape le suivant", () => {
    const { container } = render(<Typewriter prefix="Je suis" words={WORDS} />);
    expect(typed(container)).toBe("");
    act(() => vi.advanceTimersByTime(0));
    expect(typed(container)).toBe("d");
    act(() => vi.advanceTimersByTime(85));
    expect(typed(container)).toBe("de");
    act(() => vi.advanceTimersByTime(85));
    expect(typed(container)).toBe("dev");
    act(() => vi.advanceTimersByTime(1900));
    expect(typed(container)).toBe("de");
    act(() => vi.advanceTimersByTime(45 * 2));
    expect(typed(container)).toBe("");
    act(() => vi.advanceTimersByTime(85 * 4 + 85 * 4));
    expect(typed(container)).toBe("admin");
  });

  it("fait clignoter le curseur à l'arrêt, sans animation CSS", () => {
    const { container } = render(<Typewriter prefix="Je suis" words={WORDS} />);
    act(() => vi.advanceTimersByTime(300)); // « dev » tapé, maintien en cours
    const states = new Set<string>();
    for (let i = 0; i < 4; i++) {
      act(() => vi.advanceTimersByTime(530));
      states.add(caret(container)?.style.opacity ?? "");
    }
    expect(states).toEqual(new Set(["0", "1"]));
  });

  it("se fige quand les animations sont en pause", () => {
    document.documentElement.dataset.motion = "paused";
    const { container } = render(<Typewriter prefix="Je suis" words={WORDS} />);
    act(() => vi.advanceTimersByTime(10_000));
    expect(typed(container)).toBe("");
    expect(caret(container)?.style.opacity).toBe("1");
  });
});
