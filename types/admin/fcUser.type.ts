export type FCUserResponse = FCUser[];
export type FCPendingResponse = FCPendingUser[];

export interface FCUser {
  fcId: number;
  username: string;
  role: number;
  underMember: number;
  totalBuyingAmount: number;
  teamBuyingAmount : number;
  memberFeeAmount: number;
  adminFeeAmount: number;
  userId?: number;
  tantoName?: string;
}

export interface FCPendingUser {
  fcId: number;
  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime
  username: string;
  planName: string;
  currentFcPlanMasterId: number;
  adminConfirm: number;
  paymentType: number;
  totalPrice: number;
  orderId: number;
}

export interface UpdateFcStatus {
  fcId: number;
  status: number;
  amount: number;
}

export interface UpdateFcStatusResponse {
  status: string;
  message: string;
  code: string;
}


export interface FCDashboardData {
  totalFcUsers: number;
  totalSales: number;
  totalBonus: number;
}
export interface FCApprovedHistory {
  fcApprovedId: number;
  fcName: string;
  plan: string;
  applyDate: string; // LocalDate
  approvedDate: string; // LocalDate
  totalAmount: number;
  status: string;
  createdAt: string; // LocalDateTime
}

export interface FCApprovedHistoryPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface FCApprovedHistoryResponse {
  data: FCApprovedHistory[];
  pagination: FCApprovedHistoryPagination;
}
