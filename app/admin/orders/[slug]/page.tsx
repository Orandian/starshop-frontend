"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import ImageCardComponent from "@/components/admin/ImageCardComponent";
import {
  //useConfirmOrder,
  useGetOrderSummaryDetailsByOrderId,
  useUpdateOrderStatus,
  useSendDeliveryInformationMail,
} from "@/hooks/admin/useOrder";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  convertToYen,
  decryptString,
  formatDate,
  formatDate2,
  getPublicUrl,
} from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderStatus, shippingCompany, fcRoles } from "@/data/order/indes";
import { OrderProduct } from "@/types/orders";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "@/lib/api/api.gateway";

const FormSchema = z.object({
  shipping_company: z.number().min(1, "配達会社は必須です"),
  tracking_number: z.string().min(1, "追跡番号は必須です"),
  shipping_date: z.string().min(1, "配達日は必須です"),
});

const OrdersPage = () => {
  const params = useParams(); // params
  const router = useRouter();

  const [orderId, setOrderId] = useState<number | null>(null); // order id

  // Get order details
  const {
    data: orderDetails,
    isLoading,
    error,
    isError,
    refetch: refetchOrderDetails,
  } = useGetOrderSummaryDetailsByOrderId(orderId || 0);

  // const { mutate: confirmOrder, isPending: isConfirmOrderPending } =
  //   useConfirmOrder();

  // Update shipping tracking number
  // const {
  //   mutate: updateShippingTrackingNumber,
  //   isPending: updateShippingTrackingNumberLoading,
  // } = useUpdateShippingTrackingNumber();

  // Update order status
  const { mutate: updateOrderStatus, isPending: updateOrderStatusLoading } =
    useUpdateOrderStatus();

  //email send
  const {
    mutate: sendDeliveryInformationMail,
    isPending: sendDeliveryInformationMailLoading,
  } = useSendDeliveryInformationMail(orderId || 0);

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      shipping_company: 1,
      tracking_number: "",
      shipping_date: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updateOrderStatus(
      {
        orderId: orderId || 0,
        trackingNumber: data.tracking_number,
        deliveryCompany: data.shipping_company,
        status: orderStatus[2].value,
        shippingDate: data.shipping_date,
      },
      {
        onSuccess: () => {
          toast.success("配達状況を更新しました");
          handleSendMail();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleSendMail = () => {
    if (!orderId) {
      toast.error("注文IDがありません");
      return;
    }

    // Show loading toast
    const toastId = toast.loading("配送情報メールを送信中...");

    sendDeliveryInformationMail(undefined, {
      onSuccess: () => {
        toast.success("配送情報メールを送信しました", { id: toastId });
        refetchOrderDetails();
      },
      onError: (error) => {
        if (error instanceof Error) {
          const apiError = error as ApiError;
          toast.error(apiError.data?.message || error.message);
        } else {
          toast.error("メールの送信に失敗しました");
        }
      },
    });
  };

  // const updateConfirmOrderForFc = () => {
  //   if (!orderDetails?.orderId || !orderDetails?.customerId) {
  //     toast.error("注文IDまたはFCIDが不明です");
  //     return;
  //   }
  //   confirmOrder(
  //     {
  //       orderId: Number(orderDetails?.orderId),
  //       fcId: Number(orderDetails?.customerId),
  //     },
  //     {
  //       onSuccess: () => {
  //         toast.success("FC確認を更新しました");
  //         refetchOrderDetails();
  //       },
  //       onError: (error) => {
  //         toast.error(error.message || "FC確認の更新に失敗しました");
  //       },
  //     }
  //   );
  // };

  const handleToOrdersPage = () => {
    router.push("/admin/orders");
  };

  // const handleUpdateOrderStatus = (status: string) => {
  //   updateOrderStatus(
  //     {
  //       orderId: orderId || 0,
  //       status: Number(status),
  //     },
  //     {
  //       onSuccess: () => {
  //         toast.success("注文状態を更新しました");
  //         refetchOrderDetails();
  //       },
  //       onError: (error) => {
  //         toast.error(error.message);
  //       },
  //     }
  //   );
  // };

  useEffect(() => {
    if (params.slug) {
      const decryptedOrderId = decryptString(params.slug as string);
      setOrderId(Number(decryptedOrderId));
    }
  }, [params.slug]);

  useEffect(() => {
    if (error && isError) {
      toast.error(error.message);
    }

    if (orderDetails && orderDetails.orderId) {
      const timer = setTimeout(() => {
        const shippingDate = orderDetails.shippingDate
          ? formatDate2(orderDetails.shippingDate as string)
          : "";

        form.reset({
          shipping_company: orderDetails.shippingCompany || 1,
          tracking_number: orderDetails.trackingNumber || "",
          shipping_date: shippingDate,
        });
      }, 100);

      // Cleanup timeout to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [error, isError, form, orderDetails]);

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
            onClick={handleToOrdersPage}
          >
            <ArrowLeft className="cursor-pointer" size={20} />
          </div>
          {/* {orderDetails?.adminConfirmStatus === -1 && (
            <Button
              onClick={updateConfirmOrderForFc}
              className="px-4 py-3 rounded-xl bg-[#9399D4] cursor-pointer"
              disabled={
                !orderDetails?.orderId ||
                !orderDetails?.customerId ||
                isConfirmOrderPending
              }
            >
              <p className="text-xs text-white">
                {isConfirmOrderPending ? "処理中..." : "支払い確認済み"}
              </p>
            </Button>
          )} */}
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
                  <span className="text-normal text-dark  ">:</span>
                  <h2 className="text-normal text-dark word-break break-all">
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
                      orderDetails?.fcRole || 0
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
                  <p className="text-normal text-dark word-break break-all">
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
                            company.value === orderDetails?.shippingCompany
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
                    {orderDetails?.shippingDate
                      ? orderDetails?.shippingDate
                      : "未設定"}
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
          {/* 配達状況 */}
          <div className="flex flex-col h-full p-7 bg-white-bg rounded-[10px] tracking-wider">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-dark">配達状況</h3>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 mt-5"
              >
                {/* Shipping Date */}
                <AdminDatePicker
                  value={form.watch("shipping_date")}
                  onChange={(date) => {
                    form.setValue("shipping_date", date, {
                      shouldValidate: true,
                    });
                  }}
                  minDate={new Date(Date.now() - 24 * 60 * 60 * 1000)} 
                  styleName="w-full border border-white-bg bg-white rounded-md mt-2"
                />

                <Controller
                  control={form.control}
                  name="shipping_company"
                  render={({ field }) => {
                    // Convert number → string for UI
                    const fieldValueStr = field.value
                      ? String(field.value)
                      : "";

                    const selected = shippingCompany.find(
                      (company) => String(company.value) === fieldValueStr
                    );

                    return (
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))} // string → number
                        value={fieldValueStr}
                        // disabled={orderDetails?.adminConfirmStatus === -1}
                      >
                        <SelectTrigger className="w-full placeholder:text-sm bg-white border border-black/10 rounded-[5px] p-2">
                          <SelectValue
                            placeholder={
                              selected
                                ? selected.label
                                : "配達会社を選択してください"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent className="bg-white border border-black/10 rounded-[5px]">
                          {shippingCompany.map((company) => (
                            <SelectItem
                              key={company.value}
                              value={String(company.value)}
                            >
                              {company.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {form.formState.errors.shipping_company && (
                  <p className="text-xs text-[#FF0000]">
                    {form.formState.errors.shipping_company?.message}
                  </p>
                )}
                <FormInputComponent
                  control={form.control}
                  label=""
                  name="tracking_number"
                  type="text"
                  placeholder="追跡番号"
                  className="bg-white text-xs"
                  // disabled={orderDetails?.adminConfirmStatus === -1}
                />
                {/* <Controller
                  control={form.control}
                  name="shipping_date"
                  render={({ field }) => (
                    <AdminDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      styleName="w-full border border-white rounded-md p-2 bg-white"
                    />
                  )}
                />
                {form.formState.errors.shipping_date && (
                  <p className="text-xs text-[#FF0000]">
                    {form.formState.errors.shipping_date?.message}
                  </p>
                )} */}

                {/* {orderDetails?.adminConfirmStatus !== -1 && ( */}
                <Button
                  type="submit"
                  className="py-2 bg-black text-white-bg px-5 rounded-md mt-1 text-xs cursor-pointer hover:bg-black/80 disabled:bg-black/50"
                  disabled={
                    updateOrderStatusLoading ||
                    sendDeliveryInformationMailLoading
                  }
                >
                  {updateOrderStatusLoading
                    ? "更新中..."
                    : sendDeliveryInformationMailLoading
                      ? "メールを送信中..."
                      : "配達済みにする"}
                </Button>
                {/* )} */}
              </form>
            </Form>
          </div>
        </div>

        {/* 注文商品 */}
        <div className="flex flex-wrap items-center justify-between mt-10 md:mt-0 mb-5 md:mb-2 gap-2">
          <p className="text-normal text-dark">
            注文日時：
            {formatDate(orderDetails?.orderDate || "")}
          </p>
          {/* <Select
            value={orderDetails?.orderStatus.toString()}
            onValueChange={(value) => handleUpdateOrderStatus(value)}
            disabled={updateOrderStatusLoading}
          >
            <SelectTrigger className="w-full md:w-[180px] border border-black/10 text-black">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-black/10 text-black">
              {orderStatus.map((status) => (
                <SelectItem key={status.value} value={status.value.toString()}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
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
                          imgURL={
                            item.images?.length
                              ? getPublicUrl(item.images[0])
                              : "/placeholder-product.png"
                          }
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
                      0
                    ) || 0
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

      <ServerActionLoadingComponent
        loading={updateOrderStatusLoading}
        message={"注文状態を更新しています"}
      />
    </section>
  );
};

export default OrdersPage;
