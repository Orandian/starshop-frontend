// Order date array format [year, month, day, hour, minute]
type DateArray = [number, number, number, number, number];

export interface SupplierOrder {
  supplierOrderId: number;
  orderDate: DateArray;

  brandId: number;
  brandName: string;
  productId: number;
  productName: string;

  purchasePrice: number;
  quantity: number;
  subTotal: number;
  totalTax: number;
  totalPrice: number;
  status: number; // Note: API returns number, not string
}

export interface SupplierOrderResponse {
  data: SupplierOrder[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
  extra: null;
}


export interface InventroyProduct {
  productId: number;
  productName: string;
  brandName: string;
  safeStockQuantity: number;
  stockQuantity: number;
  orderCount: number;
}

export interface InventoryProductResponse {
  data: InventroyProduct[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
  extra: null;
}

export interface SupplierBrand {
  brandId: number;
  name: string;
  isActive: boolean;
  isFcShow: boolean;
  manufacturerCompany: string | null;
  distributionCompany: string | null;
  createdAt: DateArray | null;
  updatedAt: DateArray;
}

export interface ProductListByBrand {
  productId: number;
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
      updatedAt: null;
    } | null;
    createdAt: null;
    updatedAt: null;
  };
  brand: {
    brandId: number;
    name: string;
    isActive: boolean;
    isFcShow: boolean;
    manufacturerCompany: string | null;
    distributionCompany: string | null;
    createdAt: DateArray;
    updatedAt: DateArray;
  };
  productCode: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  subscriptDiscountSalePrice: number;
  subscriptDiscountPercent: number;
  stockQuantity: number;
  safeStockQuantity: number;
  tax: number;
  status: number;
  createdAt: DateArray | [number, number, number, number, number]; // Different formats in data
  updatedAt: DateArray;
  deletedAt: null;
  shippingFee: number;
  images: {
    imageId: number;
    imageUrl: string;
    imageOrder: number;
    createdAt: DateArray;
    updatedAt: DateArray;
  }[];
}


export interface CreateSupplierRequest  {
    orderDate: string,
    brandId: number,
    productId: number,
    purchasePrice: number,
    totalPrice: number,
    subTotal: number,
    quantity: number,
    totalTax: number,
    status: number
}


 export interface UpdateSupplierRequest  {
    purchasePrice: number,
    totalPrice: number,
    subTotal: number,
    quantity: number,
    totalTax: number,
    status: number
}

export interface UpdateStockRequest {
  quantity:number
  safeStockQuantity:number
}

export interface ExportToCSVFilters {
  brandName?: string;
  productName?: string;
  safeStockQuantity?: string;
  status?: string;
}