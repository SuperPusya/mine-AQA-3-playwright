export const loginSchema = {
  type: "object",
  required: ["IsSuccess", "ErrorMessage"],
  properties: {
    IsSuccess: { type: "boolean" },
    ErrorMessage: { type: ["string", "null"] },
  },
};
