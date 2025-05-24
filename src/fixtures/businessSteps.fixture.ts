import { SALES_PORTAL_URL, MY_USER } from "config/envirement";
import { test as base } from "./pages.fixture";

interface IBusinessSteps {
  loginAsLocalUser(): Promise<void>;
}

export const test = base.extend<IBusinessSteps>({
  loginAsLocalUser: async ({ page, homePage }, use) => {
    await use(async () => {
      await page.goto(SALES_PORTAL_URL);
      await page.locator("#emailinput").fill(MY_USER.email);
      await page.locator("#passwordinput").fill(MY_USER.password);
      await page.getByRole("button", { name: "Login" }).click();
      await homePage.waitForOpened();
    });
  },
});

export { expect } from "@playwright/test";
