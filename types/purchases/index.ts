export type PurchaseType = {
  subscriptTypeId: number;
  name: string;
  intervalMonth: number;
};

export interface PurchaseTypesResponse {
  status: string;
  message: string;
  code: number;
  data: PurchaseType[];
}
