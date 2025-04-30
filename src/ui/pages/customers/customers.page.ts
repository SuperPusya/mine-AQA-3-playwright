import { expect, Locator } from "@playwright/test";
import { SalesPortalPage } from "../salesPortal.page";
import { ICustomer } from "types/customer.types";

export class CustomersPage extends SalesPortalPage {
  addNewCustomerButton = this.page.getByRole("button", {
    name: "Add Customer",
  });
  firstRow = this.page.locator("table tbody tr:first-child");

  uniqueElement = this.addNewCustomerButton;

  async clickAddNewCustomer() {
    await this.addNewCustomerButton.click();
  }

  async verifyCustomerInTable(expectedData: ICustomer) {
    const actualData = {
      email: await this.firstRow.locator("td:nth-child(1)").innerText(),
      name: await this.firstRow.locator("td:nth-child(2)").innerText(),
      country: await this.firstRow.locator("td:nth-child(3)").innerText(),
    };

    expect(actualData).toEqual({
      email: expectedData.email,
      name: expectedData.name,
      country: expectedData.country,
    });
  }

  async verifyCustomerPosition() {
    await expect(this.firstRow).toBeVisible();
  }
}
