export type CustomerWithTotalOrderAmount = {
  user_id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  first_name_kana: string | null;
  last_name_kana: string | null;
  user_photo: string | null;
  phone_number: string | null;
  registration_date: string;
  last_login: string;
  user_type: "customer" | "admin" | string;
  is_active: boolean;
  total_order_amount: number;
};

export type Customer = {
  user_id: string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  first_name_kana?: string | null;
  last_name_kana?: string | null;
  user_photo: string | null;
  phone_number: string | null;
  registration_date?: string;
  last_login: string;
  user_type: "一般" | "FC" | string;
  is_active: boolean;
  status: number;
  total_order_amount?: number;
};

export type CustomerResponseType = {
  userId: number;
  username: string;
  usernameKana: string;
  email: string;
  lastLogin: string;
  status: number;
  userPhoto: string;
  userType: number;
  totalOrderAmount: number;
  totalOrderCount: number;
  bonusType: number;
  createdAt: [number, number, number, number, number, number, number];
};

export type AllCustomersApiResponse = {
  data: CustomerResponseType[];
  pagination: Pagination;
};

export type AdminConfrimFcApiResponse = {
  data: AdminConfirmFcUser[];
  pagination: Pagination;
};

export type AdminConfirmFcUser = {
  fcId: number;
  userName: string;
  role: number;
};

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export type UpdateStatus = {
  user_id: number | string;
  status: number;
};

export type UpdateStatusResponse = {
  status: string;
  message: string;
  code: string;
};

export type CustomerResponse = {
  data: Customer[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
};

export type NewCustomer = {
  username: string;
  usernameKana: string;
  tantoName: string;
  tantoPosition: string;
  postalCode?: string;
  prefecture?: string;
  address1?: string;
  address2?: string;
  phoneNumber?: string;
  email: string;
  password: string | null;
  representativeName: string;
  contractStartDate: string;
  contractEndDate: string;
  contractUpdateFlg: string; //有,無
  currentFcPlanMasterId: number;
  referrerId?: number | null;
  name: string;
  privacyAggree: number;
  role?: number;
};

export type CustomerDetailResponse = {
  status: number;
  message: string;
  code: string;
  data: CustomerDetail;
};

export type CustomerDetail = {
  user_id?: string;
  userId?: string;
  current_fc_plan_master_id?: number;
  username?: string;
  usernameKana?: string;
  email?: string;
  phone_number?: string;
  user_photo?: string;
  user_type?: number;
  status?: number;
  billing_address?: Address[];
  shipping_address?: Address[];
  bank_info?: BankInfo;
  company_info?: CompanyInfo;
  tantoName?: string;
  tantoPosition?: string;
  representativeName?: string;
  fc_info?: FCInfo;
  createdAt?: [number, number, number, number, number, number, number];
  totalBonus?: number;
  recentBonus?: number;
};

export type FCInfo = {
  fcId: number;
  referrerId: number;
  referrerName: string;
  contractPlanId: number;
  contractStartDt: number[];
  contractEndDt: number[];
  contractUpdateFlg: string;
  introIncentive: number;
  contSupplySalesAggree: number;
  deposit: string | number | null;
  depositType: string;
  createdAt: [number, number, number, number, number, number, number];
  signPath?: string;
  role?: number;
};

export type Address = {
  addressId?: number;
  name?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  address1?: string;
  address2?: string;
  phoneNumber?: string;
};

export type CompanyInfo = {
  username: string;
  usernameKana: string;
  tantoPosition: string;
  representativeName: string;
};

export type BankInfo = {
  bankName: string;
  branchName: string;
  branchNumber: string;
  bankAccountNumber: string;
  bankAccountName: string;
};

export type UpdateProfile = {
  tantoName?: string;
  username?: string;
  usernameKana?: string;
  phoneNumber?: string;
  role?: number; //fc role
};

export type CustomerInvoice = {
  type1ACount: number;
  type1BCount: number;
  type2Amount: number;
  totalAmount: number;
  type2TotalCost: number;
  paymentDate: string;
};

export type CustomerInvoiceResponse = {
  data: CustomerInvoice;
};

export type UserTypeCountResponse = UserTypeCount[];

export type UserTypeCount = {
  type:
    | "GENERAL"
    | "FC_ROLE_1"
    | "FC_ROLE_2"
    | "FC_ROLE_3"
    | "FC_ROLE_4"
    | "FC_ROLE_5";
  count: number;
};

export type CustomerFilterProps = {
  searchQuery?: string;
  userType?: string;
  bonusType?: string;
};

export type CompanyInfoUpdate = {
  tantoPosition: string;
  representativeName: string;
};
