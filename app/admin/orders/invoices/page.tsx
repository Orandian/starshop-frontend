/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { convertToYen, formatDate } from "@/utils";
import { toast } from "sonner";
import {
  useGetInvoice,
  useChangeStatus,
  useExportToCSV,
} from "@/hooks/admin/useInvoice";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationComponent from "@/components/app/PaginationComponent";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { useCustomerStore } from "@/store/Admin/useCustomerStore";
import { Invoice } from "@/types/admin/invoice.type";
import { useCsvDownloader } from "@/hooks/admin/useCsvDownloader";
import { useGetOrderSummaryDetailsByOrderId } from "@/hooks/admin/useOrder";
import { InvoiceFilter } from "@/components/admin/order/InvoiceFilter";

const FilterButton = ({
  title,
  count,
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
        "min-w-28 flex justify-between items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
        active
          ? "bg-black text-white hover:bg-black"
          : "bg-transparent border border-black text-black hover:bg-black/20"
      )}
    >
      <span className="mx-2">{title}</span>
      <span className="text-xs rounded-full py-1 px-2 font-medium text-black bg-gray-200">
        {count}
      </span>
    </Button>
  );
};

const InvoicesPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("general");
  //pagination
  const pageSize = 10;
  const [page, setPage] = useState(1);
  //注文ID、氏名、購入日、ステータス、リセット、　検索ボタン
  const [filters, setFilters] = useState({
    orderId: "",
    userName: "",
    orderDate: "",
    invoiceStatus: "",
    userType: "general",
  });
  //invoice hook
  const {
    data: invoices,
    error,
    isError,
    refetch,
    isLoading,
  } = useGetInvoice(
    filters.userType,
    page,
    pageSize,
    filters.orderId,
    filters.userName,
    filters.invoiceStatus,
    filters.orderDate
  );

  //total vals
  const totalReceipts = invoices?.extra?.totalReceipts || 0;
  const totalInvoices = invoices?.extra?.totalInvoices || 0;

  //pagination
  const total = invoices?.pagination?.totalElements || 0;
  const totalPages = Math.ceil(total / pageSize);

  const [invoiceId, setInvoiceId] = useState<number>(0);
  const [statusToChange, setStatusToChange] = useState<number>(0);

  //csv download
  const { mutate: exportToCSV } = useExportToCSV(filters);
  const { downloadCsv, isDownloading: csvDownloading } =
    useCsvDownloader(exportToCSV);

  //pdf generate
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadingInvoices, setDownloadingInvoices] = useState<
    Record<number, boolean>
  >({});
  const [orderId, setOrderId] = useState<number>(0);
  const [currentInvoiceData, setCurrentInvoiceData] = useState<Invoice>(
    {} as Invoice
  );
  const { data: orderDetails } = useGetOrderSummaryDetailsByOrderId(orderId);
  const [isDownloadTriggered, setIsDownloadTriggered] = useState(false);

  //store
  const { downloadInvoiceReceipt, isDownloading } = useCustomerStore();

  // Change invoice status hooks
  const {
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingInvoiceStatus,
  } = useChangeStatus(invoiceId, statusToChange, selectedFilter);

  
  // Error handling
  useEffect(() => {
    // error
    if (isError) {
      toast.error(error?.message);
    }

    // change status error
    if (changeStatusError) {
      toast.error(changeStatusError?.message);
    }

    // change status success
    if (isSuccess) {
      toast.success(changeStatusData?.message);
      refetch();
    }
  }, [isError, error, changeStatusError, isSuccess, changeStatusData, refetch]);

  /**
   * handle csv download
   * @author Phway
   * @date 2026-01-05
   */
  const handleDownloadCSV = () => {
    downloadCsv(undefined, `${selectedFilter === "fc" ? "請求書" : "領収書"}`, {
      onSuccess: () => {
        toast.success("CSV出力が完了しました");
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("CSV出力に失敗しました");
        }
      },
    });
  };

  useEffect(() => {
    if (orderDetails && isDownloadTriggered) {
      if (orderDetails.products?.length > 0 && selectedFilter !== "") {
        if (!currentInvoiceData?.userId) {
          toast.error("ユーザーIDがありません");
          return;
        }
        toast.loading("請求書の生成中...");
        downloadInvoiceReceipt(
          currentInvoiceData?.userId?.toString(),
          currentInvoiceData,
          orderDetails,
          selectedFilter
        ).finally(() => {
          setIsGeneratingPDF(false);
          setDownloadingInvoices((prev) => ({
            ...prev,
            [currentInvoiceData.id]: false,
          }));
          toast.dismiss();
          setIsDownloadTriggered(false);
        });
      } else {
        setIsDownloadTriggered(false);
      }
    }
  }, [
    orderDetails,
    downloadInvoiceReceipt,
    invoiceId,
    currentInvoiceData,
    selectedFilter,
    isDownloadTriggered,
  ]);

  const handleDownloadRecord = async (invoice: Invoice) => {
    try {
      setDownloadingInvoices((prev) => ({ ...prev, [invoice.id]: true }));
      setIsGeneratingPDF(true);
      setOrderId(invoice.orderId);
      setInvoiceId(invoice.id);
      setCurrentInvoiceData(invoice);
      setIsDownloadTriggered(true); // Set the trigger flag
    } catch (e) {
      console.error("請求書の生成に失敗しました", e);
      toast.error("請求書の生成に失敗しました");
      setDownloadingInvoices((prev) => ({ ...prev, [invoice.id]: false }));
      setIsDownloadTriggered(false);
    }
  };
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
    invoiceStatus: string;
  }) => {
    setFilters({
      ...filters,
      orderId: newFilters.orderId ?? filters.orderId,
      userName: newFilters.userName ?? filters.userName,
      orderDate: newFilters.orderDate ?? "",
      invoiceStatus: newFilters.invoiceStatus ?? filters.invoiceStatus,
    });
    setPage(1);
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        {/* Header with Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            <h2>
              <span>
                {selectedFilter === "general" ? "領収書管理" : "請求書管理"}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <FilterButton
                title="一般"
                count={totalReceipts}
                onClick={() => {
                  setSelectedFilter("general");
                  setFilters((prev) => ({ ...prev, userType: "general" }));
                }}
                active={selectedFilter === "general"}
              />
              <FilterButton
                title="代理店"
                count={totalInvoices}
                onClick={() => {
                  setSelectedFilter("fc");
                  setFilters((prev) => ({ ...prev, userType: "fc" }));
                }}
                active={selectedFilter === "fc"}
              />
            </div>
          </div>
        </div>
        {/* Filter Section */}
        <InvoiceFilter onFilter={handleFilter} initialFilters={filters} />
        <div className="flex justify-between gap-2">
          <div>
            <span className="text-sm">
              {invoices?.pagination?.totalElements || 0}件
            </span>
          </div>
          <Button
            onClick={() => handleDownloadCSV()}
            disabled={
              csvDownloading ||
              isLoading ||
              !invoices?.data?.length ||
              isGeneratingPDF
            }
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
          >
            {csvDownloading ? "CSVエクスポート中... " : "CSVエクスポート"}
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10 bg-gray-50">
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  <span>
                    {selectedFilter === "general" ? "領収書" : "請求書"}
                  </span>
                  番号
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  注文ID
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  顧客名
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  発行日
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider">
                  請求金額
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={7} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : invoices?.data && invoices?.data.length > 0 ? (
                invoices?.data.map((invoice) => (
                  <TableRow
                    key={invoice.idNumber}
                    className="border-b border-black/10 hover:bg-gray-50"
                  >
                    <TableCell className="px-6 py-3 text-sm font-medium text-black">
                      {invoice.idNumber}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-sm text-gray-700">
                      {invoice.orderNumber}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-sm text-gray-900">
                      {invoice.userName}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-sm text-gray-700">
                      {formatDate(invoice.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-sm text-right font-medium text-gray-900">
                      {convertToYen(invoice.totalAmount)}
                    </TableCell>
                    <TableCell
                      className="px-6 py-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <span
                        className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 mr-2 ${
                          invoice.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status === 1 ? "支払済み" : "未払い"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          key={invoice.id}
                          onClick={() => handleDownloadRecord(invoice)}
                          variant="outline"
                          size="sm"
                          disabled={
                            isGeneratingPDF ||
                            isDownloading ||
                            downloadingInvoices[invoice.id]
                          }
                          className="bg-primary text-white border-gray-300 hover:bg-primary/80 px-3 py-1 "
                        >
                          {downloadingInvoices[invoice.id]
                            ? "ダウンロード中..."
                            : "ダウンロード"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    <span>
                      {selectedFilter === "general" ? "領収書" : "請求書"}
                    </span>
                    がありません
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading &&
          invoices?.data &&
          invoices?.data?.length > 0 &&
          invoices?.pagination?.totalElements &&
          invoices?.pagination?.totalElements > pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage: number) => setPage(newPage)}
                />
              </div>
            </div>
          )}
      </div>
      <ServerActionLoadingComponent
        loading={isChangingInvoiceStatus}
        message="ステータスを変更中..."
      />
    </section>
  );
};

export default InvoicesPage;
