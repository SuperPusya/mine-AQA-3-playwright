import { Page } from "@playwright/test";
import { MY_USER } from "config/envirement";
import { HomePage } from "ui/pages/home.page";
import { SignIn } from "ui/pages/login/sign-in.page";
import { ProductsPage } from "ui/pages/products/products.page";
import { AddNewProductPage } from "ui/pages/products/add-new-product.page";

export class ProductsUIService {
  private productsPage: ProductsPage;
  private addNewProductPage: AddNewProductPage;
  constructor(private page: Page) {
    this.productsPage = new ProductsPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
  }

  async openAddNewProductPage() {
    await this.productsPage.clickAddNewProductButton();
    await this.addNewProductPage.waitForOpened();
  }
}
