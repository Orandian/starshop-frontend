import { apiRoutes } from "@/lib/api/api.route";
import {
  OrderRequest,
  ProductCartPayload
} from "@/types/fc";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllProducts = (brandId: string = "", page: number, pageSize: number) =>
  useQuery({
    queryKey: ["get-all-products", brandId, page, pageSize],
    queryFn: () => apiRoutes.fc.purchase.fcGetAllProducts(brandId || undefined, page, pageSize), // Only pass brandId if it's not empty
  });

export const useGetProductDetails = (id: string) =>
  useQuery({
    queryKey: ["get-product-details", id],
    queryFn: () => apiRoutes.fc.purchase.fcGetProductDetails(id),
    enabled: !!id,
  });

export const useGetCart = () =>
  useQuery({
    queryKey: ["get-cart"],
    queryFn: () => apiRoutes.fc.purchase.fcGetCart(),
  });

export const useAddToCart = () =>
  useMutation({
    mutationKey: ["add-to-cart"],
    mutationFn: (data: ProductCartPayload) =>
      apiRoutes.fc.purchase.fcAddToCart(data),
  });

export const useGetAllBrands = () =>
  useQuery({
    queryKey: ["get-all-brand"],
    queryFn: () => apiRoutes.fc.purchase.fcGetBrands(),
  });


export const useFCPostOrder = () =>
  useMutation({
    mutationKey: ["post-order"],
    mutationFn: (data: OrderRequest) => apiRoutes.fc.purchase.fcPostOrder(data),
  });
