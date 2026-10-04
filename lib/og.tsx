import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

const font = readFile(join(process.cwd(), "assets/fonts/Anton-Regular.ttf"));

type OgInput = { eyebrow: string; title: string; subtitle?: string; footer: string };

/** Visuel Open Graph aux couleurs du site (nuit, capitales condensées, lagon). */
export async function renderOgImage({ eyebrow, title, subtitle, footer }: OgInput) {
  const anton = await font;
  const titleSize = title.length > 40 ? 84 : title.length > 22 ? 108 : 140;

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
          background: "radial-gradient(70% 90% at 100% 0%, rgba(94, 224, 208, 0.22), transparent 70%), #0a0c0d",
          color: "#eef1f0",
          fontFamily: "Anton",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, letterSpacing: "0.08em", color: "#a3acaa" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#5ee0d0" }} />
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: titleSize, lineHeight: 0.95, textTransform: "uppercase" }}>{title}</div>
          {subtitle && (
            <div style={{ display: "flex", marginTop: 28 }}>
              <div
                style={{
                  fontSize: 40,
                  lineHeight: 1.2,
                  padding: "4px 22px 8px",
                  borderRadius: 999,
                  background: "#5ee0d0",
                  color: "#03201d",
                  textTransform: "uppercase",
                }}
              >
                {subtitle}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #222a2d",
            paddingTop: 24,
            fontSize: 28,
            letterSpacing: "0.06em",
            color: "#a3acaa",
          }}
        >
          <span>{footer}</span>
          <span>PORTFOLIO</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }],
    },
  );
}
