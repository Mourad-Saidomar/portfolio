import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ProjectSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  project: Pick<ProjectSummary, "title" | "cover" | "stack">;
  /** Format panoramique (carte mise en avant sur grand écran). */
  wide?: boolean;
  sizes: string;
  /** Chargement immédiat (image visible dès l'arrivée sur la page). */
  eager?: boolean;
  /** Pastille « Voir » qui suit le curseur (cartes cliquables uniquement). */
  cursor?: boolean;
  className?: string;
};

/**
 * Couverture 16:10 avec parallaxe au défilement (CSS, sans JS) et léger zoom au survol.
 * Sans image, une composition typographique prend le relais : jamais de cadre vide.
 */
export function ProjectCover({ project, sizes, eager, wide, cursor, className }: Props) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-(--radius-lg) bg-sunken",
        wide && "lg:aspect-[21/9]",
        className,
      )}
    >
      {project.cover ? (
        <div className="parallax-img absolute inset-0">
          <Image
            src={project.cover.url}
            alt={project.cover.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className="object-cover transition-[scale] duration-[1.1s] ease-(--ease-out) group-hover:scale-[1.05]"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col justify-between p-6 md:p-8"
          style={{
            backgroundImage:
              "radial-gradient(80% 90% at 100% 0%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%), linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          }}
        >
          <span className="font-mono text-meta uppercase text-subtle">{project.stack[0] ?? "Projet"}</span>
          <span className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-none text-accent transition-[translate] duration-700 ease-(--ease-out) group-hover:-translate-y-2">
            {initials(project.title)}
          </span>
        </div>
      )}

      {cursor && (
        <span
          aria-hidden
          className="cursor-disc z-10 grid size-24 place-items-center rounded-full bg-accent text-sm font-medium text-on-accent shadow-lift"
        >
          <span className="flex items-center gap-1">
            Voir <ArrowUpRight className="size-4" />
          </span>
        </span>
      )}
    </div>
  );
}

function initials(title: string): string {
  const words = title.split(/[\s'’-]+/).filter((w) => /^[\p{L}\p{N}]/u.test(w) && w.length > 2);
  return (words.slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || title.slice(0, 2)).trim();
}
