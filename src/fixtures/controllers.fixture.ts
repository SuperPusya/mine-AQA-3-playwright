import { test as base } from "@playwright/test";
import { CustomersController } from "api/controllers/customers.controller";
import { ProductsController } from "api/controllers/product.contoller";
import { SignInController } from "api/controllers/signIn.controller";

interface ISalesPortalControllers {
  customersController: CustomersController;
  signInController: SignInController;
  productsController: ProductsController;
}

export const test = base.extend<ISalesPortalControllers>({
  customersController: async ({}, use) => {
    await use(new CustomersController());
  },
  signInController: async ({}, use) => {
    await use(new SignInController());
  },
  productsController: async ({}, use) => {
    await use(new ProductsController());
  },
});
export { expect } from "@playwright/test";
