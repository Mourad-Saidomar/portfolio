import { expect, test } from "@playwright/test";

/*
 * Parcours admin. Les tests connectés nécessitent un projet Supabase de TEST
 * (jamais la production) et un build sans DEMO_MODE :
 *   E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… npm run test:e2e
 */
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe("protection de l'admin", () => {
  test("toute page admin exige une connexion", async ({ page }) => {
    await page.goto("/admin/projets");
    await expect(page).toHaveURL(/\/admin\/connexion/);
    await expect(page.getByRole("heading", { level: 1, name: "Administration" })).toBeVisible();
  });

  test("l'admin n'est pas indexable", async ({ request }) => {
    const response = await request.get("/admin/connexion");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
  });
});

test.describe("admin connecté", () => {
  test.skip(!email || !password, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD non définis");
  test.describe.configure({ mode: "serial" });

  const stamp = Date.now();
  const title = `Projet E2E ${stamp}`;
  const slug = `projet-e2e-${stamp}`;

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/connexion");
    await page.getByRole("textbox", { name: "E-mail" }).fill(email!);
    await page.getByLabel("Mot de passe").fill(password!);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("identifiants erronés refusés", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/admin/connexion");
    await page.getByRole("textbox", { name: "E-mail" }).fill(email!);
    await page.getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByRole("alert")).toContainText("Identifiants incorrects");
    await page.close();
  });

  test("créer un projet, le publier, le voir en ligne puis le supprimer", async ({ page }) => {
    await page.getByRole("link", { name: "Nouveau projet" }).first().click();
    await page.getByRole("textbox", { name: /Titre/ }).fill(title);
    await expect(page.getByRole("textbox", { name: /Slug/ })).toHaveValue(slug);
    await page.getByRole("textbox", { name: /Résumé/ }).fill("Projet créé par le test de bout en bout.");
    await page.getByRole("textbox", { name: "Stack technique" }).fill("Playwright");
    await page.keyboard.press("Enter");
    await page.getByRole("textbox", { name: "Contexte" }).fill("Vérifier la publication sans redéploiement.");

    // Brouillon : invisible du public.
    await page.getByRole("button", { name: /Enregistrer le brouillon/ }).click();
    await expect(page.getByText("Brouillon enregistré.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/projets\/[0-9a-f-]{36}$/);
    const draft = await page.request.get(`/projets/${slug}`);
    expect(draft.status()).toBe(404);

    // Aperçu avant publication.
    await page.getByRole("link", { name: "Aperçu" }).click();
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await page.getByRole("link", { name: /Revenir à l'édition/ }).click();

    // Publication : visible immédiatement, sans redéploiement.
    await page.getByRole("button", { name: "Publier" }).click();
    await expect(page.getByText(/Projet publié/)).toBeVisible();
    await page.goto(`/projets/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.goto("/projets");
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    // Nettoyage.
    await page.goto("/admin/projets");
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: `Supprimer « ${title} »` }).click();
    await expect(page.getByText("Projet supprimé.")).toBeVisible();
  });
});
