import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGetOrderSummaryDetailsByOrderId, useGetUserOrderReceipt } from "@/hooks/user/useOrder";
import { useCustomerStore } from "@/store/Admin/useCustomerStore";
import { Invoice } from "@/types/admin/invoice.type";
import { OrderDetail } from "@/types/orders";
import { Download } from "lucide-react";

interface Props {
    orderId: string;
    label?: string;
    className?: string;
}

export const OrderReceiptDownloadButton = ({
    orderId,
    label = "Download",
    className = "",
}: Props) => {
    const [activeOrderId, setActiveOrderId] = useState("");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const { data: receiptData, isError: receiptError } =
        useGetUserOrderReceipt(activeOrderId);

    const { data: orderSummary, isError: orderError } =
        useGetOrderSummaryDetailsByOrderId(Number(activeOrderId || 0));

    const { downloadInvoiceReceipt, isDownloading } = useCustomerStore();

    // Button click
    const handleClick = () => {
        if (!orderId || isGeneratingPDF) return;
        setActiveOrderId(orderId);
    };

    // Error handling (fetch errors only)
    useEffect(() => {
        if (receiptError || orderError) {
            toast.error("Failed to fetch receipt or order data.");
        }
    }, [receiptError, orderError]);

    // Download trigger (CORRECT)
    useEffect(() => {
        if (!activeOrderId) return;
        if (!receiptData || !orderSummary) return;
        if (isGeneratingPDF) return;

        const run = async () => {
            const invoice = receiptData as unknown as Invoice;
            const orderDetails = orderSummary as unknown as OrderDetail;

            if (!invoice?.userId) return;
            if (!orderDetails?.products?.length) return;

            setIsGeneratingPDF(true);
            toast.loading("Generating receipt...");

            try {
                await downloadInvoiceReceipt(
                    invoice.userId.toString(),
                    invoice,
                    orderDetails,
                    "general",
                    "user"
                );
            } finally {
                setIsGeneratingPDF(false);
                setActiveOrderId("");
                toast.dismiss();
            }
        };

        run();
    }, [
        activeOrderId,
        receiptData,
        orderSummary,
        isGeneratingPDF,
        downloadInvoiceReceipt,
    ]);

    return (
        <Button
            variant="outline"
            className={`flex items-center gap-2 ${className}`}
            onClick={handleClick}
            disabled={isGeneratingPDF || isDownloading}
        >
            {isGeneratingPDF || isDownloading ? (
                "ダウンロード中..."
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    {label}
                </>
            )}
        </Button>
    );
};
