"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderFilter } from "@/components/admin/order/OrderFilter";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetOrderSummaries,
  useGetPeriodList,
  useExportOrderSummariesToCSV,
  useSendShippingOrderConfirmationMail,
} from "@/hooks/admin/useOrder";
import PaginationComponent from "@/components/app/PaginationComponent";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  // convertToLocaleDateTime,
  convertToYen,
  encryptString,
  formatDate,
  orderFormatDate,
  getOrderStatus,
  getOrderStatusClass,
  // getProfileImage,
  getPublicUrl,
  navigateToDeliveryService,
} from "@/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { OrderType } from "@/types/orders";
import ImageComponent from "@/components/fc/ImageComponent";
// import defaultImage from "@/public/profile/profileDummy.jpg";
import { shippingCompany, userType } from "@/data/order/indes";
import { useCsvDownloader } from "@/hooks/admin/useCsvDownloader";
import { User, Mail, FileSpreadsheet } from "lucide-react";
import { useCSVImporter } from "@/hooks/admin/useCSVImporter";
import { ApiError } from "@/lib/api/api.gateway";

const FilterButton = ({
  title,
  //count,
  onClick,
  active,
}: {
  title: string;
  count: number;
  onClick: () => void;
  active: boolean;
}) => {
  return (
    <Button
      key={title}
      onClick={() => {
        onClick();
      }}
      className={cn(
        "min-w-28 flex justify-center items-center gap-2 px-2 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer",
        active
          ? "bg-black text-white hover:bg-black"
          : "bg-transparent border border-black text-black hover:bg-black/20",
      )}
    >
      <span className="mx-2">{title}</span>
      {/* <span className="ml-2 text-xs rounded-full py-1 px-2 font-medium text-black bg-gray-200">
        {count}
      </span> */}
    </Button>
  );
};

const OrdersPage = () => {
  const router = useRouter(); // router

  const [pageSize] = useState(10); // page size
  const [page, setPage] = useState(1); // page

  const [filters, setFilters] = useState({
    orderId: "",
    userName: "",
    orderDate: "",
    orderStatus: "",
    userType: "all",
    yearMonth: "",
  });

  // order summaries hooks
  const {
    data: orderSummaryData,
    isLoading: orderSummaryLoading,
    error: orderSummaryError,
    isError: orderSummaryIsError,
    refetch: refetchOrderSummaries,
  } = useGetOrderSummaries(
    page,
    pageSize,
    filters.userType,
    filters.orderId,
    filters.userName,
    filters.orderStatus,
    filters.orderDate,
    filters.yearMonth,
  );

  //get period List
  const { data: periodListData } = useGetPeriodList();
  const periodList = periodListData ? ["All", ...periodListData] : ["All"];

  //export csv
  const { mutate: exportOrderSummariesToCSV } =
    useExportOrderSummariesToCSV(filters);

  const { downloadCsv, isDownloading: csvDownloading } = useCsvDownloader(
    exportOrderSummariesToCSV,
  );

  const total = orderSummaryData?.pagination?.totalElements || 0; // total
  const totalPages = Math.ceil(total / pageSize); // total pages

  //send 1 day order confirmation mail
  const { mutate: sendShippingOrderConfirmationMail } =
    useSendShippingOrderConfirmationMail();
  const [isSendingMail, setIsSendingMail] = useState(false);

  //csv import
  const {
    handleCSVUpload,
    handleFileChange,
    isUploading,
    fileInputRef,
    isSuccess,
  } = useCSVImporter();

  /**
   * Handle filter change
   * @param newFilters new filter values
   * @author
   * @date 2026-01-05
   */
  const handleFilter = (newFilters: {
    orderId: string;
    userName: string;
    orderDate: string;
    orderStatus: string;
  }) => {
    setFilters({
      ...filters,
      orderId: newFilters.orderId ?? filters.orderId,
      userName: newFilters.userName ?? filters.userName,
      orderDate: newFilters.orderDate ?? "",
      orderStatus: newFilters.orderStatus ?? filters.orderStatus,
    });
    setPage(1);
  };

  /**
   * Handle CSV download
   * @author Phway
   * @date 2026-01-05
   */
  const handleDownloadCSV = () => {
    downloadCsv(undefined, "注文", {
      onSuccess: () => {
        toast.success("CSV出力が完了しました");
      },
      onError: (error) => {
        if (error instanceof Error) {
          const apiError = error as ApiError;
          toast.error(apiError.data?.message || error.message);
        } else {
          toast.error("CSV出力に失敗しました");
        }
      },
    });
  };

  /**
   * Error handling
   */
  useEffect(() => {
    if (orderSummaryError && orderSummaryIsError) {
      toast.error(orderSummaryError.message);
    }
  }, [orderSummaryError, orderSummaryIsError]);

  /**
   * Handle 1 day order confirmation mail
   * @author Phway
   */
  const handle1DayOrderConfirmationMail = () => {
    setIsSendingMail(true);
    const loadingToast = toast.loading(
      "1日以内の発送注文確認メールを送信中...",
    );
    sendShippingOrderConfirmationMail(undefined, {
      onSuccess: () => {
        setIsSendingMail(false);
        toast.dismiss(loadingToast);
        toast.success("1日以内の発送注文確認メールが送信されました");
      },
      onError: (error) => {
        setIsSendingMail(false);
        toast.dismiss(loadingToast);
        if (error instanceof Error) {
          const apiError = error as ApiError;
          toast.error(apiError.data?.message || error.message);
        } else {
          toast.error("メールの送信に失敗しました");
        }
      },
    });
  };

  //refetch data if import success
  useEffect(() => {
    if (isSuccess) {
      refetchOrderSummaries();
    }
  }, [isSuccess, refetchOrderSummaries]);

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between">
          <div className="flex items-center gap-10">
            <h2>注文一覧</h2>
            <div className="flex items-center gap-2">
              {[
                {
                  title: "ALL",
                  count: orderSummaryData?.extra.all || 0,
                  active: true,
                  value: "all",
                },
                {
                  title: "一般",
                  count: orderSummaryData?.extra.customer || 0,
                  active: false,
                  value: "customer",
                },
                {
                  title: "代理店",
                  count: orderSummaryData?.extra.fc || 0,
                  active: false,
                  value: "fc",
                },
                // {
                //   title: "FC初期購入",
                //   count: orderSummaryData?.extra.fcInitial || 0,
                //   active: false,
                //   value: "fc_initial",
                // },
              ].map((item, index) => (
                <FilterButton
                  key={index}
                  title={item.title}
                  count={item.count}
                  onClick={() => {
                    setFilters({ ...filters, userType: item.value });
                    setPage(1);
                  }}
                  active={item.value === filters.userType}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Filter & Search */}
        {/* All and Month Filter */}
        <div className="w-full   bg-white h-auto">
          <div className="flex gap-4  items-center">
            {periodList.map((dateString: string) => (
              <Button
                key={dateString}
                className={`w-28 flex justify-center items-center text-white rounded-full text-sm hover:bg-dark ${
                  (dateString === "All" && !filters.yearMonth) ||
                  filters.yearMonth === dateString
                    ? "bg-black text-white hover:bg-black"
                    : "bg-transparent border border-black text-black hover:bg-black/20"
                }`}
                onClick={() => {
                  setFilters({
                    ...filters,
                    yearMonth: dateString === "All" ? "" : dateString,
                  });
                  setPage(1);
                }}
              >
                {dateString} {/* Or format this date as needed */}
              </Button>
            ))}
          </div>
        </div>
        {/* Filter Section */}
        <OrderFilter
          onFilter={handleFilter}
          initialFilters={filters}
          period={filters.yearMonth}
        />
        {/* CSV Export Button and Results Count */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm">
              {orderSummaryData?.pagination.totalElements || 0}件
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Import csv  */}
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={handleCSVUpload}
              disabled={isUploading || !orderSummaryData?.data.length}
              className={`bg-primary ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"} min-w-42 text-white px-6 py-2 rounded-md flex items-center gap-2`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isUploading ? "CSVインポート中..." : "CSVインポート"}
            </Button>

            {/* one day order send mail  */}
            <Button
              onClick={() => {
                handle1DayOrderConfirmationMail();
              }}
              disabled={
                isSendingMail ||
                orderSummaryData?.pagination.totalElements === 0
              }
              className={`bg-primary ${isSendingMail ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"} min-w-42 text-white px-6 py-2 rounded-md flex items-center gap-2`}
            >
              <Mail className="w-4 h-4" />
              {isSendingMail ? "確認メール送信中..." : "確認メール送信"}
            </Button>
            {/* csv download button */}
            <Button
              onClick={() => {
                handleDownloadCSV();
              }}
              disabled={
                csvDownloading ||
                orderSummaryLoading ||
                !orderSummaryData?.data.length
              }
              className="min-w-42 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {csvDownloading ? "CSVエクスポート中... " : "CSVエクスポート"}
            </Button>
          </div>
        </div>
        {/* Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                  注文ID
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  氏名
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                  購入日時
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  ブランド名
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[140px]">
                  合計金額（税込）
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                  配送伝票番号
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!orderSummaryLoading &&
                orderSummaryData?.data?.map((order: OrderType) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2"
                    key={order.orderId}
                  >
                    {/* 注文ID */}
                    <TableCell className="px-6 py-3">
                      #
                      {order.orderDate
                        ? `${(orderFormatDate(order.orderDate) ?? "").replaceAll("/", "")}-${order.orderId}`
                        : `${order.orderId}`}
                    </TableCell>

                    {/* 氏名 */}
                    <TableCell className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {order.customerPhoto &&
                        order.customerPhoto.trim() !== "" &&
                        order.customerPhoto.length > 4 &&
                        (order.customerPhoto.startsWith("http://") ||
                          order.customerPhoto.startsWith("https://") ||
                          order.customerPhoto.startsWith("/")) ? (
                          <ImageComponent
                            imgURL={
                              order.customerPhoto
                                ? getPublicUrl(order.customerPhoto)
                                : ""
                            }
                            imgName={order.customerName.slice(0, 2)}
                            className="rounded-full object-cover w-10 h-10 mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 mr-3 bg-gray-200 flex items-center justify-center text-gray-500 rounded-full">
                            <User className="w-8 h-8" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-gray-500">
                            {
                              userType.find(
                                (u) => u.value === Number(order.userType),
                              )?.label
                            }
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* 購入日時 */}
                    <TableCell className="px-6 py-3">
                      {formatDate(order.orderDate)}
                    </TableCell>

                    {/* ブランド名 */}
                    <TableCell className="px-6 py-3">
                      {order.orderItems[0]?.brands?.[0]?.name || "-"}
                    </TableCell>

                    {/* 合計金額（税込） */}
                    <TableCell className="px-6 py-3 text-right font-medium">
                      {convertToYen(order.orderTotal)}
                    </TableCell>

                    {/* ステータス */}
                    <TableCell className="px-6 py-3 text-center">
                      <span
                        className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 ${getOrderStatusClass(Number(order.orderStatus))}`}
                      >
                        {getOrderStatus(Number(order.orderStatus), true)}
                      </span>
                    </TableCell>

                    {/* 配送伝票番号 */}
                    <TableCell className="px-6 py-3">
                      {(() => {
                        const company = shippingCompany.find(
                          (s) => s.value === Number(order.deliveryCompany),
                        );

                        const hasTracking =
                          company &&
                          order.trackingNumber &&
                          order.deliveryCompany;

                        const trackingUrl = hasTracking
                          ? navigateToDeliveryService(
                              order.trackingNumber || "",
                              Number(order.deliveryCompany),
                            )
                          : "#";

                        return (
                          <div
                            className={`text-left ${
                              hasTracking
                                ? "text-blue-800 underline underline-offset-2"
                                : ""
                            }`}
                          >
                            <p>
                              {company && hasTracking ? (
                                <a
                                  href={trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {company.label}
                                </a>
                              ) : (
                                "未設定"
                              )}
                            </p>

                            <p>
                              {hasTracking ? (
                                <a
                                  href={trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {order.trackingNumber}
                                </a>
                              ) : (
                                ""
                              )}
                            </p>
                          </div>
                        );
                      })()}
                    </TableCell>

                    {/* 操作 */}
                    <TableCell className="px-6 py-3 text-center">
                      <Button
                        onClick={() =>
                          router.push(
                            `/admin/orders/${encryptString(order.orderId.toString())}`,
                          )
                        }
                        className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                      >
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {orderSummaryData?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    注文がありません
                  </TableCell>
                </TableRow>
              )}
              {orderSummaryLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={8} className="h-24 text-center">
                      <Skeleton className="h-24 w-full bg-white-bg rounded-[10px]" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {!orderSummaryLoading &&
          orderSummaryData &&
          orderSummaryData?.data?.length > 0 &&
          (orderSummaryData?.pagination?.totalElements ?? 0) > pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default OrdersPage;
