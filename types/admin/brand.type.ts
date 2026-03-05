export interface Brand {
  brandId: number;
  name: string;
  isActive: boolean;
  isFcShow: boolean;
  createdAt: string;
  distributionCompany:string;
  manufacturerCompany:string;
  updated_at: string;
  productCount: number;
}

export interface BrandList {
  brand_id: number;
  name: string;
}

export interface BrandStatus {
  brand_id: string | number;
  is_active: boolean;
}

export interface BrandResponse {
  status: string;
  message: string;
  code: number;
  data: Brand[];
  pagination: Pagination;
}

export interface BrandPayload {
  name: string;
  isFcShow: boolean;
  manufacturerCompany:string;
  distributionCompany:string;
}

export interface BrandUpdatePayload {
  name: string;
  isFcShow: boolean;
  manufacturerCompany:string;
  distributionCompany:string;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}