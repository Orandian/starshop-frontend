"use client";

import BannerComponent from "@/components/app/BannerComponent";
import BannerImage from "@/public/products/Banner.png";
import PublicLayout from "@/components/layouts/PublicLayout";
import { useEffect, useState } from "react";
import { useNewsList } from "@/hooks/user/useNews";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListFilter } from "lucide-react";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PaginationComponent from "@/components/app/PaginationComponent";
import { toast } from "sonner";
import { NewsItem } from "@/types/news";
import NewsCardComponent from "@/components/app/public/NewsCardComponent";
import { useRouter } from "next/navigation";
import { encryptString } from "@/utils";

export default function NewsPage() {
  const router = useRouter(); // Router
  const [pageSize] = useState(10); // Page size
  const [page, setPage] = useState(1); // Page

  const [newsTitle, setNewsTitle] = useState(""); // News title
  const [searchNewsTitle, setSearchNewsTitle] = useState(""); // Search news title
  const [newsDate, setNewsDate] = useState(""); // News date
  const [searchNewsDate, setSearchNewsDate] = useState(""); // Search news date
  const [open, setOpen] = useState(false); // Open

  // Get news list
  const {
    data: news,
    isLoading,
    error,
    isError,
  } = useNewsList(page, pageSize, searchNewsTitle, searchNewsDate);
  // const {
  //   data: news,
  //   isLoading,
  //   error,
  //   isError,
  // } = usePublicNewsList(page, pageSize, searchNewsTitle, searchNewsDate)

  const total = news?.data?.pagination?.totalElements || 0; // Total news
  const totalPages = Math.ceil(total / pageSize); // Total pages

  // Handle search news
  const handleSearch = () => {
    setPage(1); // Reset page
    setSearchNewsTitle(newsTitle); // Set search news title
    setSearchNewsDate(newsDate); // Set search news date
    setOpen(false); // Close dialog
  };

  // Handle news click
  const handleNewsClick = (newsId: number) => {
    router.push(`/news/${encryptString(newsId.toString())}`); // Navigate to news details
  };

  // Handle error
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }
  }, [isError, error]);

  return (
    <PublicLayout>
      <BannerComponent image={BannerImage} />

      <div className="container px-10 py-10 space-y-6 border-0 rounded-[10px]">
        <h2>ニュース一覧</h2>

        {/* Filter & Search */}
        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm">{total}件</p>
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <div className="flex items-center justify-between">
                <DialogTrigger asChild>
                  <div className="hover:bg-black/2 cursor-pointer p-2 rounded-[7px] hover:text-black/80">
                    <ListFilter
                      className="w-5 h-5"
                      onClick={() => setOpen(true)}
                    />
                  </div>
                </DialogTrigger>
              </div>

              <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                <DialogHeader>
                  <DialogTitle>検索</DialogTitle>
                  <DialogDescription className="mt-2 space-y-4">
                    {/* 日付 */}
                    <span className="text-xs">日付</span>
                    <AdminDatePicker
                      value={newsDate}
                      onChange={(date) => setNewsDate(date)}
                      styleName="w-full border border-white-bg rounded-md p-2 mt-2"
                    />

                    {/* ニュース名 */}
                    <span className="text-sm">ニュース名</span>
                    <Input
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="ニュース名を入力"
                      className="mt-2 text-sm border border-white-bg rounded-md p-2"
                    />
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                    onClick={handleSearch}
                  >
                    OK
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="w-full space-y-6">
          {news?.data?.data?.map((news: NewsItem) => (
            <div key={news.newsId} className="shrink-0">
              <NewsCardComponent
                date={news.newsDate.join("/")}
                title={news.title}
                handleClick={() => handleNewsClick(news.newsId)}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {!isLoading && news?.data && news?.data?.data?.length > 0 && (
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
    </PublicLayout>
  );
}
