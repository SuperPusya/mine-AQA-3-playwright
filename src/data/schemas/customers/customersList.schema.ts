import { COUNTRIES } from "data/customers/countries.data";

export const customersListSchema = {
  type: "object",
  required: ["IsSuccess", "ErrorMessage", "Customers", "sorting"],
  properties: {
    IsSuccess: { type: "boolean" },
    ErrorMessage: { type: ["string", "null"] },
    sorting: {
      type: "object",
      required: ["sortField", "sortOrder"],
      properties: {
        sortField: { type: "string" },
        sortOrder: { type: "string", enum: ["asc", "desc"] },
      },
      additionalProperties: false,
    },
    Customers: {
      type: "array",
      items: {
        type: "object",
        required: [
          "_id",
          "email",
          "name",
          "country",
          "city",
          "street",
          "house",
          "flat",
          "phone",
          "createdOn",
        ],
        properties: {
          _id: { type: "string" },
          email: { type: "string" },
          name: { type: "string" },
          country: { type: "string", enum: Object.values(COUNTRIES) },
          city: { type: "string" },
          street: { type: "string" },
          house: { type: "number" },
          flat: { type: "number" },
          phone: { type: "string" },
          createdOn: { type: "string" },
          notes: { type: ["string", "null"] },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};
