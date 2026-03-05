// fcMemberTree.type.ts


export interface ProductImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}

export interface Brand {
  name:string;
  brandId: number;
  brandName: string;
  brandLogo?: string;
  description?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  parentCategoryId?: number;
  parentCategory?: {
    categoryId: number;
    categoryName: string;
  };
}

export interface Product {
  productId: number;
  productCode: string;
  description: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  subscriptDiscountSalePrice: number;
  subscriptDiscountPercent: number;
  stockQuantity: number;
  safeStockQuantity: number;
  tax: number;
  discountSalePrice:number;
  status: number;
  shippingFee: number;
  totalSold: number;
  images: ProductImage[];
  brand: Brand;
  category: Category[];
}
