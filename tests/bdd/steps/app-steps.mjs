import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Given,
  Then,
  When,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, expect } from "@playwright/test";

const baseURL = process.env.BDD_BASE_URL ?? "http://127.0.0.1:3000";
let browser;

setDefaultTimeout(120_000);

async function login(page) {
  await page.goto(`${baseURL}/login`);
  await page.getByLabel("Email").fill("teste@coursesphere.com");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

BeforeAll(async function () {
  browser = await chromium.launch();
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});

Given("que estou na tela de login", async function () {
  await this.page.goto(`${baseURL}/login`);
});

When("preencho o login com o usuario de teste", async function () {
  await this.page.getByLabel("Email").fill("teste@coursesphere.com");
  await this.page.getByLabel("Senha").fill("123456");
});

When("envio o formulario de login", async function () {
  await this.page.getByRole("button", { name: "Entrar" }).click();
});

Then("devo acessar a area de trabalho", async function () {
  await expect(this.page).toHaveURL(/\/dashboard/);
  await expect(
    this.page.getByRole("heading", { name: "Bem-vindo à sua área de cursos." }),
  ).toBeVisible();
});

Given("que estou autenticado", async function () {
  await login(this.page);
});

When("crio um curso com dados validos", async function () {
  this.courseName = `Curso BDD ${Date.now()}`;

  await this.page.getByRole("link", { name: "Novo curso" }).click();
  await this.page.getByLabel("Nome do curso").fill(this.courseName);
  await this.page
    .getByLabel("Descrição")
    .fill("Curso criado por um cenario BDD automatizado.");
  await this.page.getByLabel("Data inicial").fill("2026-06-01");
  await this.page.getByLabel("Data final").fill("2026-06-30");
  await this.page.getByRole("button", { name: "Salvar curso" }).click();
});

Then("devo ver o curso criado na area de trabalho", async function () {
  await expect(this.page).toHaveURL(/\/dashboard\/cursos\//);
  await expect(this.page.getByRole("heading", { name: this.courseName })).toBeVisible();

  await this.page.getByRole("link", { name: "Voltar para cursos" }).click();
  this.courseCard = this.page.locator("article").filter({ hasText: this.courseName });
  await expect(this.courseCard).toBeVisible();
});

When("excluo o curso criado", async function () {
  await this.courseCard.getByRole("button", { name: "Excluir" }).click();
  const dialog = this.page.getByRole("dialog", { name: "Excluir curso?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Excluir" }).click();
});

Then("o curso nao deve aparecer na listagem", async function () {
  await expect(this.page.getByText(this.courseName)).toHaveCount(0);
});
