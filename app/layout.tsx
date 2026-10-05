import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { env } from "@/lib/env";
import { OPEN_GRAPH_BASE, SITE_NAME } from "@/lib/seo";
import { MOTION_SCRIPT } from "@/lib/theme";
import "./globals.css";

// Titres : grotesque condensée, une seule graisse (fichier léger).
const display = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// « optional » : le texte courant (souvent l'élément LCP) n'est jamais repeint après coup.
// Le fallback généré par next/font a des métriques ajustées : pas de décalage de mise en page.
const sans = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "optional",
});

// Une seule graisse utilisée (métadonnées) : fichier statique plus léger que la version variable.
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Mourad Saidomar — Développeur web",
    template: "%s — Mourad Saidomar",
  },
  description:
    "Portfolio de Mourad Saidomar, développeur web & web mobile à Mayotte : projets, parcours, compétences et contact.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  formatDetection: { telephone: false },
  openGraph: OPEN_GRAPH_BASE,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0c0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
