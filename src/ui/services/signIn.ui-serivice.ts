import { Page } from "@playwright/test";
import { MY_USER } from "config/envirement";
import { HomePage } from "ui/pages/home.page";
import { SignIn } from "ui/pages/login/sign-in.page";

export class SignInUIService {
  private signInPage: SignIn;
  private homePage: HomePage;
  constructor(private page: Page) {
    this.signInPage = new SignIn(page);
    this.homePage = new HomePage(page);
  }

  async signInAsLocalUser() {
    await this.signInPage.openPortal();
    await this.signInPage.fillCredentials({
      username: MY_USER.email,
      password: MY_USER.password,
    });
    await this.signInPage.clickLoginButton();
    await this.homePage.waitForOpened();
    const token = (await this.page.context().cookies()).find(
      (c) => c.name === "Authorization"
    )!.value;
    return token;
  }
}
