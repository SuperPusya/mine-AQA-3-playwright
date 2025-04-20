import test, { expect } from "@playwright/test";

function generateRandomString(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

const email = `${generateRandomString(6)}@mail.com`;

const phone = `+7${Math.floor(9000000000 + Math.random() * 1000000000)}`;

const password = generateRandomString(8);

test.describe("[UI] Register", () => {
  test("Smoke-test", async ({ page }) => {
    //precondition (arrange)
    await page.goto(
      "https://anatoly-karpovich.github.io/demo-registration-form/"
    );

    //action (act)
    await page.locator("#firstName").fill("Анастасия");
    await page.locator("#lastName").fill("Иванова");
    await page
      .locator("#address")
      .fill("Саратов, улица Пушкина, дом Колотушкина");
    await page.locator("#email").fill(email);
    await page.locator("#phone").fill(phone);
    await page.locator("#language").fill("Russian");
    await page.locator("#password").fill(password);
    await page.locator("#password-confirm").fill(password);

    const dropdown = page.locator("#country");
    await dropdown.selectOption("USA");

    await page.locator('input[type="radio"][value="female"]').check();

    await page.locator('input[type="checkbox"][value="Movies"]').check();

    await page.locator("select#skills").selectOption(["Python", "JavaScript"]);

    await page.locator("select#year").selectOption(["2003"]);
    await page.locator("select#month").selectOption(["September"]);
    await page.locator("select#day").selectOption(["24"]);

    await page.locator('button[type="submit"]').click();

    //assert
    const label = page.locator("h2.text-center");
    await expect(label).toContainText("Registration Details");

    const btn = page.locator('//*[@id="root"]/div/div[2]/button');
    await expect(btn).toBeVisible();
  });
});
