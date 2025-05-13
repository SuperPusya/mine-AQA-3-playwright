// Написать смоук API тест на логин
//   - создать и проверить схему
//   - проверить статус
//   - проверить наличие токена в хедерах

import test, { expect } from "@playwright/test";
import { apiConfig } from "config/api-config";
import { MY_USER } from "config/envirement";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { loginSchema } from "data/schemas/login.schema";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { validateSchema } from "utils/validations/schemaValidation";

test.describe("[API] [Auth] [ValidateData]", () => {
  test("Login with valid data", async ({ request }) => {
    const loginResponse = await request.post(
      apiConfig.BASE_URL + apiConfig.ENDPOINTS.LOGIN,
      {
        data: { username: MY_USER.email, password: MY_USER.password },
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const loginBody = await loginResponse.json();
    validateSchema(loginSchema, loginBody);

    expect.soft(loginResponse.status()).toBe(STATUS_CODES.OK);

    const headers = loginResponse.headers();
    const authHeader = headers["authorization"] || headers["Authorization"];

    expect.soft(authHeader).toBeTruthy();
  });
});
