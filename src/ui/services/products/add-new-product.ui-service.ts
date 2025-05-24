import { expect, Page } from "@playwright/test";
import { MY_USER } from "config/envirement";
import { HomePage } from "ui/pages/home.page";
import { SignIn } from "ui/pages/login/sign-in.page";
import { ProductsPage } from "ui/pages/products/products.page";
import { AddNewProductPage } from "ui/pages/products/add-new-product.page";
import { generateCustomerData } from "data/products/generateProduct.data";
import { apiConfig } from "config/api-config";
import { IProductResponse } from "types/product.types";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";

export class AddNewProductUIService {
  private productsPage: ProductsPage;
  private addNewProductPage: AddNewProductPage;
  constructor(private page: Page) {
    this.productsPage = new ProductsPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
  }

  async addProduct() {
    const data = generateCustomerData();
    await this.addNewProductPage.fillInputs(data);
    const response = await this.addNewProductPage.interceptResponse<IProductResponse, any>(
      apiConfig.ENDPOINTS.PRODUCTS,
      this.addNewProductPage.clickSaveNewProductButton.bind(this.addNewProductPage)
    );
    expect(response.status).toBe(STATUS_CODES.CREATED);
    expect(_.omit(response.body.Product, "_id", "createdOn")).toEqual({ ...data });
    await this.productsPage.waitForOpened();
    return response.body.Product;
  }
}
