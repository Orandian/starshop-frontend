export interface AdminUserData {
  userId: number;
  username: string;
  usernameKana: string | null;
  email: string;
  password: string | null;
  phoneNumber: string;
  status:number;
  lastLogin: number[] | null;
  createdAt: number[];
  updatedAt: number[];
}

export interface AdminUserListResponse {
  data: AdminUserData[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
  extra: null;
}

export interface AdminUpdateUserRequest {
  username?: string;
  usernameKana?: string | null;
  email?: string;
  password?: string | null;
  phoneNumber?: string;
  status?: number;
}

export interface AdminMailTemplate {
  templateId: number;
  templateName: string;
  templateDescription: string;
  isActive: number; // 0 or 1
  createdAt: number[];
  updatedAt: number[];
}

export interface AdminMailTemplateResponse{
  data:AdminMailTemplate[]
   pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
}

export interface AdminMailCreateRequest{
  templateName:string;
  templateDescription:string;
  isActive?:boolean
}

export interface AdminMailUpdateRequest{
    templateName?:string;
  templateDescription?:string;
  isActive?:boolean
}

export interface AdminDeliverySetting {
  settingId: number;
  shippingFreeLimitUser: number;
  shippingFreeLimitFc: number;
}

export interface AdminDeliveryPayload {
  shippingFreeLimitUser: number;
  shippingFreeLimitFc: number;
}

export interface AdminShippingCostRequest {
    shippingCostId: number;
    fees: number;
}

export interface AdminShippingCost {
  shippingCostId: number;
  state: string;
  fees: number;
  createdAt: null | number[];
  updatedAt: null | number[];
}

export type AdminGetAllShippingCostResponse = AdminShippingCost[];

export interface AdminUserDetails {
  userId: number;
  username: string;
  usernameKana: string | null;
  email: string;
  password: string | null;
  provider: string;
  providerId: string | null;
  userPhoto: string | null;
  phoneNumber: string;
  userType: string | null;
  aiReferrerId: string | null;
  referrer: string | null;
  status: number;
  points: number;
  failedLoginCount: number;
  lastLogin: number[] | null;
  createdAt: number[];
  updatedAt: number[];
  userAddresses: null;
  orders:  null;
}export interface Setting {
  settingId: number;
  shippingFreeLimitPrice: number;
  shippingOverLimitPrice: number;
  allowPeriod : number;
}

export interface ContactUs {
  contactId: number;
  name: string;
  phoneNumber: string;
  email: string;
  subject: string;
  body: string;
  createdAt: number[]; // [year, month, day, hour, minute, second, nanosecond]
}

export interface ContactusResponse {
  data: ContactUs[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
  extra: null;
}