"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get dashboard summary
 * @returns Dashboard summary
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const [
    { data: lastYearAnnualSales, error: lastYearError },
    { data: thisMonthSales, error: thisMonthError },
    { data: productsOnSale, error: productsError },
    { data: customers, error: customersError },
    { data: orders, error: ordersError },
  ] = await Promise.all([
    supabase.from("last_year_annual_sales").select("*"),
    supabase.from("dashboard_monthly_sales").select("*"),
    supabase.from("dashboard_products_on_sale").select("*"),
    supabase.from("dashboard_customer_count").select("*"),
    supabase.from("dashboard_order_count").select("*"),
  ]);

  const allErrors = [
    lastYearError,
    thisMonthError,
    productsError,
    customersError,
    ordersError,
  ].filter(Boolean);

  if (allErrors.length) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      allErrors[0]?.message ?? "",
      500
    );
  }

  return successResponse(
    {
      lastYearAnnualSales: lastYearAnnualSales?.[0] ?? { total: 0 },
      thisMonthSales: thisMonthSales?.[0] ?? { total: 0 },
      productsOnSale: productsOnSale?.[0] ?? { count: 0 },
      customers: customers?.[0] ?? { count: 0 },
      orders: orders?.[0] ?? { count: 0 },
    },
    MESSAGES.COMMON.SUCCESS
  );
}
