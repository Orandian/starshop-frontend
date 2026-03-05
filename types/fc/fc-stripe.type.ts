export interface CartProduct {
  product_name: string;
  product_images: string[];
  sale_price: number;
  quantity: number;
}

export interface Cart {
  products: CartProduct[];
  shipping_fee: number;
  tax_eight: number;
  tax_ten: number;
}

export interface FCCheckoutIntentRequest {
  orderId?: number;
  cart: Cart;
  returnUrl: string;
  transactionType?: number;
  pdfKey?: string;
  cartSubscriptId?: number;
}

export interface FCCheckoutIntentResponse {
  clientSecret: string;
  publicKey: string;
}

export interface FCSubscriptionPaymentSuccessRequest {
  sessionId: string;
}
export interface FCSubscriptionPaymentSuccessResponse {
  success: boolean;
}


export interface FcSubscriptionIntent {
  cartSubscriptId: number;
  returnUrl: string;
  userId: number;
}


export interface FcSaveSubscriptionRequest{
  purchaseTypeId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface FcSaveSubscriptionResponse {
 data:{
   cartSubscriptId: number;
 }
}
