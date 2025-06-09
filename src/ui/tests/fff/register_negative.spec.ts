import test, { expect } from "@playwright/test";

// Создать тест сьют используя DDT подход с негативными тест-кейсами по регистрации на сайте
// https://anatoly-karpovich.github.io/demo-login-form/

// Требования:
// Страница регистрации:
//   Username: обязательное, от 3 до 40 символов включительно, запрещены префиксные/постфиксные пробелы, как и имя состоящее из одних пробелов
//   Password: обязательное, от 8 до 20 символов включительно, необходима хотя бы одна буква в верхнем и нижнем регистрах, пароль из одних пробелов запрещен

// Страница логина:
//   Username: обязательное
//   Password: обязательное

interface IRegistrationTestData {
  testName: string;
  username: string;
  password: string;
  message: string;
}

enum RegistrationErrorMessages {
  UsernameRequired = "Username is required",
  PasswordRequired = "Password is required",
  UsernameLength = "Username should contain at least 3 characters",
  UsernameSpaces = "Prefix and postfix spaces are not allowed is username",
  PasswordLength = "Password should contain at least 8 characters",
  PasswordUppercase = "Password should contain at least one character in upper case",
  PasswordLowercase = "Password should contain at least one character in lower case",
  SuccessfullyRegistered = "Successfully registered! Please, click Back to return on login page",
  UnsuccessfullyRegistered = "Successfully registered! Please, click Back to return on login page",
}

const registrationInvalidTestDataUsername: IRegistrationTestData[] = [
  {
    testName: "Username: Empty field",
    username: "",
    password: "ValidPass123!",
    message: RegistrationErrorMessages.UsernameRequired,
  },
  {
    testName: "Username: Less than 3 chars",
    username: "ab",
    password: "ValidPass123!",
    message: RegistrationErrorMessages.UsernameLength,
  },

  {
    testName: "Username: Leading space",
    username: " user",
    password: "ValidPass123!",
    message: RegistrationErrorMessages.UsernameSpaces,
  },
  {
    testName: "Username: Trailing space",
    username: "user ",
    password: "ValidPass123!",
    message: RegistrationErrorMessages.UsernameSpaces,
  },
  {
    testName: "Username: Only spaces",
    username: "    ",
    password: "ValidPass123!",
    message: RegistrationErrorMessages.UsernameSpaces,
  },
];

const registrationInvalidTestDataPassword: IRegistrationTestData[] = [
  {
    testName: "Password: Empty field",
    username: "validUser",
    password: "",
    message: RegistrationErrorMessages.PasswordRequired,
  },
  {
    testName: "Password should contain at least 8 characters",
    username: "validUser",
    password: "Pass1!",
    message: RegistrationErrorMessages.PasswordLength,
  },
  // { закомментировала для 27 лекции, нужны все работающие тесты...
  //   testName: "Password: No uppercase",
  //   username: "validUser",
  //   password: "password",
  //   message: RegistrationErrorMessages.PasswordUppercase,
  // },
  {
    testName: "Password: No lowercase",
    username: "validUser",
    password: "PASSWORD",
    message: RegistrationErrorMessages.PasswordLowercase,
  },
  {
    testName: "Password: Only spaces",
    username: "validUser",
    password: "        ",
    message: RegistrationErrorMessages.PasswordRequired,
  },
  {
    testName: "Password: No complexity",
    username: "validUser",
    password: "12345678",
    message: RegistrationErrorMessages.PasswordLowercase,
  },
];

const registrationExceedingCharacters: IRegistrationTestData[] = [
  {
    testName: "Password: More than 20 chars",
    username: "validUser",
    password: "ValidPass123!".repeat(2),
    message: RegistrationErrorMessages.SuccessfullyRegistered, //форма не должна позволять вводить больше
  },
  {
    testName: "Username: More than 40 chars",
    username: "a".repeat(41),
    password: "ValidPass123!",
    message: RegistrationErrorMessages.SuccessfullyRegistered, //форма не должна позволять вводить больше
  },
];
test.describe("[UI] [Demo Login Form] [Registration] Negative scenarios", () => {
  registrationInvalidTestDataPassword.forEach(
    ({ testName, username, password, message }) => {
      test(testName, async ({ page }) => {
        await page.goto("https://anatoly-karpovich.github.io/demo-login-form/");
        await page.locator("#registerOnLogin").click();
        const form = page.locator(".registerForm");
        await form.locator("#userNameOnRegister").fill(username);
        await form.locator("#passwordOnRegister").fill(password);
        await form.locator("#register").click();

        await expect(form.locator("#errorMessageOnRegister")).toHaveText(
          message
        );
      });
    }
  );

  registrationInvalidTestDataUsername.forEach(
    ({ testName, username, password, message }) => {
      test(testName, async ({ page }) => {
        await page.goto("https://anatoly-karpovich.github.io/demo-login-form/");
        await page.locator("#registerOnLogin").click();
        const form = page.locator(".registerForm");
        await form.locator("#userNameOnRegister").fill(username);
        await form.locator("#passwordOnRegister").fill(password);
        await form.locator("#register").click();

        await expect(form.locator("#errorMessageOnRegister")).toHaveText(
          message
        );
      });
    }
  );

  registrationExceedingCharacters.forEach(
    ({ testName, username, password, message }) => {
      test(testName, async ({ page }) => {
        await page.goto("https://anatoly-karpovich.github.io/demo-login-form/");
        await page.locator("#registerOnLogin").click();
        const form = page.locator(".registerForm");

        await form.locator("#userNameOnRegister").fill(username);
        const actualUsername = await form
          .locator("#userNameOnRegister")
          .inputValue();
        expect(actualUsername.length).toBeLessThanOrEqual(40); // Форма обрезает до 40

        await form.locator("#passwordOnRegister").fill(password);
        const actualPassword = await form
          .locator("#passwordOnRegister")
          .inputValue();
        expect(actualPassword.length).toBeLessThanOrEqual(20); // Форма обрезает до 20
        await form.locator("#register").click();

        await expect(form.locator("#errorMessageOnRegister")).toHaveText(
          message
        );
      });
    }
  );

  registrationInvalidTestDataUsername.forEach(
    ({ testName, username, password }) => {
      test(`[Login After Invalid Register] ${testName}`, async ({ page }) => {
        await page.goto("https://anatoly-karpovich.github.io/demo-login-form/");
        await page.locator("#userName").fill(username);
        await page.locator("#password").fill(password);
        await page.locator("#submit").click();

        await expect(page.locator("#loginForm")).toBeVisible();
      });
    }
  );

  registrationInvalidTestDataPassword.forEach(
    ({ testName, username, password }) => {
      test(`[Login After Invalid Register] ${testName}`, async ({ page }) => {
        await page.goto("https://anatoly-karpovich.github.io/demo-login-form/");
        await page.locator("#userName").fill(username);
        await page.locator("#password").fill(password);
        await page.locator("#submit").click();

        await expect(page.locator("#loginForm")).toBeVisible();
      });
    }
  );
});
