import { expect, test } from "@playwright/test";

async function openLogin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
}

test.describe("login", () => {
  test("valida email inválido", async ({ page }) => {
    await openLogin(page);

    await page.getByLabel("Email").fill("email-invalido");
    await page.getByLabel("Senha").fill("123456");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe um email válido")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("valida senha vazia", async ({ page }) => {
    await openLogin(page);

    await page.getByLabel("Email").fill("teste@coursesphere.com");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Senha é obrigatório")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("permite login válido", async ({ page }) => {
    await openLogin(page);

    await page.getByLabel("Email").fill("teste@coursesphere.com");
    await page.getByLabel("Senha").fill("123456");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Bem-vindo à sua área de cursos." })).toBeVisible();
  });
});
