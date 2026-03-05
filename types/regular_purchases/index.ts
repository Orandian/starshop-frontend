export interface RegularPurchaseCart {
  regular_purchase_cart_id?: number;
  user_id: string;
  purchase_type_id: number;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  subscription_status: string;
  current_period_end: string;
}

export interface RegularPurchaseItem {
  regular_item_id?: number;
  regular_purchase_cart_id: number;
  product_id: number;
  quantity: number;
  stripe_subscription_item_id: string;
}

export interface subscriptionProduct {
  product_id: number;
  product_name: string;
  sale_price: number;
  product_images: string[];
  product_quantity: number;
  regular_discount: number;
  regular_percentage: number;
  tax: number;
  subtotal: number;
  subtotal_with_tax: number;
  subtotal_without_tax: number;
}

export interface RegularPurchaseSummary {
  cart_id: number;
  purchase_date: string;
  next_purchase_date: string;
  cart_status: string;
  customer_id: string;
  customer_name: string;
  customer_photo: string;
  subscription_items: subscriptionProduct[];
  cart_total: number;
  purchase_type_name: string;
  interval_month: number;
}


