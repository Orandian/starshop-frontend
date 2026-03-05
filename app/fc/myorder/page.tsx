"use client";

import PaginationComponent from "@/components/app/PaginationComponent";
import ImageComponent from "@/components/fc/ImageComponent";
import { OrderFilter } from "@/components/fc/order/OrderFilter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { useOrder, useOrderPeriodLists } from "@/hooks/fc";
import { Order } from "@/types/fc";
import {
  encryptString,
  formatDate,
  getPublicUrl,
  getOrderStatus,
  getOrderStatusClass,
  formatId,
} from "@/utils";
import { generatePDF } from "@/utils/fc/generateVoucherPdf";
import { fetchOrderItemsById } from "@/utils/fc/getOrderItemById";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import MobileTableCard from "@/components/fc/MobileTableCard";
import { Search, SearchX } from "lucide-react";

const MyOrdersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    orderDate: "",
    status: "",
  });
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const pageSize = 10;
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useOrder(
    page,
    pageSize,
    filters.search,
    filters.orderDate,
    parseInt(filters.status),
    period,
  );
  const { data: orderPeriodListsData } = useOrderPeriodLists();

  const orders: Order[] = ordersData?.data?.data || [];
  const pagination = ordersData?.data?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const total = ordersData?.data?.pagination.totalElements || 0;
  const [isOrderFilterShow, setIsOrderFilterShow] = useState(false);

  // generate pdf
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadingInvoices, setDownloadingInvoices] = useState<
    Record<number, boolean>
  >({});

  const { userDetail } = useFullUserDetail();

  const handleViewOrder = (orderId: number) => {
    // Implement order detail navigation logic here
    router.push(`/fc/myorder/${encryptString(orderId.toString())}`);
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters({
      ...newFilters,
      search: newFilters.search.trim(),
    });
    setPage(1); // Reset to first page when filters change
    refetch();
    // // Update URL with new filters
    // const params = new URLSearchParams();
    // if (newFilters.search) params.set("search", newFilters.search);
    // if (newFilters.orderDate) params.set("orderDate", newFilters.orderDate);
    // if (newFilters.status) params.set("status", newFilters.status);
    // router.push(`/fc/myorder?${params.toString()}`);
  };

  /**
   * Handle page change for pagination
   * @param newPage new page number
   * @author Phway
   * @date 2025-11-27
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL without causing a full page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/fc/myorder?${params.toString()}`, { scroll: false });
  };

  /**
   * Generate pdf functions
   * @param orderItems
   */
  const handleGeneratePDF = async (orderId: number) => {
    try {
      setIsGeneratingPDF(true);
      setDownloadingInvoices((prev) => ({ ...prev, [orderId]: true }));
      const orderItems = await fetchOrderItemsById(orderId);
      if (orderItems.length > 0 && userDetail?.data) {
        //process invoiceNumner
        const invoiceId = ordersData?.data?.data?.find(
          (order) => order.orderId === orderId,
        )?.invoices?.[0].invoiceId;
        const createdDate = ordersData?.data?.data?.find(
          (order) => order.orderId === orderId,
        )?.invoices?.[0].createdAt;
        const invoiceNumber = formatId(createdDate as number[], invoiceId || 0);
        await generatePDF(userDetail?.data, orderItems, invoiceNumber);
      } else {
        toast.error("請求書の生成に失敗しました");
      }
    } catch (e) {
      console.error("請求書の生成に失敗しました", e);
      toast.error("請求書の生成に失敗しました");
    } finally {
      setIsGeneratingPDF(false);
      setDownloadingInvoices((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handlePeriodChange = (selectedPeriod: string) => {
    return () => {
      handlePageChange(1);
      setPeriod(selectedPeriod);
    };
  };

  return (
    <div className="w-full  ">
      <div className="w-full px-4 md:px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="my-4 font-bold">私の注文</h2>
        </div>

        {/* All and Month Filter */}
        <div className="w-full   bg-white h-auto">
          <div className="flex gap-4  items-center">
            <Button
              onClick={handlePeriodChange("all")}
              className={`w-14 md:w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark ${period === "all" ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}
            >
              All
            </Button>
            {orderPeriodListsData?.data?.map((p) => (
              <Button
                key={p.orderYearMonth}
                onClick={handlePeriodChange(p.orderYearMonth)}
                className={`w-18 md:w-28   flex justify-center items-center   text-white rounded-full text-sm hover:bg-dark ${period === p.orderYearMonth ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}
              >
                {p.orderYearMonth}
              </Button>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <OrderFilter
          onFilter={handleFilter}
          initialFilters={filters}
          period={period}
          className={` ${isOrderFilterShow ? "block" : "hidden"} md:block`}
        />

        <div className="p-2 pt-0 flex items-center justify-between mt-4">
          <span className="text-sm"> {total ? total : 0}件</span>
          <Button
            onClick={() => setIsOrderFilterShow(!isOrderFilterShow)}
            className={`block md:hidden ${isOrderFilterShow ? "bg-red-200" : "bg-gray-400"}`}
          >
            {isOrderFilterShow ? (
              <SearchX className="w-4 h-4 text-red-600" />
            ) : (
              <Search className="w-4 h-4 text-white" />
            )}
          </Button>
        </div>

        <div className="overflow-x-auto border border-disabled/20 mb-6 rounded-lg hidden md:block">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[800px] md:w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-2.5">
                        NO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        購入日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        商品名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        購入金額（税別）
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        消費税
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                        送料
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        合計購入金額
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                        転送伝票番号
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        請求書
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      Array.from({ length: pageSize }).map((_, index) => (
                        <TableRow
                          key={index}
                          className="border-b border-black/10"
                        >
                          <TableCell colSpan={10} className="h-10 text-center">
                            <Skeleton className="w-full h-full bg-white-bg" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr
                          key={order.orderId}
                          className="hover:bg-gray-50 group"
                        >
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                           {(page - 1) * pageSize + index + 1}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            {formatDate(order.orderDate)}
                          </td>

                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer group-hover:bg-gray-50"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            {order.orderItems.map((item) => (
                              <div
                                key={item.orderDetailId}
                                className="flex items-center gap-3 mb-2"
                              >
                                <div className="shrink-0 w-10 h-10">
                                  <ImageComponent
                                    imgURL={getPublicUrl(
                                      item.product.images?.[0]?.imageUrl || "",
                                    )}
                                    imgName="product"
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div className="flex flex-col text-gray-500">
                                  <span className="text-gray-900 font-medium">
                                    {item.productName}
                                  </span>
                                  ¥
                                  {Number(item.priceAtPurchase).toLocaleString(
                                    "ja-JP",
                                  )}{" "}
                                  * {item.quantity}
                                </div>
                              </div>
                            ))}
                          </td>

                          {/* 購入金額（税別） */}
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer group-hover:bg-gray-50"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            {"¥" +
                              (order?.totalPriceNoTax?.toLocaleString(
                                "ja-JP",
                              ) ?? "0")}
                          </td>

                          {/* 消費税 */}
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer group-hover:bg-gray-50"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            {"¥" +
                              (order?.totalTax?.toLocaleString("ja-JP") ?? "0")}
                          </td>

                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            {"¥" + order.shippingCost}
                          </td>

                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            {"¥" + order.totalPrice?.toLocaleString()}
                          </td>

                          <td
                            className="px-6 py-4 whitespace-nowrap cursor-pointer"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            <span
                              className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 ${getOrderStatusClass(order.orderStatus)}`}
                            >
                              {getOrderStatus(order.orderStatus)}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                            onClick={() => handleViewOrder(order.orderId)}
                          >
                            <span className="text-blue-600">
                              {order.shippingCompany === 1
                                ? "ヤマト運輸"
                                : order.shippingCompany === 2
                                  ? "佐川急便"
                                  : order.shippingCompany === 3
                                    ? "日本郵便"
                                    : order.shippingCompany === 4
                                      ? "DHL"
                                      : order.shippingCompany === 5
                                        ? "FedEx"
                                        : "未設定"}
                            </span>
                            <br />
                            <a href="" className="underline text-blue-600">
                              {order.trackingNumber}
                            </a>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">
                            {/* status 4 = failed, status 5 = calcelled , not show download button */}
                            {order.orderStatus !== 4 &&
                              order.orderStatus !== 5 && (
                                <button
                                  key={order.orderId}
                                  onClick={() =>
                                    handleGeneratePDF(order?.orderId)
                                  }
                                  disabled={
                                    isGeneratingPDF ||
                                    downloadingInvoices[order.orderId]
                                  }
                                  className="flex items-center justify-center gap-2"
                                >
                                  {downloadingInvoices[order.orderId]
                                    ? "ダウンロード中..."
                                    : "ダウンロード"}
                                </button>
                              )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-6 py-3 text-center text-sm text-gray-500"
                        >
                          レコードがありません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 my-2 w-full text-center">
                <Skeleton className="w-full h-full bg-white-bg" />
              </div>
            ))
          ) : orders.length > 0 ? (
            orders.slice(0, 5).map((order, index) => {
              const items = [
                { label: "No.", value: index + 1 },
                { label: "購入日", value: formatDate(order.orderDate) },
                {
                  label: "商品名",
                  value: order.orderItems.map((item) => ({
                    src: getPublicUrl(item.product.images?.[0]?.imageUrl || ""),
                    alt: item.productName,
                    text: `¥${Number(item.priceAtPurchase).toLocaleString("ja-JP")} * ${item.quantity}`,
                  })),
                  type: "image" as const,
                },
                {
                  label: "購入金額（税別）",
                  value:
                    "¥" +
                    (order?.totalPriceNoTax?.toLocaleString("ja-JP") ?? "0"),
                },
                {
                  label: "消費税",
                  value:
                    "¥" + (order?.totalTax?.toLocaleString("ja-JP") ?? "0"),
                },
                {
                  label: "送料",
                  value: "¥" + order.shippingCost,
                },
                {
                  label: "合計購入金額",
                  value:
                    "¥" + (order?.totalPrice?.toLocaleString("ja-JP") ?? "0"),
                },
                {
                  label: "ステータス",
                  value: getOrderStatus(order.orderStatus),
                  type: "badge" as const,
                  badgeColor: getOrderStatusClass(order.orderStatus),
                },
                {
                  label: "転送伝票番号",
                  value:
                    order.shippingCompany === 1
                      ? "ヤマト運輸"
                      : order.shippingCompany === 2
                        ? "佐川急便"
                        : order.shippingCompany === 3
                          ? "日本郵便"
                          : order.shippingCompany === 4
                            ? "DHL"
                            : order.shippingCompany === 5
                              ? "FedEx"
                              : "未設定" +
                                " " +
                                (order.trackingNumber
                                  ? order.trackingNumber
                                  : "-"),
                  type: "link" as const,
                },
                {
                  label: "請求書",
                  value: "ダウンロード",
                  href: "",
                  onClick: () => handleGeneratePDF(order?.orderId),
                  type: "link" as const,
                },
              ];

              return <MobileTableCard key={index} items={items} />;
            })
          ) : (
            <div>
              <div className="px-6 py-3 text-center text-sm text-gray-500">
                レコードがありません
              </div>
            </div>
          )}
        </div>

        {!isLoading && orders?.length > 0 && totalPages !== 1 && (
          <div className="flex justify-end">
            <div>
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
