"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import {
  convertToYen,
  encryptString,
  getPublicUrl,
  decryptString,
  getOrderStatus,
  dateArrayToString,
} from "@/utils";
import { ProductCell } from "@/components/cart/CartSectionOneComponent";
import AddressCard from "@/components/profile/AddressCard";
import { Bike, CreditCard, ClipboardList, FileText } from "lucide-react";
import DeliveryCard from "@/components/profile/DeliveryCard";
import OrderCancelSection from "@/components/profile/OrderCancelSection";
import { useParams, useRouter } from "next/navigation";
import {
  useGetOrderSummaryDetailsByOrderId,
  useGetUserOrderReceipt,
  useUpdateOrderStatus,
} from "@/hooks/user/useOrder";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderProduct } from "@/types/orders";
import { AxiosError } from "axios";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
// import { cancelOrderMail } from "@/lib/api/user/cancelOrderMailService";
import { shippingCompany } from "@/data/order/indes";
import { Invoice } from "@/types/admin/invoice.type";
import { useCustomerStore } from "@/store/Admin/useCustomerStore";
import { Button } from "@/components/ui/button";

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams(); // Get order id from url

  const [orderId, setOrderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");

  const { mutate: updateOrderStatus, isPending: updateOrderStatusLoading } =
    useUpdateOrderStatus(); // Update order status

  const [profileInvoice, setInvoice] = useState<Invoice | null>(null);

  const {
    data: orderSummary,
    isLoading: orderSummaryLoading,
    error: orderSummaryError,
    isError: orderSummaryIsError,
    refetch: orderSummaryRefetch,
  } = useGetOrderSummaryDetailsByOrderId(Number(orderId || 0)); // Get order summary details

  // Update order status
  const handleUpdateOrderStatus = (notes: string) => {
    updateOrderStatus(
      {
        orderId: Number(orderId || 0),
        notes,
      },
      {
        onSuccess: () => {
          toast.success("注文をキャンセルしました。");
          // handleCancelOrder(notes);
          orderSummaryRefetch();
          setOpen(false);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          toast.error(
            err.response?.data.message || "注文をキャンセルできませんでした。"
          );
          setOpen(false);
        },
      }
    );
  };

  // Send cancel order mail
  // const handleCancelOrder = async (notes: string) => {
  //   await cancelOrderMail({
  //     username:
  //       orderSummary?.shippingAddress?.firstName +
  //       " " +
  //       orderSummary?.shippingAddress?.lastName,
  //     orderId: Number(orderId || 0),
  //     total: orderSummary?.orderTotal || 0,
  //     eightPercentTotal: orderSummary?.eightPercentTotal || 0,
  //     tenPercentTotal: orderSummary?.tenPercentTotal || 0,
  //     products:
  //       orderSummary?.products.map((product) => ({
  //         product_name: product.productName,
  //         quantity: product.quantity,
  //         price: product.price,
  //         tax_amount: product.tax,
  //       })) || [],
  //     cancelReason: notes,
  //   }).then((res) => {
  //     if (res.success) {
  //       toast.success(res.message);
  //     } else {
  //       toast.error(res.message);
  //     }
  //   });
  // };
  const { data: receiptData } =
    useGetUserOrderReceipt(orderId || ""); // Update order status
  // const invoiceData = receiptData?.data;
  useEffect(() => {
    if (!receiptData) return;
    const invoice = receiptData as unknown as Invoice;
    setInvoice(invoice);
  }, [receiptData]);

  useEffect(() => {
    if (params.slug) {
      const decryptedOrderId = decryptString(params.slug as string);
      if (decryptedOrderId === null) {
        router.push("/profile");
        return;
      }
      setOrderId(decryptedOrderId);
    
    }
  }, [params.slug, router]);

  // If error, show error message
  useEffect(() => {
    if (orderSummaryIsError) {
      toast.error(orderSummaryError.message);
    }
  }, [orderSummaryIsError, orderSummaryError]);

  useEffect(() => {
    if (
      orderSummary?.orderStatus &&
      getOrderStatus(Number(orderSummary?.orderStatus)) === "キャンセル"
    ) {
      setReason(orderSummary?.notes || "");
    }
  }, [orderSummary?.orderStatus, orderSummary?.notes]);

    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadingInvoices, setDownloadingInvoices] = useState<
    Record<number, boolean>
  >({});
  const [currentInvoiceData, setCurrentInvoiceData] = useState<Invoice>(
    {} as Invoice,
  );
  const { data: orderDetails } = useGetOrderSummaryDetailsByOrderId(orderId ? Number(orderId) : 0);
  const [invoiceId, setInvoiceId] = useState<number>(0);
  const { downloadInvoiceReceipt, isDownloading } = useCustomerStore();

  const handleDownloadRecord = async (invoice: Invoice) => {
    if (!invoice?.id || isGeneratingPDF) return;
    try {
      setDownloadingInvoices((prev) => ({ ...prev, [invoice.id]: true }));
      setIsGeneratingPDF(true);
      setOrderId(invoice?.orderId.toString() || null);
      setInvoiceId(invoice.id);
      setCurrentInvoiceData(invoice);
    } catch (e) {
      console.error("請求書の生成に失敗しました", e);
      toast.error("請求書の生成に失敗しました");
      setDownloadingInvoices((prev) => ({ ...prev, [invoice.id]: false }));
    }
  };


  useEffect(() => {
    if (orderDetails) {
      if (orderDetails.products?.length > 0) {
        if (!currentInvoiceData?.userId) {
          // toast.error("ユーザーIDがありません");
          return;
        }
        toast.loading("請求書の生成中...");
        downloadInvoiceReceipt(
          profileInvoice?.userId?.toString() || "",
          profileInvoice || currentInvoiceData,
          orderDetails,
          "general",
          "user"
        ).finally(() => {
          setIsGeneratingPDF(false);
          setDownloadingInvoices((prev) => ({
            ...prev,
            [currentInvoiceData.id]: false,
          }));
          toast.dismiss();
        });
      }
    }
  }, [
    orderDetails,
    downloadInvoiceReceipt,
    invoiceId,
    currentInvoiceData,
    profileInvoice,
  ]);

  return (
    <div className="px-4">
      <div className="bg-white/50 border border-white-bg rounded-md p-4 md:p-6 drop-shadow-xl md:space-y-6 space-y-3">
        {/* Delivery Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <AddressCard
            icon={<Bike size={26} className="text-dark" />}
            title="配送先"
            name={
              orderSummary?.shippingAddress?.firstName +
              " " +
              orderSummary?.shippingAddress?.lastName
            }
            phone={orderSummary?.shippingAddress?.phone || ""}
            zipCode={orderSummary?.shippingAddress?.postalCode || ""}
            address={
              // orderSummary?.shippingAddress?.prefecture +
              //   " " +
                orderSummary?.shippingAddress?.city +
                " " +
                orderSummary?.shippingAddress?.street +
                " " +
                orderSummary?.shippingAddress?.building
                // " " +
                // orderSummary?.shippingAddress?.room || ""
            }
          />
          <DeliveryCard
            icon={<CreditCard size={26} className="text-dark" />}
            title="配送状況"
            company={
              shippingCompany.find(
                (company) => company.value === orderSummary?.shippingCompany
              )?.label || ""
            }
            trackingNumber={orderSummary?.trackingNumber || ""}
            deliveryDate={orderSummary?.shippingDate || ""}
          />
          <AddressCard
            icon={<ClipboardList size={26} className="text-dark" />}
            title="請求先"
            name={
              orderSummary?.billingAddress.firstName +
              " " +
              orderSummary?.billingAddress.lastName
            }
            phone={orderSummary?.billingAddress.phone || ""}
            zipCode={orderSummary?.billingAddress.postalCode || ""}
            address={
              // orderSummary?.billingAddress.prefecture +
              //   " " +
                orderSummary?.billingAddress.city +
                " " +
                orderSummary?.billingAddress.street +
                " " +
                orderSummary?.billingAddress.building
               // " " +
                // orderSummary?.billingAddress.room || ""
            }
            downLoadButton={
              <div className="flex justify-center gap-2">
                <Button
                  key={profileInvoice?.id}
                  onClick={() => handleDownloadRecord(profileInvoice as Invoice)}
                  disabled={
                    isGeneratingPDF ||
                    isDownloading ||
                    downloadingInvoices[profileInvoice?.id || 0]
                  }
                  className="w-[180px] flex items-center gap-2 bg-black hover:bg-black/80 text-white cursor-pointer"
                >
                  <FileText size={16} />
                  {isDownloading
                    ? "領収書生成中..."
                    : "領収書ダウンロード"}
                </Button>
              </div>
              // <InvoiceGenerator
              //   orderData={{
              //     order_id: orderSummary?.orderId || 0,
              //     order_date: dateArrayToString(orderSummary?.orderDate || []),
              //     payment_method: orderSummary?.paymentMethod || "",
              //     order_status:
              //       getOrderStatus(Number(orderSummary?.orderStatus)) || "",
              //     notes: orderSummary?.notes || "",
              //     shipping_company:
              //       shippingCompany.find(
              //         (company) =>
              //           company.value === orderSummary?.shippingCompany
              //       )?.label || "-",
              //     shipping_date: orderSummary?.shippingDate || "",
              //     tracking_number: orderSummary?.trackingNumber || "",
              //     shipping_cost: orderSummary?.shippingCost || 0,
              //     order_total: orderSummary?.orderTotal || 0,
              //     eight_percent_total: orderSummary?.eightPercentTotal || 0,
              //     ten_percent_total: orderSummary?.tenPercentTotal || 0,
              //     customer_id: orderSummary?.customerId || "",
              //     customer_name: orderSummary?.customerName || "",
              //     shipping_address: {
              //       first_name: orderSummary?.shippingAddress.firstName || "",
              //       last_name: orderSummary?.shippingAddress.lastName || "",
              //       phone: orderSummary?.shippingAddress.phone || "",
              //       postal_code: orderSummary?.shippingAddress.postalCode || "",
              //       prefecture: orderSummary?.shippingAddress.prefecture || "",
              //       city: orderSummary?.shippingAddress.city || "",
              //       street: orderSummary?.shippingAddress.street || "",
              //       building: orderSummary?.shippingAddress.building || "",
              //       room: orderSummary?.shippingAddress.room || "",
              //       country: orderSummary?.shippingAddress.country || "",
              //     },
              //     billing_address: {
              //       first_name: orderSummary?.billingAddress.firstName || "",
              //       last_name: orderSummary?.billingAddress.lastName || "",
              //       phone: orderSummary?.billingAddress.phone || "",
              //       postal_code: orderSummary?.billingAddress.postalCode || "",
              //       prefecture: orderSummary?.billingAddress.prefecture || "",
              //       city: orderSummary?.billingAddress.city || "",
              //       street: orderSummary?.billingAddress.street || "",
              //       building: orderSummary?.billingAddress.building || "",
              //       room: orderSummary?.billingAddress.room || "",
              //       country: orderSummary?.billingAddress.country || "",
              //     },
              //     products:
              //       orderSummary?.products.map((product) => ({
              //         product_id: product.productId,
              //         product_name: product.productName,
              //         quantity: product.quantity,
              //         price: product.price,
              //         subtotal: product.subtotal,
              //         tax: product.tax,
              //         tax_amount: product.tax,
              //         images: product.images,
              //       })) || [],
              //   }}
              //   disabled={orderSummaryLoading}
              // />
            }
          />
        </div>

        {/* Order Cancel Section */}
        <div className="space-y-2 md:mt-7 mt-5">
          <OrderCancelSection
            orderDate={dateArrayToString(orderSummary?.orderDate || []) || ""}
            paymentMethod={orderSummary?.paymentMethod || ""}
            open={open}
            setOpen={setOpen}
            isLoading={updateOrderStatusLoading}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            orderStatus={Number(orderSummary?.orderStatus || 0)}
            reason={reason}
            setReason={setReason}
          />

          {/* Order Details Table */}
          <div className="bg-white/50 border border-white-bg rounded-md">
            {/* Desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white-bg">
                    <TableHead className=" px-6 py-4">商品</TableHead>
                    <TableHead className="w-[100] px-6 py-4">
                      金額（税別）
                    </TableHead>
                    <TableHead className="w-[250px] px-6 py-4">個数</TableHead>
                    <TableHead className="w-[100px] px-6 py-4">
                      合計金額
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!orderSummaryLoading &&
                    orderSummary?.products.map((product: OrderProduct) => (
                      <TableRow
                        key={product.productId}
                        className="border-b border-white-bg"
                      >
                        <TableCell className="px-6 py-4">
                          <ProductCell
                            name={product.productName}
                            price={product.price}
                            image={
                              product.images[0]
                                ? getPublicUrl(product.images[0])
                                : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            }
                            onClick={() =>
                              router.push(
                                `/products/${encryptString(
                                  product.productId.toString()
                                )}`
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {convertToYen(product.price)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right px-6 py-4">
                          {convertToYen(product.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  {orderSummaryLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-white-bg"
                      >
                        <TableCell colSpan={4} className="p-4">
                          <Skeleton className="h-[50px] w-full bg-white-bg rounded-md p-2 mt-1" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <div className="">
                {!orderSummaryLoading &&
                  orderSummary?.products.map((product: OrderProduct) => (
                    <div
                      key={product.productId}
                      className="border-b border-white-bg"
                    >
                      <div className="px-3 py-3">
                        <ProductCell
                          name={product.productName}
                          price={product.price}
                          image={
                            product.images[0]
                              ? getPublicUrl(product.images[0])
                              : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          }
                          onClick={() =>
                            router.push(
                              `/products/${encryptString(
                                product.productId.toString()
                              )}`
                            )
                          }
                        />
                      </div>
                      <div className="px-3 mb-2 flex justify-between text-sm">
                        <p>個数: {product.quantity}</p>
                        <p>{convertToYen(product.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                {orderSummaryLoading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border-b border-white-bg">
                      <div className="p-4">
                        <Skeleton className="h-[50px] w-full bg-white-bg rounded-md p-2 mt-1" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {!orderSummaryLoading && (
            <div className="md:py-6 md:px-6 py-4 px-2 md:space-y-10 space-y-5">
              <div className="flex justify-between">
                <div className="w-full flex md:justify-end justify-between font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">小計</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(
                        orderSummary?.products.reduce(
                          (total: number, item: OrderProduct) =>
                            total + item.subtotal,
                          0
                        ) || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">送料</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(orderSummary?.shippingCost || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">税金(8%)</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(orderSummary?.eightPercentTotal || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">税金(10%)</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(orderSummary?.tenPercentTotal || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-2xl">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p>合計</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p>{convertToYen(orderSummary?.orderTotal || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {orderSummaryLoading && (
            <div className="flex pr-5 gap-4">
              <div className="md:block hidden w-[70%]" />

              <div className="md:w-[30%] w-full flex flex-col gap-5 justify-end font-semibold text-base">
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      <ServerActionLoadingComponent
        loading={updateOrderStatusLoading}
        message="注文状態を更新しています"
      />
    </div>
  );
};

export default OrderDetailsPage;
