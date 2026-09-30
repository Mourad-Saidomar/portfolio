import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { TagList } from "@/components/ui/tag";
import type { ProjectSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PointerSurface } from "./interactive";
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
  const large = size === "large";

  return (
    <PointerSurface
      as="article"
      className="group relative rounded-(--radius-lg) has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent"
    >
      <ViewTransition name={`project-cover-${project.slug}`}>
        <ProjectCover
          project={project}
          eager={eager}
          wide={large}
          cursor
          sizes={large ? "(min-width: 1320px) 1224px, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
        />
      </ViewTransition>

      <div className={cn("mt-6 grid gap-x-8 gap-y-3", large && "lg:grid-cols-12")}>
        <div className={cn("flex items-start gap-6", large ? "justify-between lg:col-span-7 lg:justify-start" : "justify-between")}>
          <div className="min-w-0">
            <p className="font-mono text-meta text-subtle">
              <span className="text-coral">{String(index + 1).padStart(2, "0")}</span>
              {project.period && <span> — {project.period}</span>}
            </p>
            <Heading className={cn("mt-2 font-display", large ? "text-h1" : "text-h2")}>
              <Link
                href={`/projets/${project.slug}`}
                transitionTypes={["nav-forward"]}
                className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-(--ease-out) outline-none group-hover:bg-[length:100%_1px] after:absolute after:inset-0 after:content-['']"
              >
                {project.title}
              </Link>
            </Heading>
          </div>
          <span
            aria-hidden
            className="mt-1 inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-[background-color,color,border-color] duration-(--duration-base) ease-(--ease-out) group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
          >
            <ArrowUpRight className="size-5 transition-transform duration-(--duration-base) group-hover:rotate-45" />
          </span>
        </div>
        <div className={cn(large && "lg:col-span-5 lg:pt-7")}>
          {project.summary && (
            <p className={cn("text-muted", large ? "text-lead" : "max-w-[52ch]")}>{project.summary}</p>
          )}
          <TagList items={project.stack.slice(0, 5)} label={`Technologies de ${project.title}`} className="mt-5" />
        </div>
      </div>
    </PointerSurface>
  );
}
