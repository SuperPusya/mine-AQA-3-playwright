import { Locator, Page } from "@playwright/test";
import { ModuleName } from "types/home.types";
import { SalesPortalPage } from "./salesPortal.page";

export class HomePage extends SalesPortalPage {
  title = this.page.locator(".welcome-text");
  customersButton = this.page.getByRole("link", { name: "Customer" });
  productsButton = this.page.getByRole("link", { name: "Products" });
  ordersButton = this.page.getByRole("link", { name: "Orders" });

  readonly totalOrders = this.page.locator(
    "#total-orders-container .card-text"
  );
  readonly totalRevenue = this.page.locator(
    "#total-revenue-container .card-text"
  );
  readonly totalNewCustomers = this.page.locator(
    "#total-customers-container .card-text"
  );
  readonly averageOrderValue = this.page.locator(
    "#avg-orders-value-container .card-text"
  );
  readonly totalCanceledOrders = this.page.locator(
    "#canceled-orders-container .card-text"
  );

  uniqueElement = this.title;

  async open() {
    await this.page.evaluate(async () => {
      await (
        window as typeof window & { renderHomePage: () => Promise<void> }
      ).renderHomePage();
    });
  }

  async clickModuleButton(moduleName: ModuleName) {
    const moduleButtons: Record<ModuleName, Locator> = {
      Customers: this.customersButton,
      Products: this.productsButton,
      Orders: this.ordersButton,
    };
    await moduleButtons[moduleName].click();
  }
  async getAllMetrics(): Promise<{
    //для 3-х
    totalOrders: number;
    totalNewCustomers: number;
    totalCanceledOrders: number;
  }> {
    const totalOrdersText = await this.totalOrders.textContent();
    const totalNewCustomersText = await this.totalNewCustomers.textContent();
    const totalCanceledOrdersText =
      await this.totalCanceledOrders.textContent();

    return {
      totalOrders: parseInt(totalOrdersText ?? "0", 10),
      totalNewCustomers: parseInt(totalNewCustomersText ?? "0", 10),
      totalCanceledOrders: parseInt(totalCanceledOrdersText ?? "0", 10),
    };
  }
}
