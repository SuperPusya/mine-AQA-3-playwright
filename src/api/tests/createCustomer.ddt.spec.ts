import { test, expect } from "fixtures/controllers.fixture";
import { MY_USER } from "config/envirement";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { customerSchema } from "data/schemas/customers/customer.schema";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer } from "types/customer.types";
import { validateSchema } from "utils/validations/schemaValidation";
import { ERROR_MESSAGE } from "data/errorMessage.data";

test.describe("[API] [Customers] [Create] Simple Positive", () => {
  let token = "";
  let createdCustomerId = "";

  test.beforeAll(async ({ signInController }) => {
    const loginResponse = await signInController.signIn({
      username: MY_USER.email,
      password: MY_USER.password,
    });
    const headers = loginResponse.headers as Record<string, string>;
    token = headers["authorization"];
  });

  test.afterEach(async ({ customersController }) => {
    if (createdCustomerId) {
      const deleteResponse = await customersController.delete(
        createdCustomerId,
        token
      );
      expect(deleteResponse.status).toBe(STATUS_CODES.DELETED);
      createdCustomerId = "";
    }
  });

  test("Create customer with valid data", async ({ customersController }) => {
    const customerData: ICustomer = generateCustomerData();

    const response = await customersController.create(customerData, token);

    expect(response.status).toBe(STATUS_CODES.CREATED);
    validateSchema(customerSchema, response.body);
    expect(response.body.IsSuccess).toBe(true);
    expect(response.body.ErrorMessage).toBeNull();

    expect(response.body.Customer).toMatchObject({
      ...customerData,
    });

    createdCustomerId = response.body.Customer._id;
  });

  test("Create customer with empty notes", async ({ customersController }) => {
    const customerData: ICustomer = {
      ...generateCustomerData(),
      notes: "",
    };

    const response = await customersController.create(customerData, token);

    expect(response.status).toBe(STATUS_CODES.CREATED);
    validateSchema(customerSchema, response.body);
    expect(response.body.IsSuccess).toBe(true);
    expect(response.body.ErrorMessage).toBeNull();

    expect(response.body.Customer).toMatchObject({
      ...customerData,
    });

    createdCustomerId = response.body.Customer._id;
  });

  test("Create customer with invalid email", async ({
    customersController,
  }) => {
    const customerData: ICustomer = {
      ...generateCustomerData(),
      email: "invalid-email-format",
    };

    const response = await customersController.create(customerData, token);

    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response.body.IsSuccess).toBe(false);
    expect(response.body.ErrorMessage).toBe(ERROR_MESSAGE.INCORRECT_BODY);
  });

  test("Create customer with phone number without '+' sign", async ({
    customersController,
  }) => {
    const customerData: ICustomer = {
      ...generateCustomerData(),
      phone: "1234567890",
    };

    const response = await customersController.create(customerData, token);

    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response.body.IsSuccess).toBe(false);
    expect(response.body.ErrorMessage).toBe(ERROR_MESSAGE.INCORRECT_BODY);
  });
});
