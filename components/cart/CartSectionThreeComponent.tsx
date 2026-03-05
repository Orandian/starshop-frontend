"use client";

import { toast } from "sonner";
import { ProductCell } from "./CartSectionOneComponent";
import { convertToYen, getPublicUrl } from "@/utils";
import { useGetCartItems } from "@/hooks/user/useCart";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Checkout from "./Checkout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CartData } from "@/types/cart/cardtype";
import { useInvoiceData } from "@/hooks/user/useInvoiceData";
import { useGenerateAndUploadInvoicePdf } from "@/hooks/user/useGenerateAndUploadInvoicePdf";
import Link from "next/link";
import ImageComponent from "../fc/ImageComponent";
import Line from "@/public/fc/line.jpg";

const CartSectionThreeComponent = ({
  handleToPreviousStep,
  shippingAddressCity,
}: {
  handleToPreviousStep: () => void;
  shippingAddressCity: string | "";
}) => {
  const {
    data: cartItems,
    isLoading,
    error,
    isError,
  } = useGetCartItems(shippingAddressCity);
  const [cart, setCart] = useState<CartData>({} as CartData);
  // const [addCart, setAddCart] = useState<CartItem>({} as CartItem);
  const { invoiceData, orderDetail, userDetail } = useInvoiceData(cart);
  //get userDetail, orderDetil, and invoiceData form invoiceData
  const { mutate: generateAndUploadPdf, isPending: isGeneratingPdf } =
    useGenerateAndUploadInvoicePdf();
  const [pdfKey, setPdfKey] = useState<string | null>(null);

  useEffect(() => {
    if (!cartItems?.data) return;
    const cartData = (cartItems?.data as unknown as CartData) || undefined;
    setCart(cartData);
    if (
      invoiceData &&
      orderDetail &&
      userDetail &&
      !pdfKey &&
      !isGeneratingPdf
    ) {
      // Trigger PDF generation when all data is ready
      generateAndUploadPdf(
        {
          userDetail,
          orderDetail,
          invoiceData,
        },
        {
          onSuccess: (pdfUrl) => {
            setPdfKey(pdfUrl);
          },
        },
      );
    }
  }, [
    cartItems,
    invoiceData,
    orderDetail,
    userDetail,
    pdfKey,
    isGeneratingPdf,
    generateAndUploadPdf,
  ]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [error, isError]);

  return (
    <div className="flex gap-6 mt-10 md:flex-row flex-col">
      <div className="md:w-1/2 w-full space-y-4 rounded-md overflow-hidden border border-white-bg pb-6 bg-white md:px-6 md:py-10 px-3 py-0">
        {(cart?.products?.length || 0) > 0 && pdfKey && (
          <Checkout
            cart={{
              products:
                cart.products?.map((cp) => ({
                  product_name: cp.productName,
                  product_images: cp.productImages,
                  sale_price: cp.salePrice || 0,
                  quantity: cp.quantity || 0,
                })) || [],
              shipping_fee: 0,
              tax_eight: cart.taxEight || 0,
              tax_ten: cart.taxTen || 0,
            }}
            pdfUrl={pdfKey}
          />
        )}
      </div>

      <div className="md:w-1/2 w-full space-y-6">
        <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white">
          <div className="space-y-4">
            {!isLoading &&
              cart?.products?.map((product) => (
                <ProductCell
                  key={product.productId}
                  name={product.productName}
                  price={product?.salePrice || 0}
                  image={
                    product.productImages[0]
                      ? getPublicUrl(product.productImages[0])
                      : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  count={product.quantity}
                />
              ))}
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="w-full h-11 bg-white-bg" />
                <Skeleton className="w-full h-11 bg-white-bg" />
                <Skeleton className="w-full h-11 bg-white-bg" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm">小計</p>
              <p className="text-normal">{convertToYen(cart?.subTotal || 0)}</p>
            </div>
            {cart?.taxEight !== undefined && cart?.taxEight !== 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm">税金 (8%)</p>
                <p className="text-normal">{convertToYen(cart?.taxEight || 0)}</p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <p className="text-sm">税金 (10%)</p>
              <p className="text-normal">{convertToYen(cart?.taxTen || 0)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">送料</p>
              <p className="text-normal">
                {convertToYen(cart?.shippingFee || 0)}
              </p>
            </div>
            {/* <div className="flex justify-between items-center">
                <p className="text-sm">ポイント</p>
                <p className="text-normal">{convertToYen(cart.point)}</p>
              </div> */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-xl">合計</p>
              <p className="font-semibold text-xl">
                {convertToYen(cart?.cartTotalPrice || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-left justify-between md:mt-10 mt-6 w-full">
          <div className=" flex justify-center px-4">
            <Link
              href={"https://lin.ee/tgFsxgK"}
              target="_blank"
              className="flex items-center gap-2"
            >
              <ImageComponent
              imgURL={Line.src}
              imgName="line"
              width={80}
              height={80}
            />
          </Link>
        </div>   
        {/* <div className="flex md:justify-end justify-between space-x-4"> */}
          <Button
            type="button"
            onClick={handleToPreviousStep}
            className="bg-white w-[100px] text-black hover:bg-white-bg cursor-pointer gap-1 border border-white-bg"
          >
            <ChevronLeft size={26} />
            <p>戻る</p>
          </Button>
          {/* <Button
            type="submit"
            className="bg-primary w-[100px] text-white hover:bg-primary/80 cursor-pointer gap-1"
          >
            <p>次へ</p>
            <ChevronRight size={26} />
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default CartSectionThreeComponent;
