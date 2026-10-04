"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  prefix: string;
  words: string[];
  className?: string;
  /** Délai avant la première frappe (laisse jouer l'apparition du hero). */
  startDelay?: number;
};

const TYPE_MS = 85;
const ERASE_MS = 45;
const HOLD_MS = 1900;
const BLINK_MS = 530;

/** Animations en pause via le bouton « Mettre en pause les animations » (WCAG 2.2.2). */
const paused = () => document.documentElement.dataset.motion === "paused";

/**
 * Effet machine à écrire : « Je suis » + des mots tapés lettre par lettre, curseur clignotant,
 * puis effacés lettre par lettre avant le mot suivant, en boucle.
 * Pas de déplacement à l'écran (seul le texte change) : l'effet reste actif en mouvement réduit.
 * Le clignotement est piloté en JS (aucune animation CSS en boucle) et le curseur reste plein
 * pendant la frappe, comme dans un éditeur. Pause globale : tout se fige.
 * Les lecteurs d'écran lisent la phrase complète une seule fois (texte masqué).
 */
export function Typewriter({ prefix, words, className, startDelay = 0 }: Props) {
  // Vide au départ : le premier mot se tape lui aussi, une fois l'entrée du hero terminée.
  const [text, setText] = useState("");
  const [caretOn, setCaretOn] = useState(true);
  const lastKey = useRef(0);

  useEffect(() => {
    if (words.length === 0) return;
    let index = 0;
    let length = 0;
    let erasing = false;
    let timer: ReturnType<typeof setTimeout>;

    const key = (value: string) => {
      lastKey.current = performance.now();
      setText(value);
    };

    const tick = (delay: number) => {
      timer = setTimeout(() => {
        if (paused()) return tick(300);
        const word = words[index] ?? "";
        if (erasing) {
          length -= 1;
          key(word.slice(0, Math.max(0, length)));
          if (length <= 0) {
            erasing = false;
            index = (index + 1) % words.length;
            return tick(TYPE_MS * 4);
          }
          return tick(ERASE_MS);
        }
        length += 1;
        key(word.slice(0, length));
        if (length >= word.length) {
          erasing = words.length > 1;
          return erasing ? tick(HOLD_MS) : undefined;
        }
        tick(TYPE_MS);
      }, delay);
    };

    tick(startDelay);

    // Curseur : plein pendant la frappe, clignote à l'arrêt.
    const blink = setInterval(() => {
      if (paused() || performance.now() - lastKey.current < BLINK_MS) return setCaretOn(true);
      setCaretOn((on) => !on);
    }, BLINK_MS);

    return () => {
      clearTimeout(timer);
      clearInterval(blink);
    };
  }, [words, startDelay]);

  return (
    <p className={className}>
      <span className="sr-only">
        {prefix} {words.join(", ")}.
      </span>
      <span aria-hidden className="whitespace-nowrap">
        {prefix} <span className="text-accent">{text}</span>
        <span
          className="ml-[0.06em] inline-block h-[0.82em] w-[0.07em] bg-accent align-[-0.04em] transition-opacity duration-100"
          style={{ opacity: caretOn ? 1 : 0 }}
        />
      </span>
    </p>
  );
}
