"use client";

import { inView } from "motion";
import { useAnimate } from "motion/react-mini";
import { type ReactNode, useEffect } from "react";

/*
 * Animations publiques avec l'API compacte de Motion (Web Animations API) :
 * quelques Ko de JavaScript au lieu du moteur complet, pour préserver le LCP mobile.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Mouvement réduit demandé (ou environnement sans Web Animations : aucune animation). */
export function prefersReducedMotion(): boolean {
  if (typeof window.matchMedia !== "function" || typeof Element.prototype.animate !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
  /** « up » : fondu + montée ; « clip » : rideau qui se lève (images, cartes). */
  variant?: "up" | "clip";
};

const VARIANTS = {
  up: {
    hidden: { opacity: 0, transform: "translateY(12px)" },
    visible: { opacity: 1, transform: "translateY(0px)" },
    duration: 0.5,
  },
  clip: {
    hidden: { clipPath: "inset(18% 0% 0% 0% round 20px)", opacity: 0.001, transform: "translateY(40px)" },
    visible: { clipPath: "inset(0% 0% 0% 0% round 20px)", opacity: 1, transform: "translateY(0px)" },
    duration: 0.9,
  },
} as const;

/**
 * Apparition discrète au scroll (opacité + 12 px, une seule fois).
 * Le HTML serveur est toujours visible : seul le client masque, après hydratation,
 * ce qui est encore sous la ligne de flottaison, puis le révèle à l'entrée dans l'écran.
 * Sans JavaScript ou en mouvement réduit, rien n'est jamais caché.
 */
export function Reveal({ children, delay = 0, className, as = "div", variant = "up" }: RevealProps) {
  // Le type de balise ne change que la sémantique (div ou li) : même API DOM.
  const Tag = as as "div";
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return;

    const { hidden, visible, duration } = VARIANTS[variant];
    animate(el, hidden, { duration: 0 });
    const stop = inView(
      el,
      () => {
        animate(el, visible, { duration, delay, ease: EASE_OUT });
        stop();
      },
      { margin: "0px 0px -8% 0px" },
    );
    return stop;
  }, [animate, delay, scope, variant]);

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
