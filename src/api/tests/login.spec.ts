import { apiConfig } from "config/api-config";
import { MY_USER } from "config/envirement";
import { loginSchema } from "data/schemas/login.schema";
import { STATUS_CODES } from "data/statusCodes";
import { validateSchema } from "utils/validations/schemaValidation";
import { ILoginRequest } from "types/signIn.type";
import { SignInController } from "../controllers/signIn.controller";
import { test, expect } from "fixtures/controllers.fixture";

test.describe("[API] [Auth] [ValidateData]", () => {
  test("Login with valid data", async ({ signInController }) => {
    const loginData: ILoginRequest = {
      
      username: MY_USER.email,
      password: MY_USER.password,
    };

    const response = await signInController.signIn(loginData);

    expect.soft(response.status).toBe(STATUS_CODES.OK);
    validateSchema(loginSchema, response.body);

    const headers = response.headers as Record<string, string>;
    const authHeader = headers["authorization"];
    expect.soft(authHeader).toBeTruthy();
  });
});
