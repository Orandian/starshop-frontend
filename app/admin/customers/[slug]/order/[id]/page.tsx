"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import ImageCardComponent from "@/components/admin/ImageCardComponent";
import { useGetOrderSummaryDetailsByOrderId } from "@/hooks/admin/useOrder";
import { use, useEffect } from "react";
import { toast } from "sonner";
import {
  convertToYen,
  decryptString,
  formatDate,
  formatDate2,
  getPublicUrl,
} from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { shippingCompany, fcRoles } from "@/data/order/indes";
import { OrderProduct } from "@/types/orders";
import { ArrowLeft } from "lucide-react";

const CustomerOrderDetailPage = (props: {
  params: Promise<{ id: string; slug: string }>;
}) => {
  const router = useRouter();
  const params = use(props.params);
  const { id, slug } = params;
  // Decrypt the encrypted order ID from URL
  const orderId = parseInt(decryptString(id));

  // Get order details
  const {
    data: orderDetails,
    isLoading,
    error,
    isError,
  } = useGetOrderSummaryDetailsByOrderId(orderId || 0);

  const handleToCustomerDetailPage = () => {
    router.push(`/admin/customers/${slug}/order`);
  };

  useEffect(() => {
    if (error && isError) {
      toast.error(error.message);
    }
  }, [error, isError]);

  /**
   * map user type
   * @param type
   * @param role
   * @returns
   * @author ayenadikyaw
   */
  const mapUserType = (type: number, role: number) => {
    if (type === 2) {
      return fcRoles.find((fcRole) => fcRole.value === role)?.label;
    }
    if (type === 3) {
      return "一般";
    }
    return "";
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleToCustomerDetailPage}
          >
            <ArrowLeft className="cursor-pointer" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2  md:grid-cols-3 gap-6">
          {/* お客様情報 */}
          {!isLoading && orderDetails && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <div className="flex items-center gap-2 mb-5">
                <h3 className="font-bold text-dark">お客様情報</h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <h2 className="text-normal text-dark min-w-20">氏名</h2>
                  <span className="text-normal text-dark">:</span>
                  <h2 className="text-normal text-dark">
                    {orderDetails?.billingAddress?.firstName}{" "}
                    {orderDetails?.billingAddress?.lastName}
                  </h2>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <h2 className="text-normal text-dark min-w-20">メール</h2>
                  <span className="text-normal text-dark">:</span>
                  <h2 className="text-normal text-dark word-break break-all">
                    {orderDetails?.customerEmail}
                  </h2>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <h2 className="text-normal text-dark min-w-20">電話</h2>
                  <span className="text-normal text-dark">:</span>
                  <h2 className="text-normal text-dark">
                    {orderDetails?.billingAddress?.phone}
                  </h2>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <h2 className="text-normal text-dark min-w-20">顧客タイプ</h2>
                  <span className="text-normal text-dark">:</span>
                  <h2 className="text-normal text-dark">
                    {mapUserType(
                      orderDetails?.userType || 0,
                      orderDetails?.fcRole || 0,
                    )}
                  </h2>
                </div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <Skeleton className="h-[25px] w-full bg-white border border-white rounded-md p-2 mt-1" />
            </div>
          )}
          {/* 配送情報 */}
          {!isLoading && orderDetails && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-dark">配送情報</h3>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <div className="flex items-start gap-2">
                  <h2 className="text-normal text-dark min-w-20">配送先</h2>
                  <span className="text-normal text-dark">:</span>
                  <p className="text-normal text-dark">
                    〒{orderDetails?.billingAddress?.postalCode} {""}
                    {orderDetails?.billingAddress?.prefecture}
                    {orderDetails?.billingAddress?.city}
                    {orderDetails?.billingAddress?.street}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <div className="flex items-start gap-2">
                  <h2 className="text-normal text-dark min-w-20">配送方法</h2>
                  <span className="text-normal text-dark">:</span>
                  <p className="text-normal text-dark">
                    {orderDetails?.shippingCompany
                      ? shippingCompany.find(
                          (company) =>
                            company.value === orderDetails?.shippingCompany,
                        )?.label
                      : "未設定"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <div className="flex items-start gap-2">
                  <h2 className="text-normal text-dark min-w-20">配送希望日</h2>
                  <span className="text-normal text-dark">:</span>
                  <p className="text-normal text-dark">
                    {formatDate2(orderDetails?.shippingDate || "未設定")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <div className="flex items-start gap-2">
                  <h2 className="text-normal text-dark min-w-20">
                    配送伝票番号
                  </h2>
                  <span className="text-normal text-dark">:</span>
                  <p className="text-normal text-dark">
                    {orderDetails?.trackingNumber
                      ? orderDetails?.trackingNumber
                      : "未設定"}
                  </p>
                </div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
              <Skeleton className="h-[25px] w-full bg-white border border-white rounded-md p-2 mt-1" />
            </div>
          )}
        </div>

        {/* 注文商品 */}
        <div className="flex flex-wrap items-center justify-between mt-10 md:mt-0 mb-5 md:mb-2 gap-2">
          <p className="text-normal text-dark">
            注文日時：
            {formatDate(orderDetails?.orderDate || "")}
          </p>
        </div>
        <div className="rounded-[10px] overflow-hidden border border-black/10 px-6">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="py-4 px-4 font-bold text-left text-black">
                  商品名
                </TableHead>
                <TableHead className="py-4 font-bold text-right text-black">
                  販売金額（税別）
                </TableHead>
                <TableHead className="py-4 font-bold text-center text-black">
                  数量
                </TableHead>
                <TableHead className="py-4 font-bold text-right text-black">
                  合計
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                orderDetails?.products?.map((item: OrderProduct) => (
                  <TableRow
                    className="border-b border-black/10"
                    key={item.productId}
                  >
                    <TableCell className="py-4 px-4">
                      <div className={`flex items-center gap-1`}>
                        <ImageCardComponent
                          imgURL={getPublicUrl(item.images[0])}
                          imgName="product1"
                        />
                        <div className="flex-col">{item.productName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-right">
                      {convertToYen(item.price)}
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {convertToYen(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading &&
                Array.from({ length: 3 }, (_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={4} className="h-24">
                      <Skeleton className="h-full w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end w-full">
          {!isLoading && (
            <div className="flex flex-col pr-5 gap-4">
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">小計</div>
                <div className="text-right">
                  {convertToYen(
                    orderDetails?.products.reduce(
                      (total: number, item: OrderProduct) =>
                        total + item.subtotal,
                      0,
                    ) || 0,
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">送料</div>
                <div className="text-right">
                  {convertToYen(orderDetails?.shippingCost || 0)}
                </div>
              </div>
              {/* <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">税金(8%)</div>
                <div className="text-right">
                  {convertToYen(orderDetails?.eightPercentTotal || 0)}
                </div>
              </div> */}
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">税金(10%)</div>
                <div className="text-right">
                  {convertToYen(orderDetails?.tenPercentTotal || 0)}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-20">
                <div className="text-left">合計</div>
                <div className="text-right">
                  {convertToYen(orderDetails?.orderTotal || 0)}
                </div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col pr-5 gap-4">
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              <Skeleton className="h-[25px] w-[200px] bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerOrderDetailPage;
