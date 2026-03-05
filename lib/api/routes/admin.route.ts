import { TeamList } from "@/hooks/admin/useTeam";
import { api } from "@/lib/api/api.gateway";
import { Photo, putObjects } from "@/lib/api/aws/putObjects";
import {
  ALlMemberBonuseRepose,
  AdminBonusById,
  AllAdminBonusResponse,
  BonusPeriodList,
  BonusTimePeriod,
  BonusTransactionList,
  BonusTransactionListGroupByResponse,
  BonusTransactionListResponse,
  MemberBonusById,
} from "@/types/admin/bonus.type";
import {
  BrandPayload,
  BrandResponse,
  BrandStatus,
  BrandUpdatePayload,
} from "@/types/admin/brand.type";
import {
  CategoryItem,
  CategoryPayload,
  CategoryResponse,
  CategoryStatus,
} from "@/types/admin/category.type";
import { CSVRow, ImportCSVResponse } from "@/types/admin/csvData.type";
import {
  ActivityResponse,
  Statistic,
  TotalFc,
} from "@/types/admin/dashboard.type";
import {
  FAQ,
  FAQPayload,
  FAQResponse,
  FAQStatus,
} from "@/types/admin/faqs.type";
import {
  FCApprovedHistoryResponse,
  FCDashboardData,
  FCPendingUser,
  FCUserResponse,
  UpdateFcStatus,
  UpdateFcStatusResponse,
} from "@/types/admin/fcUser.type";
import {
  AllFcPlanProduct,
  FCMasterPlanWithProducts,
  FCPlanMasterResponse,
  FCPlanResponse,
  FcUserWithPlanResponsePagination,
  UpdateFCPlanProduct,
  UpdateFcPlan,
  UpdatePlanStatus,
  UpdatePlanStatusResponse,
} from "@/types/admin/fcplan.type";
import {
  CreateSupplierRequest,
  ExportToCSVFilters,
  InventoryProductResponse,
  ProductListByBrand,
  SupplierBrand,
  SupplierOrderResponse,
  UpdateStockRequest,
  UpdateSupplierRequest,
} from "@/types/admin/inventory.type";
import {
  InvoiceResponse,
  UpdateInvoiceStatus,
  UpdateInvoiceStatusResponse,
} from "@/types/admin/invoice.type";
import { NewsPayload, NewsResponse, NewsStatus } from "@/types/admin/news.type";
import { OrderResponse } from "@/types/admin/order.type";
import {
  AdminDeliveryPayload,
  AdminDeliverySetting,
  AdminGetAllShippingCostResponse,
  AdminMailCreateRequest,
  AdminMailTemplate,
  AdminMailTemplateResponse,
  AdminMailUpdateRequest,
  AdminShippingCostRequest,
  AdminUpdateUserRequest,
  AdminUserDetails,
  AdminUserListResponse,
  ContactusResponse,
  Setting,
} from "@/types/admin/setting.type";
import { ApiResponse } from "@/types/api/api-response";
import {
  AllCustomersApiResponse,
  CustomerDetail,
  CustomerDetailResponse,
  CustomerFilterProps,
  CustomerInvoice,
  NewCustomer,
  UpdateProfile,
  UpdateStatus,
  UpdateStatusResponse,
  UserTypeCountResponse,
  CompanyInfoUpdate,
  AdminConfrimFcApiResponse,
} from "@/types/customers";
import {
  ChangeProductStatusRequest,
  ChangeProductStatusResponse,
  CreateProductRequest,
  CreateProductResponse,
  MemberBonusResponse,
  Product,
  ProductImageData,
  ProductListResponse,
  SaveProductImagesRequest,
  SaveProductImagesResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from "@/types/dashboard/products";
import {
  DocumentCreateRequest,
  DocumentCreateResponse,
  DocumentResponse,
  DocumentUpdateRequest,
  DocumentUpdateResponse,
} from "@/types/documents/document.type";
import { EmptyResponse, OrderItemResponse } from "@/types/fc";
import { ImageData } from "@/types/fc/file.type";
import { UserAddressUpdate, UserBankUpdate } from "@/types/fc/user.type";
import { InvoiceFiltersProps } from "@/types/invoices";
import { NewsItem } from "@/types/news";
import {
  AdminConfirmOrderRequest,
  OrderDetail,
  OrderFilterProps,
  OrderResponseData,
} from "@/types/orders";

const productAPI = {
  getAllProducts: ({
    page,
    pageSize,
    productName,
    status,
    brandId,
  }: {
    page: number;
    pageSize: number;
    productName: string;
    status: string;
    brandId: string;
  }) =>
    api.get<ProductListResponse>(`/admin/products`, {
      params: {
        page,
        pageSize,
        productName,
        status,
        brandId,
      },
    }),

  exportAllProductsToCSV: (filters: {
    productName: string;
    status: string;
    brandId: string;
  }) =>
    api.get<Blob>(`/admin/products/export`, {
      params: filters,
      responseType: "blob",
    }),

  getProductById: (productId: number) =>
    api.get<Product>(`/admin/products/${productId}`),

  createProduct: (request: CreateProductRequest) => {
    // Transform frontend request to match backend expectations
    const transformedRequest = {
      product: {
        categoryId: request.product.categoryId,
        brandId: request.product.brandId,
        productCode: request.product.productCode,
        name: request.product.name,
        description: request.product.description,
        originalPrice: request.product.originalPrice,
        salePrice: request.product.salePrice,
        subscriptDiscountSalePrice: request.product.subscriptDiscountSalePrice,
        subscriptDiscountPercent: request.product.subscriptDiscountPercent,
        tax: request.product.tax,
        status: request.product.status,
        barcode: request.product.barcode,
      },
      recommendProducts: request.recommendProducts,
    };
    return api.post<typeof transformedRequest, CreateProductResponse>(
      `/admin/products`,
      transformedRequest
    );
  },

  updateProduct: ({
    productId,
    product,
    recommendProducts,
  }: {
    productId: number;
    product: UpdateProductRequest;
    recommendProducts?: number[];
  }) => {
    const requestBody = recommendProducts
      ? { ...product, recommendProducts }
      : product;

    return api.put<typeof requestBody, UpdateProductResponse>(
      `/admin/products/${productId}`,
      requestBody
    );
  },

  updateProductRankingAndArrival: (
    id: number,
    data: { ranking?: number; isNewArrival?: boolean }
  ) => api.put(`/admin/products/${id}`, data),

  uploadProductImages: async ({
    files,
    productId,
    initialCount,
  }: {
    files: File[];
    productId: number;
    initialCount?: number;
  }) => {
    // Upload files to S3
    const photos: Photo[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      imgUrl: "",
    }));

    const uploadedPhotos = await putObjects(`products/${productId}`, photos);
    initialCount = initialCount || 0; // Default to 0 if not provided

    // Save image records to backend
    const imageData: ProductImageData[] = uploadedPhotos.map(
      (photo, index) => ({
        imageUrl: photo.imgUrl,
        imageOrder: index + 1 + initialCount, // Ensure new images are ordered after existing ones
      })
    );

    return api.post<SaveProductImagesRequest, SaveProductImagesResponse>(
      `/admin/products/${productId}/images`,
      { images: imageData }
    );
  },

  deleteProductImages: ({
    productId,
    imageUrls,
  }: {
    productId: number;
    imageUrls: string[];
  }) =>
    api.delete<ApiResponse<null>>(`/admin/products/${productId}/images`, {
      data: imageUrls,
    }),

  updateImageOrder: ({
    productId,
    images,
  }: {
    productId: number;
    images: ProductImageData[];
  }) =>
    api.put<SaveProductImagesRequest, ApiResponse<null>>(
      `/admin/products/${productId}/images/order`,
      { images }
    ),

  changeProductStatus: ({
    status,
    productId,
  }: {
    status: boolean;
    productId: number;
  }) =>
    api.put<ChangeProductStatusRequest, ChangeProductStatusResponse>(
      `/admin/products/${productId}/status`,
      { status }
    ),

  getRecommendProductsToChoose: (productId?: number) =>
    api.get<Product[]>(`/admin/products/recommendations/choose`, {
      params: productId ? { productId } : {},
    }),

  getAdminProfit: (
    page: number,
    size: number,
    filter: { yearMonth?: string }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<MemberBonusResponse>(
      `/admin/dashboard/profit/${filter.yearMonth ? filter.yearMonth : "all"}`,
      { params }
    );
  },

  getAdminProfilePeriod: () =>
    api.get<string[]>(`/admin/dashboard/profit/period-list`),
};

const adminOrderAPI = {
  getAllOrderSummaries: ({
    page,
    pageSize,
    userType,
    orderId,
    userName,
    orderStatus,
    orderDate,
    yearMonth,
  }: {
    page: number;
    pageSize: number;
    userType: string;
    orderId: string;
    userName: string;
    orderStatus: string;
    orderDate: string;
    yearMonth: string;
  }) =>
    api.get<OrderResponseData>("/admin/orders/summaries", {
      params: {
        page,
        pageSize,
        userType,
        orderId,
        userName,
        orderStatus,
        orderDate,
        yearMonth,
      },
    }),
  getOrderDetails: (orderId: number) =>
    api.get<OrderDetail>(`/admin/orders/${orderId}`),
  updateOrderStatus: (
    orderId: number,
    status: number,
    notes?: string,
    trackingNumber?: string,
    deliveryCompany?: number,
    shippingDate?: string
  ) =>
    api.put(`/admin/orders/update-status`, {
      orderId,
      newStatus: status,
      notes,
      trackingNumber,
      deliveryCompany,
      shippingDate,
    }),
  confirmOrder: (request: AdminConfirmOrderRequest) =>
    api.put<AdminConfirmOrderRequest, ApiResponse<null>>(
      `/admin/orders/admin-confirm`,
      request
    ),
  //get period list
  getPeriodList: () => api.get<string[]>("/admin/orders/period"),
  //export csv
  exportOrderSummariesToCSV: (filters: OrderFilterProps) =>
    api.get("/admin/orders/export", { params: filters, responseType: "blob" }),
  //send delivered mail
  sendDeliveryInformationMail: (orderId: number) =>
    api.post(`/admin/orders/${orderId}/send-shipping-confirmation`),
  //send shipping order confirmation mail
  sendShippingOrderConfirmationMail: () =>
    api.get(`/admin/orders/send-csv-mail`),
  //import shipping info via csv
  importCSVData: (data: { rows: CSVRow[] }) => {
    return api.post<{ rows: CSVRow[] }, ImportCSVResponse>(
      `/admin/orders/csv-import`,
      data
    );
  },
};

const newsAPI = {
  getNews: (
    page: number,
    pageSize: number,
    title: string,
    status: string,
    newsDate: string,
    target: string
  ) =>
    api.get<NewsResponse>(`/admin/news`, {
      params: { page, pageSize, title, status, newsDate, target },
    }),

  //get News by Id
  getNewsById: (newsId: number) => api.get<NewsItem>(`/admin/news/${newsId}`),

  //create new
  createNews: (news: NewsPayload) =>
    api.post<NewsPayload, NewsResponse>(`/admin/news`, news),

  //update news
  updateNews: (news_id: number | string, news: NewsPayload) =>
    api.put<NewsPayload, NewsResponse>(`/admin/news/${news_id}`, news),

  //update news status
  updateNewsStatus: (news_id: number | string, status: boolean) =>
    api.patch<NewsStatus, UpdateStatusResponse>(`/admin/news/status`, {
      news_id,
      is_active: status,
    }),

  //delete news
  deleteNews: (news_id: number | string) =>
    api.delete<ApiResponse<null>>(`/admin/news/${news_id}`),
};

const categoryAPI = {
  getCategories: (
    page: number,
    pageSize: number,
    isActive: string,
    parentId: string
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", pageSize.toString());

    if (isActive && isActive !== "all") {
      params.append("isActive", isActive);
    }

    if (parentId && parentId !== "all") {
      params.append("parentId", parentId);
    }

    return api.get<CategoryResponse>(`/admin/categories-pagination`, {
      params,
    });
  },

  //get parent categories only
  getParentCategories: () =>
    api.get<CategoryItem[]>(`/admin/categories-parents`),

  //get Category by Id
  getCategoryById: (categoryId: number) =>
    api.get<CategoryItem>(`/admin/categories/${categoryId}`),

  //create new
  createCategory: (category: CategoryPayload) =>
    api.post<CategoryPayload, CategoryResponse>(`/admin/categories`, category),

  //update category
  updateCategory: (categoryId: number | string, category: CategoryPayload) =>
    api.put<CategoryPayload, CategoryResponse>(
      `/admin/categories/${categoryId}`,
      category
    ),

  //update category status
  updateCategoryStatus: (categoryId: number | string, status: boolean) =>
    api.put<CategoryStatus, UpdateStatusResponse>(
      `/admin/categories/${categoryId}`,
      {
        isActive: status,
      }
    ),

  //delete category
  deleteCategory: (categoryId: number | string) =>
    api.delete<ApiResponse<null>>(`/admin/categories/${categoryId}`),
};

const faqAPI = {
  getFaqs: (
    page: number,
    pageSize: number,
    keyword: string,
    status: string,
    faqDate: string
  ) =>
    api.get<FAQResponse>(`/admin/faqs`, {
      params: { page, pageSize, keyword, status, faqDate },
    }),

  //get by Id
  getFaqById: (faqId: number) => api.get<FAQ>(`/admin/faqs/${faqId}`),

  //create faq
  createFaq: (faq: { question: string; answer: string }) =>
    api.post<FAQPayload, FAQResponse>(`/admin/faqs`, faq),

  //update faq
  updateFaq: (faq_id: number | string, faq: FAQPayload) =>
    api.put<FAQPayload, FAQResponse>(`/admin/faqs/${faq_id}`, faq),

  //update news status
  updateFaqStatus: (faq_id: number | string, status: boolean) =>
    api.patch<FAQStatus, UpdateStatusResponse>(`/admin/faqs/status`, {
      faq_id,
      is_active: status,
    }),

  //delete faq
  deleteFaq: (faq_id: number | string) =>
    api.delete<ApiResponse<null>>(`/admin/faqs/${faq_id}`),
};

const brandAPI = {
  getBrands: (
    page: number,
    pageSize: number,
    keyword: string,
    status: string,
    brandDate: string
  ) =>
    api.get<BrandResponse>(`/admin/brands`, {
      params: { page, pageSize, keyword, status, brandDate },
    }),

  //create faq
  createBrand: (brand: BrandPayload) =>
    api.post<BrandPayload, BrandResponse>(`/admin/brands`, brand),

  //update faq
  updateBrand: (brand_id: number, body: BrandUpdatePayload) =>
    api.put<BrandUpdatePayload, BrandResponse>(
      `/admin/brands/${brand_id}`,
      body
    ),

  //update news status
  updateBrandStatus: (brand_id: number | string, status: boolean) =>
    api.patch<BrandStatus, UpdateStatusResponse>(`/admin/brands/status`, {
      brand_id,
      is_active: status,
    }),

  //delete faq
  deleteBrand: (faq_id: number | string) =>
    api.delete<ApiResponse<null>>(`/admin/brands/${faq_id}`),
};

const documentAPI = {
  getDocuments: (
    page: number,
    pageSize: number,
    searchDocumentName: string,
    searchStatus: string,
    searchDocumentDate: string,
    searchBrandId: string
  ) => {
    // Format the date to match the required format: 2025-12-05T19:56:08
    const formattedDate = searchDocumentDate
      ? new Date(searchDocumentDate).toISOString().replace(/\.\d+Z$/, "")
      : undefined;

    return api.get<DocumentResponse>(`/admin/doc/all`, {
      params: {
        page,
        size: pageSize, // Changed from pageSize to size to match the API requirement
        docName: searchDocumentName,
        docStatus: searchStatus,
        createdAt: formattedDate,
        brandId: searchBrandId,
      },
    });
  },

  createDocument: async (document: DocumentCreateRequest) => {
    const uploadedFiles = await Promise.all(
      document.file.map(async (file) => {
        const photo: Photo = {
          id: Date.now() + Math.random(),
          file: file,
          imgUrl: "",
        };
        const [uploaded] = await putObjects(`documents`, [photo]);
        return uploaded;
      })
    );
    return api.post<DocumentCreateRequest, DocumentCreateResponse>(
      "/admin/doc/create",
      {
        ...document,
        docPath: uploadedFiles[0].imgUrl,
      }
    );
  },

  updateDocument: async (document: DocumentUpdateRequest) => {
    if (document.file) {
      const uploadedFiles = await Promise.all(
        document.file.map(async (file) => {
          const photo: Photo = {
            id: Date.now() + Math.random(),
            file: file,
            imgUrl: "",
          };
          const [uploaded] = await putObjects(`documents`, [photo]);
          return uploaded;
        })
      );
      document.docPath = uploadedFiles[0].imgUrl;
    }
    return api.put<DocumentUpdateRequest, DocumentUpdateResponse>(
      `/admin/doc/update`,
      document
    );
  },
};

const customerAPI = {
  getCustomers: (
    page: number,
    pageSize: number,
    searchQuery: string,
    userType: string,
    bonusType: string
  ) =>
    api.get<AllCustomersApiResponse>(`/admin/users`, {
      params: { page, pageSize, searchQuery, userType, bonusType },
    }),
  getCustomerById: (customerId: string | number) =>
    api.get<CustomerDetail>(`/admin/user/${customerId}`),

  getOrderByCustomerId: (
    customerId: string | number,
    page: number,
    size: number
  ) =>
    //get apis
    api.get<OrderResponse>(`/admin/user/order/${customerId}`, {
      params: { page, size },
    }),

  getOrderItemsByOrderId: (orderId: string | number) =>
    api.get<OrderItemResponse>(`/admin/user/order/detail/${orderId}`),

  getTeam: () => api.get<TeamList[]>(`/admin/user/fc/team`),

  getCounts: () => api.get<UserTypeCountResponse>(`/admin/users/count`),

  exportUsersToCSV: (filters: CustomerFilterProps) =>
    api.get<Blob>(`/admin/users/export`, {
      params: filters,
      responseType: "blob",
    }),

  getAdminConfirmedFcCustomers: (page: number, size: number) =>
    api.get<AdminConfrimFcApiResponse>(`/admin/fc/admin-confirm-list`, {
      params: { page, size },
    }),

  // create and update apis

  createCustomer: (data: NewCustomer) =>
    api.post<NewCustomer, CustomerDetailResponse>(`/admin/fc/create`, data),

  updateProfile: (data: UpdateProfile, userId: string | number) =>
    api.put<UpdateProfile, CustomerDetailResponse>(
      `/admin/user/update-profile/${userId}`,
      data
    ),

  updateCompanyInfo: (data: CompanyInfoUpdate, userId: string | number) =>
    api.put<CompanyInfoUpdate, CustomerDetailResponse>(
      `/admin/user/update-companyInfo/${userId}`,
      data
    ),

  updateBankInfo: (data: UserBankUpdate, userId: string | number) =>
    api.put<UserBankUpdate, CustomerDetailResponse>(
      `/admin/user/update-bankInfo/${userId}`,
      data
    ),

  updateAddressInfo: (data: UserAddressUpdate, userId: string | number) =>
    api.put<UserAddressUpdate, CustomerDetailResponse>(
      `/admin/user/update-address/${userId}`,
      data
    ),

  updateCustomerStatus: (user_id: number | string, status: number) =>
    api.patch<UpdateStatus, UpdateStatusResponse>(`/admin/user/status`, {
      user_id,
      status,
    }),

  //get invoice data by customer id
  getInvoiceByCustomerId: (customerId: string, invoiceDate: string) =>
    api.get<CustomerInvoice>(`/admin/user/invoice/${customerId}`, {
      params: { invoiceDate },
    }),
};

const fcAPI = {
  //get all fc plans
  getPlans: () => api.get<FCPlanResponse>(`/admin/fc/plan`),

  //get all fc users
  getUsers: (period: string) =>
    api.get<FCUserResponse>(`/admin/fc/all-users/${period}`),

  //get all fc users
  getPlanMaster: () => api.get<FCPlanMasterResponse>(`/admin/fc-plans`),

  // update status
  updatePlanStatus: (plan_id: number | string, status: boolean) =>
    api.patch<UpdatePlanStatus, UpdatePlanStatusResponse>(
      `/admin/fc-plans/status`,
      {
        plan_id,
        status,
      }
    ),
  getFcPendingUsers: () => api.get<FCPendingUser[]>(`/admin/fc/pending-users`),
  updateFcStatus: (fcId: number, status: number, amount: number) =>
    api.patch<UpdateFcStatus, UpdateFcStatusResponse>(`/admin/fc/approve`, {
      fcId,
      status,
      amount,
    }),
  getPeriodUpgrade: () =>
    api.get<Setting>(`/admin/fc/get-upgrade-allow-period`),
  updatePeriodUpgrade: (period: number) =>
    api.patch<{ period: number }, ApiResponse<null>>(
      `/admin/fc/update-allow-period`,
      {
        period,
      }
    ),
  getFcDashboardDataPeriodList: () =>
    api.get<{ period: string }[]>(`/admin/fc/dashboard-data-period-list`),
  getFcDashboardData: (period: string) =>
    api.get<FCDashboardData>(`/admin/fc/dashboard-data/${period}`),

  updatePlan: (plan: UpdateFcPlan) =>
    api.put<UpdateFcPlan, ApiResponse<null>>(
      `/admin/fc-plans/${plan.planId}`,
      plan
    ),

  getAllFCPlanProducts: () =>
    api.get<AllFcPlanProduct>(`/admin/fc-plans/all-products`),
  getFCPlanProducts: () =>
    api.get<FCMasterPlanWithProducts[]>(`/admin/fc-plans/products`),
  updateFCPlanProducts: (payload: UpdateFCPlanProduct) =>
    api.post<UpdateFCPlanProduct, EmptyResponse>(
      `/admin/fc-plans/products`,
      payload
    ),
  //get fc users with plan
  getFcWithPlanInfo: (page: number, size: number) =>
    api.get<FcUserWithPlanResponsePagination>(`/admin/fc/fc-with-plan`, {
      params: { page, size },
    }),

  //get fc approved history with pagination
  getFcApprovedHistory: (page: number, size: number) =>
    api.get<FCApprovedHistoryResponse>(`/admin/fc/approved-history`, {
      params: { page, size },
    }),
};

/**
 * File Upload API
 * @author Paing Sett Kyaw
 * @created 2025-11-27
 * @updates ****-**-**
 */

const fileUploadAPI = {
  userUploadProfile: async (
    files: File[],
    userId: string | number,
    user_type: string
  ) => {
    const photos: Photo[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      imgUrl: "",
    }));

    const folderPath = user_type === "FC" ? `fc/profile` : `user/profile`;

    const uploadedPhotos = await putObjects(folderPath, photos);
    const imageData: ImageData[] = uploadedPhotos.map((photo, index) => ({
      imageUrl: photo.imgUrl,
      imageOrder: index,
    }));
    return api.patch(`/admin/user/update-image/${userId}`, {
      userPhoto: imageData[0].imageUrl,
    });
  },
};

/**
 * Bonus API
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const bonusAPI = {
  // Bonus
  adminGetBonusPeriodList: () =>
    api.get<BonusPeriodList>(`/admin/bonus/period-list`),
  adminGetBonusTransactionList: (
    invoiceYearMonth: string | null,
    page: number,
    size: number
  ) =>
    api.get<BonusTransactionListGroupByResponse>(
      `/admin/bonus/period/${invoiceYearMonth}`,
      { params: { page, size } }
    ),
  adminGetBonusTransactionListByUser: (
    userId: number,
    invoiceYearMonth: string | null,
    page: number,
    size: number
  ) =>
    api.get<BonusTransactionListResponse>(
      `/admin/bonus/period/${invoiceYearMonth}/user/${userId}`,
      {
        params: { page, size },
      }
    ),
  adminGetTotalBonusAmount: (invoiceYearMonth: string | null, userId: number) =>
    api.get<BonusTransactionList>(
      `/admin/bonus/get-total-bonus/${invoiceYearMonth}/user/${userId}`
    ),

  adminGetAllMemeberBonus: (
    filter: { yearMonth: string },
    page: number,
    size: number
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<ALlMemberBonuseRepose>(
      `/admin/bonus/fc-member-bonus/${filter.yearMonth ? filter.yearMonth : "all"}`,
      { params }
    );
  },
  adminGetMemberBonusById: (id: number) =>
    api.get<MemberBonusById>("/admin/bonus/fc-member-bonus/all/" + id),
  adminGetAllAdminBonus: (
    filter: { yearMonth: string },
    page: number,
    size: number
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<AllAdminBonusResponse>(
      `/admin/bonus/fc-admin-bonus/${filter.yearMonth ? filter.yearMonth : "all"}`,
      {
        params,
      }
    );
  },
  adminGetAllBonus: (
    filter: { yearMonth: string },
    page: number,
    size: number
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<AllAdminBonusResponse>(
      `/admin/bonus/fc-all-bonus/${filter.yearMonth ? filter.yearMonth : "all"}`,
      {
        params,
      }
    );
  },
  adminGetAdminBonusById: (id: number) =>
    api.get<AdminBonusById[]>("/admin/bonus/fc-admin-bonus/all/" + id),
  adminGetTimePeriodById: (id: number) =>
    api.get<BonusTimePeriod[]>("/admin/bonus/bonus-period-list/" + id),

  adminPaymentActivate: (yearMonth: string, fcId: number) =>
    api.patch(`/admin/bonus/fc-member-bonus/${yearMonth}/${fcId}/activate`),
};

/**
 * Order API
 * @author Linn Ko Ko
 * @created 2025-11-23
 * @updated ****-**-**
 */
const orderAPI = {
  // FC Get Orders
  adminGetOrders: (page: number, size: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<OrderResponse>(`/admin/order?${params.toString()}`);
  },
};

/**
 * Order API
 * @author Linn Ko Ko
 * @created 2025-11-23
 * @updated ****-**-**
 */
const dashboardAPI = {
  // FC Get Orders
  adminGetOrders: (page: number, size: number, type: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      type: type.toString(),
    });
    return api.get<OrderResponse>(
      `/admin/dashboard/order?${params.toString()}`
    );
  },
  adminGetBonusTransactionList: (
    invoiceYearMonth: string | null,
    page: number,
    size: number
  ) =>
    api.get<BonusTransactionListGroupByResponse>(
      `/admin/dashboard/bonus/period/${invoiceYearMonth}`,
      { params: { page, size } }
    ),
  adminGetAllOrdersCount: () => api.get<number>(`/admin/dashboard/order/total`),

  adminGetOrderCountByType: () =>
    api.get<{ all: number; user: number; fc: number; fcInitial: number }>(
      `/admin/dashboard/order-count-by-type`
    ),

  adminGetAllCustomerCount: () =>
    api.get<number>(`/admin/dashboard/customer/total`),

  adminGetAllProductCount: () =>
    api.get<number>(`/admin/dashboard/product/total`),

  adminThisMonthSalesTotal: () =>
    api.get<{ month: string; total: number }>(
      `/admin/dashboard/sales/this-month`
    ),
  adminYearlySalesTotal: () =>
    api.get<{ month: string; total: number }>(`/admin/dashboard/sales/yearly`),
  adminDateRangeSalesTotal: ({
    fromDate,
    toDate,
  }: {
    fromDate: string;
    toDate: string;
  }) =>
    api.get<{ date: string; current: number; last: number }[]>(
      `/admin/dashboard/sales/date-range`,
      { params: { fromDate, toDate } }
    ),
  adminFcTotal: () => {
    return api.get<TotalFc>(`/admin/dashboard/total-fc`);
  },
  adminActivity: (page: number, size: number) => {
    return api.get<ActivityResponse>(`/admin/dashboard/activity`, {
      params: { page, size },
    });
  },

  adminGetStatistics: () => {
    return api.get<Statistic>(`/admin/dashboard/statistic`);
  },
};

const invoiceAPI = {
  adminGetInvoiceByUserType: (
    userType: string,
    page: number,
    size: number,
    orderId?: string,
    userName?: string,
    invoiceStatus?: string,
    orderDate?: string
  ) =>
    api.get<InvoiceResponse>(`/admin/invoices`, {
      params: {
        userType,
        page,
        pageSize: size,
        orderId,
        userName,
        invoiceStatus,
        orderDate,
      },
    }),

  updateStatus: (invoiceId: number, status: number, userType: string) =>
    api.patch<UpdateInvoiceStatus, UpdateInvoiceStatusResponse>(
      `/admin/invoices/status-update`,
      {
        invoiceId,
        status,
        userType,
      }
    ),

  exportToCSV: (filters: InvoiceFiltersProps) =>
    api.get("/admin/invoices/export", {
      params: filters,
      responseType: "blob",
    }),
};

const settingAPI = {
  adminGetAllUsers: (page: number, size: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return api.get<AdminUserListResponse>(
      `/admin/auth/all?${params.toString()}`
    );
  },

  adminUpdateUsers: (userid: number, data: AdminUpdateUserRequest) =>
    api.post(`/admin/auth/update/${userid}`, data),

  adminCreateUsers: (data: AdminUpdateUserRequest) =>
    api.post("/admin/auth/create", data),
  adminGetUserDetails: (id: number) =>
    api.get<AdminUserDetails>(`/admin/auth/detail/${id}`),

  adminGetAllMail: (page: number, size: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<AdminMailTemplateResponse>("/admin/mail/all", { params });
  },
  adminCreateMail: (data: AdminMailCreateRequest) =>
    api.post<AdminMailCreateRequest, EmptyResponse>("/admin/mail/create", data),
  adminGetMailDetails: (id: string) =>
    api.get<AdminMailTemplate>(`/admin/mail/detail/${id}`),
  adminUpdateMail: (id: string, data: AdminMailUpdateRequest) =>
    api.put<AdminMailUpdateRequest, EmptyResponse>(
      `/admin/mail/update/${id}`,
      data
    ),

  adminGetAllDelivery: () =>
    api.get<AdminDeliverySetting[]>("/admin/delivery/all"),
  adminUpdateDelivery: (id: number, data: AdminDeliveryPayload) =>
    api.put<AdminDeliveryPayload, EmptyResponse>(
      `/admin/delivery/update/${id}`,
      data
    ),

  adminContactUs: (page: number, size: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<ContactusResponse>(`/admin/contact-us?${params.toString()}`);
  },

  adminGetAllShipping: (params: { prefecture?: string }) =>
    api.get<AdminGetAllShippingCostResponse>("/admin/shipping-costs", {
      params,
    }),

  adminUpdateShippingCost: (data: AdminShippingCostRequest[]) =>
    api.put("/admin/shipping-costs/bulk", data),
};

const inventoryAPI = {
  getAllSupplier: (
    page: number,
    size: number,
    filters?: {
      brandName?: string;
      productName?: string;
      status?: string;
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters?.brandName) {
      params.append("brandName", filters.brandName);
    }

    if (filters?.productName) {
      params.append("productName", filters.productName);
    }

    if (filters?.status && filters.status !== "-1") {
      params.append("status", filters.status);
    }

    return api.get<SupplierOrderResponse>(
      `/admin/supplier-order?${params.toString()}`
    );
  },
  getProductList: (
    page: number,
    size: number,
    filters?: {
      brandName?: string;
      productName?: string;
      safeStockQuantity?: string;
      status?: string;
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters?.brandName) {
      params.append("brandName", filters.brandName);
    }

    if (filters?.productName) {
      params.append("productName", filters.productName);
    }

    if (filters?.safeStockQuantity) {
      params.append("safeStockQuantity", filters.safeStockQuantity);
    }

    if (filters?.status && filters.status !== "-1") {
      params.append("status", filters.status);
    }

    return api.get<InventoryProductResponse>(
      `/admin/supplier-order/product-list?${params.toString()}`
    );
  },
  getAllBrands: () => api.get<SupplierBrand[]>("/admin/supplier-order/brands"),
  getProductById: (id: number) =>
    api.get<ProductListByBrand[]>(`/admin/supplier-order/products/${id}`),
  // getSupplierById: (id: number) => api.get<any>(`/admin/supplier-order/${id}`),
  createSupplierOrder: (data: CreateSupplierRequest) =>
    api.post<CreateSupplierRequest, EmptyResponse>(
      "/admin/supplier-order",
      data
    ),
  updateSupplierOrder: (id: number, data: UpdateSupplierRequest) =>
    api.put<UpdateSupplierRequest, EmptyResponse>(
      `/admin/supplier-order/${id}`,
      data
    ),

  updateProductQty: (id: number, data: UpdateStockRequest) =>
    api.patch<UpdateStockRequest, EmptyResponse>(
      `/admin/supplier-order/product-list/${id}`,
      data
    ),
   exportToCSVSupplier: (filters: ExportToCSVFilters) =>
    api.get("/admin/supplier-order/supplier-order-export", {
      params: filters,
      responseType: "blob",
    }),
   exportToCSVInventory: (filters: ExportToCSVFilters) =>
    api.get("/admin/supplier-order/inventory-export", {
      params: filters,
      responseType: "blob",
    }),
};

const adminAPI = {
  product: productAPI,
  order: orderAPI,
  dashboard: dashboardAPI,
  news: newsAPI,
  category: categoryAPI,
  faq: faqAPI,
  adminOrder: adminOrderAPI,
  bonus: bonusAPI,
  brand: brandAPI,
  document: documentAPI,
  customer: customerAPI,
  fc: fcAPI,
  fileUpload: fileUploadAPI,
  invoice: invoiceAPI,
  setting: settingAPI,
  inventory: inventoryAPI,
};

export const adminRoutes = adminAPI;
