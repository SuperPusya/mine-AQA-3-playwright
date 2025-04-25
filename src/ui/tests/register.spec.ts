import test, { expect } from "@playwright/test";

function generateRandomString(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

test.describe("[UI] Register", () => {
  const validCredentials = {
    username: `user_${generateRandomString()}`,
    password: `Pass_${generateRandomString()}123`,
  };

  test.beforeEach(async ({ page }) => {
    //precondition (arrange)
    await page.goto("https://anatoly-karpovich.github.io/demo-login-form/");
    const registerLink = page.locator("#registerOnLogin");
    await registerLink.click();
  });

  test("Should register page is visible", async ({ page }) => {
    //action (act)
    const locators = [
      page.locator("#userNameOnRegister"),
      page.locator("#passwordOnRegister"),
      page.locator("#register"),
      page.locator("#backOnRegister"),
      page.locator("#registerForm"),
    ];

    //assert
    for (const locator of locators) {
      await expect(locator).toBeVisible();
    }
  });

  test("Should register with valid credentials", async ({ page }) => {
    //action (act)
    await page.locator("#userNameOnRegister").fill(validCredentials.username);
    await page.locator("#passwordOnRegister").fill(validCredentials.password);
    await page.locator("#register").click();

    //assert
    const notification = page.locator("#errorMessageOnRegister");
    await expect(notification).toContainText(
      "Successfully registered! Please, click Back to return on login page"
    );
  });

  test("Should back from register page", async ({ page }) => {
    //action (act)
    await page.locator("#backOnRegister").click();

    //assert
    const label = page.locator("#loginForm");
    await expect(label).toContainText("Login");
  });

  test("Should back to login page after register", async ({ page }) => {
    //action (act)
    await page.locator("#userNameOnRegister").fill(validCredentials.username);
    await page.locator("#passwordOnRegister").fill(validCredentials.password);
    await page.locator("#register").click();
    await page.locator("#backOnRegister").click();

    //assert
    const label = page.locator("#loginForm");
    await expect(label).toContainText("Login");
  });

  //   test("Should NOT register with invalid login", async ({ page }) => {
  //     //action (act)
  //     await page.locator("#userNameOnRegister").fill("a1");
  //     await page.locator("#passwordOnRegister").fill(validCredentials.password);
  //     await page.locator("#register").click();

  //     //assert
  //     const notification = page.locator("#errorMessageOnRegister");
  //     await expect(notification).toContainText(
  //       "Username should contain at least 3 characters"
  //     );
  //   });

  //   test("Should NOT register with invalid password (< 8)", async ({ page }) => {
  //     //action (act)
  //     await page.locator("#userNameOnRegister").fill(validCredentials.username);
  //     await page.locator("#passwordOnRegister").fill("123456");
  //     await page.locator("#register").click();

  //     //assert
  //     const notification = page.locator("#errorMessageOnRegister");
  //     await expect(notification).toContainText(
  //       "Password should contain at least 8 characters"
  //     );
  //   });
});
