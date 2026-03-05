"use server";

// import { createClient } from "@/utils/supabase/client";
// import { Order, OrderItemCreate } from "@/types/orders";

/**
 * Create order
 * @param order - Order object
 * @returns Created order
 * @author ヤン
 */
// export const createOrder = async (order: Order, userId: string) => {
//   const supabase = createClient();

//   const { data: shippingAddress } = await supabase
//     .from("addresses")
//     .select("*")
//     .eq("user_id", userId)
//     .eq("is_default", true)
//     .eq("address_type", "shipping")
//     .single();

//   const { data: billingAddress } = await supabase
//     .from("addresses")
//     .select("*")
//     .eq("user_id", userId)
//     .eq("is_default", true)
//     .eq("address_type", "billing")
//     .single();

//   const { data, error } = await supabase
//     .from("orders")
//     .insert({
//       ...order,
//       user_id: userId,
//       shipping_address_id: shippingAddress?.address_id,
//       billing_address_id: billingAddress?.address_id,
//     })
//     .select()
//     .single();
    
//   if (error) {
//     throw error;
//   }

//   return {
//     ...data,
//     shippingData: shippingAddress,
//     billingData: billingAddress,
//   };
// };

/**
 * Create order item
 * @param orderItem - Order item object
 * @returns Created order item
 * @author ヤン
 */
// export const createOrderItem = async (orderItem: OrderItemCreate[]) => {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("order_items")
//     .insert(orderItem)
//     .select();

//   if (error) {
//     throw error;
//   }

//   return data;
// };

