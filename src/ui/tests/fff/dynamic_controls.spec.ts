import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // - открыть https://the-internet.herokuapp.com/
  await page.goto("https://the-internet.herokuapp.com/");
  // - перейти на страницу Dynamic Controls
  await page.getByRole("link", { name: "Dynamic Controls" }).click();
  // - Дождаться появления кнопки Remove
  await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();
  // - Завалидировать текста в заголовке страницы
  await expect(
    page.getByRole("heading", { name: "Dynamic Controls" })
  ).toBeVisible();

  // - Чекнуть чекбокс
  await page.getByRole("checkbox").check();
  // - Кликнуть по кнопке Remove
  await page.getByRole("button", { name: "Remove" }).click();

  // - Дождаться скрытия индикатора загрузки
  await page
    .locator("#checkbox-example > div#loading")
    .first()
    .waitFor({ state: "hidden" });

  // - Дождаться исчезновения чекбокса
  await expect(page.getByRole("checkbox")).toBeHidden();

  // - Проверить наличие кнопки Add
  await expect(page.getByRole("button", { name: "Add" })).toBeVisible();

  // - Завалидировать текст It's gone!
  await expect(page.getByText("It's gone!")).toBeVisible();
  // - Кликнуть на кнопку Add
  await page.getByRole("button", { name: "Add" }).click();

  // - Дождаться скрытия индикатора загрузки
  await page
    .locator("#checkbox-example > div#loading")
    .first()
    .waitFor({ state: "hidden" });

  // - Дождаться появления чекбокса и проверить, что он видим
  await expect(page.getByRole("checkbox")).toBeVisible();

  // - Завалидировать текст It's back!
  await expect(page.getByText("It's back!")).toBeVisible();
});
