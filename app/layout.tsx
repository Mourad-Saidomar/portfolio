import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { env } from "@/lib/env";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: "normal",
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
  applicationName: "Mourad Saidomar",
  authors: [{ name: "Mourad Saidomar" }],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1113" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
