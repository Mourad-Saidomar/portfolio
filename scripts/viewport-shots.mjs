// Captures « écran par écran » avec animations : node scripts/viewport-shots.mjs <dossier> <chemin> [light|dark] [largeur]
import { chromium } from "@playwright/test";

const [out = "shots", path = "/", scheme = "light", width = "1440"] = process.argv.slice(2);
const base = process.env.BASE_URL ?? "http://localhost:3100";
const w = Number(width);
const h = w < 600 ? 844 : 900;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
await page.goto(base + path, { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
const total = await page.evaluate(() => document.body.scrollHeight);
let i = 0;
for (let y = 0; y < total && i < 8; y += Math.round(h * 0.95), i++) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1300);
  const file = `${out}/${scheme}-${w}${path.replace(/\//g, "_") || "_home"}-${i}.png`;
  await page.screenshot({ path: file });
  console.log(file);
}
await browser.close();
