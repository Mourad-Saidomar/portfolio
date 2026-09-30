import Image from "next/image";
import type { ProjectSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  project: Pick<ProjectSummary, "title" | "cover" | "stack">;
  /** Format panoramique (carte mise en avant sur grand écran). */
  wide?: boolean;
  sizes: string;
  /** Chargement immédiat (image visible dès l’arrivée sur la page). */
  eager?: boolean;
  className?: string;
};

/**
 * Couverture 16:10. Sans image, une composition typographique prend le relais
 * (initiales + technologie principale) : jamais de cadre vide.
 */
export function ProjectCover({ project, sizes, eager, wide, className }: Props) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-(--radius-lg) bg-sunken",
        wide && "lg:aspect-[21/9]",
        className,
      )}
    >
      {project.cover ? (
        <Image
          src={project.cover.url}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col justify-between p-6 transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.03] md:p-8"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          <span className="font-mono text-meta uppercase text-subtle">{project.stack[0] ?? "Projet"}</span>
          <span className="font-display text-[clamp(3.5rem,10vw,7rem)] leading-none text-accent">
            {initials(project.title)}
          </span>
        </div>
      )}
    </div>
  );
}

function initials(title: string): string {
  const words = title.split(/[\s'’-]+/).filter((w) => /^[\p{L}\p{N}]/u.test(w) && w.length > 2);
  return (words.slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || title.slice(0, 2)).trim();
}
