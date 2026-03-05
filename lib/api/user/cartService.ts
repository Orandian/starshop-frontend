// import { createClient } from "@/utils/supabase/client";

/**
 * Delete cart
 * @param cartId - Cart id
 * @returns
 * @author ヤン
 */
// export const deleteCart = async (cartId: number) => {
//   const supabase = createClient();

//   const { error: deleteError } = await supabase
//     .from("cart_items")
//     .delete()
//     .eq("cart_id", cartId);

//   // If error, throw error
//   if (deleteError) throw deleteError;

//   // Delete cart
//   const { error: cartError } = await supabase
//     .from("shopping_carts")
//     .delete()
//     .eq("cart_id", cartId);

//   // If error, throw error
//   if (cartError) throw cartError;

//   return {
//     success: true,
//     message: "Cart deleted successfully",
//   };
// };

/**
 * Get cart items by cart id
 * @param cartId - Cart id
 * @returns
 * @author ヤン
 */
// export const getCartItemsByCartId = async (cartId: number) => {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("cart_items")
//     .select(`
//       *,
//       products (
//         product_id,
//         name,
//         sale_price,
//         tax
//       )
//     `)
//     .eq("cart_id", cartId);

//   if (error) throw error;

//   return data;
// };
