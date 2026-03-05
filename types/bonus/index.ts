export interface Bonus {
    bonus_id: number;
    target_month: string; // e.g., "2025-11"
    user_name: string;
    user_image?: string;
    position: string; // FC
    sales_count: number; // 件数
    bonus_amount: number; // ボーナス金額
    payment_date: string; // 支払い日
    status: string; // 未振込, 振込済
}

export interface BonusFilters {
    year_month?: string;
    user_name?: string;
    status?: string;
}
