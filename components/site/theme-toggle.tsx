"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABELS: Record<ThemePreference, string> = { system: "système", light: "clair", dark: "sombre" };
const listeners = new Set<() => void>();

function read(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function write(theme: ThemePreference) {
  try {
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Stockage indisponible (navigation privée) : le choix vaut pour la page courante.
  }
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as const);
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? "system";
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => write(next)}
      className="inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors duration-(--duration-fast) hover:bg-sunken hover:text-ink"
      aria-label={`Thème ${LABELS[theme]}. Passer au thème ${LABELS[next]}`}
      title={`Thème : ${LABELS[theme]}`}
    >
      <Icon className="size-[1.125rem]" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
