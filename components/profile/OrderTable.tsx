"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  convertToYen,
  encryptString,
  formatOrderDate,
  getPublicUrl,
} from "@/utils";
import { ListFilter } from "lucide-react";
import PaginationComponent from "../app/PaginationComponent";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import StatusBadgeComponent from "@/components/app/StatusBadgeComponent";
import { cn } from "@/lib/utils";
import { OrderSummary } from "@/types/profile/ordersummary.type";
import { useGetUserOrderSummariesAPI } from "@/hooks/user/useProfile";
import { OrderReceiptDownloadButton } from "./OrderReceiptDownloadButton";

// Image card component props
interface ImageCardComponentProps {
  imgURL: string;
  imgName: string;
  className?: string;
}

// Image card component
const ImageCardComponent = ({
  imgURL,
  imgName,
  className,
}: ImageCardComponentProps) => {
  return (
    <div
      className={cn(
        "bg-white-bg flex items-center justify-center overflow-hidden w-[80px] h-[80px] border border-black/10",
        className
      )}
    >
      <Image
        src={imgURL}
        alt={imgName}
        width={80}
        height={80}
        className="object-contain"
      />
    </div>
  );
};

const OrderTable = () => {
  const router = useRouter(); // Router
  const [pageSize] = useState(20); // Page size
  const [page, setPage] = useState(1); // Page

  const [orderDate, setOrderDate] = useState(""); // Order date
  const [status, setStatus] = useState("all"); // Status
  const [searchOrderDate, setSearchOrderDate] = useState(""); // Search order date
  const [searchStatus, setSearchStatus] = useState("all"); // Search status

  const [open, setOpen] = useState(false); // Open dialog

  // Get order summaries
  const {
    data: orderSummaryData,
    isLoading: orderSummaryLoading,
    error: orderSummaryError,
    isError: orderSummaryIsError,
  } = useGetUserOrderSummariesAPI(
    page,
    pageSize,
    searchOrderDate,
    searchStatus
  );

  // Total orders
  const totalOrders = (orderSummaryData?.data ?? []) as OrderSummary[];
  const totalPages = Math.ceil(totalOrders?.length / pageSize);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setSearchOrderDate(orderDate);
    setSearchStatus(status);
    setOpen(false);
  };

  // Error handling
  useEffect(() => {
    if (orderSummaryError && orderSummaryIsError) {
      toast.error(orderSummaryError.message || "注文情報の取得に失敗しました。");
    }
  }, [orderSummaryError, orderSummaryIsError]);

  return (
    <div>
      <div className="flex items-center justify-between px-2 py-2">
        <p className="text-sm">{totalOrders?.length}件</p>
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
                <DialogDescription className="mt-2 justify-content-start items-start flex flex-col">
                  {/* 注文日 */}
                  <span className="text-left">注文日</span>
                  <AdminDatePicker
                    value={orderDate}
                    onChange={(date) => setOrderDate(date)}
                    styleName="w-full border border-white-bg rounded-md mt-2 p-2 mb-4"
                  />

                  {/* 状況 */}
                  <span className="text-left">状況</span>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger className="w-full mt-2 text-sm border border-white-bg rounded-md p-2">
                      <SelectValue placeholder="状況を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-white-bg rounded-md">
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="保留中">保留中</SelectItem>
                      <SelectItem value="処理中">処理中</SelectItem>
                      <SelectItem value="発送済み">発送済み</SelectItem>
                      <SelectItem value="配送済み">配送済み</SelectItem>
                      <SelectItem value="キャンセル済み">
                        キャンセル済み
                      </SelectItem>
                      <SelectItem value="返品済み">返品済み</SelectItem>
                      <SelectItem value="返金済み">返金済み</SelectItem>
                      <SelectItem value="失敗">失敗</SelectItem>
                      <SelectItem value="完了">完了</SelectItem>
                    </SelectContent>
                  </Select>
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
      <div className="border border-white-bg rounded-md bg-white/50">
        {/* Desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className=" px-6 py-4  text-black">注文内容</TableHead>
                <TableHead className="w-[150px] px-6 py-4 text-black">注文日時</TableHead>
                <TableHead className="w-[150px] px-6 py-4 text-black">状況</TableHead>
                <TableHead className="w-[100px] px-6 py-4 text-black">送料</TableHead>
                <TableHead className="w-[100px] px-6 py-4 text-black">
                  合計金額
                </TableHead>
                <TableHead className="w-[100px] text-right px-6 py-4 text-black">
                  領収書
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!orderSummaryLoading &&
                totalOrders.map((order: OrderSummary) => (
                  <TableRow
                    key={order.orderId}
                    className="border-b border-white-bg"
                  >
                    <TableCell
                      className="px-6 py-4 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/profile/${encryptString(order.orderId.toString())}`
                        )
                      }
                    >
                      {order.orderItems?.map((item, index) => (
                        <div
                          className={`flex items-center space-y-4 space-x-4 ${
                            (order.orderItems?.length ?? 0) > 1 &&
                            index !== (order.orderItems?.length ?? 0) - 1
                              ? "mb-2"
                              : ""
                          }`}
                          key={item.productId}
                        >
                          <ImageCardComponent
                            imgURL={getPublicUrl(item.productImages[0])}
                            imgName="product1"
                          />
                          <div className="flex-col">
                            <p className="truncate w-[200px]">
                              {item.productName}
                            </p>
                            <p>
                              {convertToYen(
                                Math.floor(
                                  item.salePrice +
                                    (item.salePrice * item.tax) / 100
                                )
                              )}{" "}
                              * {item.productQuantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {order?.orderDate && formatOrderDate(order?.orderDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <StatusBadgeComponent
                        label={order?.orderStatus ?? ""}
                        isLink={false}
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {convertToYen(order?.shippingCost ?? 0)}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4">
                      {convertToYen(order?.orderTotal ?? 0)}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4">
                      <OrderReceiptDownloadButton
                        orderId={order.orderId.toString()}
                        label="ダウンロード"
                        className="rounded-lg px-4 bg-primary text-white-bg border-white-bg"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {/* No orders found */}
              {(!orderSummaryLoading && totalOrders.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    注文がありません
                  </TableCell>
                </TableRow>
              )}
              {/* Loading */}
              {orderSummaryLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Skeleton className="h-24 w-full bg-white-bg rounded-[10px]" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {!orderSummaryLoading &&
          totalOrders?.map((order: OrderSummary) => (
            <div
              key={order.orderId}
              className="bg-white/50 border border-white-bg rounded-md p-4 mb-4 text-xs space-y-2"
              onClick={() =>
                router.push(
                  `/profile/${encryptString(order?.orderId.toString())}`
                )
              }
            >
              <div className="flex items-center mb-4 justify-between">
                <div>
                  {/* {convertToLocaleDateTime(order?.orderDate, "Asia/Tokyo")} */}
                  {order?.orderDate && formatOrderDate(order?.orderDate)}
                </div>
                <StatusBadgeComponent
                  label={order?.orderStatus ?? ""}
                  isLink={false}
                />
              </div>
              <div>
                {order.orderItems?.map((item, index) => (
                  <div
                    className={`flex items-center ${
                      (order.orderItems?.length ?? 0) > 1 &&
                      index !== (order.orderItems?.length ?? 0) - 1
                        ? "mb-2"
                        : "mb-0"
                    }`}
                    key={item.productId}
                  >
                    <ImageCardComponent
                      imgURL={getPublicUrl(item.productImages[0])}
                      imgName="product1"
                      className="w-[60px] h-[60px]"
                    />
                    <div className="flex-col ml-2">
                      <p className="truncate">{item.productName}</p>
                      <p>
                        {convertToYen(
                          Math.floor(
                            item.salePrice + (item.salePrice * item.tax) / 100
                          )
                        )}{" "}
                        * {item.productQuantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>合計金額</div>
                <div>{convertToYen(order?.orderTotal ?? 0)}</div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>領収書</div>
                <div>
                  <OrderReceiptDownloadButton
                    orderId={order.orderId.toString()}
                    label="ダウンロード"
                    className="rounded-lg px-4 bg-primary text-white-bg border-white-bg"
                  />
                </div> 
              </div>

            </div>
          ))}
      </div>

      {/* Pagination */}
      {!orderSummaryLoading && orderSummaryData && totalOrders.length > 0 && (
        <div className="flex justify-end pt-8">
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
  );
};

export default OrderTable;
