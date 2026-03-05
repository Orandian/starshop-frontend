"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import {
  useChangeCustomerStatus,
  useCustomers,
  useGetCounts,
  useExportUsersToCSV,
} from "@/hooks/admin/useCustomer";
import PaginationComponent from "@/components/app/PaginationComponent";
import { toast } from "sonner";
import {
  convertToYen,
  encryptString,
  formatDate,
  formatDate2,
  getPublicUrl,
  getUserType,
  getUserTypeClass,
  formatId,
  getBonusType,
} from "@/utils";
import { CustomerResponseType } from "@/types/customers";
import { Skeleton } from "@/components/ui/skeleton";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import ImageComponent from "@/components/fc/ImageComponent";
import AdminCustomerHeader from "@/components/admin/customer/AdminCustomerHeader";
import { AdminCustomerFilter } from "@/components/admin/customer/AdminCustomerFilter";
import { useCsvDownloader } from "@/hooks/admin/useCsvDownloader";
import { ApiError } from "@/lib/api/api.gateway";

const CustomersPage = () => {
  const router = useRouter(); // Router

  const [pageSize] = useState(10); // Page size
  const [page, setPage] = useState(1); // Page
  const [customerId, setCustomerId] = useState<string | number>(0); // Customer ID
  const [statusToChange, setStatusToChange] = useState<number>(0); // Status to change

  //filters
  const [filters, setFilters] = useState({
    searchQuery: "",
    bonusType: "",
    userType: "",
  });

  // Customers hooks
  const {
    data: customerData,
    isLoading,
    error,
    isError,
    refetch,
  } = useCustomers(
    page,
    pageSize,
    filters.searchQuery,
    filters.userType,
    filters.bonusType
  );

  const total = customerData?.pagination?.totalElements || 0; // Total
  const totalPages = Math.ceil(total / pageSize); // Total pages

  //fetch counts
  const { data: userCounts } = useGetCounts();

  //csv downloaing
  const { mutate: exportUsersToCSV } = useExportUsersToCSV(filters);

  const { downloadCsv, isDownloading } = useCsvDownloader(exportUsersToCSV);

  // Change customer status hooks
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingCustomerStatus,
  } = useChangeCustomerStatus(customerId, statusToChange);

  // Handle status change
  const handleStatusChange = (userStatus: number) => {
    setStatusToChange(userStatus);
    changeStatus();
  };

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

  const handleFilter = (newFilters: {
    searchQuery: string;
    userType: string;
    bonusType: string;
  }) => {
    setFilters({
      ...filters,
      searchQuery: newFilters.searchQuery ?? "",
      userType: newFilters.userType ?? "",
      bonusType: newFilters.bonusType ?? "",
    });
    setPage(1);
  };

  /**
   * Handle CSV download
   */
  const handleCsvDownload = () => {
    downloadCsv(undefined, "氏名", {
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
  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <h2>顧客一覧</h2>
        <AdminCustomerHeader UserCount={userCounts} />

        {/* filter */}
        <AdminCustomerFilter onFilter={handleFilter} />

        {/* CSV Export Button and Results Count */}
        <div className="flex justify-between items-center">
          <div>
            <span className="ml-2 text-sm">
              {customerData?.pagination?.totalElements}件
            </span>
          </div>
          <Button
            onClick={() => {
              handleCsvDownload();
            }}
            disabled={isDownloading || isLoading || !customerData?.data?.length}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md flex items-center gap-2"
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
            {isDownloading ? "CSVエクスポート中... " : "CSVエクスポート"}
          </Button>
        </div>

        {/* table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  顧客ID
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  氏名
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  顧客タイプ
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  登録日
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  購入回数
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  注文合計金額
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  ボーナス対象
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  最後ログイン日時
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={10} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : customerData && customerData?.data?.length > 0 ? (
                customerData?.data?.map((customer: CustomerResponseType) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2"
                    key={customer.userId}
                    // onClick={() =>
                    //   router.push(
                    //     `/admin/customers/${encryptString(customer.userId.toString())}`
                    //   )
                    // }
                  >
                    {/* customer id */}
                    <TableCell className="px-6 py-3">
                      {formatId(customer?.createdAt, customer?.userId)}
                    </TableCell>
                    {/* customer name and photo */}
                    <TableCell className="px-6 py-3 flex items-center gap-2">
                      {customer.userPhoto &&
                      customer.userPhoto.trim() !== "" &&
                      customer.userPhoto.length > 4 &&
                      (customer.userPhoto.startsWith("http://") ||
                        customer.userPhoto.startsWith("https://") ||
                        customer.userPhoto.startsWith("/")) ? (
                        <ImageComponent
                          imgURL={
                            customer.userPhoto
                              ? getPublicUrl(customer.userPhoto)
                              : ""
                          }
                          imgName={customer.username.slice(0, 2)}
                          className="rounded-full object-cover w-10 h-10 mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 mr-3 bg-gray-200 flex items-center justify-center text-gray-500 rounded-full">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                      <div className="flex-col">
                        <p className="truncate w-[200px]">
                          {customer.username}
                        </p>
                        <p>{customer.email}</p>
                      </div>
                    </TableCell>
                    {/* customer type */}
                    <TableCell className="px-6 py-3">
                      <span
                        className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 ${getUserTypeClass(Number(customer?.userType), Number(customer?.bonusType))}`}
                      >
                        {getUserType(customer?.userType, customer?.bonusType)}
                      </span>
                    </TableCell>
                    {/* created date */}
                    <TableCell className="px-6 py-3 ">
                      {formatDate2(customer.createdAt)}
                    </TableCell>
                    {/* total order count */}
                    <TableCell className="px-6 py-3">
                      {customer.totalOrderCount || 0}回
                    </TableCell>
                    {/* total order amount */}
                    <TableCell className="px-6 py-3 text-right">
                      {convertToYen(customer.totalOrderAmount || 0)}
                    </TableCell>
                    {/* bonus type */}
                    <TableCell className="px-6 py-3">
                      {(
                        getBonusType(customer.userType, customer.bonusType) ||
                        []
                      ).map((bonus, index) => (
                        <span
                          key={index}
                          className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 mr-2 ${bonus.color}`}
                        >
                          {bonus.label}
                        </span>
                      ))}
                    </TableCell>
                    {/* last login */}
                    <TableCell className="px-6 py-3">
                      {customer.lastLogin
                        ? formatDate(customer.lastLogin)
                        : "-"}
                    </TableCell>
                    {/* status */}
                    <TableCell
                      className="px-6 py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomerId(customer.userId || 0);
                      }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              customer.status === 1
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : customer.status === 2
                                  ? "bg-primary hover:bg-primary/80"
                                  : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              setCustomerId(customer.userId || 0);
                            }}
                          >
                            {customer.status === 1
                              ? "有効"
                              : customer.status === 2
                                ? "無効"
                                : "ロック"}
                            <ChevronDown size={15} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                          <DialogHeader>
                            <DialogTitle>ステータス変更</DialogTitle>
                            <DialogDescription className="w-full flex items-center justify-center gap-4 border-y border-black/10 py-8 mt-2">
                              <DialogClose
                                className="rounded-md text-xs bg-tertiary text-white cursor-pointer w-[100px] py-2 hover:bg-tertiary/80"
                                onClick={() => {
                                  setCustomerId(customer.userId || 0);
                                  handleStatusChange(1);
                                }}
                              >
                                有効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-primary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() => {
                                  setCustomerId(customer.userId || 0);
                                  handleStatusChange(2);
                                }}
                              >
                                無効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() => {
                                  setCustomerId(customer.userId || 0);
                                  handleStatusChange(3);
                                }}
                              >
                                ロック
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    {/* action */}
                    {/* 操作 */}
                    <TableCell className="px-6 py-4 text-center">
                      <Button
                        onClick={() =>
                          router.push(
                            `/admin/customers/${encryptString(customer.userId.toString())}`
                          )
                        }
                        className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                      >
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
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
            </TableBody>
          </Table>
        </div>

        {!isLoading &&
          customerData &&
          customerData?.data?.length > 0 &&
          customerData?.pagination?.totalElements &&
          customerData?.pagination?.totalElements > pageSize && (
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

      <ServerActionLoadingComponent
        loading={isChangingCustomerStatus}
        message="お客様のステータスを変更中..."
      />
    </section>
  );
};

export default CustomersPage;
