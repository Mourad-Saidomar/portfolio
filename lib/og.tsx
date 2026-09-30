import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Italic.ttf")),
]);

type OgInput = { eyebrow: string; title: string; subtitle?: string; footer: string };

/** Visuel Open Graph aux couleurs du site (papier, encre, lagon). */
export async function renderOgImage({ eyebrow, title, subtitle, footer }: OgInput) {
  const [regular, italic] = await fonts;
  const titleSize = title.length > 40 ? 76 : title.length > 22 ? 96 : 124;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#f5f2ec",
          color: "#15181b",
          fontFamily: "Instrument Serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#5f656c" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#a8421e" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: titleSize, lineHeight: 1, letterSpacing: "-0.02em" }}>{title}</div>
          {subtitle && (
            <div style={{ marginTop: 24, fontSize: 44, fontStyle: "italic", color: "#0a6664", lineHeight: 1.15 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #d9d2c7",
            paddingTop: 24,
            fontSize: 28,
            color: "#565c63",
          }}
        >
          <span>{footer}</span>
          <span>Portfolio</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Instrument Serif", data: regular, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}
