// Написать смоук API тест на получение всех кастомеров (без фильтрационных параметров) со следующими шагами:
//   - Залогиниться
//   - Создать кастомера и проверить 200й статус
//   - Получить всех кастомеров
//   - создать и проверить схему
//   - проверить статус
//   - проверить, что в массиве тела респонса есть созданный кастомер
//   - Проверить поля IsSuccess и ErrorMessage

import test, { expect } from "@playwright/test";
import { apiConfig } from "config/api-config";
import { MY_USER } from "config/envirement";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { customersListSchema } from "data/schemas/customers/customersList.schema";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { ICustomer } from "types/customer.types";
import { validateSchema } from "utils/validations/schemaValidation";

test.describe("[API] [Customers] [GetAll]", () => {
  let id = "";
  let token = "";

  test("Create customer with smoke data", async ({ request }) => {
    const loginResponse = await request.post(
      apiConfig.BASE_URL + apiConfig.ENDPOINTS.LOGIN,
      {
        data: { username: MY_USER.email, password: MY_USER.password },
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const headers = loginResponse.headers();
    token = headers["authorization"];
    const body = await loginResponse.json();

    expect.soft(loginResponse.status()).toBe(STATUS_CODES.OK);
    expect.soft(token).toBeTruthy();

    const customerData = generateCustomerData();
    const customerResponse = await request.post(
      apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS,
      {
        data: customerData,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const customerBody = await customerResponse.json();
    console.log(
      "Ответ создания кастомера:",
      JSON.stringify(customerBody, null, 2)
    );

    expect.soft(customerResponse.status()).toBe(STATUS_CODES.CREATED);

    const getAllResponse = await request.get(
      apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const getAllBody = await getAllResponse.json();

    expect.soft(getAllResponse.status()).toBe(STATUS_CODES.OK);

    validateSchema(customersListSchema, getAllBody);

    const createdCustomerId = customerBody.Customer._id;
    console.log("createdCustomerId:", createdCustomerId);

    const customersArray = getAllBody.Customers || [];

    const foundCustomer = customersArray.find(
      (c: ICustomer) => c._id === createdCustomerId
    );

    console.log("foundCustomer:", foundCustomer);

    expect.soft(foundCustomer).toBeDefined();

    expect.soft(getAllBody.IsSuccess).toBe(true);
    expect.soft(getAllBody.ErrorMessage).toBeNull();
  });
});
