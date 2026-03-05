// import { createClient } from "@/utils/supabase/client";
// import { RegularPurchaseCart, RegularPurchaseItem } from "@/types/regular_purchases";

// export const createRegularPurchaseCart = async (regularPurchaseCart: RegularPurchaseCart) => {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("regular_purchase_carts")
//     .insert(regularPurchaseCart)
//     .select()
//     .single();

//   if (error) {
//     throw error;
//   }

//   return data;
// };

// export const createRegularPurchaseItems = async (regularPurchaseItems: RegularPurchaseItem[] | undefined) => {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("regular_purchase_items")
//     .insert(regularPurchaseItems ?? [])
//     .select();

//   if (error) {
//     throw error;
//   }

//   return data;
// };
