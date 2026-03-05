export interface Brand {
    brand_id: number;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    products?: {
        product_id: number;
    }[];
}   

export interface BrandList {
    brand_id: number;
    name: string;
}
    