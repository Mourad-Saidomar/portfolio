"use client";

import { LazyMotion, MotionConfig, domAnimation, useInView, useReducedMotion } from "motion/react";
import { useAnimate } from "motion/react-mini";
import { type ReactNode, useEffect, useRef } from "react";

/** Charge uniquement les fonctionnalités d'animation DOM (bundle réduit) et respecte le mouvement réduit. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Apparition discrète au scroll (opacité + 12 px, une seule fois).
 * Le HTML serveur est toujours visible : seul le client masque, après hydratation,
 * ce qui est encore sous la ligne de flottaison, puis le révèle à l'entrée dans l'écran.
 * Sans JavaScript ou en mouvement réduit, rien n'est jamais caché.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  // Le type de balise ne change que la sémantique (div ou li) : même API DOM.
  const Tag = as as "div";
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduce = useReducedMotion();
  const inView = useInView(scope, { once: true, margin: "0px 0px -8% 0px" });
  const armed = useRef(false);

  useEffect(() => {
    const el = scope.current;
    if (reduce || !el || el.getBoundingClientRect().top < window.innerHeight) return;
    armed.current = true;
    animate(el, { opacity: 0, transform: "translateY(12px)" }, { duration: 0 });
  }, [animate, reduce, scope]);

  useEffect(() => {
    if (!inView || !armed.current || !scope.current) return;
    armed.current = false;
    animate(scope.current, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.5, delay, ease: EASE });
  }, [animate, delay, inView, scope]);

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
