import { CartItem } from ".";

export type AddToCardResponse = {
  status: number;
  message: string;
};

export interface CartGetResponse {
  status: number;
  message: string;
  data: CartData;
}

export interface CartData {
  userId: number;
  cartId: number;
  subTotal?: number;
  taxEight?: number;
  taxTen?: number;
  cartTotalPrice?: number;
  shippingFee?: number;
  products?: CartProduct[];
}

export interface CartProduct {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  salePrice?: number;
  tax?: number;
  total: number;
  stockQuantity?: number;
  safeStockQuantity?: number;
  shippingFee?: number;
  productImages: string[];
}

export const convertCamelToSnake = (data: CartData): CartItem => {
  return {
    user_id: String(data.userId),
    cart_id: data.cartId || 0,
    sub_total: data.subTotal || 0,
    tax_eight: data.taxEight || 0,
    tax_ten: data.taxTen || 0,
    cart_total_price: data.cartTotalPrice || 0,
    cart_item_id: "",
    products: data?.products?.map((p) => ({
      cart_item_id: p.cartItemId || 0,
      product_id: p.productId || 0,
      product_name: p.productName || "",
      quantity: p.quantity || 0,
      sale_price: p.salePrice || 0,
      tax: p.tax || 0,
      total: p.total || 0,
      stock_quantity: p.stockQuantity || 0,
      safe_stock_quantity: p.safeStockQuantity || 0,
      product_images: p.productImages || [],
    })),
  };
};

export type PaymentSuccessResponse = {
  status: number;
  message: string;
  data: {
    customerEmail: string;
  };
};
