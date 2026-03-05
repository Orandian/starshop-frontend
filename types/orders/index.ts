import { Pagination } from "../dashboard/products";

export type OrderItem = {
  productId: number;
  salePrice: number;
  productName: string;
  productImages: string[];
  productQuantity: number;
  productSubtotal: number;
  tax: number;
  brands?: BrandItem[];
};

export type BrandItem={
  id: number;
  name: string;
}

export type OrderSummary = {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  shippingCost: number;
  orderTotal: number;
  customerId: number;
  customerName: string;
  customerPhoto: string;
  orderItems: OrderItem[];
};

export type OrderDetails = {
  order_id: number;
  order_date: string;
  order_status: string;
  shipping_cost: number;
  shipping_company: string;
  tracking_number: string;
  order_total: number;
  eight_percent_total: number;
  ten_percent_total: number;
  customer_id: string;
  customer_name: string;
  shipping_address: Address;
  billing_address: Address;
  products: Product[];
};

type Address = {
  first_name: string;
  last_name: string;
  phone: string;
  postal_code: string;
  prefecture: string;
  city: string;
  street: string;
  building: string;
  room: string;
  country: string;
};

export type Product = {
  product_id: number;
  product_name: string;
  tax: number;
  price: number;
  quantity: number;
  subtotal: number;
  images: string[];
};

export type Order = {
  total_amount: number;
  shipping_address_id: number;
  billing_address_id: number;
  payment_method: string;
  transaction_id: string;
};

export type OrderItemCreate = {
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
};

export type OrderSummaryDetails = {
  order_id: number;
  order_date: string;
  order_status: string;
  shipping_cost: number;
  order_total: number;
  customer_id: number;
  customer_name: string;
  customer_photo: string;
  order_items: OrderItem[];
};

export type OrderEmailBody = {
  orderId: number;
  total: number;
  products: Product[];
};

export interface OrderResponse {
  status: number;
  message: string;
  data: OrderResponseData;
}

export interface Extra {
  all: number;
  fc: number;
  customer: number;
  fcInitial: number;
}

export interface OrderResponseData {
  data: OrderType[];
  pagination: Pagination;
  extra: Extra;
}

export interface OrderType {
  orderId: number;
  orderDate: number[];
  orderStatus: string;
  shippingCost: number;
  orderTotal: number;
  customerId: string;
  customerName: string;
  customerPhoto: string | null;
  userType: number;
  fcInitial: boolean;
  deliveryCompany: string | null;
  trackingNumber: string | null;
  orderItems: OrderItem[];
}

export interface OrderItemType {
  tax: number;
  productId: number;
  salePrice: number;
  productName: string;
  productImages: string[];
  productQuantity: number;
  productSubtotal: number;
  productTaxAmount: number;
}

export interface OrderDetailResponse {
  data: OrderDetail;
}

export interface OrderDetail {
  orderId: number;
  orderDate: number[]; // [year, month, day, hour, minute, second, nano]
  paymentMethod: string;
  orderStatus: string;
  notes: string | null;
  shippingCompany: number | null;
  shippingDate: string | null;
  trackingNumber: string | null;
  shippingCost: number;
  orderTotal: number;
  orderTotalNoTax:number;
  eightPercentTotal: number;
  tenPercentTotal: number;
  adminConfirmStatus: number;
  fcRole: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  userType: number;
  shippingAddress: AddressType;
  billingAddress: AddressType;
  products: OrderProduct[];
}

export interface AddressType {
  firstName: string;
  lastName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  building: string;
  room: string;
  phone: string;
  country: string;
}

export interface OrderProduct {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  tax: number;
  subtotal: number;
  taxAmount: number;
  images: string[];
}

export interface AdminConfirmOrderRequest {
  fcId: number;
  orderId: number;
}

export interface OrderPeriodList {
  data: string[];
}

export interface OrderFilterProps{
  orderId: string;
  userName: string;
  orderDate: string;
  orderStatus: string;
  yearMonth: string;
  userType: string;
}
