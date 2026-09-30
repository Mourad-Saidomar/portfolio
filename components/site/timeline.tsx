"use client";

import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { formatPeriod } from "@/lib/format";
import type { TimelineEntry, TimelineKind } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | TimelineKind;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "experience", label: "Expériences" },
  { value: "education", label: "Formations" },
];

const KIND_LABEL: Record<TimelineKind, string> = { experience: "Expérience", education: "Formation" };

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? entries : entries.filter((e) => e.kind === filter);
  const count = (value: Filter) => (value === "all" ? entries.length : entries.filter((e) => e.kind === value).length);

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrer le parcours"
        className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1"
      >
        {FILTERS.map((option) => {
          const pressed = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(option.value)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-(--duration-fast)",
                pressed ? "bg-ink text-bg" : "text-muted hover:text-ink",
              )}
            >
              {option.label}
              <span className={cn("font-mono text-[0.75rem]", pressed ? "text-bg/70" : "text-subtle")}>
                {count(option.value)}
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {visible.length} étape{visible.length > 1 ? "s" : ""} affichée{visible.length > 1 ? "s" : ""}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <m.ol
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 border-t border-line"
        >
          {visible.map((entry) => (
            <TimelineItem key={entry.id} entry={entry} />
          ))}
        </m.ol>
      </AnimatePresence>
    </div>
  );
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const Icon = entry.kind === "experience" ? BriefcaseBusiness : GraduationCap;
  const period = formatPeriod(entry);

  return (
    <li className="relative grid gap-4 border-b border-line py-8 md:grid-cols-12 md:gap-8 md:py-10">
      <div className="flex items-center gap-3 md:col-span-3 md:flex-col md:items-start md:gap-2">
        <p className="font-mono text-meta text-ink">
          {entry.isCurrent && (
            <span className="mr-2 inline-block size-2 rounded-full bg-success align-middle" aria-hidden />
          )}
          {period}
        </p>
        <p className="inline-flex items-center gap-1.5 font-mono text-meta text-subtle">
          <Icon className="size-3.5" aria-hidden />
          {KIND_LABEL[entry.kind]}
        </p>
      </div>
      <div className="md:col-span-9">
        <h3 className="font-display text-h3">{entry.title}</h3>
        <p className="mt-1 text-muted">
          {entry.organization}
          {entry.location && <span className="text-subtle"> · {entry.location}</span>}
        </p>
        {entry.description && <p className="mt-4 max-w-[68ch]">{entry.description}</p>}
        {entry.highlights.length > 0 && (
          <ul className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {entry.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-muted">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-coral" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
