import { expect, Locator } from "@playwright/test";
import { ICustomer, ICustomerInTable } from "types/customer.types";
import { SalesPortalPage } from "../salesPortal.page";
import { COUNTRIES } from "data/customers/countries.data";
import { FilterModal } from "../modals/customers/filter.modal";
import { DeleteModal } from "../modals/customers/delete.modal";

export class CustomersPage extends SalesPortalPage {
  readonly filterModal = new FilterModal(this.page);
  readonly DeleteModal = new DeleteModal(this.page);

  readonly addNewCustomerButton = this.page.getByRole("button", {
    name: "Add Customer",
  });
  readonly filterButton = this.page.getByRole("button", { name: "Filter" });

  readonly tableHeader = this.page.locator("#table-customers th div");
  readonly emailHeader = this.tableHeader.filter({ hasText: "Email" });
  readonly nameHeader = this.tableHeader.filter({ hasText: "Name" });
  readonly countryHeader = this.tableHeader.filter({ hasText: "Country" });
  readonly createdOnHeader = this.tableHeader.filter({ hasText: "Created On" });

  readonly tableRow = this.page.locator("#table-customers tbody tr");
  readonly firstRow = this.tableRow.first(); // Добавлено из второго файла
  readonly tableRowByEmail = (email: string) =>
    this.tableRow.filter({ has: this.page.getByText(email) });

  readonly emailCell = (email: string) =>
    this.tableRowByEmail(email).locator("td").nth(1);
  readonly nameCell = (email: string) =>
    this.tableRowByEmail(email).locator("td").nth(2);
  readonly countryCell = (email: string) =>
    this.tableRowByEmail(email).locator("td").nth(3);
  readonly createdOnCell = (email: string) =>
    this.tableRowByEmail(email).locator("td").nth(4);
  readonly editButton = (email: string) =>
    this.tableRowByEmail(email).getByTitle("Edit");
  readonly detailsButton = (email: string) =>
    this.tableRowByEmail(email).getByTitle("Details");
  readonly deleteButton = (email: string) =>
    this.tableRowByEmail(email).getByTitle("Delete");

  readonly uniqueElement = this.addNewCustomerButton;

  async clickAddNewCustomer() {
    await this.addNewCustomerButton.click();
  }

  async clickDeleteCustomer(customerEmail: string) {
    await this.deleteButton(customerEmail).click();
  }

  async clickFilter() {
    await this.filterButton.click();
  }

  async clickTableAction(
    customerEmail: string,
    action: "edit" | "details" | "delete"
  ) {
    const buttons = {
      edit: this.editButton(customerEmail),
      details: this.detailsButton(customerEmail),
      delete: this.deleteButton(customerEmail),
    };

    await buttons[action].click();
  }

  async getCustomerData(customerEmail: string): Promise<ICustomerInTable> {
    const [email, name, country, createdOn] = await this.tableRowByEmail(
      customerEmail
    )
      .locator("td")
      .allInnerTexts();
    return {
      email,
      name,
      country: country as COUNTRIES,
    };
  }

  async getTabeData() {
    const tableData: Array<ICustomerInTable> = [];

    const rows = await this.tableRow.all();
    for (const row of rows) {
      const [email, name, country, createdOn] = await row
        .locator("td")
        .allInnerTexts();
      tableData.push({
        email,
        name,
        country: country as COUNTRIES,
      });
    }
    return tableData;
  }

  // Метод для проверки, что созданный пользователь в первой строке
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
}
