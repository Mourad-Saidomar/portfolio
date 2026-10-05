import type { Metadata } from "next";

export const SITE_NAME = "Mourad Saidomar";

/**
 * Champs Open Graph communs à toutes les pages. Les métadonnées sont fusionnées de façon
 * superficielle : une page qui déclare `openGraph` remplace celui du layout, d'où ce socle à étaler.
 * Titre, description et image (opengraph-image.tsx) sont complétés automatiquement par Next.js.
 */
export const OPEN_GRAPH_BASE = {
  type: "website",
  locale: "fr_FR",
  siteName: SITE_NAME,
} satisfies Metadata["openGraph"];

/** Métadonnées d'une page publique : titre, description, URL canonique et aperçu de partage. */
export function pageMetadata({ title, description, path }: { title?: string; description?: string; path: string }): Metadata {
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH_BASE, url: path },
  };
}
