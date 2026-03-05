export type FCPlanResponse = FCPlan[];

export interface FCPlan {
  id: number;
  name: string;
}

export type FCPlanMasterResponse = FCPlanMaster[];

export interface FCPlanMaster {
  planId: number;
  planName: string;
  contractPurchaseAmount: number;
  introIncentive: number;
  wholesaleRate: number;
  isActive: boolean;
}

export interface UpdatePlanStatus {
  plan_id: string | number;
  status: boolean;
}

export interface UpdatePlanStatusResponse {
  status: string;
  message: string;
  code: string;
}

export interface UpdateFcPlan {
  planId:number;
  name: string;
  contractPurchaseAmount: number;
  introIncentive: number;
  wholesaleRate: number;
}


export interface Product {
  productId: number;
  productCode: string | null;
  name: string;
  description: string | null;
  originalPrice: number | null;
  salePrice: number;
  subscriptDiscountSalePrice: number | null;
  subscriptDiscountPercent: number | null;
  discountSalePrice: number | null;
  safeStockQuantity: number | null;
  stockQuantity: number;
  status: number | null;
  tax: number | null;
  shippingFee: number | null;
  category: {
    categoryId: number;
    name: string;
    description: string;
    parentCategory: {
      categoryId: number;
      name: string;
      description: string;
      parentCategory: null;
      createdAt: null;
      updatedAt: [number, number, number, number, number, number, number];
    } | null;
    createdAt: null | [number, number, number, number, number, number, number];
    updatedAt: null | [number, number, number, number, number, number, number];
  } | null;
  brand: {
    brandId: number;
    name: string;
    isActive: boolean;
    isFcShow: boolean;
    createdAt: null | [number, number, number, number, number, number, number];
    updatedAt: [number, number, number, number, number, number, number] | null;
  } | null;
  images: ProductImage[] | null;
  createdAt: null;
  updatedAt: null;
  totalSold: number | null;
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
}

export type AllFcPlanProduct = Product[];

// If you still need the simplified version for specific use cases
export interface AllFcPlanProductAllFcPlanProduct {
  id: number;
  name: string;
  quantity: number;
}

export interface FCMasterPlanWithProducts {
  fcPlanMasterId: number;
  wholesaleRate: number;
  planName: string;
  planProducts: Product[];
}

export interface FCMasterPlanWithSimplifiedProducts {
  fcPlanMasterId: number;
  wholesaleRate: number;
  planName: string;
  planProducts: {
    productId: number;
    quantity: number;
  }[];
}

export interface UpdateFCPlanProduct {
  fcPlanMasters: {
    fcPlanMasterId: number;
    products: {
      productId: number;
      quantity: number;
    }[];
  }[];
}

export interface FCUserWithPlanResponse {
  userId: number;
  role: number;
   userName: string;
   currentPlan: string;
   currentPlanId: number;
   contractStartDate: number[];
   rankUpExpirationDate: number[];
   totalPurchaseAmount: number;
   targetAmount: number;
   remainingBalance: number;
   lastPurchaseDate: number[];
   targetAchievementMonth: number[];
   goldPlanStartMonth: number[];
}

export interface FcUserWithPlanResponsePagination {
  data: FCUserWithPlanResponse[];
  pagination: Pagination;
}
  
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}