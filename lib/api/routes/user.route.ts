import {
  UserPasswordChangeRequest,
  UserPasswordChangeResponse,
  UserProfileResponse,
  UserProfileUpdateRequest,
} from "@/types/profile/profile.type";
import { api } from "../api.gateway";
import { OrderListResponse } from "@/types/profile/ordersummary.type";
import {
  ShippingAddressResponse,
  AddressUpdateRequest,
  AddressCreateRequest,
  PostcodeLookupRequest,
  PostcodeLookupResponse,
  PostcodeResponse,
} from "@/types/profile/address.type";
import { PurchaseTypesResponse } from "@/types/purchases";
import {
  AddToCardResponse,
  CartGetResponse,
  PaymentSuccessResponse,
} from "@/types/cart/cardtype";
import {
  UserCheckoutIntentRequest,
  UserCheckoutIntentResponse,
} from "@/types/cart";
import { OrderDetail } from "@/types/orders";
import { CustomerDetail } from "@/types/customers";
import { userInvoiceResponse } from "@/types/admin/invoice.type";
import { Photo, putObjects } from "../aws/putObjects";
import { InvoiceIdResponse } from "@/types/fc";

export const userRoutes = {
  userProfile: () => api.get<UserProfileResponse>(`/user/profile`),
  userProfileUpdate: (param: UserProfileUpdateRequest) =>
    api.patch<UserProfileUpdateRequest, UserProfileResponse>(
      `/user/profile`,
      param,
    ),
  userProfilePasswordChange: (param: UserPasswordChangeRequest) =>
    api.patch<UserPasswordChangeRequest, UserPasswordChangeResponse>(
      `/user/profile/password`,
      param,
    ),

  userOrderSummary: (
    page: number,
    pageSize: number,
    orderDate: string,
    status: string,
  ) =>
    api.get<OrderListResponse>("/user/orders/summary", {
      params: { page, pageSize, orderDate, status },
    }),
  useOrderReceipt: (orderId: string) =>
    api.get<userInvoiceResponse>(`/user/receipt/${orderId}`),
  userOrderDetails: (orderId: number) =>
    api.get<OrderDetail>(`/user/orders/${orderId}`),
  userCancelOrder: (orderId: number, notes: string) =>
    api.put(`/user/orders/${orderId}/cancel`, { notes }),
  userSubscriptionSummary: (page: number, pageSize: number) =>
    api.get<OrderListResponse>("/user/subscriptions/summary", {
      params: { page, pageSize },
    }),
  // Address endpoints
  shippingAddresses: () =>
    api.get<ShippingAddressResponse[]>(`/user/addresses/shipping`),
  billingAddresses: () =>
    api.get<ShippingAddressResponse[]>(`/user/addresses/billing`),
  createShippingAddress: (data: AddressCreateRequest) =>
    api.post<AddressCreateRequest, ShippingAddressResponse>(
      `/user/addresses/shipping`,
      data,
    ),
  createBillingAddress: (data: AddressCreateRequest) =>
    api.post<AddressCreateRequest, ShippingAddressResponse>(
      `/user/addresses/billing`,
      data,
    ),
  updateShippingAddress: (data: AddressUpdateRequest) =>
    api.put<AddressUpdateRequest, ShippingAddressResponse>(
      `/user/addresses/shipping`,
      data,
    ),
  updateBillingAddress: (data: AddressUpdateRequest) =>
    api.put<AddressUpdateRequest, ShippingAddressResponse>(
      `/user/addresses/billing`,
      data,
    ),
  // Purchase types
  purchaseTypes: () => api.get<PurchaseTypesResponse>(`/user/purchases/types`),
  // Postcode lookup
  postcodeLookup: (data: PostcodeLookupRequest) =>
    api.post<PostcodeLookupRequest, PostcodeLookupResponse>(
      `/user/addresses/postcode`,
      data,
    ),

  postCodeSearch: (data: PostcodeLookupRequest) =>
    api.post<PostcodeLookupRequest, PostcodeResponse>(
      `/user/addresses/postcode`,
      data,
    ),

  //Cart endpoints
  addToCart: (productId: number, quantity: number) =>
    api.post<{ productId: number; quantity: number }, AddToCardResponse>(
      `/user/cart/add`,
      { productId, quantity },
    ),
  // Added 'city' as an optional parameter
  getCartItems: (city?: string) =>
    api.get<CartGetResponse>(`/user/cart/items`, {
      params: { city: city === "" ? undefined : city },
    }),
  // getCartItems: () => api.get<CartGetResponse>(`/user/cart/items`),
  updateCartItems: (productId: number, quantity: number, cartItemId: number) =>
    api.put<
      { productId: number; quantity: number; cartItemId: number },
      AddToCardResponse
    >(`/user/cart/update-item`, { productId, quantity, cartItemId }),
  deleteCartItems: (cartItemId: number) =>
    api.delete<{ cartItemId: number }>(`/user/cart/remove/${cartItemId}`),
  //Checkout endpoints

  paymentSuccess: (sessionId: string) =>
    api.post<{ sessionId: string }, PaymentSuccessResponse>(
      `/user/payment-success`,
      { sessionId },
    ),

  userCheckIntent: (payload: UserCheckoutIntentRequest) =>
    api.post<UserCheckoutIntentRequest, UserCheckoutIntentResponse>(
      "/user/checkout-intent-user",
      payload,
    ),

  getUserById: (customerId: string | number) =>
    api.get<CustomerDetail>(`/user/${customerId}`),

  //userUploadPdf api
  userUploadPdf: async (pdfBlob: Blob | false, fileName: string) => {
    if (!pdfBlob) throw new Error("No PDF blob provided");

    // Convert Blob to File
    const file = new File([pdfBlob], fileName, {
      type: "application/pdf",
    });

    // Wrap in Photo format expected by putObjects
    const photo: Photo = {
      id: Date.now(),
      file: file,
      imgUrl: "",
    };

    return await putObjects("file/receipt", [photo]);
  },

  //fetch pre-receiptNum api
  userPreReceiptId: () => api.get<InvoiceIdResponse>(`/user/pre-reciept-id`),
};
