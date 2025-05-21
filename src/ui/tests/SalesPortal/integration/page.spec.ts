// Создайте 3 интеграционных теста для проверки следующих метрик на странице Home:
// 1. Orders This Year
// 2. New Customers
// 3. Canceled Orders

// Для реализации подмокивайте респонс эндпоинта metrics

//   - Orders This Year: Metrics.orders.totalOrders
//   - New Customers: Metrics.customers.customers
//   - Canceled Orders: Metrics.orders.totalCanceledOrders

// Остальной объект оставьте как есть сейчас в респонсе, замените просто на ваши данные в метриках нужных

import { expect, test } from "fixtures/businessSteps.fixture";
import { IMetricsResponse } from "types/home.types";

test.describe("[UI] [Home] [Metrics]", () => {
  const dataForMock: IMetricsResponse = {
    IsSuccess: true,
    ErrorMessage: null,
    Metrics: {
      orders: {
        totalRevenue: 0,
        totalOrders: 170,
        averageOrderValue: 0,
        totalCanceledOrders: 10,
        ordersCountPerDay: [],
        recentOrders: [],
      },
      customers: {
        topCustomers: [],
        totalNewCustomers: 5555,
        customerGrowth: [],
      },
      products: {
        topProducts: [],
      },
    },
  };

  test("Should display correct Orders This Year metric", async ({
    mock,
    loginAsLocalUser,
    homePage,
  }) => {
    await mock.metrics(dataForMock);

    await loginAsLocalUser();
    await homePage.waitForOpened();

    console.log("Mock for /metrics endpoint triggered");

    const metrics = await homePage.getAllMetrics();

    expect
      .soft(metrics.totalOrders)
      .toBe(dataForMock.Metrics.orders.totalOrders);
    expect
      .soft(metrics.totalNewCustomers)
      .toBe(dataForMock.Metrics.customers.totalNewCustomers);
    expect
      .soft(metrics.totalCanceledOrders)
      .toBe(dataForMock.Metrics.orders.totalCanceledOrders);
  });
});
