"use client";

import AdminDatePicker from "@/components/admin/AdminDatePicker";
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
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useChangeFaqStatus, useFaqs } from "@/hooks/admin/useFaqs";
import { FAQ } from "@/types/admin/faqs.type";
import { encryptString, formatDate } from "@/utils";
import { ChevronDown, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FaqsPage = () => {
  const router = useRouter(); // Get the router
  const [pageSize] = useState(10); // Set page size
  const [page, setPage] = useState(1); // Set page

  const [faqsKeyword, setFaqsKeyword] = useState(""); // Set faqs keyword
  const [searchFaqsKeyword, setSearchFaqsKeyword] = useState(""); // Set search faqs keyword
  const [faqsDate, setFaqsDate] = useState(""); // Set faqs date
  const [searchFaqsDate, setSearchFaqsDate] = useState(""); // Set search faqs date
  const [status, setStatus] = useState("0"); // Set status
  const [searchStatus, setSearchStatus] = useState("0"); // Set search status
  const [faqId, setFaqId] = useState(0); // Set faq id
  const [statusToChange, setStatusToChange] = useState(false); // Set status to change


  // Change status mutation
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingFaqStatus,
  } = useChangeFaqStatus(faqId, statusToChange);

  // Get faqs
  const {
    data: faqs,
    isLoading,
    error,
    isError,
    refetch,
  } = useFaqs(page, pageSize, searchFaqsKeyword, searchStatus, searchFaqsDate);

  // Total faqs
  const total = faqs?.data?.pagination.totalElements || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setSearchFaqsKeyword(faqsKeyword);
    setSearchFaqsDate(faqsDate);
    setSearchStatus(status);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus();
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }

    if (changeStatusError) {
      toast.error(changeStatusError?.message);
    }

    if (isSuccess) {
      toast.success(changeStatusData?.message);
      refetch();
    }
  }, [isError, error, changeStatusError, isSuccess, changeStatusData, refetch]);

  const resetFilters = () => {
    setPage(1);
    setFaqsKeyword("");
    setFaqsDate("");
    setStatus("0");
    setSearchFaqsKeyword("");
    setSearchFaqsDate("");
    setSearchStatus("0");
    refetch();
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
       
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>FAQ管理</h2>
          </div>
          <Button
            onClick={() => router.push("/admin/support/faqs/new")}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
            <CirclePlus className="w-4 h-4" />
            新規作成
          </Button>
        </div> 

               {/* Filter Section */}
        <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* 日付 */}
              <div>
                <span className="text-sm">日付</span>
                <AdminDatePicker
                  value={faqsDate}
                  onChange={(date) => setFaqsDate(date)}
                  styleName="w-full border border-white-bg rounded-md mt-2 mb-4"
                />
              </div>

              {/* FAQキーワード */}
              <div>
                <span className="text-sm">FAQキーワード</span>
                <Input
                  value={faqsKeyword}
                  onChange={(e) => setFaqsKeyword(e.target.value)}
                  placeholder="FAQキーワードを入力"
                  className="mt-2 text-sm border border-white-bg rounded-md p-2"
                />
              </div>

              {/* 状況 */}
              <div>
                <span className="text-sm">状況</span>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="状況を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0">すべて</SelectItem>
                    <SelectItem value="1">有効</SelectItem>
                    <SelectItem value="2">無効</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="px-6 w-20 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                リセット
              </Button>
              <Button
                onClick={handleSearch}
                className="px-6 w-20 bg-primary text-white hover:bg-primary/80 cursor-pointer"
              >
                検索
              </Button>
            </div>
          </div>
        </div>

    <div className="flex justify-between items-center gap-2 mb-5">
          <p className="text-sm">
             {total ? total : 0}件
          </p>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[100px] py-3 px-6 uppercase font-bold text-black text-xs">
                  日付
                </TableHead>
                <TableHead className="py-3 px-6 uppercase font-bold text-black text-xs">
                  内容
                </TableHead>
                <TableHead className="text-center py-3 px-6 uppercase font-bold text-black text-xs">
                  ステータス
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs?.data &&
                faqs?.data?.data?.length > 0 &&
                faqs?.data?.data?.map((faq: FAQ) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    key={faq.faqId}
                  >
                    <TableCell
                      className="py-3 px-6 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/admin/support/faqs/${encryptString(faq.faqId.toString())}`
                        )
                      }
                    >
                      {formatDate(faq.createdAt)}
                    </TableCell>
                    <TableCell
                      className="py-3 px-6 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/admin/support/faqs/${encryptString(faq.faqId.toString())}`
                        )
                      }
                    >
                      {faq.question}
                    </TableCell>
                    <TableCell className="text-center py-3 px-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              faq.isActive
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              setFaqId(faq.faqId || 0);
                            }}
                          >
                            {faq.isActive ? "有効" : "無効"}
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
                                  handleStatusChange(true);
                                }}
                              >
                                有効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                onClick={() => {
                                  handleStatusChange(false);
                                }}
                              >
                                無効
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                          {/* <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() => {
                                  handleStatusChange(!statusToChange);
                                }}
                                className="text-xs bg-additional text-white cursor-pointer w-[100px] ml-auto hover:bg-additional/80"
                              >
                                OK
                              </Button>
                            </DialogClose>
                          </DialogFooter> */}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && faqs?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    FAQがありません
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={3} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && faqs?.data && faqs?.data?.data?.length > 0 && total > pageSize && (
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
        loading={isChangingFaqStatus}
        message="FAQの状況を変更しています"
      />
    </section>
  );
};

export default FaqsPage;
