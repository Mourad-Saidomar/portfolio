import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", heading: /Mourad Saidomar/ },
  { path: "/projets", heading: /construit/ },
  { path: "/parcours", heading: /parcours/i },
  { path: "/competences", heading: /boîte à outils/ },
  { path: "/a-propos", heading: /Mourad Saidomar/ },
  { path: "/contact", heading: /Parlons/ },
];

/** Attend la fin des animations d'entrée (hors boucles et animations pilotées par le défilement). */
async function settleAnimations(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.timeline instanceof DocumentTimeline && a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
}

test.describe("visite du site", () => {
  for (const { path, heading } of PAGES) {
    test(`${path} : rendu, titre unique et accessibilité (axe WCAG 2.2 AA)`, async ({ page }) => {
      await page.goto(path);
      await settleAnimations(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page).toHaveTitle(/Mourad Saidomar/);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id} : ${v.nodes.length} élément(s)`)).toEqual([]);
    });
  }

  test("aucune erreur console sur l'accueil", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("parcours visiteur", () => {
  test("contact en un clic depuis l'accueil", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: /contact/i }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("textbox", { name: /Nom/ })).toBeVisible();
  });

  test("de l'accueil à une étude de cas, puis au projet suivant", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.locator("#projets-title").locator("xpath=ancestor::section").getByRole("article").first();
    const title = await firstCard.getByRole("heading").innerText();
    await firstCard.getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.getByRole("heading", { name: "Contexte" })).toBeVisible();
    await page.getByRole("navigation", { name: "Projet suivant" }).getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(title);
  });

  test("lien d'évitement et navigation clavier", async ({ page, isMobile }) => {
    test.skip(isMobile, "Clavier : bureau uniquement");
    await page.goto("/parcours");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Aller au contenu" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contenu$/);
  });

  test("filtre du parcours", async ({ page }) => {
    await page.goto("/parcours");
    await page.waitForLoadState("networkidle"); // attendre l'hydratation avant d'interagir
    const formations = page.getByRole("button", { name: /Formations/ });
    await formations.click();
    await expect(formations).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/Expérience$/)).toHaveCount(0);
  });

  test("le thème choisi est conservé", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const toggle = page.getByRole("button", { name: /^Thème/ }).first();
    await toggle.click(); // système → clair
    await toggle.click(); // clair → sombre
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("menu mobile accessible", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile uniquement");
    await page.goto("/");
    const button = page.getByRole("button", { name: "Ouvrir le menu" });
    await button.click();
    await expect(page.getByRole("button", { name: "Fermer le menu" })).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("link", { name: /Compétences/ }).click();
    await expect(page).toHaveURL(/\/competences$/);
    await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeHidden();
  });

  test("page 404", async ({ page }) => {
    const response = await page.goto("/page-inexistante");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("n'existe pas");
  });

  test("projet inexistant : page 404 non indexable", async ({ page }) => {
    // Rendu en streaming (projets publiés après le build) : statut 200 mais noindex + contenu 404.
    await page.goto("/projets/projet-inexistant");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("n'existe pas");
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
  });
});

test.describe("animations", () => {
  test("peuvent être mises en pause, et le choix est mémorisé (WCAG 2.2.2)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Mettre en pause les animations" }).first().click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    await expect(page.getByRole("button", { name: "Relancer les animations" }).first()).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("mouvement réduit : aucune animation, contenu visible d'emblée", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const running = await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === "running").length,
    );
    expect(running).toBe(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await context.close();
  });
});

test.describe("SEO", () => {
  test("sitemap, robots et données structurées", async ({ page, request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/projets/");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");

    await page.goto("/");
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(jsonLd ?? "{}")).toMatchObject({ "@type": "Person", name: "Mourad Saidomar" });
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });

  test("image Open Graph générée par projet", async ({ request }) => {
    const html = await (await request.get("/projets/covoit-may")).text();
    const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    expect(og).toBeTruthy();
    const image = await request.get(new URL(og!).pathname);
    expect(image.headers()["content-type"]).toBe("image/png");
  });
});
