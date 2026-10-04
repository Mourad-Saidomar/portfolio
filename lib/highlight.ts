/**
 * Mise en valeur éditoriale saisie dans l'admin : les passages entre crochets
 * (« Je conçois des [interfaces web] claires ») sont affichés en pastille.
 */

export type Segment = { text: string; highlight: boolean };

const MARKED = /\[([^[\]]+)\]/g;

export function splitHighlights(value: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of value.matchAll(MARKED)) {
    if (match.index > last) segments.push({ text: value.slice(last, match.index), highlight: false });
    segments.push({ text: match[1] ?? "", highlight: true });
    last = match.index + match[0].length;
  }
  if (last < value.length) segments.push({ text: value.slice(last), highlight: false });
  return segments;
}

/** Texte brut, sans crochets (métadonnées, données structurées). */
export function stripHighlights(value: string): string {
  return value.replace(MARKED, "$1");
}
