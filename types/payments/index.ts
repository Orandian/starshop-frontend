export interface PaymentRequest {
  order_id: number;
  payment_date: string;
  amount: number;
  payment_method: string;
  transaction_status: string;
  transaction_reference: string;
}
