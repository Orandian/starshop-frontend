export interface Category {
  category_id: number;
  name: string;
  description: string;
}

export interface CategoryPublic {
  categoryId: number;
  name?: string | null;
  description?: string;
  parentCategoryId?: number | null;
  parentCategoryName?: string | null;
}

export interface CategoryResponse {
  status: string;
  message: string;
  code: number;
  data: CategoryPublic[];
}