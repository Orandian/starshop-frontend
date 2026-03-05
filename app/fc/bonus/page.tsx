"use client";
import PaginationComponent from "@/components/app/PaginationComponent";
import ImageComponent from "@/components/fc/ImageComponent";
import MobileTableCard from "@/components/fc/MobileTableCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  useBonusPeriod,
  useBonusTransactionList,
  useInvoiceData,
  useTotalBonusAmount,
} from "@/hooks/fc/useBonus";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import { CustomerInvoice } from "@/types/customers";
import { BonusPeriodList, BonusTransactionList } from "@/types/fc/bonus.type";
import { encryptString, formatDate, formatDate2, getPublicUrl } from "@/utils";
import { generatePDF } from "@/utils/admin/customers-invoices/generatePDF";
import { Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const getBonusTypeLabel = (transactionType: number) => {
  switch (transactionType) {
    case 1:
      return "お祝金";
    case 2:
      return "管理金";
    default:
      return "販売コミッション";
  }
};

const FCBonusPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const pageSize = 10;
  const [period, setPeriod] = useState("all");

  //filter
  const [filters] = useState({ bonus_type: 0 });
  const [filterBonus, setFilterBonuse] = useState(0);

  const { data: periodList } = useBonusPeriod();
  const { data: transactionData, isLoading } = useBonusTransactionList(
    period,
    page,
    pageSize,
    filters,
  );
  const { data: totalBonusAmountData, isLoading: isTotalLoading } =
    useTotalBonusAmount(period);

  const pagination = transactionData?.data?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const total = transactionData?.data?.pagination.totalElements || 0;

  const periods: BonusPeriodList[] = Array.isArray(periodList?.data)
    ? (periodList?.data ?? [])
    : [];

  const transactions: BonusTransactionList[] = Array.isArray(
    transactionData?.data?.data,
  )
    ? (transactionData?.data?.data ?? [])
    : [];

  const totalBonusAmount: BonusTransactionList[] = Array.isArray(
    totalBonusAmountData?.data,
  )
    ? (totalBonusAmountData?.data ?? [])
    : [];

  /**
   * Handle bonus type filter change
   * @param newFilters - New filter values
   * @author Phway
   * @date 2025-12-30
   */
  // const handleFilter = useCallback((newFilters: { bonus_type: number }) => {
  //   setFilters(newFilters);
  //   setPage(1);
  // }, []);

  //generate invoice section
  // 1. get User Detail
  const { userDetail } = useFullUserDetail();
  // 2. get invoice data
  const { data: invoiceResponse } = useInvoiceData(period);
  const [invoiceData, setInvoiceData] = useState<CustomerInvoice | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // set invoice data
  useEffect(() => {
    if (period !== "all" && invoiceResponse) {
      setInvoiceData(invoiceResponse);
    }

    if (period === "all") {
      setInvoiceData(null);
    }
  }, [period, invoiceResponse]);

  const handlePeriodChange = (selectedPeriod: string) => {
    return () => {
      handlePageChange(1);
      setPeriod(selectedPeriod);
    };
  };

  const convertDate = (dateString: string) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    return `${year}-${month}`;
  };

  const bannerData = [
    {
      title: "合計金額",
      amount: totalBonusAmount.reduce((sum, tx) => sum + tx.bonus, 0),
    },
    {
      title: "募集お祝金",
      amount: totalBonusAmount.reduce((sum, tx) => {
        if (tx.transactionType === 1) {
          return sum + Math.floor(tx.bonus);
        }
        return sum;
      }, 0),
    },
    {
      title: "管理金",
      amount: totalBonusAmount.reduce((sum, tx) => {
        if (tx.transactionType === 2) {
          return sum + Math.floor(tx.bonus);
        }
        return sum;
      }, 0),
    },
    // for next version
    // {
    //   title: "販売コミッション",
    //   amount: 0,
    // },
  ];

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
    router.push(`/fc/bonus?${params.toString()}`, { scroll: false });
  };

  /**
   * download invoice data
   */
  const handleInvoiceDownload = async () => {
    try {
      setIsGeneratingPdf(true);
      if (invoiceData && userDetail?.data) {
        //remap userDetail to Customer Detail format
        const customerDetail = {
          username: userDetail.data.user?.username || "",
          usernameKana: userDetail.data.user?.usernameKana || "",
          email: userDetail.data.user?.email || "",
          phone_number: userDetail.data.user?.phoneNumber || "",
          tantoName: userDetail?.data?.tantoName || "",
          bank_info: {
            branchName: userDetail.data?.branchName || "",
            branchNumber: userDetail.data?.branchNumber || "",
            bankAccountNumber: userDetail.data?.bankAccountNumber || "",
            bankAccountName: userDetail.data?.bankAccountName || "",
            bankName: userDetail.data?.bankName || "",
          },
          billing_address: userDetail?.data?.user?.userAddresses
            .filter((address) => address.addressType === 2)
            .map((address) => ({
              name: address.name,
              postalCode: address.postalCode,
              prefecture: address.prefecture,
              city: address.city,
              address1: address.address1,
              address2: address.address2 || undefined,
              phoneNumber: address.phoneNumber || undefined,
            }))
            .slice(0, 1), // Take only the first match (or empty array if none)
        };
        await generatePDF(invoiceData, customerDetail, period);
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleViewOrder = (orderId: number) => {
    router.push(`/fc/bonus/${encryptString(orderId.toString())}`);
  };

  return (
    <section className="w-full">
      <div className="w-full px-3 md:px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        {/* 契約書 */}
        <div className="flex justify-between items-center">
          <h2 className="my-4 font-bold">私のボーナス</h2>
          {/* <Link
            href={"bonus/receipt"}
            className="cursor-pointer underline hover:text-dark/50 text-blue-500 bg-transparent"
          >
            請求書はこちら
          </Link> */}
          {period !== "all" && (
            <Button
              className="cursor-pointer underline hover:bg-dark/50 text-white bg-dark"
              onClick={handleInvoiceDownload}
            >
              <span className="flex justify-center items-center gap-3">
                <Download />
                {isGeneratingPdf ? "ダウンロード中..." : "ダウンロード"}
              </span>
            </Button>
          )}
        </div>
        <div className="w-full   bg-white h-auto">
          <div className="flex gap-4  items-center">
            <Button
              onClick={handlePeriodChange("all")}
              className={`w-14 md:w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark ${period === "all" ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}
            >
              All
            </Button>
            {periods?.map((p) => (
              <Button
                key={p.invoiceYearMonth}
                onClick={handlePeriodChange(p.invoiceYearMonth)}
                className={`w-18 md:w-28   flex justify-center items-center   text-white rounded-full text-sm hover:bg-dark ${period === p.invoiceYearMonth ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}
              >
                {convertDate(String(p.invoiceYearMonth))}
              </Button>
            ))}
          </div>
        </div>
        {/* banner */}
        <div className="mt-6">
          {isTotalLoading ? (
            <div className="flex justify-center items-center w-full h-24 gap-4">
              <Skeleton className="w-full h-32 bg-white-bg" />
              <Skeleton className="w-full h-32 bg-white-bg" />
              <Skeleton className="w-full h-32 bg-white-bg" />
              <Skeleton className="w-full h-32 bg-white-bg" />
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              <div
                className={`${filterBonus === 0 ? "bg-black text-white " : "bg-foreground text-black border border-foreground hover:border-black"} rounded-xl md:rounded-lg p-2 md:p-6 flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => setFilterBonuse(0)}
              >
                <p className="text-sm md:text-md">{bannerData[0].title}</p>
                <p className="mt-2 md:mt-3 text-md md:text-xl font-semibold">
                  ¥{bannerData[0].amount.toLocaleString()}
                </p>
              </div>

              <div
                className={`${filterBonus === 1 ? "bg-black text-white" : "bg-foreground text-black border border-foreground hover:border-black"}  rounded-xl md:rounded-lg p-2 md:p-6 flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity ${filters.bonus_type === 1 ? "ring-2 ring-primary" : ""}`}
                onClick={() => setFilterBonuse(1)}
              >
                <p className="text-sm md:text-md">{bannerData[1].title}</p>
                <p className="mt-2 md:mt-3 text-md md:text-xl font-semibold">
                  ¥{bannerData[1].amount.toLocaleString()}
                </p>
              </div>

              <div
                className={`${filterBonus === 2 ? "bg-black text-white" : "bg-foreground text-black border border-foreground hover:border-black"}  rounded-xl md:rounded-lg p-2 md:p-6 flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity ${filters.bonus_type === 2 ? "ring-2 ring-primary" : ""}`}
                onClick={() => setFilterBonuse(2)}
              >
                <p className="text-sm md:text-md">{bannerData[2].title}</p>
                <p className="mt-2 md:mt-3 text-md md:text-xl font-semibold">
                  ¥{bannerData[2].amount.toLocaleString()}
                </p>
              </div>

              {/* <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center">
                <p className="">{bannerData[3].title}</p>
                <p className="mt-3 text-xl font-semibold">
                  ¥{bannerData[3].amount.toLocaleString()}
                </p>
              </div> */}
            </div>
          )}
        </div>
        <div className="mt-8">
          {/* <BonusFilter onFilter={handleFilter} fcRole={userDetail?.data?.role || 0} /> */}
          <span className="text-sm p-2">{total ? total : 0}件</span>

          <div className="overflow-x-auto mt-2 border border-disabled/20 mb-6 rounded-lg hidden md:block">
            <div className="overflow-x-auto">
              <div className="min-w-[800px] md:w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[80px]">
                        No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        レベル
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        氏名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        購入日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[200px]">
                        取引内容（初回/再購入）
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        商品一覧
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        購入金額（税別）
                      </th>
                      {filterBonus === 0 && (
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                          ボーナス種類
                        </th>
                      )}
                      <th className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                        ボーナス金額
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                        ボーナス支払い日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      Array.from({ length: 10 }).map((_, index) => (
                        <TableRow
                          key={index}
                          className="border-b border-black/10"
                        >
                          <TableCell colSpan={11} className="h-10 text-center">
                            <Skeleton className="w-full h-full bg-white-bg" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : transactions.length > 0 ? (
                      transactions
                        .filter((transaction) =>
                          filterBonus === 0
                            ? true
                            : transaction.transactionType === filterBonus,
                        )
                        .map((transaction, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 group">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(page - 1) * pageSize + idx + 1}
                            </td>
                            {/* level */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.level || "-"}
                            </td>
                            {/* user name */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.buyer?.username || "-"}
                            </td>
                            {/* order date */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.transactionDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-3">
                                <div className="text-gray-900 font-medium">
                                  {transaction.remark}
                                </div>
                              </div>
                            </td>
                            {/* first product of order */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer">
                              {transaction.order.orderItems
                                .slice(0, 1)
                                .map((item) => (
                                  <div
                                    key={item.orderDetailId}
                                    className="flex items-center gap-3 mb-2"
                                  >
                                    <div className="shrink-0 w-10 h-10">
                                      <ImageComponent
                                        imgURL={getPublicUrl(
                                          item.product.images?.[0]?.imageUrl ||
                                            "",
                                        )}
                                        imgName="product"
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                    <div className="flex flex-col text-gray-500">
                                      <span className="text-gray-900 font-medium">
                                        {item.productName}
                                      </span>
                                      <span>
                                        ¥
                                        {Number(
                                          item.priceAtPurchase,
                                        ).toLocaleString("ja-JP")}{" "}
                                        * {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </td>
                            {/* total buy price /purchase price with no tax  */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              ¥{transaction?.totalBuyPrice?.toLocaleString()}
                            </td>

                            {/* transaction type */}
                            {filterBonus === 0 && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full  text-white py-1
                          ${transaction.transactionType === 1 ? "bg-[#9399D4]" : transaction.transactionType === 2 ? "bg-[#E0BD00]" : "bg-[#00B8D4]"}`}
                                >
                                  {transaction.transactionType === 1
                                    ? "お祝金"
                                    : transaction.transactionType === 2
                                      ? "管理金"
                                      : "販売コミッション"}
                                </span>
                              </td>
                            )}
                            {/* bonus amount */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              ¥{transaction?.bonus?.toLocaleString()}
                            </td>
                            {/* payment date */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction?.paymentDate
                                ? formatDate2(transaction.paymentDate)
                                : "-"}
                            </td>
                            {/* status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={[
                                  "px-3 inline-flex text-xs leading-5 font-normal rounded-full  text-white py-1",
                                  transaction.isActive
                                    ? "bg-tertiary"
                                    : "bg-gray-500",
                                ].join(" ")}
                              >
                                {transaction.isActive ? "振込完了" : "未振込"}
                              </span>
                            </td>

                            <td className="px-6 py-5 whitespace-nowrap">
                              <Button
                                onClick={() =>
                                  handleViewOrder(transaction.order.orderId)
                                }
                                className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm cursor-pointer"
                              >
                                詳細
                              </Button>
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
          {/* Mobile Card Style */}
          <div className="sm:hidden mt-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 my-2 w-full text-center">
                  <Skeleton className="w-full h-full bg-white-bg" />
                </div>
              ))
            ) : transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction, index) => {
                const items = [
                  { label: "No.", value: transaction.transactionId },
                  { label: "レベル", value: transaction.level || "-" },
                  {
                    label: "氏名",
                    value: transaction.buyer?.username || "-",
                  },
                  {
                    label: "購入日",
                    value: formatDate(transaction.transactionDate),
                  },
                  {
                    label: "取引内容（初回/再購入）",
                    value: transaction.remark,
                  },
                  {
                    label: "商品一覧",
                    value: transaction.order.orderItems.map((item) => ({
                      src: getPublicUrl(
                        item.product.images?.[0]?.imageUrl || "",
                      ),
                      alt: item.productName,
                      text: `¥${Number(item.priceAtPurchase).toLocaleString("ja-JP")} * ${item.quantity}`,
                    })),
                    type: "image" as const,
                  },
                  {
                    label: "購入金額（税別）",
                    value: `¥${transaction?.totalBuyPrice?.toLocaleString()}`,
                  },
                  ...(filterBonus === 0
                    ? [
                        {
                          label: "ボーナス種類",
                          value: getBonusTypeLabel(transaction.transactionType),
                          type: "badge" as const,
                          badgeColor:
                            transaction.transactionType === 1
                              ? "bg-[#9399D4] text-white"
                              : transaction.transactionType === 2
                                ? "bg-[#E0BD00] text-white"
                                : "bg-[#00B8D4] text-white",
                        },
                      ]
                    : []),
                  {
                    label: "ボーナス金額",
                    value: `¥${transaction?.bonus?.toLocaleString()}`,
                  },
                  {
                    label: "ボーナス支払い日",
                    value: transaction?.paymentDate
                      ? formatDate2(transaction.paymentDate)
                      : "-",
                  },
                  {
                    label: "ステータス",
                    value: transaction.isActive ? "振込完了" : "未振込",
                    type: "badge" as const,
                    badgeColor: transaction.isActive
                      ? "bg-tertiary text-white"
                      : "bg-gray-500 text-white",
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

          {!isLoading && transactions?.length > 0 && totalPages !== 1 && (
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
          {/* <div className="w-full flex justify-end mt-4">
            <div className="flex items-center gap-2">
              <Button size="icon" className="bg-transparent mr-5">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8  hover:bg-disabled/20"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8  hover:bg-disabled/20"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8  hover:bg-disabled/20"
              >
                3
              </Button>
              <Button
                size="icon"
                className="bg-transparent hover:bg-transparent ml-5"
              >
                <span>Next</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
        </div> 
          */}
        </div>
      </div>
    </section>
  );
};

export default FCBonusPage;
