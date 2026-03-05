export interface ParentCategory {
  categoryId: number;
  name: string;
  description: string;
  parentCategory: ParentCategory | null;
  createdAt: number[];
  updatedAt: number[];
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  parentCategory: ParentCategory | null;
  createdAt: number[];
  updatedAt: number[];
}

export interface Brand {
  brandId: number;
  name: string;
  isActive: boolean;
  createdAt: number[];
  updatedAt: number[];
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}

export interface Product {
  productId: number;
  category: Category;
  brand: Brand | null;
  productCode: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discountSalePrice:number;
  subscriptDiscountSalePrice: number;
  subscriptDiscountPercent: number;
  stockQuantity: number;
  safeStockQuantity: number;
  tax: number;
  status: number;
  createdAt: number[];
  updatedAt: number[];
  deletedAt: number[] | null;
  shippingFee: number;
  images: ProductImage[];
}

export interface PurchaseResponse {
  status: string;
  message: string;
  code: number;
  data: Product[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface ProductCartPayload {
  products: {
    productId: number;
    quantity: number;
  }[];
}

export interface CartResponse {
  status: string;
  message: string;
  code: number;
  data: CartItem[];
}

export interface CartItem {
  cartItemId: number;
  cartRegular: CartRegular;
  product: Product;
  productQty: number;
  createdAt: number[];
  updatedAt: number[];
}

export interface CartRegular {
  cartRegularId: number;
  user: any | null; // You might want to replace 'any' with a proper User type
  createdAt: number[];
  updatedAt: number[];
}

export interface Brand {
  brandId: number;
  name: string;
  isActive: boolean;
  createdAt: number[];
  updatedAt: number[];
}

export interface BrandResponse {
  brandId: number;
  name: string;
  isActive: boolean;
  createdAt: number[];
  updatedAt: number[];
}

export interface AddressItem {
  addressType: number;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
  name: string;
  phoneNumber: string;
}

export interface OrderAddressRequest {
  addresses: AddressItem[];
}

export interface OrderRequest {
  userId?: number;
  couponId?: number;
  subscriptType?: number | null;
  points?: number;
  couponPoint?: number;
  shippingCost?: number;
  shippingCompany?: number;
  trackingNumber?: string | null;
  shippingDate?: string;
  note?: string;
  paymentDate?: string | null;
  paymentReference?: string | null;
  orderType?: number;
  orderStatus?: number;
  paymentType?: number;
  subscript?: boolean;
  billName: string;
  billPostalCode: string;
  billPrefecture: string;
  billCity: string;
  billAddress1: string;
  billAddress2: string;
  billPhone: string;
  receiveName: string;
  receivePostalCode: string;
  receivePrefecture: string;
  receiveCity: string;
  receiveAddress1: string;
  receiveAddress2: string;
  receivePhone: string;
  totalPrice?: number;
}
