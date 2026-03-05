
export interface Coupon {
  couponId: number;
  couponCode: string;
  couponPoint: number;
  startDt: string;
  endDt: string;
  isActive: boolean;
  couponLimit: number;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  Id?: number;
  image?: string ;
}

export interface CouponResponse {
  status: number;
  message: string;
  data: Coupon[];
}
