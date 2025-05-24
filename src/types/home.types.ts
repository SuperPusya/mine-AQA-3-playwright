export type ModuleName = "Customers" | "Products" | "Orders";

export interface IMetricsResponse {
  IsSuccess: boolean;
  ErrorMessage: string | null;
  Metrics: {
    orders: {
      totalCanceledOrders: number;
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      ordersCountPerDay: Array<{}>;
      recentOrders: Array<{}>;
    };
    customers: {
      topCustomers: Array<{}>;
      totalNewCustomers: number;
      customerGrowth: Array<{}>;
    };
    products: {
      topProducts: Array<{}>;
    };
  };
}
