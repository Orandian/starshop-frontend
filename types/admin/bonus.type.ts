import { Order } from './order.type';
import { User } from './user.type';

export interface BonusTransactionListResponse {
  data: BonusTransactionList[];
  pagination: Pagination;
}

export interface BonusTransactionListGroupByResponse {
  data: BonusTransactionListGroupedByMonth[];
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
  amount: number; // 税別金額
  amountNoTax: number;
  tax: number; // %
  amountWithTax: number;
  isActive: boolean;
  invoiceYearMonth: string; // "YYYYMM" format
  remark: string;
  paymentDate: string; // 支払い日
  createdAt: number[]; // LocalDateTime as array
  updatedAt: number[]; // LocalDateTime as array
}


export interface BonusTransactionListGroupedByMonth {
  userId : number; // ユーザーID
  yearMonth: string; // "YYYY-MM" format
  total: number; //　件数
  totalAmount: number; // 合計金額
  userName  : string; // ユーザー名
  userPhoto: string; // ユーザー写真
  userType: number; // ユーザータイプ
  paymentDate: string; // 支払い日
}



export interface BonusPeriodList {
  invoiceYearMonth: string; // e.g., "2024-05"
}


export interface ALlMemberBonuseRepose{
  data:AllMemeberBonus[],
  pagination:Pagination

}
export interface AllMemeberBonus {
  fcId: number;
  username: string;
  role: number;
  fcPlanId: number;
  fcPlanName: string;
  plan1Name: string;
  plan2Name: string;
  plan1Referrals: number;
  plan2Referrals: number;
  plan1Amount: number;
  plan2Amount: number;
  plan1Bonus: number;
  plan2Bonus: number;
  isAllActive: boolean

}

export interface MemberBonusById {
  fcId: number;
  plan1Users: User[];
  plan2Users: User[];
}


export interface AllAdminBonusResponse{
  data: AllAdminBonus[],
   pagination:Pagination
}

export interface AllAdminBonus {
  fcId: number;
  username: string;
  role: number;
  isActive: number;
  totalBuyerCount: number;
  totalBuyPrice: number;
  totalBonus: number;
}

export interface AdminBonusById {
  transactionId: number;
  user: User | null;
  buyer: User;
  order: Order;
  transactionType: number;
  transactionDate: number[];
  totalBuyPrice: number;
  tax: number;
  level: number | null;
  bonus: number;
  isActive: boolean;
  invoiceYearMonth: string;
  remark: string;
  createdAt: number[];
  updatedAt: number[];
  paymentDate: number[];
}


export interface BonusTimePeriod {
  invoiceYearMonth: string;
}