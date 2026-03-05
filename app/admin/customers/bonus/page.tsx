"use client";
import PaginationComponent from "@/components/app/PaginationComponent";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllAdminBonus,
  useGetAllBonus,
  useGetAllMemeberBonus,
  useGetTimePeriodById,
  useUpdatePaymentActivate,
} from "@/hooks/admin/useBonus";
import { encryptString, userType } from "@/utils";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomerStore } from "@/store/Admin/useCustomerStore";

const BonusNewPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [memeberPage, setMemberPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"member" | "admin" | "all">("all");
  const [filters, setFilters] = useState({
    yearMonth: "",
  });

  const { data: memberBonusData, isLoading: memberBonusDataLoading } =
    useGetAllMemeberBonus(
      activeTab === "member",
      {
        yearMonth: filters.yearMonth.replace("-", ""),
      },
      memeberPage,
      10,
    );

  const memberPagination = memberBonusData?.data?.pagination;
  const memeberTotalPages = memberPagination?.totalPages || 1;

  const { data: adminBonusData, isLoading: adminBonusDataLoading } =
    useGetAllAdminBonus(
      activeTab === "admin",
      {
        yearMonth: filters.yearMonth.replace("-", ""),
      },
      adminPage,
      10,
    );

  const { data: allBonusData, isLoading: allBonusDataLoading } = useGetAllBonus(
    activeTab === "all",
    {
      yearMonth: filters.yearMonth.replace("-", ""),
    },
    allPage,
    10,
  );
  const allPagination = allBonusData?.data?.pagination;
  const allTotalPages = allPagination?.totalPages || 1;

  const { mutate: updatePaymentActivate, isPending: isChangingPaymentStatus } =
    useUpdatePaymentActivate();

  const adminPagination = adminBonusData?.data?.pagination;
  const adminTotalPages = adminPagination?.totalPages || 1;

  const { data: timePeriodData } = useGetTimePeriodById(
    activeTab === "member" ? 1 : 2,
  );

  // console.log("memberBonusByIdData", memberBonusByIdData);
  // console.log("adminBonusByIdData", adminBonusByIdData);
  // console.log("timePeriodData", timePeriodData);
  const periodList = timePeriodData
    ? [
        "All",
        ...(timePeriodData?.map((item) => {
          const yearMonth = item.invoiceYearMonth;
          if (yearMonth && yearMonth.length === 6) {
            const year = yearMonth.slice(0, 4);
            const month = yearMonth.slice(4, 6);
            return `${year}-${month}`;
          }
          return yearMonth;
        }) || []),
      ]
    : ["All"];

  // Mock pagination data - replace with actual API response
  // const pagination = {
  //   currentPage: page,
  //   totalPages: 5,
  //   totalElements: 45,
  //   pageSize: 10,
  // };
  // const totalPages = pagination?.totalPages || 1;

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("ja-JP")}`;
  };

  const handlePaymentActivate = (yearMonth: string, fcId: number) => {
    updatePaymentActivate(
      { yearMonth, fcId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-all-member-bonus"] });
        },
      },
    );
  };
  /*** Download Invoice Section */
  const { downloadInvoice, isDownloading } = useCustomerStore();
  const [downloadingInvoices, setDownloadingInvoices] = useState<
    Record<number, boolean>
  >({});
  const [selectedFcId, setSelectedFcId] = useState<number | null>(null);

  const handleDownloadInvoice = (fcId: number) => {
    setSelectedFcId(fcId);
    //reformat year month into 'yyyyMM'
    const formattedYearMonth = filters.yearMonth
      ? filters.yearMonth.replace("-", "")
      : "";
    downloadInvoice(fcId.toString(), formattedYearMonth);
  };

  // const getStatusBadge = (status: string) => {
  //   if (status === "達成") {
  //     return "bg-green-50 text-green-700 border border-green-200";
  //   }
  //   return "bg-red-50 text-red-700 border border-red-200";
  // };

  // const getPaymentStatusBadge = (status: string) => {
  //   if (status === "支給済み") {
  //     return "bg-blue-50 text-blue-700 border border-blue-200";
  //   }
  //   return "bg-gray-50 text-gray-700 border border-gray-200";
  // };

  useEffect(() => {
    if (isDownloading && selectedFcId) {
      // Set only the selected invoice to downloading state
      setDownloadingInvoices({ [selectedFcId]: true });
    } else {
      // Reset the downloading state when download is complete
      setDownloadingInvoices({});
    }
  }, [isDownloading, selectedFcId]);

  const TabButton = ({
    isActive,
    onClick,
    children,
  }: {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <Button
      onClick={onClick}
      className={`w-28 cursor-pointer  flex justify-center items-center  text-white rounded-full text-sm ${isActive ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}
    >
      {children}
    </Button>
  );

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2 flex  gap-3 w-full">
            <h2>ボーナス支給管理</h2>

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
                    // setPage(1);
                  }}
                >
                  {dateString} {/* Or format this date as needed */}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full   bg-white h-auto">
          <div className="flex gap-2">
            <TabButton
              isActive={activeTab === "all"}
              onClick={() => {
                setActiveTab("all");
                //setFilters((prev) => ({ ...prev, yearMonth: "" })); // Reset yearMonth to empty string (All)
              }}
            >
              All
            </TabButton>
            <TabButton
              isActive={activeTab === "member"}
              onClick={() => {
                setActiveTab("member");
                //setFilters((prev) => ({ ...prev, yearMonth: "" })); // Reset yearMonth to empty string (All)
              }}
            >
              募集お祝金
            </TabButton>
            <TabButton
              isActive={activeTab === "admin"}
              onClick={() => {
                setActiveTab("admin");
                //setFilters((prev) => ({ ...prev, yearMonth: "" })); // Reset yearMonth to empty string (All)
              }}
            >
              管理費
            </TabButton>
          </div>
        </div>

        {/* Count */}
        <div className="flex justify-between items-center gap-2 mb-5">
          <p className="text-sm">
            {activeTab === "member"
              ? memberBonusData?.data?.data.length
              : activeTab === "admin"
                ? adminBonusData?.data?.data.length
                : allBonusData?.data?.data.length}
            件
          </p>
        </div>

        {/* admin Table */}
        {activeTab === "all" && (
          <div className="rounded-[10px] overflow-hidden border border-black/10">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/10 bg-white">
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    NO
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    対象者
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    FC階層
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    管理範囲売上
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    管理対象者数
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    計算率
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    ボーナス金額
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    ステータス
                  </TableHead>
                  {filters.yearMonth && (
                    <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                      請求書
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!allBonusDataLoading &&
                  allBonusData?.data?.data.map((bonus, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-black/10 hover:bg-black/2"
                    >
                      <TableCell className="px-6 py-4 text-center">
                        {allPagination?.currentPage && allPagination?.pageSize
                          ? (allPagination.currentPage - 1) *
                              allPagination.pageSize +
                            index +
                            1
                          : index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.username}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {userType(bonus.role)}名
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        ¥{formatCurrency(bonus.totalBuyPrice)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.totalBuyerCount}名
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {/* {formatCurrency(bonus.introducedSalesGold)} */} -
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-medium}`}
                        >
                          ¥{formatCurrency(bonus.totalBonus)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span
                          className={` rounded-[30px] px-6 py-3 text-xs font-medium cursor-pointer text-white ${
                            bonus.isActive === 0
                              ? "bg-tertiary hover:bg-tertiary/80"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          {bonus.isActive === 0 ? "公開" : "非公開"}
                        </span>
                      </TableCell>
                      {filters.yearMonth && bonus.totalBonus > 0 && (
                        <TableCell className="px-6 py-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 bg-primary text-white"
                            onClick={() => handleDownloadInvoice(bonus.fcId)}
                            disabled={downloadingInvoices[bonus.fcId]}
                          >
                            {downloadingInvoices[bonus.fcId] ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                  ダウンロード中...
                                </span>
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                  請求書ダウンロード
                                </span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                {allBonusDataLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index} className="border-b border-black/10">
                      <TableCell colSpan={9} className="text-center">
                        <Skeleton className="h-12 w-full bg-white-bg" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!allBonusDataLoading &&
                  allBonusData?.data?.data?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        レコードがありません
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* member Table */}
        {activeTab === "member" && (
          <div className="rounded-[10px] overflow-hidden border border-black/10 ">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/10 bg-white">
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    NO
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    対象者
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    FC階層
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    紹介メンバー
                    <br />
                    （シルバー）数
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    紹介売上 <br />
                    （シルバー）
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    紹介メンバー <br />
                    （ゴールド）数
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    紹介売上 <br />
                    （ゴールド）
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    ボーナス金額
                  </TableHead>
                  {filters.yearMonth && (
                    <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                      支給条件
                    </TableHead>
                  )}
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    明細
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberBonusData?.data?.data &&
                  memberBonusData?.data?.data?.map((bonus, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-black/10 hover:bg-black/2"
                    >
                      <TableCell className="px-6 py-4 text-center">
                        {memberPagination?.currentPage &&
                        memberPagination?.pageSize
                          ? (memberPagination.currentPage - 1) *
                              memberPagination.pageSize +
                            index +
                            1
                          : index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.username}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.fcPlanName}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.plan1Referrals}名
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ¥{formatCurrency(bonus.plan1Amount)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.plan2Referrals}名
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        ¥{formatCurrency(bonus.plan2Amount)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        ¥
                        {/* {bonus.role === 2
                          ? formatCurrency(bonus.plan1Bonus + bonus.plan2Bonus)
                          : formatCurrency(bonus.plan1Bonus)} */}
                        {formatCurrency(bonus.plan1Bonus + bonus.plan2Bonus)}
                      </TableCell>
                      {filters.yearMonth && (
                        <TableCell className="px-6 py-4 text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white 
                              ${
                                bonus.isAllActive
                                  ? "bg-tertiary hover:bg-tertiary/80"
                                  : "bg-secondary hover:bg-secondary/80"
                              }
                                  `}
                              >
                                {bonus.isAllActive ? "支払済み" : "未払い"}
                                <ChevronDown size={15} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                              <DialogHeader>
                                <DialogTitle>支給条件変更</DialogTitle>
                                <DialogDescription className="w-full flex items-center justify-center gap-4 border-y border-black/10 py-8 mt-2">
                                  <DialogClose
                                    className="rounded-md text-xs bg-tertiary text-white cursor-pointer w-[100px] py-2 hover:bg-tertiary/80"
                                    onClick={() =>
                                      handlePaymentActivate(
                                        filters.yearMonth.replace("-", ""),
                                        bonus.fcId || 0,
                                      )
                                    }
                                  >
                                    支払済み
                                  </DialogClose>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      )}
                      {/* <TableCell className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-medium ${getPaymentStatusBadge(bonus.status)}`}
                        >
                          {bonus.status}
                        </span>
                      </TableCell> */}
                      <TableCell className="px-6 py-4 text-center">
                        <Button
                          onClick={() =>
                            router.push(
                              `/admin/customers/bonus/${encryptString(
                                bonus.fcId?.toString() + "-" + activeTab || "",
                              )}`,
                            )
                          }
                          className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm cursor-pointer"
                        >
                          詳細
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {memberBonusDataLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index} className="border-b border-black/10">
                      <TableCell colSpan={11} className="text-center">
                        <Skeleton className="h-12 w-full bg-white-bg" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!memberBonusDataLoading &&
                  memberBonusData?.data?.data?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className="h-24 text-center">
                        レコードがありません
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* admin Table */}
        {activeTab === "admin" && (
          <div className="rounded-[10px] overflow-hidden border border-black/10">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/10 bg-white">
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    No
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    対象者
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    FC階層
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    管理範囲売上
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    管理対象者数
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    計算率
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    ボーナス金額
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    ステータス
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    設定
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!adminBonusDataLoading &&
                  adminBonusData?.data?.data.map((bonus, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-black/10 hover:bg-black/2"
                    >
                      <TableCell className="px-6 py-4 text-center">
                        {adminPagination?.currentPage &&
                        adminPagination?.pageSize
                          ? (adminPagination.currentPage - 1) *
                              adminPagination.pageSize +
                            index +
                            1
                          : index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.username}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {userType(bonus.role)}名
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        ¥{formatCurrency(bonus.totalBuyPrice)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.totalBuyerCount}名
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {/* {formatCurrency(bonus.introducedSalesGold)} */} -
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-medium}`}
                        >
                          ¥{formatCurrency(bonus.totalBonus)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span
                          className={` rounded-[30px] px-6 py-3 text-xs font-medium cursor-pointer text-white ${
                            bonus.isActive === 0
                              ? "bg-tertiary hover:bg-tertiary/80"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          {bonus.isActive === 0 ? "公開" : "非公開"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Button
                          onClick={() =>
                            router.push(
                              `/admin/customers/bonus/${encryptString(
                                bonus.fcId?.toString() + "-" + activeTab || "",
                              )}?${activeTab}`,
                            )
                          }
                          className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm cursor-pointer"
                        >
                          詳細
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {adminBonusDataLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index} className="border-b border-black/10">
                      <TableCell colSpan={9} className="text-center">
                        <Skeleton className="h-12 w-full bg-white-bg" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!adminBonusDataLoading &&
                  adminBonusData?.data?.data?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        レコードがありません
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {/* {!isLoading && pagination && totalPages > 0 && (
          <div className="flex justify-end">
            <div>
              <PaginationComponent
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        )} */}

        {activeTab === "all" &&
          !allBonusDataLoading &&
          allBonusData?.data?.data &&
          allBonusData?.data?.data.length > 0 &&
          allPagination &&
          allPagination?.totalElements > allPagination?.pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={allPagination?.currentPage || 1}
                  totalPages={allTotalPages}
                  onPageChange={(newPage) => setAllPage(newPage)}
                />
              </div>
            </div>
          )}

        {activeTab === "member" &&
          !memberBonusDataLoading &&
          memberBonusData?.data?.data &&
          memberBonusData?.data?.data.length > 0 &&
          memberPagination &&
          memberPagination?.totalElements > memberPagination?.pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={memberPagination?.currentPage || 1}
                  totalPages={memeberTotalPages}
                  onPageChange={(newPage) => setMemberPage(newPage)}
                />
              </div>
            </div>
          )}

        {activeTab === "admin" &&
          !adminBonusDataLoading &&
          adminBonusData?.data?.data &&
          adminBonusData?.data?.data.length > 0 &&
          adminPagination &&
          adminPagination?.totalElements > adminPagination?.pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={adminPagination?.currentPage || 1}
                  totalPages={adminTotalPages}
                  onPageChange={(newPage) => setAdminPage(newPage)}
                />
              </div>
            </div>
          )}
      </div>

      <ServerActionLoadingComponent
        loading={isChangingPaymentStatus}
        message="お客様のステータスを変更中..."
      />
    </section>
  );
};

export default BonusNewPage;
