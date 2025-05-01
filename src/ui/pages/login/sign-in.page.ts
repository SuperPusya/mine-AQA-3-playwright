import { Locator, Page } from "@playwright/test";
import { ModuleName } from "types/home.types";
import { SalesPortalPage } from "../salesPortal.page";
import { ILogin } from "types/sign-in.types";

export class SignIn extends SalesPortalPage {
  emailInput = this.page.locator("#emailinput");
  passwordInput = this.page.locator("#passwordinput");
  loginButton = this.page.locator('button[type="submit"]');

  uniqueElement = this.loginButton;

  async fillCredentials(user: Partial<ILogin>) {
    user.email && (await this.emailInput.fill(user.email));
    user.password && (await this.passwordInput.fill(user.password));
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }
}
