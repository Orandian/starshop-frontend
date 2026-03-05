import { apiRoutes } from "@/lib/api/api.route";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoryPayload } from "@/types/admin/category.type";

/**
 * Use category list
 * @param page - Page number
 * @param pageSize - Page size
 * @param name - Category name
 * @param status - Category status
 * @returns
 * @example
 * const { data, isLoading, error } = useCategoryList(page, pageSize, name, status);
 * @author ヤン
 */
export const useCategoryList = (
  page: number = 1,
  pageSize: number = 10,
  isActive: string = "",
  parentId: string = ""
) => {
  return useQuery({
    queryKey: ["categories", page, pageSize, isActive, parentId],
    queryFn: () =>
      apiRoutes.admin.category.getCategories(page, pageSize, isActive, parentId),
  });
};

/**
 * Use category by id
 * @param categoryId - Category id
 * @returns
 * @example
 * const { data, isLoading, error } = useCategoryById(categoryId);
 * @author ヤン
 */
export const useCategoryById = (categoryId: number) => {
  return useQuery({
    queryKey: ["categoryById", categoryId],
    queryFn: () => apiRoutes.admin.category.getCategoryById(categoryId),
    select: (data) => data.data,
    enabled: !!categoryId,
  });
};

/**
 * Use change category status
 * @param categoryId - Category id
 * @param status - Category status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeCategoryStatus(categoryId, status);
 * @author ヤン
 */
export const useChangeCategoryStatus = () => {
  return useMutation({
    mutationKey: ["change-category-status"],
    mutationFn: ({ categoryId, status }: { categoryId: number; status: boolean }) => 
      apiRoutes.admin.category.updateCategoryStatus(categoryId, status),
  });
};

/**
 * Use create category
 * @param category - Category
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateCategory(category);
 * @author ヤン
 */
export const useCreateCategory = () => {
  return useMutation({
    mutationKey: ["create-category"],
    mutationFn: (data: CategoryPayload) => apiRoutes.admin.category.createCategory(data),
  });
};

/**
 * Use parent categories only
 * @returns
 * @example
 * const { data, isLoading, error } = useParentCategories();
 * @author ヤン
 */
export const useParentCategories = () => {
  return useQuery({
    queryKey: ["parent-categories"],
    queryFn: () => apiRoutes.admin.category.getParentCategories(),
  });
};

/**
 * Use update category
 * @param category - Category
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateCategory(category);
 * @author ヤン
 */
export const useUpdateCategory = () => {
  return useMutation({
    mutationKey: ["update-category"],
    mutationFn: (category: {
      name: string;
      description: string;
      categoryId: number;
      parentCategoryId?: number | null;
      isActive?: boolean;
    }) => apiRoutes.admin.category.updateCategory(category.categoryId, category),
  });
};

/**
 * Use delete category
 * @param categoryId - Category id
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteCategory(categoryId);
 * @author ヤン
 */
export const useDeleteCategory = () => {
  return useMutation({
    mutationKey: ["delete-category"],
    mutationFn: (categoryId: number) => apiRoutes.admin.category.deleteCategory(categoryId),
  });
};
