
export type User = {
  userId: number;
  username: string;
  email: string;
  password: string;
  status: number;
  userType: number;
  deleteFlg: number;
  token: string;
  profileImage: string;
  userPhoto: string;
  failedLoginCount: number;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type VerifyRequest = {
  name: string;
  email: string;
  code: string;
  password: string;
};

export type SignUpResponse = {
  status: string;
  message: string;
  code: number;
  data: object;
};

export type ForgotPasswordResponse = {
  status: string;
  message: string;
  code: number;
};

export type ForgotEmailVerifyRequest = {
  email: string;
  code?: string;
};

export type ForgotEmailResponse = {
  status: string;
  message: string;
  code: number;
  data: VerifyCodeData;
};

export interface VerifyCodeData {
  token: string;
}

export type ChangePasswordRequest = {
  token: string;
  email: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  status: string;
  message: string;
  code: number;
};