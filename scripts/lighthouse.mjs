// Audit Lighthouse (mobile par défaut) : node scripts/lighthouse.mjs [--desktop] /chemin1 /chemin2 …
// Prérequis : serveur de production lancé (BASE_URL, défaut http://localhost:3100) et Chrome (CHROME_PATH).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const desktop = args.includes("--desktop");
const paths = args.filter((a) => !a.startsWith("--"));
const base = process.env.BASE_URL ?? "http://localhost:3100";
const dir = mkdtempSync(join(tmpdir(), "lh-"));

for (const path of paths.length ? paths : ["/"]) {
  const out = join(dir, `${path.replace(/\W+/g, "_") || "home"}.json`);
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "-y",
      "lighthouse@12",
      base + path,
      "--quiet",
      "--chrome-flags=--headless=new",
      "--output=json",
      `--output-path=${out}`,
      ...(desktop ? ["--preset=desktop"] : []),
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  const report = JSON.parse(readFileSync(out, "utf8"));
  const scores = Object.fromEntries(
    Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
  );
  const lcp = report.audits["largest-contentful-paint"].displayValue;
  const cls = report.audits["cumulative-layout-shift"].displayValue;
  const tbt = report.audits["total-blocking-time"].displayValue;
  console.log(`${desktop ? "desktop" : "mobile"} ${path}`, JSON.stringify(scores), `LCP ${lcp} · TBT ${tbt} · CLS ${cls}`);
}
