import { useMutation, useQuery } from "@tanstack/react-query";
import { AddressForm } from "@/types/addresses";
import { apiRoutes } from "@/lib/api/api.route";
import { AddressDataForm, AddressUpdateRequest } from "@/types/profile/address.type";

/**
 * 配送先住所を取得する
 * @returns
 * @author ヤン
 */
export const useGetShippingAddress = () => {
  return useQuery({
    queryKey: ["shipping-address"],
    queryFn: () => apiRoutes.user.shippingAddresses(),
  });
};

/**
 * 請求先住所を取得する
 * @returns
 * @author ヤン
 */
export const useGetBillingAddress = () => {
  return useQuery({
    queryKey: ["billing-address"],
    queryFn: () => apiRoutes.user.billingAddresses(),
  });
};

/**
 * 配送先住所を更新する
 * @returns
 * @author ヤン
 */
export const useUpdateShippingAddress = () => {
  return useMutation({
    mutationFn: ({
      addressId,
      addressData,
    }: {
      addressId: number;
      addressData: AddressDataForm;
    }) => apiRoutes.user.updateShippingAddress({
      addressId,
      addressData,
    }),
  });
};

export const useUserUpdateShippingAddress = () => {
  return useMutation({
    mutationFn: ({
      addressId,
      addressData,
    }: {
      addressId: number;
      addressData: AddressDataForm;
    }) => {
      const payload: AddressUpdateRequest = {
        addressId,
        addressData
      };
      return apiRoutes.user.updateShippingAddress(payload);
    },
  });
};
/**
 * 配送先住所を登録する
 * @returns
 * @author ヤン
 */
export const useCreateShippingAddress = () => {
  return useMutation({
    mutationFn: ({
      addressData,
    }: {
      addressData: AddressDataForm;
    }) => apiRoutes.user.createShippingAddress({
      addressData
    }),
  });
};

/**
 * 請求先住所を更新する
 * @returns
 * @author ヤン
 */
export const useUpdateBillingAddress = () => {
  return useMutation({
    mutationFn: ({
      addressId,
      addressData,
    }: {
      addressId: number;
      addressData: AddressForm;
    }) => apiRoutes.user.updateBillingAddress({
      addressId,
      addressData: {
        // recipient_first_name: addressData.recipient_first_name || "",
        // recipient_last_name: addressData.recipient_last_name || "",
        recipient_name : addressData.recipient_name || "",
        recipient_phone_number: addressData.recipient_phone_number || "",
        postal_code: addressData.postal_code,
        prefecture: addressData.prefecture,
        city: addressData.city,
        street_address: addressData.street_address,
        building_name: addressData.building_name || "",
        room_number: addressData.room_number || "",
        country: addressData.country,
      },
    }),
  });
};

/**
 * 請求先住所を登録する
 * @returns
 * @author ヤン
 */
export const useCreateBillingAddress = () => {
  return useMutation({
    mutationFn: ({
      addressData,
    }: {
      addressData: AddressForm;
    }) => apiRoutes.user.createBillingAddress({
      addressData: {
        // recipient_first_name: addressData.recipient_first_name || "",
        // recipient_last_name: addressData.recipient_last_name || "",
        recipient_name : addressData.recipient_name || "",
        recipient_phone_number: addressData.recipient_phone_number || "",
        postal_code: addressData.postal_code,
        prefecture: addressData.prefecture,
        city: addressData.city,
        street_address: addressData.street_address,
        building_name: addressData.building_name || "",
        room_number: addressData.room_number || "",
        country: addressData.country,
      },
    }),
  });
};

/**
 * 郵便番号を取得する
 * @returns
 * @author ヤン
 */
export const useAddressByPostcode = () => {
  return useMutation({
    mutationFn: ({ postcode }: { postcode: string }) => apiRoutes.user.postcodeLookup({ postcode }),
  });
};

export const useAddressSearchPostcode = () => {
  return useMutation({
    mutationFn: ({ postcode }: { postcode: string }) => apiRoutes.user.postCodeSearch({ postcode }),
  });
};