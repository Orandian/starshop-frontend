"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import {
  convertToLocaleDateTime,
  convertToYen,
  encryptString,
  getPublicUrl,
  decryptString,
} from "@/utils";
import { useParams, useRouter } from "next/navigation";
import {
  useCancelSubscription,
  useGetSubscriptionSummaryDetailsBySubscriptionId,
} from "@/hooks/admin/useSubscription";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { subscriptionProduct } from "@/types/regular_purchases";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn ,} from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProductCell = ({
  name,
  price,
  image,
  regular_price,
  regular_percentage,
  onClick,
}: {
  name: string;
  price: number;
  image: string;
  regular_price: number;
  regular_percentage: number;
  onClick?: () => void;
}) => {
  return (
    <div className="flex gap-4 items-center cursor-pointer" onClick={onClick}>
      <div className="w-[80px] h-[80px] bg-white-bg border border-black/10">
        <Image
          src={image}
          alt={name}
          className="w-full h-full object-contain"
          width={80}
          height={80}
        />
      </div>
      <div className="space-y-2">
        <p className="text-normal">{name}</p>
        <p className="text-normal">
          <span className="line-through mr-2">{convertToYen(price)}</span>
          {regular_percentage}%割引
        </p>
        <p className="text-lg font-bold text-primary">
          {convertToYen(regular_price)}
        </p>
      </div>
    </div>
  );
};

const SubscriptionDetailsPage = () => {
  const router = useRouter();
  const params = useParams(); // Get order id from url

  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const {
    data: subscriptionSummary,
    isLoading: subscriptionSummaryLoading,
    error: subscriptionSummaryError,
    isError: subscriptionSummaryIsError,
    refetch: subscriptionSummaryRefetch,
  } = useGetSubscriptionSummaryDetailsBySubscriptionId(
    Number(subscriptionId || 0)
  ); // Get order summary details

  const {
    mutateAsync: cancelSubscription,
    isPending: cancelSubscriptionLoading,
  } = useCancelSubscription();

  const handleCancelSubscription = () => {
    cancelSubscription(
      {
        subscriptionId: Number(subscriptionId || 0),
        stripeSubscriptionId:
          subscriptionSummary?.data[0]?.stripe_subscription_id || "",
        stripeCustomerId:
          subscriptionSummary?.data[0]?.stripe_customer_id || "",
      },
      {
        onSuccess: () => {
          toast.success("定期購入を中止しました。");
          setIsCancelModalOpen(false);
          subscriptionSummaryRefetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (params.slug) {
      const decryptedSubscriptionId = decryptString(params.slug as string);
      if (decryptedSubscriptionId === null) {
        router.push("/profile");
        return;
      }
      setSubscriptionId(decryptedSubscriptionId);
    }
  }, [params.slug, router]);

  // If error, show error message
  useEffect(() => {
    if (subscriptionSummaryIsError) {
      toast.error(subscriptionSummaryError.message);
    }
  }, [subscriptionSummaryIsError, subscriptionSummaryError]);

  return (
    <div className="px-4">
      <div className="bg-white/50 border border-white-bg rounded-md p-4 md:p-6 drop-shadow-xl md:space-y-6 space-y-3">
        <div className="space-y-4 relative">
          <h2 className="text-2xl font-bold">定期購入情報</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <p className="font-bold w-[100px]">定期購入ID</p>
              <p className="w-[10px]">:</p>
              <p>{subscriptionSummary?.data[0]?.regular_purchase_cart_id}</p>
            </div>
            <div className="flex items-center">
              <p className="font-bold w-[100px]">購入日</p>
              <p className="w-[10px]">:</p>
              <p>
                {convertToLocaleDateTime(
                  subscriptionSummary?.data[0]?.created_at,
                  "Asia/Tokyo"
                )}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-bold w-[100px]">次回購入日</p>
              <p className="w-[10px]">:</p>
              <p>
                {convertToLocaleDateTime(
                  subscriptionSummary?.data[0]?.current_period_end,
                  "Asia/Tokyo"
                )}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-bold w-[100px]">購入方法</p>
              <p className="w-[10px]">:</p>
              <p>{subscriptionSummary?.data[0]?.purchase_type_name}</p>
            </div>
            <div className="flex items-center">
              <p className="font-bold w-[100px]">ステータス</p>
              <p className="w-[10px]">:</p>
              <Badge
                className={cn(
                  "text-xs text-white w-[80px]",
                  subscriptionSummary?.data[0]?.subscription_status === "active"
                    ? "bg-green-500"
                    : "bg-red-500"
                )}
              >
                {subscriptionSummary?.data[0]?.subscription_status === "active"
                  ? "有効"
                  : "無効"}
              </Badge>
            </div>
          </div>

          {subscriptionSummary?.data[0]?.subscription_status === "active" && (
            <div className="absolute top-0 right-0">
              <Button
                onClick={() => setIsCancelModalOpen(true)}
                className="bg-red-500 text-white px-4 py-2 cursor-pointer hover:bg-red-600"
              >
                中止する
              </Button>
            </div>
          )}
        </div>
        {/* Subscription Details Table */}
        <div className="space-y-2 md:mt-7 mt-5">
          {/* Subscription Details Table */}
          <div className="bg-white/50 border border-white-bg rounded-md">
            {/* Desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white-bg">
                    <TableHead className=" px-6 py-4">商品</TableHead>
                    <TableHead className="w-[100] px-6 py-4">
                      金額（税別）
                    </TableHead>
                    <TableHead className="w-[250px] px-6 py-4">個数</TableHead>
                    <TableHead className="w-[100px] px-6 py-4">
                      合計金額
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!subscriptionSummaryLoading &&
                    subscriptionSummary?.data[0]?.products.map(
                      (product: subscriptionProduct) => (
                        <TableRow
                          key={product.product_id}
                          className="border-b border-white-bg"
                        >
                          <TableCell className="px-6 py-4">
                            <ProductCell
                              name={product.product_name}
                              price={product.sale_price}
                              regular_price={product.regular_discount}
                              regular_percentage={product.regular_percentage}
                              image={
                                product.product_images[0]
                                  ? getPublicUrl(product.product_images[0])
                                  : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                              }
                              onClick={() =>
                                router.push(
                                  `/products/${encryptString(
                                    product.product_id.toString()
                                  )}`
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {convertToYen(product.regular_discount)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {product.product_quantity}
                          </TableCell>
                          <TableCell className="text-right px-6 py-4">
                            {convertToYen(product.subtotal_without_tax)}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  {subscriptionSummaryLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-white-bg"
                      >
                        <TableCell colSpan={4} className="p-4">
                          <Skeleton className="h-[50px] w-full bg-white-bg rounded-md p-2 mt-1" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <div className="">
                {!subscriptionSummaryLoading &&
                  subscriptionSummary?.data[0]?.products.map(
                    (product: subscriptionProduct) => (
                      <div
                        key={product.product_id}
                        className="border-b border-white-bg"
                      >
                        <div className="px-3 py-3">
                          <ProductCell
                            name={product.product_name}
                            price={product.regular_discount}
                            regular_price={product.regular_discount}
                            regular_percentage={product.regular_percentage}
                            image={
                              product.product_images[0]
                                ? getPublicUrl(product.product_images[0])
                                : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            }
                            onClick={() =>
                              router.push(
                                `/products/${encryptString(
                                  product.product_id.toString()
                                )}`
                              )
                            }
                          />
                        </div>
                        <div className="px-3 mb-2 flex justify-between text-sm">
                          <p>個数: {product.product_quantity}</p>
                          <p>{convertToYen(product.subtotal_without_tax)}</p>
                        </div>
                      </div>
                    )
                  )}
                {subscriptionSummaryLoading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border-b border-white-bg">
                      <div className="p-4">
                        <Skeleton className="h-[50px] w-full bg-white-bg rounded-md p-2 mt-1" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {!subscriptionSummaryLoading && (
            <div className="md:py-6 md:px-6 py-4 px-2 md:space-y-10 space-y-5">
              <div className="flex justify-between">
                <div className="w-full flex md:justify-end justify-between font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">小計</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(
                        subscriptionSummary?.data[0]
                          ?.total_discount_price_without_tax || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">税金(8%)</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(
                        subscriptionSummary?.data[0]?.total_8_percent_tax || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-base">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p className="text-sm">税金(10%)</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p className="text-sm">
                      {convertToYen(
                        subscriptionSummary?.data[0]?.total_10_percent_tax || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-full flex justify-end font-semibold text-2xl">
                  <div className="w-[70%] flex justify-start md:justify-end">
                    <p>合計</p>
                  </div>
                  <div className="w-[30%] flex justify-end">
                    <p>
                      {convertToYen(
                        subscriptionSummary?.data[0]
                          ?.total_discount_price_with_tax || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subscriptionSummaryLoading && (
            <div className="flex pr-5 gap-4">
              <div className="md:block hidden w-[70%]" />
              <div className="md:w-[30%] w-full flex flex-col gap-5 justify-end font-semibold text-base">
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
                <Skeleton className="h-[30px] w-full bg-white-bg border border-white-bg rounded-md p-2 mt-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-white rounded-md p-4 md:p-6 drop-shadow-xl md:space-y-6 space-y-3">
          <DialogHeader>
            <DialogTitle>定期購入を中止する</DialogTitle>
            <DialogDescription>定期購入を中止しますか？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                キャンセル
              </Button>
            </DialogClose>
            <Button
              disabled={cancelSubscriptionLoading}
              onClick={handleCancelSubscription}
              className="bg-primary text-white cursor-pointer"
            >
              {cancelSubscriptionLoading ? "中止中..." : "中止する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionDetailsPage;
