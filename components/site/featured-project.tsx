import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { TagList } from "@/components/ui/tag";
import type { ProjectSummary } from "@/lib/types";
import { FittedImage } from "./fitted-image";
import { PointerSurface } from "./interactive";

/**
 * Bandeau « projet phare » du hero : visible sans défiler, toute la surface est cliquable
 * via un seul lien (pas de liens imbriqués).
 */
export function FeaturedProject({ project }: { project: ProjectSummary }) {
  return (
    <PointerSurface
      as="article"
      aria-labelledby="projet-phare-title"
      className="spotlight group relative grid overflow-hidden rounded-(--radius-lg) border border-line bg-surface/90 backdrop-blur transition-[border-color] duration-500 ease-(--ease-out) hover:border-accent/50 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent md:grid-cols-12"
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:col-span-7 lg:col-span-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-meta tracking-[0.06em] text-subtle uppercase">
            <span className="inline-flex items-center gap-1.5 rounded-(--radius-sm) bg-accent-soft px-2 py-1 text-accent">
              <Star className="size-3.5 fill-current" aria-hidden />
              Projet phare
            </span>
            {project.period && <span>{project.period}</span>}
          </p>
          <h2 id="projet-phare-title" className="mt-4 font-display text-[clamp(2.75rem,1.5rem+4.2vw,5.25rem)] leading-[0.9] uppercase">
            <Link
              href={`/projets/${project.slug}`}
              transitionTypes={["nav-forward"]}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </Link>
          </h2>
          {project.summary && <p className="mt-3 max-w-[56ch] text-muted">{project.summary}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
          <TagList items={project.stack.slice(0, 4)} label={`Technologies de ${project.title}`} className="lg:justify-end" />
          <span
            aria-hidden
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-[0.9375rem] font-medium whitespace-nowrap text-on-accent transition-colors duration-(--duration-fast) group-hover:bg-accent-hover"
          >
            Lire l&apos;étude de cas
            <ArrowUpRight className="size-4 transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:rotate-45" />
          </span>
        </div>
      </div>

      {project.cover && (
        <div className="relative min-h-48 overflow-hidden border-t border-line bg-sunken md:col-span-5 md:min-h-0 md:border-t-0 md:border-l lg:col-span-4">
          <FittedImage image={project.cover} sizes="(min-width: 1024px) 400px, (min-width: 768px) 40vw, 100vw" />
        </div>
      )}
    </PointerSurface>
  );
}
