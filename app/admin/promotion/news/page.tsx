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
  DialogTrigger,
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
import { useChangeNewsStatus, useNewsList } from "@/hooks/admin/useNews";
import { NewsItem } from "@/types/admin/news.type";
import { encryptString, formatDate2 } from "@/utils";
import { ChevronDown, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NewsPage = () => {
  const router = useRouter(); // Router
  const [pageSize] = useState(5); // Page size
  const [page, setPage] = useState(1); // Page

  const [newsTitle, setNewsTitle] = useState(""); // News title
  const [searchNewsTitle, setSearchNewsTitle] = useState(""); // Search news title
  const [newsDate, setNewsDate] = useState(""); // News date
  const [searchNewsDate, setSearchNewsDate] = useState(""); // Search news date
  const [status, setStatus] = useState("0"); // Status
  const [searchStatus, setSearchStatus] = useState("0"); // Search status
  const [target, setTarget] = useState(""); // Target user
  const [searchTarget, setSearchTarget] = useState(""); // Search target user
  const [newsId, setNewsId] = useState(0); // News ID
  const [statusToChange, setStatusToChange] = useState(false); // Status to change

  // Change news status
  const {
    mutate: changeStatus,
    error: changeStatusError,
    isSuccess,
    data: changeStatusData,
    isPending: isChangingNewsStatus,
  } = useChangeNewsStatus(newsId, statusToChange);

  // Get news
  const {
    data: news,
    isLoading,
    error,
    isError,
    refetch,
  } = useNewsList(
    page,
    pageSize,
    searchNewsTitle,
    searchStatus,
    searchNewsDate,
    searchTarget,
  );

  // Total news
  const total = news?.data?.pagination.totalElements || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Handle search news
  const handleSearch = () => {
    setPage(1);
    setSearchNewsTitle(newsTitle);
    setSearchNewsDate(newsDate);
    setSearchStatus(status);
    setSearchTarget(target);
  };

  // Handle status change
  const handleStatusChange = (productStatus: boolean) => {
    setStatusToChange(productStatus);
    changeStatus();
  };

  // Handle error
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
    setNewsTitle("");
    setNewsDate("");
    setStatus("0");
    setTarget("");
    setSearchNewsTitle("");
    setSearchNewsDate("");
    setSearchStatus("0");
    setSearchTarget("");
    refetch();
  };

  const getTargetUserLabel = (target?: number) => {
    if (!target && target !== 0) return "未設定";

    // Match the target options from the new news form
    switch (target) {
      case 0:
        return "すべて";
      case 1:
        return "一般";
      case 2:
        return "代理店";
    }
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>ニュース一覧</h2>
          </div>
          <Button
            onClick={() => router.push("/admin/promotion/news/new")}
            className="bg-primary hover:bg-primary/80 text-white rounded-md px-3 py-2"
          >
            <CirclePlus className="w-4 h-4" />
            新規作成
          </Button>
        </div>

        {/* Filter Section */}
        <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              {/* 日付 */}
              <div>
                <span className="text-sm">日付</span>
                <AdminDatePicker
                  value={newsDate}
                  onChange={(date) => setNewsDate(date)}
                  styleName="w-full border border-white-bg rounded-md mt-2 mb-4"
                />
              </div>

              {/* ニュース名 */}
              <div>
                <span className="text-sm">内容</span>
                <Input
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="ニュース名を入力"
                  className="mt-2 text-sm border border-white-bg rounded-md p-2"
                />
              </div>

                 {/* 対象者 */}
              <div>
                <span className="text-sm">対象者</span>
                <Select
                  value={target}
                  onValueChange={(value) => setTarget(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="対象者を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0">すべて</SelectItem>
                    <SelectItem value="1">一般</SelectItem>
                    <SelectItem value="2">代理店</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 状況 */}
              <div>
                <span className="text-sm">ステータス</span>
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

        <div className="flex justify-between items-center gap-2 mb-1 ">
          <p className="text-sm my-3 mb-5">{total ? total : 0}件</p>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="w-[100px] py-3 px-6 font-bold text-black text-xs uppercase text-left">
                  日付
                </TableHead>
                <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                  内容
                </TableHead>
                <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                  対象者
                </TableHead>
                <TableHead className="text-center py-3 px-6 font-bold text-black text-xs uppercase">
                  ステータス
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news?.data &&
                news?.data &&
                news?.data?.data.length > 0 &&
                news?.data.data.map((newsItem: NewsItem) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    key={newsItem.newsId}
                  >
                    <TableCell className="py-4 px-4 cursor-pointer">
                      {formatDate2(newsItem.newsDate) || "N/A"}
                    </TableCell>
                    <TableCell className="py-4 px-4 cursor-pointer">
                      {newsItem.title}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {getTargetUserLabel(newsItem.target)}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              newsItem.isActive
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              setNewsId(newsItem.newsId || 0);
                            }}
                          >
                            {newsItem.isActive ? "有効" : "無効"}
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

                    {/* 操作 */}
                    <TableCell className="px-6 py-4 text-center">
                      <Button
                        onClick={() =>
                          router.push(
                            `/admin/promotion/news/${encryptString(
                              newsItem.newsId.toString(),
                            )}`,
                          )
                        }
                        className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                      >
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && news?.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    ニュースがありません
                  </TableCell>
                </TableRow>
              )}
              {isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={5} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && news?.data && news?.data?.data?.length > 0 && news?.data?.pagination && news?.data?.pagination?.totalElements > pageSize && (
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
        loading={isChangingNewsStatus}
        message="ニュースの状態を変更しています"
      />
    </section>
  );
};

export default NewsPage;
