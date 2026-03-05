import { StaticImageData } from "next/image";

export type Product = {
  product_id?: number;
  category_id: number;
  name: string;
  description: string;
  sale_price: number;
  wholesale_price: number;
  shipping_fees: number | null;
  stock_quantity: number;
  safe_stock_quantity: number;
  regular_percentage: number;
  regular_discount: number;
  tax: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
  brand?: Brand;
  brand_id?: number;
};

export type SubscriptionCartProduct = {
  product_id: number;
  name: string;
  sale_price: number;
  regular_price: number;
  regular_percentage: number;
  tax: number;
  quantity: number;
  total: number;
  stock_quantity: number;
  safe_stock_quantity: number;
  product_images: ProductImage[];
};

export type Brand = {
  name: string;
};

export type ProductImage = {
  image_url: string;
  image_order?: number;
};

type productType = {
  id: number;
  name: string;
  price: number;
  image: string;
  isTax: boolean;
  imgBg?: boolean;
};

export default productType;

export type ProductRecommendationResponse = {
  recommendation_id: number;
  product_id: number;
  recommended_product_id: number;
  recommendation_type: string;
  score: number;
  created_at: string;
  recommended_product: {
    product_id: number;
    name: string;
    description: string;
    category_id: number;
    tax: number;
    sale_price: number;
    wholesale_price: number;
    stock_quantity: number;
    safe_stock_quantity: number;
    is_active: boolean;
    shipping_fees: number | null;
    created_at: string;
    updated_at: string;
    product_images: ProductImage[];
    brand?: Brand;
  };
};

export type RecommendedProduct = {
  recommended_product_id: number;
  recommended_product: {
    name: string;
    product_images: ProductImage[];
    brand?: Brand;
  };
};

export type RankingNewArrivalType = {
  id: number;
  name: string;
  brand?: Brand;
  image: string | StaticImageData;
  url?: string;
  rank?: number;
  price?: number;
  isTax?: boolean;
};