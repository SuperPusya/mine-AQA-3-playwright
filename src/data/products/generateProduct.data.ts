import { faker } from "@faker-js/faker";
import { IProduct } from "types/product.types";
import { MANUFACTURER } from "data/products/manufacturer.data";
import { getRandromEnumValue } from "utils/enum.utils";

export function generateCustomerData(params?: Partial<IProduct>): IProduct {
  return {
    name: `Test ${faker.string.alpha(35)}`,
    amount: faker.number.int(999),
    price: faker.number.int(9999),
    manufacturer: getRandromEnumValue(MANUFACTURER),
    notes: `Notes ${faker.string.alpha(244)}`,

    //validate
    
  };
}
