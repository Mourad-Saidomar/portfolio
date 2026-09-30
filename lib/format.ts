import type { DatePrecision } from "@/lib/types";

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const MONTHS_LONG = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** « 2024-01-15 » → « janv. 2024 » (mois) ou « 2024 » (année). Indépendant du fuseau du serveur. */
export function formatDate(iso: string, precision: DatePrecision, long = false): string {
  const [year, month] = iso.split("-").map(Number);
  if (!year) return "";
  if (precision === "year" || !month) return String(year);
  return `${(long ? MONTHS_LONG : MONTHS)[month - 1]} ${year}`;
}

export type PeriodInput = {
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  datePrecision: DatePrecision;
};

/** Période lisible d'une étape du parcours. */
export function formatPeriod({ startDate, endDate, isCurrent, datePrecision }: PeriodInput): string {
  const start = startDate ? formatDate(startDate, datePrecision) : null;
  const end = endDate ? formatDate(endDate, datePrecision) : null;
  if (isCurrent) return start ? `Depuis ${start}` : "En cours";
  if (start && end) return start === end ? start : `${start} – ${end}`;
  return start ?? end ?? "";
}

/** Horodatage court pour l'admin : « 30 sept. 2026, 14:05 » (fuseau de Mayotte). */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Indian/Mayotte",
  }).format(new Date(iso));
}

/** « Covoit'May — Été 2026 » → « covoit-may-ete-2026 ». */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
