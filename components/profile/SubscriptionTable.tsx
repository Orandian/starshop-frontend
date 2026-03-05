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
  convertToLocaleDateTime,
  convertToYen,
  encryptString,
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
import { useGetSubscriptionSummaries } from "@/hooks/user/useSubscription";
import { RegularPurchaseSummary } from "@/types/regular_purchases";

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

const SubscriptionTable = () => {
  const router = useRouter(); // Router
  const [pageSize] = useState(5); // Page size
  const [page, setPage] = useState(1); // Page

  const [orderDate, setOrderDate] = useState(""); // Order date
  const [status, setStatus] = useState("all"); // Status
  const [searchOrderDate, setSearchOrderDate] = useState(""); // Search order date
  const [searchStatus, setSearchStatus] = useState("all"); // Search status

  const [open, setOpen] = useState(false); // Open dialog

  // Get order summaries
  const {
    data: subscriptionSummaryData,
    isLoading: subscriptionSummaryLoading,
    error: subscriptionSummaryError,
    isError: subscriptionSummaryIsError,
  } = useGetSubscriptionSummaries(
    page,
    pageSize,
    searchOrderDate,
    searchStatus
  );

  // Total orders
  const total = subscriptionSummaryData?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setSearchOrderDate(orderDate);
    setSearchStatus(status);
    setOpen(false);
  };

  // Error handling
  useEffect(() => {
    if (subscriptionSummaryError && subscriptionSummaryIsError) {
      toast.error(subscriptionSummaryError.message);
    }
  }, [subscriptionSummaryError, subscriptionSummaryIsError]);

  return (
    <div>
      <div className="flex items-center justify-between px-2 py-2">
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
                      <SelectItem value="active">有効</SelectItem>
                      <SelectItem value="inactive">無効</SelectItem>
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
              <TableRow className="border-b border-white-bg">
                <TableHead className=" px-6 py-4">注文内容</TableHead>
                <TableHead className="w-[150px] px-6 py-4">注文日時</TableHead>
                <TableHead className="w-[150px] px-6 py-4">次回購入日時</TableHead>
                <TableHead className="w-[150px] px-6 py-4">状況</TableHead>
                <TableHead className="w-[100px] px-6 py-4">間隔</TableHead>
                <TableHead className="w-[100px] text-right px-6 py-4">
                  合計金額
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!subscriptionSummaryLoading &&
                subscriptionSummaryData?.data?.data.map(
                  (subscription: RegularPurchaseSummary) => (
                    <TableRow
                      key={subscription.cart_id}
                      className="border-b border-white-bg"
                    >
                      <TableCell
                        className="px-6 py-4 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/profile/subscription/${encryptString(subscription.cart_id.toString())}`
                          )
                        }
                      >
                        {subscription.subscription_items.map((item, index) => (
                          <div
                            className={`flex items-center space-y-4 space-x-4 ${
                              subscription.subscription_items.length > 1 &&
                              index !==
                                subscription.subscription_items.length - 1
                                ? "mb-2"
                                : ""
                            }`}
                            key={item.product_id}
                          >
                            <ImageCardComponent
                              imgURL={getPublicUrl(item.product_images[0])}
                              imgName="product1"
                            />
                            <div className="flex-col">
                              <p className="truncate w-[200px]">
                                {item.product_name}
                              </p>
                              <p className="text-sm">
                                <span className="line-through mr-2">{convertToYen(item.sale_price)}</span>
                                {item.regular_percentage}%割引
                              </p>
                              <p>
                                <span className="text-lg font-semibold text-primary">
                                  {convertToYen(item.regular_discount)}
                                </span>{" "}
                                * {item.product_quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {convertToLocaleDateTime(
                          subscription.purchase_date,
                          "Asia/Tokyo"
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {convertToLocaleDateTime(
                          subscription.next_purchase_date,
                          "Asia/Tokyo"
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <StatusBadgeComponent
                          label={subscription.cart_status === "active" ? "有効" : "無効"}
                          isLink={false}
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {subscription.purchase_type_name}
                      </TableCell>
                      <TableCell className="text-right px-6 py-4">
                        {convertToYen(subscription.cart_total)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              {/* No subscription found */}
              {subscriptionSummaryData?.data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    定期購入がありません
                  </TableCell>
                </TableRow>
              )}
              {/* Loading */}
              {subscriptionSummaryLoading &&
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
        {!subscriptionSummaryLoading &&
          subscriptionSummaryData?.data?.data.map(
            (subscription: RegularPurchaseSummary) => (
              <div
                key={subscription.cart_id}
                className="bg-white/50 border border-white-bg rounded-md p-4 mb-4 text-xs space-y-2"
                onClick={() =>
                  router.push(
                    `/profile/subscription/${encryptString(subscription.cart_id.toString())}`
                  )
                }
              >
                <div className="flex items-center mb-4 justify-between">
                  <div>
                    {convertToLocaleDateTime(
                      subscription.purchase_date,
                      "Asia/Tokyo"
                    )}
                  </div>
                  <StatusBadgeComponent
                    label={subscription.cart_status === "active" ? "有効" : "無効"}
                    isLink={false}
                  />
                </div>
                <div>
                  {subscription.subscription_items.map((item, index) => (
                    <div
                      className={`flex items-center ${
                        subscription.subscription_items.length > 1 &&
                        index !== subscription.subscription_items.length - 1
                          ? "mb-2"
                          : "mb-0"
                      }`}
                      key={item.product_id}
                    >
                      <ImageCardComponent
                        imgURL={getPublicUrl(item.product_images[0])}
                        imgName="product1"
                        className="w-[60px] h-[60px]"
                      />
                      <div className="flex-col ml-2">
                        <p className="truncate">{item.product_name}</p>
                        <p>
                          {convertToYen(
                            Math.floor(
                              item.sale_price +
                                (item.sale_price * item.tax) / 100
                            )
                          )}{" "}
                          * {item.product_quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>合計金額</div>
                  <div>{convertToYen(subscription.cart_total)}</div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>間隔</div>
                  <div>{subscription.purchase_type_name}</div>
                </div>
              </div>
            )
          )}
      </div>

      {/* Pagination */}
      {!subscriptionSummaryLoading &&
        subscriptionSummaryData &&
        subscriptionSummaryData?.data?.data.length > 0 && (
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

export default SubscriptionTable;
