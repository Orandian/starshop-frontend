import { useMutation, useQuery } from "@tanstack/react-query";
import { adminRoutes } from "@/lib/api/routes/admin.route";
import {
  CreateSupplierRequest,
  ExportToCSVFilters,
  UpdateStockRequest,
  UpdateSupplierRequest,
} from "@/types/admin/inventory.type";

export const useGetAllSupplier = (
  page: number, 
  size: number, 
  filters?: {
    brandName?: string;
    productName?: string;
    status?: string;
  }
) =>
  useQuery({
    queryKey: ["inventory-get-all-supplier", { page, size, filters }],
    queryFn: () => adminRoutes.inventory.getAllSupplier(page, size, filters),
  });

export const useGetAllBrands = () =>
  useQuery({
    queryKey: ["inventory-get-all-brands"],
    queryFn: () => adminRoutes.inventory.getAllBrands(),
  });
export const useGetProductList = (
  page: number, 
  size: number, 
  filters?: {
    brandName?: string;
    productName?: string;
    safeStockQuantity?: string;
    status?: string;
  }
) =>
  useQuery({
    queryKey: ["inventory-get-product-list", { page, size, filters }],
    queryFn: () => adminRoutes.inventory.getProductList(page, size, filters),
  });

// export const useGetSupplierById = (id: number) =>
//   useQuery({
//     queryKey: ["inventory-get-supplier-by-id", id],
//     queryFn: () => adminRoutes.inventory.getSupplierById(id),
//     enabled: !!id,
//   });

export const useGetProductById = (id: number) =>
  useQuery({
    queryKey: ["inventory-get-product-by-id", id],
    queryFn: () => adminRoutes.inventory.getProductById(id),
    enabled: !!id,
  });

export const useCreateSupplierOrder = () =>
  useMutation({
    mutationKey: ["inventory-create-supplier-order"],
    mutationFn: (data: CreateSupplierRequest) =>
      adminRoutes.inventory.createSupplierOrder(data),
  });

export const useUpdateSupplierOrder = () =>
  useMutation({
    mutationKey: ["inventory-update-supplier-order"],
    mutationFn: ({ id, data }: { id: number; data: UpdateSupplierRequest }) =>
      adminRoutes.inventory.updateSupplierOrder(id, data),
  });

export const useUpdateProductQty = () =>
  useMutation({
    mutationKey: ["inventory-update-product-qty"],
    mutationFn: ({id,data}:{id: number, data: UpdateStockRequest}) =>
      adminRoutes.inventory.updateProductQty(id, data),
  });


  export const useExportToCSVSupplier = (filters: ExportToCSVFilters ) => {
    return useMutation<Blob | unknown, Error, void>({
      mutationFn: async () => {
        const response = await adminRoutes.inventory.exportToCSVSupplier(filters);
        return response;
      },
    });
  };

    export const useExportToCSVInventory = (filters: ExportToCSVFilters ) => {
    return useMutation<Blob | unknown, Error, void>({
      mutationFn: async () => {
        const response = await adminRoutes.inventory.exportToCSVInventory(filters);
        return response;
      },
    });
  };