export interface Category {
  category_id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryItem {
  categoryId: number;
  name: string;
  description: string;
  isActive: boolean;
  parentCategoryId?: number | null;
  parentCategoryName?: string | null;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt?: [number, number, number, number, number, number, number] | null;
}

export interface CategoryResponse {
  status: string;
  message: string;
  code: number;
  data: CategoryItem[];
  pagination: Pagination;
}

export interface CategoryPayload {
  name: string;
  description: string;
  parentCategoryId?: number | null;
  isActive?: boolean;
}

export interface CategoryStatus {
  isActive: boolean;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

