import { HomeUIService } from "ui/services/home.ui-service";
import { SignInUIService } from "ui/services/signIn.ui-serivice";
import { test as base } from "fixtures/pages.fixture";
import { ProductsUIService } from "ui/services/products/products.ui-service";
import { AddNewProductUIService } from "ui/services/products/add-new-product.ui-service";

interface IUIServices {
  homeUIService: HomeUIService;
  signInUIService: SignInUIService;
  productsUIService: ProductsUIService;
  addNewProductUIService: AddNewProductUIService;
}

export const test = base.extend<IUIServices>({
  homeUIService: async ({ page }, use) => {
    await use(new HomeUIService(page));
  },
  signInUIService: async ({ page }, use) => {
    await use(new SignInUIService(page));
  },
  productsUIService: async ({ page }, use) => {
    await use(new ProductsUIService(page));
  },
  addNewProductUIService: async ({ page }, use) => {
    await use(new AddNewProductUIService(page));
  },
});

export { expect } from "@playwright/test";
