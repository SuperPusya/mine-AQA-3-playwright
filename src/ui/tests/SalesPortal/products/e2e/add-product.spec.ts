import { expect, test } from "fixtures/ui-services.fixture";
import { STATUS_CODES } from "data/statusCodes";

test.describe("[E2E] [UI] [Product] [Add]", () => {
  let id = "";
  let token = "";

  test("Create product with smoke data", async ({
    signInUIService,
    homeUIService,
    productsUIService,
    addNewProductUIService,
    productsController,
  }) => {
    token = await signInUIService.signInAsLocalUser();
    await homeUIService.openModule("Products");
    await productsUIService.openAddNewProductPage();

    const createdProduct = await addNewProductUIService.addProduct();

    // validate
    const response = await productsController.getById(
      createdProduct._id,
      token
    );
    expect(response.status).toBe(STATUS_CODES.OK);
  });
});
