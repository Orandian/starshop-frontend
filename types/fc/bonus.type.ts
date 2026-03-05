import { User } from "./user.type";
import { Order } from "./order.type";

export interface BonusTransactionListResponse {
  data: BonusTransactionList[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface BonusTransactionList {
  transactionId: number;
  user: User;
  transactionType: number; // 1:紹介費, 2:管理金, 3:愛用者購入
  transactionDate: number[]; // LocalDateTime as array [year, month, day, hour, minute, second, nanosecond]
  totalBuyPrice: number; // 税別金額
  amountNoTax: number;
  tax: number; // %
  bonus: number;
  isActive: boolean;
  invoiceYearMonth: string; // "YYYYMM" format
  remark: string;
  createdAt: number[]; // LocalDateTime as array
  updatedAt: number[]; // LocalDateTime as array
  paymentDate: number[]; // LocalDateTime as array
  level: number;
  buyer: User;
  order: Order;
}



export interface BonusPeriodList {
  invoiceYearMonth: string; // e.g., "2024-05"
}

