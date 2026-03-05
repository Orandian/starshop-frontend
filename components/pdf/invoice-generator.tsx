"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateInvoicePDF } from "@/utils/pdf-generator/invoice-pdf";
import { generateJapaneseInvoicePDF } from "@/utils/pdf-generator/japanese-pdf";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  tax: number;
  tax_amount: number;
  images: string[];
}

interface Address {
  first_name: string;
  last_name: string;
  phone: string;
  postal_code: string;
  prefecture: string;
  city: string;
  street: string;
  building: string;
  room: string;
  country: string;
}

interface OrderData {
  order_id: number;
  order_date: string;
  payment_method: string;
  order_status: string;
  notes: string;
  shipping_company: string | null;
  shipping_date: string | null;
  tracking_number: string | null;
  shipping_cost: number;
  order_total: number;
  eight_percent_total: number;
  ten_percent_total: number;
  customer_id: string;
  customer_name: string;
  shipping_address: Address;
  billing_address: Address;
  products: Product[];
}

interface InvoiceGeneratorProps {
  orderData: OrderData;
  disabled?: boolean;
}

export default function InvoiceGenerator({
  orderData,
  disabled = false,
}: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInvoice = async () => {
    if (!orderData) {
      toast.error("注文データが見つかりません。");
      return;
    }

    setIsGenerating(true);
    try {
      await generateJapaneseInvoicePDF(orderData);
      toast.success("領収書をダウンロードしました。");
    } catch (error) {
      console.error("Invoice generation error:", error);
      try {
        await generateInvoicePDF(orderData);
        toast.success("領収書をダウンロードしました。（英語版）");
      } catch (fallbackError) {
        console.error("Fallback invoice generation error:", fallbackError);
        toast.error("領収書の生成に失敗しました。");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateInvoice}
      disabled={isGenerating || disabled}
      className="w-[180px] flex items-center gap-2 bg-black hover:bg-black/80 text-white cursor-pointer"
    >
      <FileText size={16} />
      {isGenerating ? "領収書生成中..." : "領収書ダウンロード"}
    </Button>
  );
}
