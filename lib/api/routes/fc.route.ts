import { api } from "@/lib/api/api.gateway";
import { CategoryResponse } from "@/types/categories";
import { CustomerInvoice } from "@/types/customers";
import {
  NewArrivalProductListResponse,
  NewRankingProductListResponse,
  ProductDetailsResponse,
  ProductListResponse,
} from "@/types/dashboard/products";
import { FAQResponse } from "@/types/faqs";
import {
  AccountRegister,
  AccountVerify,
  AccountVerifyResponse,
  AddToCartResponse,
  BrandResponse,
  CartItem,
  EmptyResponse,
  FCCheckoutIntentRequest,
  FCCheckoutIntentResponse,
  FCRegister,
  FCStepRequest,
  FCSubscriptionPaymentSuccessRequest,
  FCSubscriptionPaymentSuccessResponse,
  FcSaveSubscriptionRequest,
  FcSaveSubscriptionResponse,
  FcSubscriptionIntent,
  Login,
  LoginResponse,
  NewsResponse,
  OrderPostResponse,
  OrderRequest,
  Product,
  ProductCartPayload,
  PurchaseResponse,
} from "@/types/fc";
import {
  BonusPeriodList,
  BonusTransactionList,
  BonusTransactionListResponse,
} from "@/types/fc/bonus.type";
import { DocumentResponse } from "@/types/fc/document.type";
import { ImageData } from "@/types/fc/file.type";
import {
  InvoiceIdResponse,
  Order,
  OrderItem,
  OrderPeriodList,
  OrderResponse,
} from "@/types/fc/order.type";
import { FCMasterPlan, FCPlanResponse } from "@/types/fc/plan.type";
import { TeamLevelData, TeamList, TeamPeriodData } from "@/types/fc/team.type";
import {
  UserAddressApiResponse,
  UserAddressRequest,
  UserAddressUpdate,
  UserBankUpdate,
  UserDetail,
  UserDetailUpdate,
  UserProfile1Update,
  UserProfile2Update,
} from "@/types/fc/user.type";
import { Photo, putObjects } from "../aws/putObjects";
import { CalculateShippingCost, FcSettingData } from "@/types/fc/setting.type";

/**
 * Authentication API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const authAPI = {
  //Auth

  login: (userData: Login) =>
    api.post<Login, LoginResponse>("/login", userData),
};

/**
 * Register API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const registerAPI = {
  // Account Register with mail
  accountRegister: (userData: AccountRegister) =>
    api.post<AccountRegister, EmptyResponse>("/register", userData),

  // Account Verify with otp and data
  accountVerify: (userData: AccountVerify) =>
    api.post<AccountVerify, AccountVerifyResponse>(
      "/pub/fc/auth/register",
      userData,
    ),

  // FC Account Register with data
  fcRegister: (userData: FCRegister) =>
    api.put<FCRegister, EmptyResponse>("/fc/auth/register", userData),

  // FC Plan
  fcPlan: () => api.get<FCPlanResponse>("/fc/plan"),

  //FC Step
  fcStep: (step: number) =>
    api.put<FCStepRequest, UserDetail>(`/fc/auth/step/${step}`),

  //FC Get Address with postal code
  fcGetAddress: (data: UserAddressRequest) =>
    api.post<UserAddressRequest, UserAddressApiResponse>(
      `/pub/auth/addresses/postcode`,
      data,
    ),

  //FC Upload Image
  fcUploadSignature: (path: { signPath: string }) =>
    api.put(`fc/auth/user-sign`, path),


  fcCheckUserExists: (id:number) => api.get<boolean>(`/check-user-exists/${id}`),
};

/**
 * Home API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const HomePublicAPI = {
  // Home Public
  products: (brandId: string) =>
    api.get<ProductListResponse>(`/api/v1/pub/products`, {
      params: { brandId: brandId === "all" ? undefined : brandId },
    }),
  newArrivalProducts: () =>
    api.get<NewArrivalProductListResponse>("/api/v1/pub/products/new-arrivals"),

  productDetail: (id: number) =>
    api.get<ProductDetailsResponse>(`/api/v1/pub/products/${id}`), // id: product_id
  productRankings: () =>
    api.get<NewRankingProductListResponse>("/api/v1/pub/products/ranking"),
  category: () => api.get<CategoryResponse>(`/api/v1/pub/categories`), // id: product_id

  faqs: () => api.get<FAQResponse>("/api/v1/pub/faqs"),
};

/**
 * Purchase API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const purchaseAPI = {
  // FC Get All Products
  fcGetAllProducts: (brandId: string = "", page: number, size: number) =>
    api.get<PurchaseResponse>("/fc/product", {
      params: { brandId, page, size },
    }),

  //Get Product Details
  fcGetProductDetails: (id: string) => api.get<Product>(`/fc/product/${id}`),

  //Add To Cart
  fcAddToCart: (data: ProductCartPayload) =>
    api.post<ProductCartPayload, AddToCartResponse>(
      `/fc/product/add-to-cart`,
      data,
    ),

  //Get Cart
  fcGetCart: () => api.get<CartItem[]>(`/fc/product/cart`),

  //Get All Brand
  fcGetBrands: () => api.get<BrandResponse[]>("/fc/product/brands"),

  //Post Order
  fcPostOrder: (data: OrderRequest) =>
    api.post<OrderRequest, OrderPostResponse>("/fc/order", data),
};

/**
 * Team API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const teamAPI = {
  // Team
  fcGetTeamList: () => api.get<TeamList>(`/fc/team`),

  //Team List by Level
  fcGetTeamListByLevel: (date?: string | null) => {
    const params = new URLSearchParams({
      ...(date && { date }),
    });
    return api.get<TeamLevelData[]>(
      `/fc/team/list/${date || "all"}?${params.toString()}`,
    );
  },

  fcGetTeamPeriodList: () => api.get<TeamPeriodData[]>(`/fc/team/period`),
};

/**
 * Bonus API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const bonusAPI = {
  // Bonus
  fcGetBonusPeriodList: () => api.get<BonusPeriodList>(`/fc/bonus/period-list`),
  fcGetBonusTransactionList: (
    invoiceYearMonth: string | null,
    page: number,
    size: number,
    filters: Record<string, number> = {},
  ) =>
    api.get<BonusTransactionListResponse>(
      `/fc/bonus/period/${invoiceYearMonth}`,
      { params: { page, size, ...filters } },
    ),
  fcGetTotalBonusAmount: (invoiceYearMonth: string | null) =>
    api.get<BonusTransactionList>(
      `/fc/bonus/get-total-bonus/${invoiceYearMonth}`,
    ),
  fcGetInvoiceData: (invoiceYearMonth: string | null) =>
    api.get<CustomerInvoice>(`/fc/bonus/invoice-data`, {
      params: { invoiceDate: invoiceYearMonth },
    }),
};

/**
 * Document API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const documentAPI = {
  // Document

  fcGetDocumentList: (page: number, size: number) =>
    api.get<DocumentResponse>(`/fc/doc/all`, { params: { page, size } }),
};

/**
 * Order API
 * @author Linn Ko Ko
 * @created 2025-11-23
 * @updated ****-**-**
 */
const orderAPI = {
  // FC Get Orders
  fcGetOrders: (
    page: number,
    size: number,
    filters?: {
      search?: string;
      orderDate?: string;
      status?: number;
    },
    date?: string | null,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.orderDate && { orderDate: filters.orderDate }),
      ...(filters?.status && { status: filters.status.toString() }),
    });
    return api.get<OrderResponse>(
      `/fc/order/user/${date || "all"}?${params.toString()}`,
    );
  },
  // FC Get Order Items
  fcGetOrderItems: (id: number) => api.get<OrderItem[]>(`/fc/order/${id}`),

  fcRemoveOrderItem: (id: number) => api.delete(`/fc/product/cart/${id}`),

  fcOrderPeroidLists: () => api.get<OrderPeriodList[]>(`/fc/order/period-list`),

  fcGetAllOrderAmount: () => api.get<number>(`/fc/order/all-order-amount`),

  //fcUploadPdf api
  fcUploadPdf: async (pdfBlob: Blob | false, fileName: string) => {
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

    return await putObjects("file/invoice", [photo]);
  },

  //fetch pre-invoiceNum api
  fcPreInvoiceId: () => api.get<InvoiceIdResponse>(`fc/order/pre-invoice-id`),
};

/**
 * User API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated 2025-11-13
 */
const userAPI = {
  // User Detail
  userDetail: () => api.get<UserDetail>(`/fc/auth/detail`),

  // User Detail By Id
  userDetailById: (id: string) => api.get<UserDetail>(`/fc/auth/detail/${id}`),

  // User Detail Update
  userDetailUpdate: (data: UserDetailUpdate) =>
    api.put<UserDetailUpdate, EmptyResponse>("/fc/auth/register/update", data),

  //User Profile 1 Update
  userProfile1Update: (data: UserProfile1Update) =>
    api.put<UserProfile1Update, EmptyResponse>("/fc/auth/profile1", data),

  //User Profile 2 Update
  userProfile2Update: (data: UserProfile2Update) =>
    api.put<UserProfile2Update, EmptyResponse>("/fc/auth/profile2", data),

  //User Address Update (deli/billing)
  userAddressUpdate: (data: UserAddressUpdate) =>
    api.put<UserAddressUpdate, EmptyResponse>("/fc/auth/profile3", data),

  //User Bank Update
  userBankUpdate: (data: UserBankUpdate) =>
    api.put<UserBankUpdate, EmptyResponse>("/fc/auth/profile-bank", data),

  //Upload Profile
  uploadProfile: (url: { userPhoto: string }) =>
    api.put(`fc/auth/user-image`, url),
};

/**
 * Product API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const productAPI = {
  // FC product Popular Products
  fcGetPopularProducts: () => api.get<Product[]>("/fc/product/popular"),
};

/**
 * File Upload API
 * @author Paing Sett Kyaw
 * @created 2025-11-27
 * @updates ****-**-**
 */

const fileUploadAPI = {
  // File Upload
  fcUploadSignature: async (signPath: string) => {
    // Upload files to S3
    // const photos: Photo[] = files.map((file) => ({
    //   id: Date.now() + Math.random(),
    //   file: file,
    //   imgUrl: "",
    // }));

    // const uploadedPhotos = await putObjects(`fc/signatures`, photos);
    // const imageData: ImageData[] = uploadedPhotos.map((photo, index) => ({
    //   imageUrl: photo.imgUrl,
    //   imageOrder: index,
    // }));
    return api.patch(`/fc/auth/user-sign`, { signPath });
  },

  fcUploadProfile: async (files: File[]) => {
    const photos: Photo[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      imgUrl: "",
    }));

    const uploadedPhotos = await putObjects(`fc/profile`, photos);
    const imageData: ImageData[] = uploadedPhotos.map((photo, index) => ({
      imageUrl: photo.imgUrl,
      imageOrder: index,
    }));
    return api.patch(`/fc/auth/user-image`, {
      userPhoto: imageData[0].imageUrl,
    });
  },
};

/**
 * File Upload API
 * @author Paing Sett Kyaw
 * @created 2025-11-27
 * @updates ****-**-**
 */

const planStatusAPI = {
  //Get Gurrent Plan Status
  fcGetPlanStatus: () => api.get<FCPlanResponse>("/fc/order/plan-upgrade"),

  //Get All Plan
  fcGetAllPlan: () => api.get<FCMasterPlan[]>("/fc/plan/all"),
};

/**
 * Stripe Payment API
 * @author Paing Sett Kyaw
 * @created 2025-12-10
 * @updates ****-**-**
 */

const stripePaymentAPI = {
  //Get Gurrent Plan Status
  fcCheckIntent: (payload: FCCheckoutIntentRequest) =>
    api.post<FCCheckoutIntentRequest, FCCheckoutIntentResponse>(
      "/fc/checkout-intent",
      payload,
    ),

  fcPaymentSuccess: (payload: FCSubscriptionPaymentSuccessRequest) =>
    api.post<
      FCSubscriptionPaymentSuccessRequest,
      FCSubscriptionPaymentSuccessResponse
    >("/fc/check-stripe-status", payload),

  fcPaymentWithCash: () => api.get("/fc/pay-with-cash"),
  fcPaymentWithCard: () => api.get<Order>("/fc/pay-with-card"),

  fcSubscriptionIntent: (payload: FcSubscriptionIntent) =>
    api.post<FcSubscriptionIntent, FCCheckoutIntentResponse>(
      "/checkout-subscription-intent-user",
      payload,
    ),
  fcSaveSubscription: (payload: FcSaveSubscriptionRequest) =>
    api.post<FcSaveSubscriptionRequest, FcSaveSubscriptionResponse>(
      "/fc/order/subscriptions/draft",
      payload,
    ),

  fcPaymentSubScriptiongSuccess: (
    payload: FCSubscriptionPaymentSuccessRequest,
  ) =>
    api.post<
      FCSubscriptionPaymentSuccessRequest,
      FCSubscriptionPaymentSuccessResponse
    >("/check-stripe-status", payload),
};

/**
 * News API
 * @author Paing Sett Kyaw
 * @created 2025-12-29
 * @updates ****-**-**
 */

const newsApi = {
  fcGetAllNews: () => api.get<NewsResponse>("/fc/news?target=2"),
};

const fcSettingApi = {
  fcGetSetting: () => api.get<FcSettingData[]>("/fc/setting"),

  fcGetCalculationShippingCost: (params: {
    prefecture: string;
    quantity: number;
  }) => api.get<CalculateShippingCost>("/fc/setting/calculate", { params }),
};

export const fcAPI = {
  auth: authAPI,
  register: registerAPI,
  purchase: purchaseAPI,
  order: orderAPI,
  team: teamAPI,
  bonus: bonusAPI,
  document: documentAPI,
  user: userAPI,
  product: productAPI,
  fileUpload: fileUploadAPI,
  planStatus: planStatusAPI,
  homePublic: HomePublicAPI,
  fcPayment: stripePaymentAPI,
  fcNews: newsApi,
  fcSetting: fcSettingApi,
};

export const fcRoutes = fcAPI;
