import { useMutation } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api.route";

/**
 * Use upload files
 * @param args - Upload files args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUploadFiles({ files, productId });
 * @author ヤン
 */
export const useUploadFiles = (initialCount?: number) => {
  return useMutation({
    mutationFn: async ({
      files,
      productId,
    }: {
      files: File[];
      productId: number;
    }) => {
      initialCount = initialCount || 0;
      return apiRoutes.admin.product.uploadProductImages({ files, productId, initialCount });
    },
  });
};

/**
 * Use delete files
 * @param args - Delete files args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteFiles({ productId, imageUrls });
 * @author ヤン
 */
export const useDeleteFiles = () => {
  return useMutation({
    mutationFn: async ({ productId, imageUrls }: { productId: number; imageUrls: string[] }) => {
      return apiRoutes.admin.product.deleteProductImages({ productId, imageUrls });
    },
  });
};

/**
 * Use delete image records
 * @param args - Delete image records args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteImageRecords({ productId, imageUrls });
 * @author ヤン
 */
export const useDeleteImageRecords = () => {
  return useMutation({
    mutationFn: async ({ productId, imageUrls }: { productId: number, imageUrls: string[] }) => {
      return apiRoutes.admin.product.deleteProductImages({ productId, imageUrls });
    },
  });
};

/**
 * Use save image order
 * @param args - Save image order args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useSaveImageOrder({ productId, images });
 * @author ヤン
 */
export const useSaveImageOrder = () => {
  return useMutation({
    mutationFn: async ({ productId, images }: { productId: number, images: { imageUrl: string; imageOrder: number }[] }) => {
      return apiRoutes.admin.product.updateImageOrder({ productId, images });
    },
  });
};


  

