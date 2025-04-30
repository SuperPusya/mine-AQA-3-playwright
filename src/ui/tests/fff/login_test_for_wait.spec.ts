// Разработать тест со следующими шагами:
//  - Открыть url https://anatoly-karpovich.github.io/aqa-course-project/#
//  - Войти в приложения используя учетные данные test@gmail.com / 12345678 при этом:
//  - дождаться исчезновения спиннеров
//  - проверить действительно ли пользователь с логином Anatoly вошел в систему
//  - Проверить скриншотом боковое навигационное меню с выбранной страницей Home

import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // - Открыть url
  await page.goto("https://anatoly-karpovich.github.io/aqa-course-project/#");

  // - Войти в приложение используя учетные данные
  await page
    .getByRole("textbox", { name: "Email address *" })
    .fill("test@gmail.com");
  await page.getByRole("textbox", { name: "Password *" }).fill("12345678");
  await page.getByRole("button", { name: "Login" }).click();

  // Локатор спиннера внутри кнопки
  const spinner = page.getByRole("status");

  // Ждем, пока спиннер исчезнет (загрузка закончится)
  await expect(spinner).toHaveCount(0);

  // - Проверить, что пользователь Anatoly вошел в систему
  await expect(page.getByRole("link", { name: "Anatoly" })).toBeVisible();

  // - Проверить скриншотом боковое навигационное меню с выбранной страницей Home
  await expect(page.locator("#sidebar")).toHaveScreenshot();
});
