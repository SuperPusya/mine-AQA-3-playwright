import { expect, Locator } from "@playwright/test";
import { ICustomer, ICustomerInTable } from "types/customer.types";
import { SalesPortalPage } from "../salesPortal.page";
import { COUNTRIES } from "data/customers/countries.data";
import { FilterModal } from "../modals/customers/filter.modal";
import { DeleteModal } from "../modals/customers/delete.modal";

export class ProductsPage extends SalesPortalPage {
  readonly addNewProductButton = this.page.getByRole("button", {
    name: "Add Product",
  });

  readonly uniqueElement = this.addNewProductButton;

  async clickAddNewProductButton() {
    await this.addNewProductButton.click();
  }
}
