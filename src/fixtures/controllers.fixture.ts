import { test as base } from "@playwright/test";
import { CustomersController } from "api/controllers/customers.controller";
import { SignInController } from "api/controllers/signIn.controller";

interface ISalesPortalControllers {
  customersController: CustomersController;
  signInController: SignInController;
}

export const test = base.extend<ISalesPortalControllers>({
  customersController: async ({}, use) => {
    await use(new CustomersController());
  },
  signInController: async ({}, use) => {
    await use(new SignInController());
  },
});
export { expect } from "@playwright/test";
