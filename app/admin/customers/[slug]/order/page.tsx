"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  decryptString,
  formatDate,
  encryptString,
  getPublicUrl,
  getOrderStatus,
  getOrderStatusClass,
} from "@/utils";
import { use, useState, useMemo } from "react";
import DetailCustomerHeader from "@/components/admin/profile/DetailCustomerHeader";
import { useGetOrderByCustomerId } from "@/hooks/admin/useCustomer";
import { Order } from "@/types/admin/order.type";
import PaginationComponent from "@/components/app/PaginationComponent";
import ImageComponent from "@/components/fc/ImageComponent";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import { useCustomerStore } from "@/store/Admin/useCustomerStore";

const ProfilePage = (props: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const params = use(props.params);
  const decryptedSlug = useMemo(
    () => decryptString(params.slug as string),
    [params.slug],
  );
  const pageSize = 10;
  const [page, setPage] = useState(1);
  // const { getUserType, downloadContract, isDownloading, getUserDetail, getFilteredPlans  } =
  //   useCustomerStore();
  const { data: ordersData, isLoading } = useGetOrderByCustomerId(
    decryptString(params.slug as string),
    page,
    pageSize,
  );
  const orders: Order[] = ordersData?.data || [];

  const totalPages = ordersData?.pagination?.totalPages || 0;

  const handleViewOrder = (orderId: number) => {
    const encryptedOrderId = encryptString(orderId.toString());
    router.push(
      `/admin/customers/${encryptString(decryptedSlug)}/order/${encryptedOrderId}`,
    );
  };

  return (
    <section className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
      {/* back */}
      <div className="flex gap-2 text-left items-center">
        <ArrowLeft
          className="cursor-pointer"
          size={20}
          onClick={() => router.push("/admin/customers")}
        />
        {/* <h2>アカウント一覧</h2> */}
      </div>
      <div className="flex gap-2 md:flex-row flex-col">
        {/* Filters */}
        <DetailCustomerHeader
          // handleDownload={() =>
          //   downloadContract(getUserDetail(), getFilteredPlans())
          // }
          slug={params.slug}
          // user_type={getUserType()}
          // isDownloading={isDownloading}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="my-4 font-bold">注文履歴({orders.length}件)</h2>
      </div>

      <div className="rounded-[10px] overflow-hidden border border-black/10">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/10">
              <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                注文日時
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                注文内容
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                ステータス
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                転送伝票番号
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                送料
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                合計金額
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-b border-black/10">
                  <TableCell colSpan={6} className="h-12 text-center">
                    <Skeleton className="h-12 w-full bg-white-bg rounded-[10px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.orderId}
                  className="border-b border-black/10 hover:bg-black/2 group cursor-pointer"
                  onClick={() => handleViewOrder(order.orderId)}
                >
                  <TableCell className="px-6 py-3 text-sm text-gray-900">
                    {formatDate(order.orderDate)}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.orderDetailId}
                        className="flex items-center gap-3 mb-2"
                      >
                        <div className="shrink-0 w-10 h-10">
                          <ImageComponent
                            imgURL={
                              getPublicUrl(
                                item.product.images?.[0]?.imageUrl,
                              ) || "/placeholder-product.png"
                            }
                            imgName="product"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex flex-col text-gray-500">
                          <span className="text-gray-900 font-medium">
                            {item.productName}
                          </span>
                          <span>{item.quantity} * 1</span>
                        </div>
                      </div>
                    ))}
                  </TableCell>

                  <TableCell className="px-6 py-3">
                    <span
                      className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 ${getOrderStatusClass(order.orderStatus)}`}
                    >
                      {getOrderStatus(order.orderStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-gray-900">
                    <span className="text-blue-600">
                      {order.shippingCompany === 1
                        ? "ヤマト運輸"
                        : order.shippingCompany === 2
                          ? "佐川急便"
                          : order.shippingCompany === 3
                            ? "日本郵便"
                            : order.shippingCompany === 4
                              ? "DHL"
                              : order.shippingCompany === 5
                                ? "FedEx"
                                : "未設定"}
                    </span>
                    <br />
                    <a href="" className="underline text-blue-600">
                      {order.trackingNumber}
                    </a>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-gray-900">
                    {"¥" + order.shippingCost}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm font-medium text-gray-900">
                    {"¥" + order.totalPrice?.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-3 text-center text-sm text-gray-500"
                >
                  レコードがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading &&
        orders?.length > 0 &&
        ordersData &&
        ordersData?.pagination?.totalElements >
          ordersData?.pagination?.pageSize && (
          <div className="flex justify-end">
            <div>
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage: number) => setPage(newPage)}
              />
            </div>
          </div>
        )}
    </section>
  );
};

export default ProfilePage;
