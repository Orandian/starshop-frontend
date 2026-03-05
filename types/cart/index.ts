import { Product } from "../dashboard/products";
import { Cart } from "../fc";

export interface CartProduct {
  tax: number;
  product_id: number;
  product_name: string;
  sale_price: number;
  quantity: number;
  total: number;
  cart_item_id: number;
  stock_quantity: number;
  safe_stock_quantity: number;
  product_images: string[];
}

export interface SubscriptionCartProduct {
  // Required fields used by subscription UI
  productId: number;
  name: string;
  salePrice: number;
  subscriptDiscountSalePrice: number;
  subscriptDiscountPercent: number;
  tax: number;
  stockQuantity: number;
  safeStockQuantity: number;
  images: Array<{
    imageId: number;
    imageOrder: number;
    imageUrl: string;
  }>;
  quantity: number;
  total: number;

  // Optional metadata (may not always be present in all contexts)
  brandId?: number;
  brandName?: string;
  categoryId?: number;
  categoryName?: string;
  description?: string;
  originalPrice?: number;
  productCode?: string;
  recommendedProducts?: number[];
  shippingFee?: number;
  status?: number;

  // Dates can arrive as strings from API; keep legacy tuple support
  createdAt?: string | [number, number, number, number, number];
  updatedAt?: string | [number, number, number, number, number];
  deletedAt?: string | [number, number, number, number, number] | null;
};

export const mapProductToSubscriptionCartProduct = (
  product: Product
): SubscriptionCartProduct => {
  return {
    productId: product.productId,
    name: product.name,
    salePrice: product.salePrice,
    subscriptDiscountSalePrice: product.subscriptDiscountSalePrice,
    subscriptDiscountPercent: product.subscriptDiscountPercent,
    tax: product.tax,
    stockQuantity: product.stockQuantity,
    safeStockQuantity: product.safeStockQuantity,
    images: product.images.map((img) => ({
      imageId: img.imageId,
      imageOrder: img.imageOrder,
      imageUrl: img.imageUrl,
    })),

    // subscription-specific fields
    quantity: 1,
    total: product.subscriptDiscountSalePrice,

    // optional metadata
    brandId: product.brandId,
    brandName: product.brandName,
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    description: product.description,
    originalPrice: product.originalPrice,
    productCode: product.productCode,
    shippingFee: product.shippingFee,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    deletedAt: product.deletedAt,
  };
};
export interface CartItem {
  user_id: string;
  cart_id: number;
  sub_total: number;
  tax_eight: number;
  tax_ten: number;
  cart_total_price: number;
  cart_item_id: string;
  products?: CartProduct[];
}

export interface SubscriptionProduct {
  sub_total: number;
  tax_eight: number;
  tax_ten: number;
  total_price: number;
  products: SubscriptionCartProduct[];
}

export interface UserCheckoutIntentRequest {
  cart: Cart;
  returnUrl:string;
}


export interface UserCheckoutIntentResponse {
    clientSecret:string;
    publicKey:string
}

