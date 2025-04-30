import test, { expect, Page } from "@playwright/test";

const promocodes: Record<string, number> = {
  "HOT-COURSE": 10,
  "NO-PYTHON": 8,
  "JAVA-FOR-BOOMERS": 7,
  "15-PERCENT-FOR-CSS": 15,
  "HelloThere": 20,
  "5-PERCENT-FOR-UTILS": 5,
  "10-PERCENT-FOR-REDEEM": 10,
};

const products = [
  "Product 2",
  "Product 4",
  "Product 6",
  "Product 8",
  "Product 10",
];

test.describe("[UI] [Demo Shopping Cart] [E2E]", () => {
  test("Successfull checkout with 5 products and all promocodes", async ({ page }) => {
    await page.goto("https://anatoly-karpovich.github.io/demo-shopping-cart/");

    // 1. Добавить продукты
    await addProductsToCart(products, page);

    // 2. Получить цены и сумму
    const prices = await getProductsPrices(products, page);
    const total = sumPrices(prices);

    // 3. Валидировать бейдж
    await expect(page.locator("#badge-number")).toHaveText(String(products.length));

    // 4. Открыть чекаут
    await page.getByRole("button", { name: "Shopping Cart" }).click();

    // 5. Валидировать продукты в корзине
    await expectProductsInCart(products, page);

    // 6. Валидировать сумму
    await expect(page.locator("#total-price")).toHaveText(formatTotal(total));

    // 7. Ввести все промокоды
    await applyAllPromocodes(promocodes, page);

    // 8. Валидировать конечную сумму
    const displayedTotal = await getDisplayedTotal(page);
    const discountedTotal = calcDiscountedTotal(total, promocodes);
    expect(displayedTotal).toBeCloseTo(discountedTotal, 2);

    // 9. Зачекаутиться
    await page.locator("#continue-to-checkout-button").click();

    // 10. Валидировать сумму заказа
    const orderTotal = await getOrderTotal(page);
    expect(orderTotal).toBe(displayedTotal);
  });
});

// --- Вспомогательные функции ---

async function addProductsToCart(productNames: string[], page: Page) {
  for (const name of productNames) {
    await getAddToCartButton(name, page).click();
  }
}

async function getProductsPrices(productNames: string[], page: Page): Promise<number[]> {
  return Promise.all(productNames.map(name => getProductPrice(name, page)));
}

function sumPrices(prices: number[]): number {
  return prices.reduce((acc, val) => acc + val, 0);
}

function formatTotal(total: number): string {
  // Если целое - без дробной части, если дробное - два знака после запятой
  return Number.isInteger(total) ? `$${total}.00` : `$${total.toFixed(2)}`;
}

async function expectProductsInCart(expectedProducts: string[], page: Page) {
  const productLocator = page.locator("h5.my-0.fw-bold");
  const allProductsInCart = await productLocator.all();
  await Promise.all(allProductsInCart.map(product => expect(product).toBeVisible()));
  const textInCart = await productLocator.allTextContents();
  expect(textInCart).toEqual(expectedProducts);
}

async function applyAllPromocodes(promocodes: Record<string, number>, page: Page) {
  for (const promo of Object.keys(promocodes)) {
    await page.locator("#rebate-input").fill(promo);
    await page.locator("#apply-promocode-button").click();
    const spinner = page.locator(".spinner-border");
    await expect(spinner).toBeHidden();
  }
}

async function getDisplayedTotal(page: Page): Promise<number> {
  const totalText = await page.locator("#total-price").innerText();
  const totalAmountText = totalText.split(" ")[0]; // "$1412.50"
  return parseFloat(totalAmountText.replace("$", ""));
}

function calcDiscountedTotal(total: number, promocodes: Record<string, number>): number {
  const totalDiscountPercent = Object.values(promocodes).reduce((acc, val) => acc + val, 0);
  return total * (1 - totalDiscountPercent / 100);
}

async function getOrderTotal(page: Page): Promise<number> {
  const totalOrder = await page.locator(".text-muted").last().innerText();
  return parseFloat(totalOrder.replace("$", ""));
}

// --- Элементы страницы ---

function getAddToCartButton(productName: string, page: Page) {
  return page
    .locator("div.card-body")
    .filter({ has: page.getByText(productName, { exact: true }) })
    .getByRole("button", { name: "Add to card" });
}

function getProductPriceSpan(productName: string, page: Page) {
  return page
    .locator("div.card-body")
    .filter({ has: page.getByText(productName, { exact: true }) })
    .locator("span");
}

async function getProductPrice(productName: string, page: Page): Promise<number> {
  const productPriceSpan = getProductPriceSpan(productName, page);
  const priceText = await productPriceSpan.innerText();
  return +priceText.replace("$", "");
}
