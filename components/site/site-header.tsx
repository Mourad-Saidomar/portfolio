import Link from "next/link";
import { SiteNav } from "./site-nav";

/**
 * En-tête collant : transparent en haut de page, il se densifie au défilement
 * et porte une fine barre de progression de lecture (CSS piloté par le scroll).
 */
export function SiteHeader() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="header-scroll sticky top-0 z-50 h-(--header-h) border-b border-line/70 bg-bg/85 backdrop-blur-md"
    >
      <div className="container-page flex h-full items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Mourad Saidomar — accueil">
          <span className="font-display text-[1.375rem] leading-none whitespace-nowrap">Mourad Saidomar</span>
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-coral transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:scale-150"
          />
        </Link>
        <SiteNav />
      </div>
      <span aria-hidden className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
    </header>
  );
}
