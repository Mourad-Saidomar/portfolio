import { Skeleton, SkeletonRegion, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/*
 * Squelettes affichés pendant le chargement des données (fallbacks de <Suspense> / loading.tsx).
 * Chacun reprend les dimensions et la structure du composant réel (mêmes conteneurs, marges,
 * hauteurs de ligne) : aucun saut de mise en page quand le contenu arrive.
 */

/** Pastilles de technologies (même hauteur que <Tag>). */
function TagsSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  const widths = ["w-16", "w-12", "w-28", "w-20", "w-14"];
  return (
    <div aria-hidden className={cn("flex flex-wrap gap-1.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={cn("h-[26px] rounded-full", widths[i % widths.length])} />
      ))}
    </div>
  );
}

// ─── Accueil ────────────────────────────────────────────────────────

/** Scène du hero : même hauteur ; mot de fond et silhouette du portrait en attente. */
export function HeroSkeleton() {
  return (
    <SkeletonRegion label="Chargement de la présentation…">
      <div className="relative isolate h-[calc(100svh-var(--header-h))] min-h-[36rem] max-h-[68rem] overflow-hidden bg-(--hero-bg)">
        <div aria-hidden className="absolute inset-x-0 top-[42%] -translate-y-1/2">
          <p className="hero-backdrop text-center font-display text-[min(21vw,38vh)] leading-[0.8] text-ink/[0.06] uppercase">
            Portfolio
          </p>
        </div>
        <Skeleton className="absolute bottom-0 left-1/2 h-[78%] w-[min(70vw,30rem)] -translate-x-1/2 rounded-t-[45%] rounded-b-none" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6 sm:pb-10">
          <Skeleton className="h-[clamp(1.5rem,0.9rem+2.6vw,3.25rem)] w-[min(80vw,34rem)] rounded-full" />
        </div>
      </div>
    </SkeletonRegion>
  );
}

/** Bandeau du projet phare (même grille que <FeaturedProject>). */
export function FeaturedProjectSkeleton() {
  return (
    <div className="container-page pt-6 pb-10 lg:pb-14">
      <SkeletonRegion label="Chargement du projet phare…">
        <div className="grid overflow-hidden rounded-(--radius-lg) border border-line bg-surface/90 md:grid-cols-12">
          <div className="flex flex-col gap-6 p-6 sm:p-8 md:col-span-7 lg:col-span-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-[26px] w-36 rounded-full" />
              <Skeleton className="mt-4 h-[calc(clamp(2.75rem,1.5rem+4.2vw,5.25rem)*0.9)] w-2/3" />
              <SkeletonText lines={2} className="mt-3 max-w-[56ch]" />
            </div>
            <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
              <TagsSkeleton count={3} />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>
          </div>
          <Skeleton className="min-h-48 rounded-none border-t border-line md:col-span-5 md:min-h-0 md:border-t-0 md:border-l lg:col-span-4" />
        </div>
      </SkeletonRegion>
    </div>
  );
}

/** Bandeau défilant des compétences (même hauteur, bouton de pause compris). */
export function MarqueeSkeleton() {
  return (
    <div className="relative border-y border-line bg-surface/60" aria-hidden>
      <div className="flex justify-center gap-8 overflow-hidden py-7 md:py-9">
        {["w-64", "w-48", "w-72", "w-56"].map((w, i) => (
          <Skeleton key={i} className={cn("h-[clamp(2rem,1.2rem+3vw,3.75rem)] shrink-0", w)} />
        ))}
      </div>
      <div className="container-page flex justify-end pb-2 md:hidden">
        <div className="min-h-11" />
      </div>
    </div>
  );
}

/** Tuile projet de l'accueil (même structure que <ProjectTile>, grande tuile comprise). */
function ProjectTileSkeleton({ large }: { large?: boolean }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-(--radius-lg) border border-line bg-surface">
      <Skeleton className={cn("aspect-[16/10] rounded-none", large && "lg:aspect-auto lg:min-h-[22rem] lg:flex-1")} />
      <div className={cn("flex flex-col p-6 md:p-7", large ? "lg:p-9" : "flex-1")}>
        <Skeleton className="h-[18px] w-32 rounded-full" />
        <Skeleton className="mt-3 h-[calc(clamp(2rem,1.6rem+1.2vw,2.5rem)*0.95)] w-1/2" />
        <SkeletonText lines={3} className="mt-3" />
        <TagsSkeleton count={3} className="mt-auto pt-6" />
      </div>
    </div>
  );
}

export function ProjectTilesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <SkeletonRegion label="Chargement des projets…">
      <ul className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 lg:grid-cols-12">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={i === 0 ? "h-full md:col-span-2 lg:col-span-7 lg:row-span-2" : "h-full lg:col-span-5"}>
            <ProjectTileSkeleton large={i === 0} />
          </li>
        ))}
      </ul>
    </SkeletonRegion>
  );
}

/** Section « À propos » de l'accueil, sous le titre : repères, frise, philosophie, avis. */
export function HomeAboutSkeleton() {
  return (
    <SkeletonRegion label="Chargement de la présentation…" className="mt-14 space-y-20 md:mt-20 md:space-y-28">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex h-full flex-col gap-5 rounded-(--radius-lg) border border-line bg-surface p-5 sm:flex-row sm:items-center md:p-6">
            <Skeleton className="size-12 shrink-0 rounded-(--radius)" />
            <div className="flex-1">
              <Skeleton className="h-[clamp(2.5rem,2rem+1.6vw,3.25rem)] w-16" />
              <Skeleton className="mt-1.5 h-[1.375rem] w-4/5" />
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-end justify-between">
          <Skeleton className="h-[18px] w-40 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="lg:pt-8">
              <Skeleton className="h-9 w-24" />
              <SkeletonText lines={2} className="mt-3" />
              <Skeleton className="mt-2 h-4 w-28 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Skeleton className="h-[18px] w-28 rounded-full" />
          <Skeleton className="mt-4 h-[calc(clamp(2.25rem,1.5rem+3vw,4.25rem)*2.04)] w-4/5" />
        </div>
        <div className="border-t border-line lg:col-span-8">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="grid gap-2 border-b border-line py-7 sm:grid-cols-[4.5rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-6">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-7 w-32" />
              <SkeletonText lines={2} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

// ─── Projets ────────────────────────────────────────────────────────

/** Carte projet de la page Projets (même structure que <ProjectCard>, grille décalée comprise). */
export function ProjectCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <SkeletonRegion label="Chargement des projets…">
      <ul className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={i % 2 === 1 ? "md:mt-24" : undefined}>
            <Skeleton className="aspect-[16/10] rounded-(--radius-lg)" />
            <div className="mt-6 flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-[18px] w-28 rounded-full" />
                <Skeleton className="mt-2 h-[calc(clamp(2.25rem,1.5rem+3vw,4.25rem)*1.02)] w-3/5" />
              </div>
              <Skeleton className="mt-1 size-12 shrink-0 rounded-full" />
            </div>
            <SkeletonText lines={2} className="mt-3 max-w-[52ch]" />
            <TagsSkeleton count={4} className="mt-5" />
          </li>
        ))}
      </ul>
    </SkeletonRegion>
  );
}

/** Étude de cas (en-tête, stack, couverture, premières sections). */
export function CaseStudySkeleton() {
  return (
    <SkeletonRegion label="Chargement de l'étude de cas…">
      <div className="container-page pt-10 md:pt-16">
        <Skeleton className="h-11 w-36 rounded-full" />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <Skeleton className="h-[18px] w-28 rounded-full" />
            <Skeleton className="mt-4 h-[calc(clamp(3.25rem,1.6rem+7vw,8.5rem)*0.9)] w-3/4" />
            <SkeletonText lines={2} line="h-[1.15em] text-h3" className="mt-6 max-w-[48ch]" />
          </div>
          <div className="grid content-end gap-6 border-t border-line pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div>
              <Skeleton className="h-[18px] w-14 rounded-full" />
              <TagsSkeleton count={4} className="mt-3" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-page mt-12 md:mt-16">
        <Skeleton className="aspect-[16/10] rounded-(--radius-lg)" />
      </div>
      <div className="container-page section-y">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="grid gap-6 border-t border-line py-12 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-8 md:py-16">
            <div className="md:col-span-4">
              <Skeleton className="h-[18px] w-8 rounded-full" />
              <Skeleton className="mt-2 h-[calc(clamp(2.25rem,1.5rem+3vw,4.25rem)*1.02)] w-1/2" />
            </div>
            <SkeletonText lines={4} className="md:col-span-8" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

// ─── Parcours et compétences ────────────────────────────────────────

/** Parcours (filtre + étapes, même rail et mêmes marges que <Timeline>). */
export function TimelineSkeleton({ count = 5 }: { count?: number }) {
  return (
    <SkeletonRegion label="Chargement du parcours…">
      <Skeleton className="h-[3.25rem] w-[min(100%,21rem)] rounded-full" />
      <div className="relative mt-12">
        <span aria-hidden className="absolute top-0 bottom-0 left-[5px] w-px bg-line md:left-[7px]" />
        <div className="border-t border-line">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="relative grid gap-4 border-b border-line py-8 pl-8 md:grid-cols-12 md:gap-8 md:py-10 md:pl-12">
              <Skeleton className="absolute top-9 left-0 size-[11px] rounded-full md:top-11 md:size-[15px]" />
              <div className="flex gap-3 md:col-span-3 md:flex-col md:gap-2">
                <Skeleton className="h-[18px] w-28 rounded-full" />
                <Skeleton className="h-[18px] w-20 rounded-full" />
              </div>
              <div className="md:col-span-9">
                <Skeleton className="h-[calc(clamp(1.375rem,1.2rem+0.7vw,1.75rem)*1.15)] w-2/3" />
                <Skeleton className="mt-1 h-[1.65em] w-1/2 py-1.5" />
                <SkeletonText lines={2} className="mt-4 max-w-[68ch]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

/** Compétences (catégories : index, titre, description, pastilles). */
export function SkillsSkeleton({ count = 4 }: { count?: number }) {
  const chips = ["w-28", "w-36", "w-24", "w-44", "w-32", "w-28", "w-40", "w-24"];
  return (
    <SkeletonRegion label="Chargement des compétences…" className="mt-14 border-t border-line md:mt-20">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-14">
          <div className="md:col-span-4">
            <Skeleton className="h-[18px] w-6 rounded-full" />
            <Skeleton className="mt-2 h-[calc(clamp(2.25rem,1.5rem+3vw,4.25rem)*1.02)] w-3/5" />
            <SkeletonText lines={2} className="mt-3 max-w-[36ch]" />
          </div>
          <div className="flex flex-wrap content-start gap-2 md:col-span-8">
            {chips.map((w, j) => (
              <Skeleton key={j} className={cn("h-[2.6rem] rounded-full", w)} />
            ))}
          </div>
        </div>
      ))}
    </SkeletonRegion>
  );
}

// ─── À propos et contact ────────────────────────────────────────────

/** Page À propos : titre, présentation, actions, portrait. */
export function AboutPageSkeleton() {
  return (
    <SkeletonRegion label="Chargement de la présentation…">
      <section className="container-page pt-14 pb-16 md:pt-24 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Skeleton className="h-[18px] w-28 rounded-full" />
            <Skeleton className="mt-6 h-[calc(clamp(2.75rem,1.4rem+5.4vw,6.25rem)*0.95*3)] w-full" />
            <SkeletonText lines={5} className="mt-10 max-w-[62ch] text-lead" />
            <div className="mt-10 flex gap-3">
              <Skeleton className="h-12 w-44 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Skeleton className="mx-auto aspect-[4/5] max-w-sm rounded-(--radius-lg) lg:max-w-none" />
          </div>
        </div>
      </section>
    </SkeletonRegion>
  );
}

/** Page Contact : textes fixes affichés tels quels, coordonnées et formulaire en attente. */
export function ContactPageSkeleton({ channels = 3 }: { channels?: number }) {
  return (
    <SkeletonRegion label="Chargement des coordonnées…">
      <section className="container-page pt-14 pb-24 md:pt-24 md:pb-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 font-mono text-meta uppercase text-subtle">
              <span aria-hidden className="h-px w-8 bg-line" />
              Contact
            </p>
            <p aria-hidden className="mt-6 font-display text-[clamp(2.75rem,1.4rem+5.4vw,6.25rem)] leading-[0.95] uppercase">
              Parlons de votre projet.
            </p>
            <p className="mt-6 max-w-[44ch] text-lead text-muted">
              Une offre de stage, une mission ou simplement une question : écrivez-moi, je réponds à chaque message.
            </p>
            <Skeleton className="mt-6 h-[1.65em] w-44 rounded-full" />
            <div className="mt-12 border-t border-line">
              {Array.from({ length: channels }, (_, i) => (
                <div key={i} className="flex min-h-16 items-center gap-4 border-b border-line py-4">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-[18px] w-16 rounded-full" />
                    <Skeleton className="mt-1 h-[1.25rem] w-48 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-(--radius-lg) border border-line bg-surface p-6 sm:p-8 md:p-10">
              <Skeleton className="h-[calc(clamp(1.375rem,1.2rem+0.7vw,1.75rem)*1.15)] w-56" />
              <div className="mt-6 grid gap-6">
                {[3, 3, 9].map((rows, i) => (
                  <div key={i}>
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="mt-2 rounded-(--radius)" style={{ height: `${rows * 0.9 + 0.6}rem` }} />
                  </div>
                ))}
                <Skeleton className="h-12 w-52 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SkeletonRegion>
  );
}
