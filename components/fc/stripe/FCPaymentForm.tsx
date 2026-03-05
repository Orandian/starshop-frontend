import { Button } from "@/components/ui/button";
import {
  useGetCart,
  useGetPreInvoiceId,
  useOrderItems,
  useUserDetail,
} from "@/hooks/fc";
import {
  useGetCalculationShippingCost,
  useGetFcSettng,
} from "@/hooks/fc/useSetting";
import { FCCheckoutIntentRequest } from "@/types/fc";
import { getPublicUrl } from "@/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ImageComponent from "../ImageComponent";
import LoadingIndicator from "../ui/LoadingIndicator";
import FCCheckoutForm from "./FC-CheckoutForm";
import { FCReturnClient } from "./FCReturnClient";
import { buildOrderItemsFromStripeCart } from "@/utils/fc/orderItemArrayBuilder";
import { useGenerateAndUploadInvoicePdf } from "@/hooks/fc/useGenerateAndUploadInvoicePdf";
import { UserDetail } from "@/types/fc/user.type";
import { OrderItem } from "@/types/fc/order.type";
import { formatDate } from "date-fns";
interface OrderSummaryProps {
  sessionId: string | null;
  sub?: string | null;
  orderId: number;
  cartSubscriptId?: number;
  backPath?: string;
  successClick: () => void;
  failureClick: () => void;
  onBack?: () => void;
  returnUrl: string;
  transactionType: number;
  pdfUrl?: string | null;
  isLoading?: boolean;
  successBtnText?: string;
  failureBtnText?: string;
}

const FCPaymentForm = ({
  sessionId,
  sub,
  orderId,
  cartSubscriptId,
  backPath,
  successClick,
  failureClick,
  onBack,
  returnUrl,
  transactionType,
  pdfUrl,
  isLoading,
  successBtnText,
  failureBtnText,
}: OrderSummaryProps) => {
  const router = useRouter();
  const { data: userCart, isLoading: isuserCarLoading } = useGetCart();
  const { data: orderItemsData, isLoading: isOrderItemsLoading } =
    useOrderItems(orderId);
  const { data: fcSetting, isLoading: isGetFcSetting } = useGetFcSettng();
  const [findCostbyPrefecture, setFindCostbyPrefecture] = useState({
    prefecture: "",
    quantity: "",
  });

  const {
    data: calculationShippingCost,
    isLoading: isCalculationShippingCost,
  } = useGetCalculationShippingCost({
    prefecture: findCostbyPrefecture.prefecture,
    quantity: Number(findCostbyPrefecture.quantity),
  });
  const [cartData, setcartData] = useState<FCCheckoutIntentRequest>();
  const [orderPriceInfo, setOrderPriceInfo] = useState({
    totalAmount: "",
    taxAmount: "",
    shippingAmount: "",
    pointAmount: 0,
    totalAmountWithTax: "",
  });

  //pdf related functions => this is only for initial purchase
  const generateAndUploadPdf = useGenerateAndUploadInvoicePdf();
  const { data: preInvoiceId } = useGetPreInvoiceId();
  const { data: userDetail } = useUserDetail();
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  const handleGenerateInvoice = useCallback(
    async (userDetail: UserDetail, orderItems: OrderItem[]) => {
      const invoiceId =
        formatDate(new Date(), "yyyyMMdd") + "-" + preInvoiceId?.data;
      try {
        const uploadedUrl = await generateAndUploadPdf.mutateAsync({
          userDetail: userDetail,
          orderItems: orderItems,
          invoiceNumber: invoiceId,
        });
        setGeneratedPdfUrl(uploadedUrl);
      } catch (error) {
        console.error("Failed to generate/upload PDF:", error);
      }
    },
    [generateAndUploadPdf, preInvoiceId],
  );
  const finalPdfUrl = pdfUrl || generatedPdfUrl; //generate here or pass from props

  const createCartData = useCallback(
    async (shippingAmount: number) => {
      if (!preInvoiceId?.data) {
        return;
      }

      if (userCart?.data && shippingAmount !== undefined) {
        const cartItems = {
          products: userCart.data.map((item) => ({
            product_name: item.product.name,
            product_images:
              item.product.images.length > 0
                ? [getPublicUrl(item.product.images[0].imageUrl)]
                : [],
            sale_price: Number(item.product.discountSalePrice),
            quantity: item.productQty,
          })),
          shipping_fee: shippingAmount,
          tax_eight: userCart.data.reduce(
            (sum, item) =>
              sum +
              (item.product.tax === 8
                ? Math.round(
                    Number(item.product.discountSalePrice) *
                      item.productQty *
                      0.08,
                  )
                : 0),
            0,
          ),
          tax_ten: userCart.data.reduce(
            (sum, item) =>
              sum +
              (item.product.tax === 10
                ? Math.round(
                    Number(item.product.discountSalePrice) *
                      item.productQty *
                      0.1,
                  )
                : 0),
            0,
          ),
        };

        //generate orderItem[] for pdf generate
        const orderItems = buildOrderItemsFromStripeCart(
          cartItems,
          userDetail?.data || ({} as UserDetail),
        );
        if (userDetail && orderItems.length > 0) {
          await handleGenerateInvoice(
            userDetail?.data || ({} as UserDetail),
            orderItems,
          );
        }

        if (cartSubscriptId) {
          return {
            cartSubscriptId,
            cart: cartItems,
            returnUrl,
            transactionType,
          };
        }

        if (orderId) {
          return {
            orderId,
            cart: {
              products: userCart.data.map((item) => ({
                product_name: item.product.name,
                product_images:
                  item.product.images.length > 0
                    ? [getPublicUrl(item.product.images[0].imageUrl)]
                    : [],
                sale_price: Number(item.product.discountSalePrice),
                quantity: item.productQty,
              })),
              shipping_fee: shippingAmount,
              tax_eight: userCart.data.reduce(
                (sum, item) =>
                  sum +
                  (item.product.tax === 8
                    ? Math.round(
                        Number(item.product.discountSalePrice) *
                          item.productQty *
                          0.08,
                      )
                    : 0),
                0,
              ),
              tax_ten: userCart.data.reduce(
                (sum, item) =>
                  sum +
                  (item.product.tax === 10
                    ? Math.round(
                        Number(item.product.discountSalePrice) *
                          item.productQty *
                          0.1,
                      )
                    : 0),
                0,
              ),
            },

            returnUrl,
            transactionType,
          };
        }
      }
    },
    [
      preInvoiceId,
      userCart,
      orderId,
      returnUrl,
      transactionType,
      cartSubscriptId,
      handleGenerateInvoice,
      userDetail,
    ],
  );
  const createCartDataRef = useRef(createCartData);
  createCartDataRef.current = createCartData;

  useEffect(() => {
    const setupCartData = async () => {
      let totalShippingFee = 0;

      if (userCart?.data && Array.isArray(userCart?.data)) {
        const subTotal = userCart?.data?.reduce(
          (sum, item) => sum + item.product.discountSalePrice * item.productQty,
          0,
        );

        const settingData =
          fcSetting?.data && fcSetting.data.length > 0
            ? fcSetting.data[0]
            : undefined;
        if (settingData?.shippingFreeLimitFc) {
          if (subTotal >= settingData.shippingFreeLimitFc) {
            totalShippingFee = 0;
          } else {
            totalShippingFee = calculationShippingCost?.data?.totalFee || 0;
          }
        }

        const totalTax = userCart?.data?.reduce((sum, item) => {
          const itemSubtotal = item.product.discountSalePrice * item.productQty;
          const itemTaxAmount = Math.round(
            itemSubtotal * (item.product.tax / 100),
          );
          return sum + itemTaxAmount;
        }, 0);

        const totalSummar = subTotal + totalTax + totalShippingFee;

        setOrderPriceInfo({
          totalAmount: subTotal.toLocaleString("ja-JP", {
            style: "currency",
            currency: "JPY",
          }),
          taxAmount: totalTax.toLocaleString("ja-JP", {
            style: "currency",
            currency: "JPY",
          }),
          shippingAmount: totalShippingFee.toLocaleString("ja-JP", {
            style: "currency",
            currency: "JPY",
          }),
          pointAmount: 0,
          totalAmountWithTax: totalSummar.toLocaleString("ja-JP", {
            style: "currency",
            currency: "JPY",
          }),
        });
      }

      const data = await createCartDataRef.current(totalShippingFee);
      if (data) {
        setcartData(data);
      }
    };
    setupCartData();
  }, [userCart, orderId, fcSetting, calculationShippingCost]);

  useEffect(() => {
    const orderItems = orderItemsData?.data;
    if (orderItems) {
      const orderCity = orderItems[0].order.receiveCity;

      if (userCart?.data) {
        setFindCostbyPrefecture({
          prefecture: orderCity,
          quantity: userCart.data.length.toString(),
        });
      }
    }
  }, [userCart, orderItemsData]);
  return (
    <>
      {sessionId || sub ? (
        <FCReturnClient
          sessionId={sessionId as string}
          sub={sub as string}
          successClick={successClick}
          successBtnText={successBtnText}
          failureClick={failureClick}
          failureBtnText={failureBtnText}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex flex-col gap-8">
          <div className="w-full mt-8 flex gap-8 flex-col md:flex-row">
            {/* Checkout Form */}

            <div className="border border-disabled/20 rounded-md p-6 w-full">
              {(!isuserCarLoading ||
                !isGetFcSetting ||
                !isOrderItemsLoading ||
                !isCalculationShippingCost) &&
              cartData &&
              cartData.cart?.products?.length > 0 ? (
                <FCCheckoutForm cartData={cartData} pdfUrl={finalPdfUrl} />
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <LoadingIndicator size="md" />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="h-fit w-full flex flex-col gap-8">
              <div className="border border-disabled/20 rounded-md p-6 ">
                {/* <h2 className="text-xl font-semibold mb-6">注文内容</h2> */}
                <div className="space-y-4">
                  {cartData &&
                    cartData.cart?.products?.map((product, index) => (
                      <div key={index} className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-50">
                          {product.product_images.length > 0 && (
                            <ImageComponent
                              imgURL={product.product_images[0]}
                              imgName={`product-${product.product_name}`} // Add a meaningful name
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-base text-dark line-clamp-2">
                            {product.product_name}
                          </div>
                          <div className="mt-1">
                            <span className="text-sm font-normal">
                              ¥{product.sale_price.toLocaleString("ja-JP")}
                              （税別）*
                              {product.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className=" pt-4 mt-4 space-y-10">
                    {/* sub total */}
                    <div className="flex justify-between text-sm text-gray-600 mb-5">
                      <div>小計</div>
                      <div>
                        ¥
                        {cartData?.cart?.products
                          ?.reduce(
                            (sum, item) =>
                              sum + item.sale_price * item.quantity,
                            0,
                          )
                          ?.toLocaleString("ja-JP")}
                      </div>
                    </div>

                    {/* Tax 8%  */}
                    <div className="flex justify-between text-sm text-gray-600 mb-5">
                      <div>税金 (8%)</div>
                      <div>
                        {cartData?.cart?.tax_eight
                          ? orderPriceInfo.taxAmount
                          : "¥0"}
                      </div>
                    </div>

                    {/* Tax 10% */}
                    <div className="flex justify-between text-sm text-gray-600 mb-5">
                      <div>税金 (10%)</div>
                      <div>
                        {cartData?.cart?.tax_ten
                          ? orderPriceInfo.taxAmount
                          : "¥0"}
                      </div>
                    </div>

                    {/* shipping fee */}
                    <div className="flex justify-between text-sm text-gray-600 mb-5">
                      <div>送料</div>
                      <div>{orderPriceInfo.shippingAmount}</div>
                    </div>

                    <div className=" mt-4 pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <div className="">合計</div>
                        <div>{orderPriceInfo.totalAmountWithTax}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    backPath
                      ? router.push(backPath)
                      : onBack
                        ? onBack()
                        : router.back()
                  }
                  variant="outline"
                  className="h-12 hover:bg-disabled/10 gap-3 flex justify-center items-center w-30 text-black border border-disabled/30 rounded-md cursor-pointer"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  戻る
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FCPaymentForm;
