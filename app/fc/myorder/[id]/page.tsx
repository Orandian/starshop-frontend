"use client";
import ImageComponent from "@/components/fc/ImageComponent";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import { useOrderItems } from "@/hooks/fc/useOrder";
import { cn } from "@/lib/utils";
import {
  AddressIcon,
  CardIcon,
  ListBoxIcon,
  MotorBikeIcon,
} from "@/public/fc/icons";
import { OrderItem } from "@/types/fc";
import {
  decryptString,
  formatDate,
  formatId,
  getPublicUrl,
  navigateToDeliveryService,
} from "@/utils";
import { generatePDF } from "@/utils/fc/generateVoucherPdf";
import { useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

// --- Helper component for the info cards ---
const InfoCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-linear-to-r from-[#9c9c9c77] to-[#f3f2f2] rounded-xl p-10">
    <h3 className="flex items-center text-xl font-semibold text-dark mb-3">
      {icon}
      {title}
    </h3>
    <div className="space-y-3 text-base text-dark">{children}</div>
  </div>
);

// --- Main Page Component ---
const OrderDetailPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  const { id } = params;
  const searchParams = useSearchParams();
  const from = searchParams.get("from") as "bonus" | null;
  const isFromBonus = decryptString(from || "") === "bonus";

  // Decrypt the encrypted order ID from URL
  const orderId = parseInt(decryptString(id));
  const { data: orderItemsData, isLoading } = useOrderItems(orderId);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { userDetail } = useFullUserDetail();
  //const { mutate: uploadPdf } = useUploadPdf();

  const orderItems: OrderItem[] =
    orderItemsData?.data && Array.isArray(orderItemsData.data)
      ? orderItemsData.data
      : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-dark">読み込み中...</div>
      </div>
    );
  }

  const shippingAddress = {
    name: orderItems.length > 0 ? orderItems[0].order.receiveName : "",
    phone: orderItems.length > 0 ? orderItems[0].order.receivePhone : "",
    zip: orderItems.length > 0 ? orderItems[0].order.receivePostalCode : "",
    address:
      orderItems.length > 0
        ? `${orderItems[0].order.receivePrefecture} ${orderItems[0].order.receiveCity} ${orderItems[0].order.receiveAddress1} ${
            orderItems[0].order.receiveAddress2 || ""
          }`
        : "",
  };

  const shippingStatus = {
    company:
      orderItems.length > 0 && orderItems[0].order.shippingCompany === 1
        ? "ヤマト運輸"
        : orderItems.length > 0 && orderItems[0].order.shippingCompany === 2
          ? "佐川急便"
          : orderItems.length > 0 && orderItems[0].order.shippingCompany === 3
            ? "日本郵便"
            : orderItems.length > 0 && orderItems[0].order.shippingCompany === 4
              ? "DHL"
              : orderItems.length > 0 &&
                  orderItems[0].order.shippingCompany === 5
                ? "FedEx"
                : "未設定",
    trackingNumber: orderItems[0].order.trackingNumber || "未設定",
    deliveryDate:
      (orderItems.length > 0 && formatDate(orderItems[0].order.orderDate)) ||
      "",
  };

  const billingAddress = {
    name: orderItems.length > 0 ? orderItems[0].order.billName : "",
    phone: orderItems.length > 0 ? orderItems[0].order.billPhone : "",
    zip: orderItems.length > 0 ? orderItems[0].order.billPostalCode : "",
    address:
      orderItems.length > 0
        ? `${orderItems[0].order.billPrefecture} ${orderItems[0].order.billCity}
       ${orderItems[0].order.billAddress1} ${orderItems[0].order.billAddress2 || ""}`
        : "",
  };

  const subtotal = orderItems[0].order.totalPriceNoTax;
  const shipping = orderItems[0].order.shippingCost;
  const tax = orderItems[0].order.totalTax;
  const grandTotal = orderItems[0].order.totalPrice;
  const totals = {
    subtotal,
    shipping,
    tax,
    grandTotal,
  };

  /**
   * Generate pdf functions
   * @param orderItems
   */
  const handleGeneratePDF = async (orderItems: OrderItem[]) => {
    try {
      setIsGeneratingPDF(true);
      if (userDetail?.data) {
        //process invoice number
        const invoiceId = orderItems?.[0]?.order?.invoices?.[0].invoiceId || 0;
        const createdDate = orderItems?.[0]?.order?.invoices?.[0]
          .createdAt as number[];
        const invoiceNumber = formatId(createdDate, invoiceId);
        await generatePDF(userDetail?.data, orderItems, invoiceNumber);

        //temp test to upload pdf to backend
        //uploadPdf(pdfBlob);
      } else {
        toast.error("ユーザー情報がありません");
      }
    } catch {
      toast.error("請求書の生成に失敗しました");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    // Page background
    <div className="b min-h-screen ">
      {/* NOTE: The header with the hamburger menu and user profile 
        is omitted as it's likely part of the global layout, not this page.
      */}

      {/* Main content container */}
      <main className=" mx-auto bg-white rounded-xl shadow-lg p-6 md:p-10">
        {/* Top 3 Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mb-8">
          <InfoCard
            title="配達先"
            icon={<MotorBikeIcon className="w-7 h-7 mr-2 text-dark" />}
          >
            <p>{shippingAddress.name}</p>
            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.zip}</p>
            <p>{shippingAddress.address}</p>
          </InfoCard>

          <InfoCard
            title="配達状況"
            icon={<CardIcon className="w-7 h-7 mr-2 text-dark" />}
          >
            <p>配送会社: {shippingStatus.company}</p>
            <p>追跡番号: {shippingStatus.trackingNumber}</p>
            <p>配達日: {shippingStatus.deliveryDate}</p>
            {shippingStatus.trackingNumber !== "未設定" &&
              orderItems[0].order.shippingCompany && (
                <a
                  href={navigateToDeliveryService(
                    shippingStatus.trackingNumber,
                    orderItems[0].order.shippingCompany,
                  )}
                  className="underline text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  状況確認
                </a>
              )}
          </InfoCard>

          <InfoCard
            title="請求先"
            icon={<AddressIcon className="w-7 h-7 mr-2 text-dark" />}
          >
            <p>{billingAddress.name}</p>
            <p>{billingAddress.phone}</p>
            <p>{billingAddress.zip}</p>
            <p className="mb-4">{billingAddress.address}</p>
            {!isFromBonus && (
              <button
                onClick={() => handleGeneratePDF(orderItems)}
                disabled={isGeneratingPDF}
                className={cn(
                  " items-center justify-center gap-2 w-fit bg-gray-900 text-white text-base font-medium py-2 px-4 rounded-md hover:bg-gray-700 transition-colors",
                  orderItems[0].order.orderStatus === 1 ? "flex" : "hidden",
                )}
              >
                <ListBoxIcon className="w-6 h-6" />
                {isGeneratingPDF ? "ダウンロード中..." : "請求書ダウンロード"}
              </button>
            )}
          </InfoCard>
        </section>

        {/* Order Status Bar */}
        <section className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 py-4">
          <div>
            <span className="text-sm text-gray-600">
              {formatDate(orderItems[0]?.order.paymentDate || "")}{" "}
              クレジットカード支払い済み
            </span>
          </div>
          {/* Order Cancel Button */}
          {/* <button className="bg-secondary text-white text-xs font-bold py-2 px-4 rounded-full hover:bg-pink-600 transition-colors">
            注文をキャンセルする
          </button> */}
        </section>

        {/* Item List */}
        <section>
          <div className="overflow-x-auto border border-disabled/20 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-dark uppercase tracking-wider min-w-[250px]">
                    商品
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-dark uppercase tracking-wider min-w-[100px]">
                    金額 (税別)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-dark uppercase tracking-wider min-w-[80px]">
                    個数
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-dark uppercase tracking-wider min-w-[120px]">
                    合計金額
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderItems.map((item) => (
                  <tr key={item.orderDetailId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <ImageComponent
                          imgURL={getPublicUrl(
                            item.product.images?.[0]?.imageUrl || "",
                          )}
                          imgName={""}
                          className="w-16 h-16 rounded-md object-cover border"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.productName}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            ¥
                            {Number(item.priceAtPurchase).toLocaleString(
                              "ja-JP",
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                      ¥{Number(item.priceAtPurchase).toLocaleString("ja-JP")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                      ¥
                      {(
                        item.quantity * Number(item.priceAtPurchase)
                      ).toLocaleString("ja-JP")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals Section */}
        <section className="mt-8 ">
          <div className="max-w-xs ml-auto space-y-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">小計</span>
              <span className="font-medium text-gray-900">
                ¥{totals.subtotal && totals.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">送料</span>
              <span className="font-medium text-gray-900">
                ¥{totals.shipping && totals.shipping.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">税金(10%)</span>
              <span className="font-medium text-gray-900">
                ¥{totals.tax && totals.tax.toLocaleString()}
              </span>
            </div>
            {/* <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">税金(10%)</span>
              <span className="font-medium text-gray-900">
                ¥{totals.tax10.toLocaleString()}
              </span>
            </div> */}

            {/* Grand Total */}
            <div className=" flex justify-between items-baseline">
              <span className="text-lg font-bold text-dark">合計</span>
              <span className="text-2xl font-bold text-dark">
                ¥{totals.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderDetailPage;
