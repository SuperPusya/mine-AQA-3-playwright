import { Page, test as base } from "@playwright/test";
import { apiConfig } from "config/api-config";
import { STATUS_CODES } from "data/statusCodes";
import { IMetricsResponse } from "types/home.types";

class Mock {
  constructor(private page: Page) {}

  async metrics(
    body: IMetricsResponse,
    statusCode: STATUS_CODES = STATUS_CODES.OK
  ) {
    this.page.route(
      apiConfig.BASE_URL + "/" + apiConfig.ENDPOINTS.METRICS,
      async (route) => {
        await route.fulfill({
          status: statusCode,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
      }
    );
  }
}

interface MockFixture {
  mock: Mock;
}

export const test = base.extend<MockFixture>({
  mock: async ({ page }, use) => {
    await use(new Mock(page));
  },
});

export { expect } from "@playwright/test";
