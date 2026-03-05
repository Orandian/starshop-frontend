"use client";

import React, { useState } from "react";
import { Star, Grid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ReviewsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Filter handlers
  const resetFilters = () => {
    setRatingFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
  };
  
  const handleSearch = () => {
    // Implement search logic here
    // TODO: Apply filters to reviews data
  };

  // Mock data for demonstration
  const ratingDistribution = [
    { stars: 5, count: 125, percentage: 62.5 },
    { stars: 4, count: 45, percentage: 22.5 },
    { stars: 3, count: 20, percentage: 10.0 },
    { stars: 2, count: 7, percentage: 3.5 },
    { stars: 1, count: 3, percentage: 1.5 },
  ];

  const reviews = [
    {
      id: 1,
      customerName: "山田太郎",
      rating: 5,
      date: "2026/01/15",
      comment: "商品の品質が非常に良いです。配送も迅速で満足しています。",
      productName: "スタンダードプラン",
      status: "approved",
    },
    {
      id: 2,
      customerName: "佐藤花子",
      rating: 4,
      date: "2026/01/14",
      comment: "期待通りの商品でした。もう少し安ければもっと良いと思います。",
      productName: "ゴールドプラン",
      status: "approved",
    },
    {
      id: 3,
      customerName: "鈴木一郎",
      rating: 3,
      date: "2026/01/13",
      comment: "普通の商品です。特筆すべき点もなければ、特に不満もありません。",
      productName: "スタンダードプラン",
      status: "pending",
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="grid flex-1 gap-1 text-left">
            <h2>カテゴリ一覧</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "border-gray-200",
                viewMode === "grid" ? "text-white border-px" : "text-black",
              )}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "border-gray-200",
                viewMode === "list" ? "text-white border-px" : "text-black",
              )}
            >
              <List size={16} />
            </Button>
          </div>
        </div>

        {/* Rating Distribution */}
        <Card className="border-gray-200 shadow-none">
          <CardHeader>
            <CardTitle>評価分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{item.stars}</span>
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-20 justify-end">
                    <span className="text-sm text-gray-600">{item.count}</span>
                    <span className="text-xs text-gray-500">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">4.2</span>
                  <div className="flex">{renderStars(4.2)}</div>
                </div>
                <span className="text-sm text-gray-600">
                  全{" "}
                  {ratingDistribution.reduce(
                    (sum, item) => sum + item.count,
                    0,
                  )}{" "}
                  件のレビュー
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
          <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 w-full">
              {/* 評価フィルター */}
              <div>
                <span className="text-sm">評価</span>
                <Select
                  value={ratingFilter}
                  onValueChange={(value) => setRatingFilter(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="評価を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="5">5星</SelectItem>
                    <SelectItem value="4">4星</SelectItem>
                    <SelectItem value="3">3星</SelectItem>
                    <SelectItem value="2">2星</SelectItem>
                    <SelectItem value="1">1星</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ステータスフィルター */}
              <div>
                <span className="text-sm">ステータス</span>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="approved">承認済み</SelectItem>
                    <SelectItem value="pending">保留中</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 日付フィルター */}
              <div>
                <span className="text-sm">日付</span>
                <Select
                  value={dateFilter}
                  onValueChange={(value) => setDateFilter(value)}
                >
                  <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="日付を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="today">今日</SelectItem>
                    <SelectItem value="week">今週</SelectItem>
                    <SelectItem value="month">今月</SelectItem>
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

        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm my-3 mb-5">
            {reviews.length ? reviews.length : 0}件
          </p>
        </div>

        {/* Reviews Table/List */}
        {viewMode === "list" ? (
          <div className="rounded-[10px] overflow-hidden border border-black/10">
            <Table className="">
              <TableHeader>
                <TableRow className="border-b border-black/10">
                  <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                    顧客名
                  </TableHead>
                  <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                    商品名
                  </TableHead>
                  <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                    評価
                  </TableHead>
                  <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                    日付
                  </TableHead>
                  <TableHead className="py-3 px-6 font-bold text-black text-xs uppercase text-left">
                    コメント
                  </TableHead>
                  <TableHead className="text-center py-3 px-6 font-bold text-black text-xs uppercase">
                    ステータス
                  </TableHead>
                  <TableHead className="text-center py-3 px-6 font-bold text-black text-xs uppercase">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    key={review.id}
                  >
                    <TableCell className="py-4 px-4 font-medium">
                      {review.customerName}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {review.productName}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {renderStars(review.rating)}
                    </TableCell>
                    <TableCell className="py-4 px-4">{review.date}</TableCell>
                    <TableCell className="py-4 px-4 max-w-xs truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`rounded-[30px] text-xs cursor-pointer w-[100px] text-white ${
                              review.status === "approved"
                                ? "bg-tertiary hover:bg-tertiary/80"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                            // onClick={() => {
                            // setCategoryId(category.categoryId || 0);
                            // }}
                          >
                            {review.status === "approved" ? "有効" : "無効"}
                            <ChevronDown size={15} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                          <DialogHeader>
                            <DialogTitle>ステータス変更</DialogTitle>
                            <DialogDescription className="w-full flex items-center justify-center gap-4 border-y border-black/10 py-8 mt-2">
                              <DialogClose
                                className="rounded-md text-xs bg-tertiary text-white cursor-pointer w-[100px] py-2 hover:bg-tertiary/80"
                                // onClick={() => {
                                //   handleStatusChange(categoryId, true);
                                // }}
                              >
                                有効
                              </DialogClose>
                              <DialogClose
                                className="rounded-md text-xs bg-secondary text-white cursor-pointer w-[100px] py-2 hover:bg-secondary/80"
                                // onClick={() => {
                                //   handleStatusChange(categoryId, false);
                                // }}
                              >
                                無効
                              </DialogClose>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Button
                        // onClick={() => {
                        //   setOpenUpdateCategory(true);
                        //   setUpdateCategoryId(category.categoryId);
                        //   updateForm.reset({
                        //     name: category.name || "",
                        //     description: category.description || "",
                        //     parentCategoryId: category.parentCategoryId || null,
                        //   });
                        // }}
                        className="bg-primary hover:bg-primary/80 text-white text-xs px-4 py-2 rounded-md"
                      >
                        編集
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-gray-200 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{review.customerName}</h3>
                      <p className="text-sm text-gray-600">
                        {review.productName}
                      </p>
                    </div>
                    <Badge
                      variant={
                        review.status === "approved" ? "default" : "secondary"
                      }
                    >
                      {review.status === "approved" ? "承認済み" : "保留中"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {review.comment}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      詳細を見る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsPage;
