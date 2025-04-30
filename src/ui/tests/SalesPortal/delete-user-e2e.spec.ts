import { test, expect } from "fixtures/pages.fixture";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { NOTIFICATIONS } from "data/notifications.data";
import { MY_USER, SALES_PORTAL_URL } from "config/envirement";

test.describe("[UI] [Sales Portal] [User]", () => {
  test("Should create and delete customer", async ({
    page,
    signInPage,
    homePage,
    customersPage,
    addNewCustomerPage,
    deleteCustomerModal,
  }) => {
    await page.goto(SALES_PORTAL_URL);
    await signInPage.fillCredentials(MY_USER);
    await signInPage.clickLoginButton();
    await homePage.waitForOpened();

    await homePage.clickModuleButton("Customers");
    await customersPage.waitForOpened();

    await customersPage.clickAddNewCustomer();
    await addNewCustomerPage.waitForOpened();
    const customerData = generateCustomerData();
    await addNewCustomerPage.fillInputs(customerData);
    await addNewCustomerPage.clickSaveNewCustomer();

    await customersPage.waitForOpened();
    await customersPage.waitForNotification(NOTIFICATIONS.CUSTOMER_CREATED);
    await expect(
      customersPage.tableRowByEmail(customerData.email)
    ).toBeVisible();

    await customersPage.clickDeleteCustomer(customerData.email);
    await deleteCustomerModal.waitForOpened();
    await deleteCustomerModal.clickDeleteButton();
    await deleteCustomerModal.waitForClosed();

    await customersPage.waitForNotification(NOTIFICATIONS.CUSTOMER_DELETED);

    await expect(
      customersPage.tableRowByEmail(customerData.email)
    ).not.toBeVisible();
  });
});
