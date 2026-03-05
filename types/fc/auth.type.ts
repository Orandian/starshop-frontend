import { User } from "./user.type";

// Types for API requests
export type AccountRegister ={
  email: string;
  password:string;
  name:string;
}

export interface AccountVerify {
  code:string;
  username:string;
  usernameKana:string;
  email:string;
  password:string;
  phoneNumber:string;
  address1:string;
  address2:string;
  name:string;
  postalCode:string;
  prefecture?:string;
  representativeName:string;
  tantoName:string;
  tantoPosition:string;
  privacyAggree:number;
  step:number
  referrerId?:number
}

export interface FCProduct {
  productId:number;
  quantity:number;
}

export interface FCRegister {
  fcId?:number;
  contractEndDt?:string;
  contractStartDt?:string;
  contractUpdateFlg?:string
  contractFcPlanMasterId?:number;
  currentFcPlanMasterId?:number;
  contSupplySalesAggree?:number;
  step?:number;
  products?:FCProduct[]
  deposite?:number
  depositType?:string,
  totalAmount?: number,
  shippingCost?: number,
  signPath?:string
}

export interface Login {
  email:string;
  password:string;
}

export interface LoginUser {
  userId: number;
  username: string;
  email: string;
  password: string | null;
  status: number;
  userType: number;
  deleteFlg: number;
  token: string | null;
  profileImage: string | null;
  userPhoto: string | null;
  failedLoginCount: number | null;
}

export interface LoginResponse {
  status: string;
  message: string;
  code: number;
  data: {
    token: string;
    user: LoginUser;
    step: number;
  };
}
export interface EmptyResponse {
  data: Record<string, never>;  // This enforces an empty object
}

export interface AccountVerifyResponse {
  data:User
}

export interface FCStepRequest {
  step:number
}