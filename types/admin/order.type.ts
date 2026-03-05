import { FCUser } from "./fcUser.type";
import { Pagination, Product } from "./purchase.type";
import { User } from "./user.type";

export interface OrderResponse {
  data: Order[];
  pagination: Pagination;
}

export interface Order {
  orderId: number;
  orderDate: number[]; // LocalDateTime
  orderType: number; // 1:通常, 2:契約
  orderStatus: number; // 1~5, -1
  paymentType: number; // 1:カード, 2:振込
  points?: number | null;
  couponPoint?: number | null;
  paymentDate?: string | null; // LocalDateTime
  paymentReference?: string | null;
  subscript: boolean;
  subscriptType?: number | null;
  shippingCost: string; // BigDecimal → string
  shippingCompany?: number | null; // 1:ヤマト, 2:佐川, 3:日本郵便
  trackingNumber?: string | null;
  shippingDate?: string | null; // LocalDate
  note?: string | null;

  fc: {
    role: number;
  };

  // Billing
  billName: string;
  billPostalCode: string;
  billPrefecture: string;
  billCity: string;
  billAddress1: string;
  billAddress2?: string | null;
  billPhone: string;

  // Shipping
  receiveName: string;
  receivePostalCode: string;
  receivePrefecture: string;
  receiveCity: string;
  receiveAddress1: string;
  receiveAddress2?: string | null;
  receivePhone: string;

  orderItems: OrderItem[];
  user: User;
  fcInitial: number;
  totalPrice: number;
  totalPriceNoTax: number;

  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime
}


export interface OrderItemResponse {
  data: OrderItem[];
}

export interface OrderItem {
  orderDetailId: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  originalSalePrice: string; // BigDecimal → string
  discount: number; // %
  priceAtPurchase: string; // BigDecimal → string
  tax: number; // %
  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime

  order: Order;

  product: Product
  

  
  // Optional fields that might come from Product join
  productImageUrl?: string;
}

// export interface Product {
//   product_id?: number;
//   images?: { imageUrl: string }[];
// }
