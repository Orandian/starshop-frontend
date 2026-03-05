export interface FcSettingData {
  shippingFreeLimitUser?: number;
  shippingFreeLimitFc?: number;
  allowPeriod?: number;
  settingId?: number;
}


export interface CalculateShippingCost {
  quantity: number;
  prefecture: string;
  totalFee: number;
  unitFee: number;
  region: string;
}