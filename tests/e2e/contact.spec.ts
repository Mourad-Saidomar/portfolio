import { expect, test } from "@playwright/test";

test.describe("formulaire de contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("signale les erreurs de saisie et place le focus sur le premier champ fautif", async ({ page }) => {
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    const name = page.getByRole("textbox", { name: /Nom/ });
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
    await expect(page.getByText(/2 caractères minimum/)).toBeVisible();

    await page.getByRole("textbox", { name: /E-mail/ }).fill("pas-un-email");
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    await expect(page.getByText(/Adresse e-mail invalide/)).toBeVisible();
  });

  test("le honeypot est invisible et hors de l'ordre de tabulation", async ({ page }) => {
    const trap = page.locator("#contact-website");
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(page.getByRole("textbox", { name: "Site web" })).toHaveCount(0);
  });

  test("envoie un message valide", async ({ page }) => {
    await page.getByRole("textbox", { name: /Nom/ }).fill("Recruteuse Test");
    await page.getByRole("textbox", { name: /E-mail/ }).fill("recrutement@example.com");
    await page.getByRole("textbox", { name: /Message/ }).fill("Bonjour, nous avons un stage à vous proposer.");
    // Délai anti-robot : une soumission humaine prend plus de 3 secondes.
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    const status = page.getByRole("status").filter({ hasText: "Message envoyé" });
    await expect(status).toBeVisible();
    await expect(status).toBeFocused();
  });
});
