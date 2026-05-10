import { expect, test } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email").fill("teste@coursesphere.com");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test("cria, verifica, exclui e confirma remoção de um curso", async ({ page }) => {
  const courseName = `Curso teste ${Date.now()}`;

  await login(page);
  await page.getByRole("link", { name: "Novo curso" }).click();

  await page.getByLabel("Nome do curso").fill(courseName);
  await page.getByLabel("Descrição").fill("Curso criado durante o teste automatizado.");
  await page.getByLabel("Data inicial").fill("2026-06-01");
  await page.getByLabel("Data final").fill("2026-06-30");
  await page.getByRole("button", { name: "Salvar curso" }).click();

  await expect(page).toHaveURL(/\/dashboard\/cursos\//);
  await expect(page.getByRole("heading", { name: courseName })).toBeVisible();

  await page.getByRole("link", { name: "Voltar para cursos" }).click();
  const courseCard = page.locator("article").filter({ hasText: courseName });
  await expect(courseCard).toBeVisible();

  await courseCard.getByRole("button", { name: "Excluir" }).click();
  const dialog = page.getByRole("dialog", { name: "Excluir curso?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Excluir" }).click();

  await expect(courseCard).toBeHidden();
  await expect(page.getByText(courseName)).toHaveCount(0);
});
