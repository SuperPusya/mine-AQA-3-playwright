import { test as base } from "@playwright/test";
import { AddNewCustomerPage } from "ui/pages/customers/add-new-customer.page";
import { CustomersPage } from "ui/pages/customers/customers.page";
import { HomePage } from "ui/pages/home.page";
import { Pages } from "./page";
import { SignIn } from "ui/pages/login/sign-in.page";
import { DeleteModal } from "ui/pages/modals/customers/delete.modal";

interface ISalesPortalPages {
  signInPage: SignIn;
  homePage: HomePage;
  customersPage: CustomersPage;
  addNewCustomerPage: AddNewCustomerPage;
  deleteCustomerModal: DeleteModal;
}

export const test = base.extend<ISalesPortalPages>({
  signInPage: async ({ page }, use) => {
    await use(new SignIn(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },
  addNewCustomerPage: async ({ page }, use) => {
    await use(new AddNewCustomerPage(page));
  },
  deleteCustomerModal: async ({ page }, use) => {
    await use(new DeleteModal(page));
  },
});

// interface ISalesPortalPages {
//   pages: Pages;
// }

// export const test = base.extend<ISalesPortalPages>({
//   pages: async ({ page }, use) => {
//     await use(new Pages(page));
//   },
// });

export { expect } from "@playwright/test";
