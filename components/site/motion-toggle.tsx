"use client";

import { Pause, Play } from "lucide-react";
import { useSyncExternalStore } from "react";
import { MOTION_STORAGE_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils";

const listeners = new Set<() => void>();

function read(): boolean {
  return document.documentElement.dataset.motion === "paused";
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

function setPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
  try {
    if (paused) localStorage.setItem(MOTION_STORAGE_KEY, "paused");
    else localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // Stockage indisponible : le choix vaut pour la page courante.
  }
  listeners.forEach((notify) => notify());
}

/**
 * Met en pause toutes les animations en boucle du site (bandeau défilant, halos, pulsations).
 * Critère WCAG 2.2.2 « Mettre en pause, arrêter, masquer ». Choix mémorisé.
 */
export function MotionToggle({ className }: { className?: string }) {
  const paused = useSyncExternalStore(subscribe, read, () => false);
  const Icon = paused ? Play : Pause;

  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted transition-colors hover:bg-sunken hover:text-ink",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
      {paused ? "Relancer les animations" : "Mettre en pause les animations"}
    </button>
  );
}
