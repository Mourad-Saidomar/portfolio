import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { TagList } from "@/components/ui/tag";
import type { ProjectSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

type Props = {
  project: ProjectSummary;
  index: number;
  size?: "large" | "default";
  headingLevel?: "h2" | "h3";
  eager?: boolean;
};

/** Carte projet : toute la surface est cliquable via un seul lien (pas de liens imbriqués). */
export function ProjectCard({ project, index, size = "default", headingLevel: Heading = "h3", eager }: Props) {
  return (
    <article className="group relative rounded-(--radius-lg) has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent">
      <ViewTransition name={`project-cover-${project.slug}`}>
        <ProjectCover
          project={project}
          eager={eager}
          wide={size === "large"}
          sizes={size === "large" ? "(min-width: 1320px) 1224px, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        />
      </ViewTransition>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="font-mono text-meta text-subtle">
            <span className="text-coral">{String(index + 1).padStart(2, "0")}</span>
            {project.period && <span> — {project.period}</span>}
          </p>
          <Heading className={cn("mt-2 font-display", size === "large" ? "text-h2" : "text-h3")}>
            <Link
              href={`/projets/${project.slug}`}
              transitionTypes={["nav-forward"]}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </Link>
          </Heading>
        </div>
        <span
          aria-hidden
          className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-[background-color,color,border-color,transform] duration-(--duration-base) ease-(--ease-out) group-hover:-rotate-0 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
        >
          <ArrowUpRight className="size-5 transition-transform duration-(--duration-base) group-hover:rotate-45" />
        </span>
      </div>
      {project.summary && (
        <p className={cn("mt-3 text-muted", size === "large" ? "max-w-[56ch] text-lead" : "max-w-[48ch]")}>
          {project.summary}
        </p>
      )}
      <TagList items={project.stack.slice(0, 5)} label={`Technologies de ${project.title}`} className="mt-5" />
    </article>
  );
}
