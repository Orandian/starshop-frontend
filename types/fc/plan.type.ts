export interface FCPlanResponse {
  status: string;
  message: string;
  code: number;
  data: FCPlan[];
}

export interface FCPlan {
  fcPlanMasterId: number;
  planName: string;
  contractPurchaseAmount: number;
  wholesaleRate: number;
  introIncentive: number;
  displayFlg: number;
  planProducts: FCPlanProduct[];
}

export interface FCPlanProduct {
  fcPlanDefaultProductId: number;
  product: FCProduct;
  quantity: number;
}

export interface FCProduct {
  productId: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  discountSalePrice:number;
  images: FCProductImage[];
  brand: FCBrand;
}

export interface FCProductImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}


export interface FCBrand {
  brandId: number;
  name: string;
  description: string;
  logoUrl: string;
}

export interface FCPlanResponse {
  currentAmount:number;
 remainingAmount: number;
 rankUpDaysLeft:number;
 remainingPercentage:number;
 goalPrice:number;
 currentAmoount:number;
 progressPercentage:number;
}
export interface FCMasterPlan{
    planId:number;
    planName:string;
    contractPurchaseAmount:number;
    isActive:boolean;
} 