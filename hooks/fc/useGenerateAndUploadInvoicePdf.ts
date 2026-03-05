import { useMutation } from "@tanstack/react-query";
import { UserDetail } from "@/types/fc/user.type";
import { generatePDF } from "@/utils/fc/generateVoucherPdf";
import { useUploadPdf } from "./useOrder";
import { OrderItem } from "@/types/fc/order.type";

export const useGenerateAndUploadInvoicePdf = () => {
  const uploadPdf = useUploadPdf();

  return useMutation({
    mutationFn: async ({
      userDetail,
      orderItems,
      invoiceNumber,
    }: {
      userDetail: UserDetail;
      orderItems: OrderItem[];
      invoiceNumber: string;
    }) => {
      const pdfBlob = await generatePDF(
        userDetail,
        orderItems,
        invoiceNumber,
        true,
      );

      if (!pdfBlob) {
        throw new Error("Failed to generate PDF");
      }
      const fileName = `${new Date().toISOString()}-請求書-${orderItems[0].order.orderId}.pdf`;

      const uploadResult = await uploadPdf.mutateAsync({
        pdfBlob: pdfBlob as Blob,
        fileName,
      });

      return uploadResult[0].imgUrl;
    },
  });
};
