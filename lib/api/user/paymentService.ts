// import { createClient } from "@/utils/supabase/client";
// import { PaymentRequest } from "@/types/payments";

/**
 * Create payment intent
 * @param paymentRequest - Payment request object
 * @returns Payment intent
 * @author ヤン
 */
// export const createPaymentIntent = async (paymentRequest: PaymentRequest) => {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("payments")
//     .insert(paymentRequest)
//     .select()
//     .single();

//   if (error) {
//     throw error;
//   }

//   return data;
// };
