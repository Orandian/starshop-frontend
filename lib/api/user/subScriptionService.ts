// import { createClient } from "@/utils/supabase/client";

/**
 * Get subscription cart items by cart id
 * @param cartId - Cart id
 * @returns
 * @author ヤン
 */
// export const getSubscriptionCartItemsByCartId = async (cartId: number) => {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("regular_purchase_items")
//     .select(`
//       *,
//       products (
//         product_id,
//         name,
//         regular_discount,
//         tax
//       )
//     `)
//     .eq("regular_purchase_cart_id", cartId);

//   if (error) throw error;

//   return data;
// };