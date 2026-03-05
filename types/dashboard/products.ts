export interface Product {
  rank?: number;
  productId: number;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
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
  shippingFee: number;
  barcode: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  deletedAt: string | null;
  images: ProductImage[];
  recommendProducts?: number[]; // Array of recommended product IDs
  ranking: number | null;
  isNewArrival: boolean | null;
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}

export interface Pagination {
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
}

export interface ProductListData {
  data: Product[];
  pagination?: Pagination;
}

export interface ProductListResponse {
  status: number;
  message: string;
  data: ProductListData;
}

export interface NewArrivalProductListResponse {
  data: Product[];
  status: number;
  message: string;
}

export interface NewRankingProductListResponse {
  data: Product[];
  status: number;
  message: string;
}

export interface ProductDetailsResponse {
  data?: Product;
  status: number;
  message: string;
}

export interface CreateProduct {
  categoryId: number;
  brandId: number;
  productCode: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  subscriptDiscountSalePrice: number;
  subscriptDiscountPercent: number;
  tax: number;
  status: number;
  barcode: string;
}

export interface CreateProductRequest {
  product: CreateProduct;
  recommendProducts: number[];
}

export interface CreateProductResponse {
  status: number;
  message: string;
  data: Product;
}

// Product Image Types
export interface ProductImageData {
  imageUrl: string;
  imageOrder: number;
}

export interface SaveProductImagesRequest {
  images: ProductImageData[];
}

export interface SavedProductImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaveProductImagesResponse {
  status: number;
  message: string;
  data: SavedProductImage[];
}

// Update Product Types
export interface UpdateProductRequest {
  categoryId?: number;
  brandId?: number;
  productCode?: string;
  name?: string;
  description?: string;
  originalPrice?: number;
  salePrice?: number;
  subscriptDiscountSalePrice?: number;
  subscriptDiscountPercent?: number;
  stockQuantity?: number;
  safeStockQuantity?: number;
  tax?: number;
  status?: number;
  shippingFee?: number;
  barcode?: string;
}

export interface UpdateProductResponse {
  status: number;
  message: string;
  data: Product;
}

// Recommend Products Response
import type { Product as PublicProduct } from "@/types/products";

export interface RecommendProductsResponse {
  status: number;
  message: string;
  data: PublicProduct[];
}

export interface ChangeProductStatusRequest {
  status: boolean;
}

export interface ChangeProductStatusResponse {
  status: number;
  message: string;
  data: Product;
}

export interface AdminProfitResponse {
  status: number;
  message: string;
  data: {
    totalProfit: number;
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
  };
}

// Member Bonus Product Data
export interface MemberBonusProduct {
  productId: number;
  productName: string;
  brandName: string;
  averageBuyPrice: number;
  averageSalePrice: number;
  totalSaleCount: number;
  totalBonus: number;
}

// Pagination Info
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// Member Bonus Response
export interface MemberBonusResponse {
  data: MemberBonusProduct[];
  pagination: PaginationInfo;
  extra: null;
}

export type AdminProfitPeriodResponse = string;
