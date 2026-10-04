// Captures d'écran de revue visuelle : node scripts/screenshots.mjs <dossier> [chemins...]
import { chromium } from "@playwright/test";

const out = process.argv[2] ?? "screenshots";
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ["/"];
const base = process.env.BASE_URL ?? "http://localhost:3100";
const variants = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, scheme: "dark" },
  { name: "mobile", viewport: { width: 390, height: 844 }, scheme: "dark" },
];

const browser = await chromium.launch();
for (const v of variants) {
  const page = await browser.newPage({
    viewport: v.viewport,
    colorScheme: v.scheme,
    reducedMotion: process.env.MOTION ? "no-preference" : "reduce",
  });
  for (const path of paths) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    // Défilement progressif pour déclencher les apparitions au scroll.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(process.env.MOTION ? 2500 : 700);
    const file = `${out}/${v.name}${path.replace(/\//g, "_") || "_home"}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
  await page.close();
}
await browser.close();
