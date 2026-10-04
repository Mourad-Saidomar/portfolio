import type { CSSProperties } from "react";
import { MotionToggle } from "./motion-toggle";

/**
 * Bandeau défilant (décoratif) : les compétences en grand, en boucle infinie.
 * Masqué des technologies d'assistance (l'information est sur /competences),
 * suspendu au survol, arrêté en mouvement réduit, pausable (WCAG 2.2.2).
 */
export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  const row = (
    <ul className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li
          key={item}
          className="flex items-center gap-8 pr-8 font-display text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-none whitespace-nowrap uppercase"
        >
          {/* Un mot sur deux au contour seul : rythme typographique (trait ≥ 3:1 de contraste). */}
          <span className={i % 2 === 1 ? "text-outline [--outline:60%]" : undefined}>{item}</span>
          <span className="text-[0.45em] text-accent">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative border-y border-line bg-surface/60">
      <div aria-hidden className="marquee ambient overflow-hidden py-7 md:py-9">
        <div className="marquee-track" style={{ "--marquee-duration": `${Math.max(30, items.length * 3.5)}s` } as CSSProperties}>
          {row}
          <div className="marquee-dup flex">{row}</div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent md:w-40" />
      </div>
      <div className="container-page flex justify-end pb-2 md:absolute md:inset-x-0 md:-bottom-14 md:pb-0">
        <MotionToggle className="text-xs" />
      </div>
    </div>
  );
}
