import { api } from "@/lib/api/api.gateway";
import { ChangePasswordRequest, ChangePasswordResponse, ForgotEmailResponse, ForgotEmailVerifyRequest, ForgotPasswordResponse, SignUpRequest, SignUpResponse, VerifyRequest } from "@/types/auth";
import { CategoryResponse } from "@/types/categories";
import { CouponResponse } from "@/types/coupons";
import { BrandResponse } from "@/types/dashboard/brands";
import { NewArrivalProductListResponse, NewRankingProductListResponse, ProductDetailsResponse, ProductListResponse } from "@/types/dashboard/products";
import { ContactFormRequest, ContactResponse, FAQResponse } from "@/types/faqs";
import { NewsList, NewsResponse } from "@/types/news";

export const publicRoutes = {
  // Public News
  publicNews: (page: number, pageSize: number, searchNewsTitle: string, searchNewsDate: string) => api.get<NewsResponse>("/pub/news", { params: { page, pageSize, title: searchNewsTitle, date: searchNewsDate } }),

  // Public News by id
  publicNewsById: (id: number | null) => api.get<NewsList>(`/pub/news/${id}`),

  // Home Public
  products: (brandId: string, page: number, pageSize: number) => api.get<ProductListResponse>(`/pub/products`, { params: { name: brandId === "All" ? undefined : brandId, page, size: pageSize }, }),
  newArrivalProducts: () => api.get<NewArrivalProductListResponse>("/pub/products/new-arrivals"),

  productDetail: (id: number) => api.get<ProductDetailsResponse>(`/pub/products/${id}`), // id: product_id
  productRankings: () => api.get<NewRankingProductListResponse>("/pub/products/ranking"),
  category: () => api.get<CategoryResponse>(`/pub/categories`), // id: product_id


  faqs: () => api.get<FAQResponse>("/pub/faqs"),
  coupons: () => api.get<CouponResponse>("/pub/coupons"),
  brands: () => api.get<BrandResponse>("/pub/brands"),

  signup: (data: SignUpRequest) => api.post<SignUpRequest, SignUpResponse>("/register", data),
  verify: (data: VerifyRequest) => api.post<VerifyRequest, SignUpResponse>("/verify", data),
  contactUs: (data: ContactFormRequest) => api.post<ContactFormRequest, ContactResponse>("/pub/contact-us", data),
  forgotEmailPassword: (data: { email: string }) => api.post<{ email: string }, ForgotPasswordResponse>("/forgot-password", data),
  forgotEmailVerify: (data: ForgotEmailVerifyRequest) => api.post<ForgotEmailVerifyRequest, ForgotEmailResponse>("/verify-forgot", data),
  forgotPasswordChange: (data: ChangePasswordRequest) => api.post<ChangePasswordRequest, ChangePasswordResponse>(`/change-password`, data),
};

