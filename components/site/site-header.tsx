import Link from "next/link";
import { ScrollState } from "./scroll-state";
import { SiteNav } from "./site-nav";

/**
 * En-tête collant : en haut de page, il prend la couleur du hero (--hero-bg) sans bordure ;
 * après ~50 px de défilement, il reprend fond translucide, flou et bordure (transition ~300 ms).
 * Il porte aussi une fine barre de progression de lecture (CSS piloté par le scroll).
 */
export function SiteHeader() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="site-header sticky top-0 z-50 h-(--header-h) border-b"
    >
      <ScrollState threshold={50} />
      <div className="container-page flex h-full items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label="Mourad Saidomar — accueil">
          <span aria-hidden className="font-display text-[1.875rem] leading-none uppercase">
            MS
            <span className="inline-block text-accent transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:translate-x-1">
              .
            </span>
          </span>
          <span aria-hidden className="hidden h-6 w-px bg-line sm:block" />
          <span aria-hidden className="hidden font-mono text-[0.6875rem] leading-tight tracking-[0.08em] text-muted uppercase sm:block">
            Mourad
            <br />
            Saidomar
          </span>
        </Link>
        <SiteNav />
      </div>
      <span aria-hidden className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
    </header>
  );
}
