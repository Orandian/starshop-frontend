export interface Image {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}

export interface Product {
  productId: number | null;
  category: number | string | null;
  brand: number | string | null;
  productCode: string | null;
  name: string | null;
  description: string | null;
  originalPrice: number | null;
  salePrice: number | null;
  discountSalePrice: number | null;
  subscriptDiscountSalePrice: number | null;
  subscriptDiscountPercent: number | null;
  stockQuantity: number | null;
  safeStockQuantity: number | null;
  tax: number | null;
  status: number;
  createdAt: number[];
  updatedAt: number[];
  deletedAt: number[] | null;
  shippingFee: number;
  images: Image[];
  totalSold: number | null;
}

export interface OrderItem {
  orderDetailId: number | null;
  order: Order | null;
  product: Product;
  productName: string | null;
  quantity: number | null;
  originalSalePrice: number | null;
  discount: number | null;
  priceAtPurchase: number | null;
  tax: number | null;
  createdAt: number[];
  updatedAt: number[];
}

export interface Order {
  orderId: number | null;
  user: number | string | null;
  coupon: number | string | null;
  orderDate: number[];
  orderType: number | string | null;
  orderStatus: number | string | null;
  paymentType: number | string | null;
  points: number | null;
  couponPoint: number | null;
  paymentDate: number | string | null;
  paymentReference: number | string | null;
  subscript: boolean;
  subscriptType: number | string | null;
  shippingCost: number;
  shippingCompany: string | null;
  trackingNumber: number | string | null;
  shippingDate: string | null;
  note: string | null;
  billName: string | null;
  billPostalCode: string | null;
  billPrefecture: string | null;
  billCity: string | null;
  billAddress1: string | null;
  billAddress2: string | null;
  billPhone: string | null;
  receiveName: string | null;
  receivePostalCode: string | null;
  receivePrefecture: string | null;
  receiveCity: string | null;
  receiveAddress1: string | null;
  receiveAddress2: string | null;
  receivePhone: string | null;
  fcInitial: string | null;
  totalPrice: number | null;
  createdAt: number[];
  updatedAt: number[];
  orderItems: OrderItem[];
}
export interface UserAddress {
  addressId: number;
  user: User | null;
  addressType: number;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string | null;
  name: string;
  phoneNumber: string;
  createdAt: number[];
  updatedAt: number[];
  orders?: Order[];
}

export interface User {
  userId: number;
  username: string;
  usernameKana: string;
  email: string;
  password: string | null;
  provider: string;
  providerId: string | null;
  userPhoto: string | null;
  phoneNumber: string | null;
  userType: number;
  aiReferrerId: number | null;
  referrer: number | null;
  status: number;
  points: number;
  failedLoginCount: number;
  lastLogin: number[] | null;
  createdAt: number[];
  updatedAt: number[];
  userAddresses: UserAddress[];
  orders: Order[];
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}

export interface PlanProductItem {
  fcPlanDefaultProductId: number;
  product: {
    productId: number;
    name: string;
    originalPrice: number;
    salePrice: number;
    discountSalePrice: number;
    images: ProductImage[];
  };
  quantity: number;
}

// Then update the Plan interface
export interface Plan {
  fcPlanMasterId: number;
  planName: string;
  contractPurchaseAmount: number;
  wholesaleRate: number;
  introIncentive: number;
  displayFlg: number;
  planProducts: PlanProductItem[] | null;
}

export interface UserDetail {
  fcId: number;
  user: User;
  contractPlan: Plan;
  currentPlan: Plan;
  referrerId: number;
  role: number;
  contractStartDt: number[];
  contractEndDt: number[];
  contractUpdateFlg: string;
  contractStatus: number;
  representativeName: string;
  contSupplySalesAggree: number;
  privacyAggree: number;
  fcPlanPaymentFlg: number;
  deposite: string | number | null;
  tantoPosition: string;
  tantoMail: string;
  tantoPhone: string;
  tantoName: string;
  bankName: string;
  bankNumber: string;
  depositType: string;
  branchName: string;
  branchNumber: string;
  bankAccountNumber: string;
  bankAccountName: string;
  rankupAt: string | number | null;
  step: number;
  createdAt: number[];
  updatedAt: number[];
  signPath?: string;
  admin_confirm?: number;
  showRank: boolean;
}

export interface UserDetailUpdate {
  fcId?: number;
  userId?: number;
  username?: string;
  usernameKana?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  address1?: string;
  address2?: string;
  name?: string;
  postalCode?: string;
  prefecture?: string;
  representativeName?: string;
  tantoName?: string;
  tantoPosition?: string;
  privacyAggree?: number;
  step?: number;
  bankName?: string;
  bankNumber?: string;
  branchName?: string;
  branchNumber?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  contractFcPlanMasterId?: number;
  currentFcPlanMasterId?: number;
  referrerId?: number;
}

export interface UserAddressApiResponse {
  data: UserAddressResponse;
}

export interface UserAddressResponse {
  city_ward_town: string;
  address: string;
  prefecture: string;
}

export interface UserAddressRequest {
  postcode: string;
}

//profile page first section
export interface UserProfile1Update {
  tantoName?: string;
  phoneNumber?: string;
}

//profile page second section
export interface UserProfile2Update {
  username: string;
  usernameKana: string;
  tantoPosition: string;
  representativeName: string;
}

export interface UserAddressUpdate {
  addressType?: number;
  postalCode?: string;
  name?: string;
  phoneNumber?: string;
  prefecture?: string;
  address1?: string;
  address2?: string;
}

export interface UserBankUpdate {
  bankName?: string;
  //bankNumber?: string;
  branchName?: string;
  branchNumber?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}
