import { Pagination } from "../dashboard/products";

export type OrderListResponse = {
    status: number;
    message: string;
    data?: OrderListDataResponse;
};

export type OrderListDataResponse = {
    data?: OrderSummary[];
    pagination?: Pagination;
};

export type OrderSummary = {
    orderId: number;
    orderDate?: number[]; // ISO date string
    orderStatus?: string;
    shippingCost?: number;
    orderTotal?: number;
    customerId?: number;
    customerName?: string;
    customerPhoto?: string;
    subscript?: boolean;
    subscriptType?: number;
    orderItems?: OrderItem[];
};

export type OrderItem = {
    productId: number;
    productName: string;
    productQuantity: number;
    salePrice: number;
    tax: number;
    productSubtotal: number;
    productTaxAmount: number;
    productImages: string[];
};
