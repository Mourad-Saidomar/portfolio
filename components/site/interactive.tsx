"use client";

import { inView } from "motion";
import { useAnimate } from "motion/react-mini";
import { type ComponentProps, Fragment, type ReactNode, useEffect, useRef } from "react";
import { EASE_OUT, prefersReducedMotion } from "./motion";

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Expose la position du pointeur en variables CSS (--mx, --my, en px) sur l'élément.
 * Sert au halo « spotlight » et à la pastille qui suit le curseur. Aucun effet au tactile.
 */
export function PointerSurface({
  as = "div",
  children,
  ...props
}: { as?: "div" | "li" | "article" } & ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const { clientX, clientY } = event;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          const el = ref.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${clientX - rect.left}px`);
          el.style.setProperty("--my", `${clientY - rect.top}px`);
        });
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Attire légèrement son contenu vers le pointeur (boutons d'appel à l'action). */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();

  return (
    <span
      ref={scope}
      className="inline-block will-change-transform"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || prefersReducedMotion() || !finePointer()) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * strength;
        const y = (event.clientY - rect.top - rect.height / 2) * strength;
        animate(scope.current, { transform: `translate(${x}px, ${y}px)` }, { duration: 0.3, ease: EASE_OUT });
      }}
      onPointerLeave={() => {
        if (prefersReducedMotion()) return;
        animate(scope.current, { transform: "translate(0px, 0px)" }, { duration: 0.6, ease: EASE_OUT });
      }}
    >
      {children}
    </span>
  );
}

/**
 * Compteur qui défile jusqu'à sa valeur à l'entrée dans l'écran.
 * Le HTML serveur affiche la valeur finale ; l'animation ne joue que si le nombre
 * est encore hors de l'écran à l'hydratation (aucun clignotement).
 */
export function CountUp({ value, pad = 2, duration = 1400 }: { value: number; pad?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => String(n).padStart(pad, "0");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return;
    el.textContent = format(0);
    let raf = 0;
    const stop = inView(el, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = format(Math.round(eased * value));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      stop();
    });
    return () => {
      stop();
      cancelAnimationFrame(raf);
      el.textContent = format(value);
    };
    // format est dérivé de pad : inutile en dépendance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pad, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  );
}

/**
 * Titre révélé mot par mot à l'entrée dans l'écran (chaque mot monte depuis un masque).
 * Le texte n'est écrit qu'une fois (vraies espaces entre les mots) : lu normalement par les
 * technologies d'assistance, indexé sans doublon ; sans JS, il est simplement affiché.
 */
export function RevealWords({ text, className, stagger = 0.06 }: { text: string; className?: string; stagger?: number }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  // Les espaces insécables (« question ? ») restent dans le mot : pas de ponctuation orpheline.
  const words = text.split(/[^\S  ]+/).filter(Boolean);

  useEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion() || el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    targets.forEach((word) => animate(word, { transform: "translateY(105%)" }, { duration: 0 }));
    const stop = inView(
      el,
      () => {
        targets.forEach((word, i) =>
          animate(word, { transform: "translateY(0%)" }, { duration: 0.8, delay: i * stagger, ease: EASE_OUT }),
        );
        stop();
      },
      { margin: "0px 0px -12% 0px" },
    );
    return stop;
  }, [animate, scope, stagger]);

  return (
    <span ref={scope} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="-mt-[0.14em] -mb-[0.08em] inline-block overflow-hidden pt-[0.14em] pb-[0.08em] align-top">
            <span data-word className="inline-block">
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
