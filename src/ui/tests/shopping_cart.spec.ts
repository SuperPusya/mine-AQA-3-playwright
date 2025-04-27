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

    await addProductsToCart(products, page);
    const prices = await getProductsPrices(products, page);
    const total = sumPrices(prices);
    await expect(page.locator("#badge-number")).toHaveText(String(products.length));
    await page.getByRole("button", { name: "Shopping Cart" }).click();
    await expectProductsInCart(products, page);
    await expect(page.locator("#total-price")).toHaveText(formatTotal(total));
    await applyAllPromocodes(promocodes, page);
    const displayedTotal = await getDisplayedTotal(page);
    const discountedTotal = calcDiscountedTotal(total, promocodes);
    expect(displayedTotal).toBeCloseTo(discountedTotal, 2);
    await page.locator("#continue-to-checkout-button").click();
    const orderTotal = await getOrderTotal(page);
    expect(orderTotal).toBe(displayedTotal);
  });
});

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
  const totalAmountText = totalText.split(" ")[0];
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
