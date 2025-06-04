import { SalesPortalPage } from "../salesPortal.page";
import { Locator } from "@playwright/test";
import { IProduct } from "types/product.types";

export class AddNewProductPage extends SalesPortalPage {
  saveNewProductButton = this.page.locator("#save-new-product");

  name = this.page.locator("#inputName");
  price = this.page.locator("#inputPrice");
  amount = this.page.locator("#inputAmount");
  notes = this.page.locator("#textareaNotes");
  manufacturer = this.page.locator("#inputManufacturer");
   

  uniqueElement = this.saveNewProductButton;

  async clickSaveNewProductButton() {
    await this.saveNewProductButton.click();
  }

  async fillInputs(product: Partial<IProduct>) {
    product.name && (await this.name.fill(product.name));
    product.price && (await this.price.fill(product.price.toString()));
    product.manufacturer &&
      (await this.manufacturer.selectOption(product.manufacturer));
    product.amount && (await this.amount.fill(product.amount.toString()));
    product.notes && (await this.notes.fill(product.notes));
  }
}
