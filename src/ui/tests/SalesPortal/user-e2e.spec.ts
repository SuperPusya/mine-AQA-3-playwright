// Разработать е2е теста со следующими шагами:
//  - Открыть url https://anatoly-karpovich.github.io/aqa-course-project/#
//  - Войти в приложения используя ваши учетные данные
//  - Создать покупателя (модуль Customers)
//  - Верифицировать появившуюся нотификацию
//  - Верифицировать созданного покупателя в таблице (сравнить все имеющиеся поля, покупатель должен быть самым верхним)

import test from "@playwright/test";
import { COUNTRIES } from "data/customers/countries.data";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { NOTIFICATIONS } from "data/notifications.data";
import { AddNewCustomerPage } from "ui/pages/customers/add-new-customer.page";
import { CustomersPage } from "ui/pages/customers/customers.page";
import { HomePage } from "ui/pages/home.page";
import { SignIn } from "ui/pages/login/sign-in.page";
import { MY_USER, SALES_PORTAL_URL } from "config/envirement";

test.describe("[UI] [Sales Portal] [User]", async () => {
  test("Should sign in with my data", async ({ page }) => {
    const signIn = new SignIn(page);
    const homePage = new HomePage(page);
    const customersPage = new CustomersPage(page);
    const addNewCustomerPage = new AddNewCustomerPage(page);

    await page.goto(SALES_PORTAL_URL);
    await signIn.fillCredentials(MY_USER);
    await signIn.clickLoginButton();

    await homePage.waitForOpened();
    await homePage.clickModuleButton("Customers");
    await customersPage.waitForOpened();
    await customersPage.clickAddNewCustomer();

    await addNewCustomerPage.waitForOpened();
    const data = generateCustomerData();
    await addNewCustomerPage.fillInputs(data);
    await addNewCustomerPage.clickSaveNewCustomer();

    await customersPage.waitForOpened();
    await customersPage.waitForNotification(NOTIFICATIONS.CUSTOMER_CREATED);
    await customersPage.verifyCustomerPosition();
    await customersPage.verifyCustomerInTable(data);
  });
});
