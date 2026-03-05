import { useUserStore } from "@/store/useAuthStore";
import { useGetUserById } from "@/hooks/user/useUserDetail";
import { buildOrderDetailFromCart } from "@/utils/cart/orderDetail";
import { useGetPreReceiptId } from "@/hooks/user/useOrder";
import { Invoice } from "@/types/admin/invoice.type";
import { CartData } from "@/types/cart/cardtype";

export const useInvoiceData = (cart: CartData) => {
  const userId = useUserStore((state) => state.user)?.userId;
  const { data: userDetail } = useGetUserById(Number(userId));
  const { data: preReceiptId } = useGetPreReceiptId();

  const orderDetail = userDetail
    ? buildOrderDetailFromCart(cart, userDetail)
    : null;

  const invoiceData: Invoice | null = orderDetail
    ? {
        id: Number(preReceiptId?.data) || 0,
        userId: Number(userId) || 0,
        userName: userDetail?.username || "",
        totalAmount: orderDetail.orderTotal,
        status: 1,
        idNumber: orderDetail.orderId.toString(),
        orderId: orderDetail.orderId,
        orderNumber: "",
        createdAt: [
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
        ],
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
      }
    : null;

  return {
    invoiceData,
    orderDetail,
    userDetail,
  };
};
