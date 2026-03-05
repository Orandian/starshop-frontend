import { adminRoutes } from "@/lib/api/routes/admin.route";
import {
  AdminDeliveryPayload,
  AdminMailCreateRequest,
  AdminMailUpdateRequest,
  AdminShippingCostRequest,
  AdminUpdateUserRequest,
} from "@/types/admin/setting.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllUsers = (page: number, size: number) =>
  useQuery({
    queryKey: ["all-users-admin", { page, size }],
    queryFn: () => adminRoutes.setting.adminGetAllUsers(page, size),
  });

export const useUpdateUser = () =>
  useMutation({
    mutationKey: ["update-user-admin"],
    mutationFn: ({ id, data }: { id: number; data: AdminUpdateUserRequest }) =>
      adminRoutes.setting.adminUpdateUsers(id, data),
  });

export const useGetAllMail = (page:number,size:number) =>
  useQuery({
    queryKey: ["all-mail-admin",{page,size}],
    queryFn: () => adminRoutes.setting.adminGetAllMail(page,size),
  });

export const useCreateMail = () =>
  useMutation({
    mutationKey: ["create-admin-mail"],
    mutationFn: (data: AdminMailCreateRequest) =>
      adminRoutes.setting.adminCreateMail(data),
  });

export const useGetMailDetails = (id: string) =>
  useQuery({
    queryKey: ["get-mail-detail"],
    queryFn: () => adminRoutes.setting.adminGetMailDetails(id),
    enabled: !!id,
  });

export const useUpdateMail = () =>
  useMutation({
    mutationKey: ["update-mail-details"],
    mutationFn: ({ id, data }: { id: string; data: AdminMailUpdateRequest }) =>
      adminRoutes.setting.adminUpdateMail(id, data),
  });

export const useGetAllDelivery = () =>
  useQuery({
    queryKey: ["all-delivery-admin"],
    queryFn: () => adminRoutes.setting.adminGetAllDelivery(),
  });

export const useUpdateDelivery = () =>
  useMutation({
    mutationKey: ["update-delivery-admin"],
    mutationFn: ({ id, data }: { id: number; data: AdminDeliveryPayload }) =>
      adminRoutes.setting.adminUpdateDelivery(id, data),
  });

export const useCreateUser = () =>
  useMutation({
    mutationKey: ["create-user-admin"],
    mutationFn: (data: AdminUpdateUserRequest) =>
      adminRoutes.setting.adminCreateUsers(data),
  });

export const useGetUserDetails = (id: number) =>
  useQuery({
    queryKey: ["get-user-detail"],
    queryFn: () => adminRoutes.setting.adminGetUserDetails(id),
    enabled: !!id,
  });


export const useGetContactUs = (page:number,size:number) =>
  useQuery({
    queryKey: ["get-all-contact-us",page,size],
    queryFn: () => adminRoutes.setting.adminContactUs(page,size),
  });



  export const useGetAllShippingCost = (params:{prefecture?:string}) => useQuery({
    queryKey:["get-all-shipping-cost",params],
    queryFn:()=>adminRoutes.setting.adminGetAllShipping(params),
  })

  export const useUpdateShippingCost = () => useMutation({
    mutationKey:["update-shipping-cost"],
    mutationFn:(data:AdminShippingCostRequest[])=>adminRoutes.setting.adminUpdateShippingCost(data),
  })