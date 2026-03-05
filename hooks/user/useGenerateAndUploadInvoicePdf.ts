import { useMutation } from "@tanstack/react-query";
import { useUploadPdf } from "./useOrder";
import { generateReceiptPDF } from "@/utils/admin/customers-invoices/generateReceiptPDF";
import { CustomerDetail } from "@/types/customers";
import { Invoice } from "@/types/admin/invoice.type";
import { OrderDetail } from "@/types/orders/index";

export const useGenerateAndUploadInvoicePdf = () => {
  const uploadPdf = useUploadPdf();

  return useMutation({
    mutationFn: async ({
      invoiceData,
      userDetail,
      orderDetail,
    }: {
      invoiceData: Invoice;
      userDetail: CustomerDetail;
      orderDetail: OrderDetail;
    }) => {
      const pdfBlob = await generateReceiptPDF(
        invoiceData,
        userDetail,
        orderDetail,
        true,
      );

      if (!pdfBlob) {
        throw new Error("Failed to generate PDF");
      }
      const fileName = `${new Date().toISOString()}-請求書-${orderDetail.orderId}.pdf`;

      const uploadResult = await uploadPdf.mutateAsync({
        pdfBlob: pdfBlob as Blob,
        fileName,
      });

      return uploadResult[0].imgUrl;
    },
  });
};
