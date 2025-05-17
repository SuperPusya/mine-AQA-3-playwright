import { test, expect } from "fixtures/controllers.fixture";
import { apiConfig } from "config/api-config";
import { MY_USER } from "config/envirement";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { customersListSchema } from "data/schemas/customers/customersList.schema";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { ICustomerFromResponse } from "types/customer.types";
import { validateSchema } from "utils/validations/schemaValidation";

test.describe("[API] [Customers] [GetAll]", () => {
  let token = "";

  test("Create customer with smoke data", async ({
    request,
    signInController,
  }) => {
    const loginData = {
      username: MY_USER.email,
      password: MY_USER.password,
    };

    const loginResponse = await signInController.signIn(loginData);

    expect.soft(loginResponse.status).toBe(STATUS_CODES.OK);

    const headers = loginResponse.headers as Record<string, string>;
    const token = headers["authorization"];

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

    const customersArray: ICustomerFromResponse[] = getAllBody.Customers || [];

    const foundCustomer = customersArray.find(
      (c) => c._id === createdCustomerId
    );

    expect.soft(foundCustomer).toBeDefined();

    if (foundCustomer) {
      expect(
        _.isEqual(_.omit(foundCustomer, ["_id", "createdOn"]), customerData)
      ).toBe(true);
    }

    expect.soft(getAllBody.IsSuccess).toBe(true);
    expect.soft(getAllBody.ErrorMessage).toBeNull();
  });
});
