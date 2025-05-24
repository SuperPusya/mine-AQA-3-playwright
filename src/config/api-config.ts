export const apiConfig = {
  BASE_URL: "https://aqa-course-project.app",
  ENDPOINTS: {
    CUSTOMERS: "/api/customers",
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}`,
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
    LOGIN: "/api/login",
    METRICS: "/api/metrics",
    PRODUCTS: "/api/products",
  },
} as const;
