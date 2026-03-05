"use client";
import ImageComponent from "@/components/fc/ImageComponent";
import { Button } from "@/components/ui/button";
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
  useGetAdminBonusById,
  useGetMemberBonusById,
} from "@/hooks/admin/useBonus";
import {
  decryptString,
  encryptString,
  formatDate2,
  getPlanName,
  getPublicUrl,
} from "@/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

const BonusDetail = ({ params }: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const [fcId, tab] = decryptString(resolvedParams.slug).split("-");
  const { data: memberBonusByIdData, isLoading: memberBonusByIdDataLoading } =
    useGetMemberBonusById(tab === "member", Number(fcId));

  const { data: adminBonusByIdData, isLoading: adminBonusByIdDataLoading } =
    useGetAdminBonusById(tab === "admin", Number(fcId));

  const allMember = [
    ...(memberBonusByIdData?.data?.plan1Users?.map((user) => ({
      ...user,
      planType: 1,
    })) || []),
    ...(memberBonusByIdData?.data?.plan2Users?.map((user) => ({
      ...user,
      planType: 2,
    })) || []),
  ];

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("ja-JP")}`;
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

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-start items-center gap-4">
          <div className="flex gap-2 text-left items-center">
            <ArrowLeft
              size={20}
              onClick={() => router.back()}
              className="cursor-pointer"
            />
            <h2>ボーナス明細</h2>
          </div>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              {tab === "member" ? (
                <TableRow className="border-b border-black/10 bg-white">
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    NO
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    取引日付
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    対象ユーザー
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    プラン名
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    プラン金額
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    ボーナス
                  </TableHead>
                </TableRow>
              ) : (
                <TableRow className="border-b border-black/10 bg-white">
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    NO
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                    取引日付
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    対象ユーザー
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    商品
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    合計
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    ボーナス金額
                  </TableHead>
                  <TableHead className="px-6 py-4 font-bold text-black text-xs text-center whitespace-nowrap">
                    詳細
                  </TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {tab === "member"
                ? allMember?.map((bonus, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-black/10 hover:bg-black/2"
                    >
                      <TableCell className="px-6 py-4 text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {formatDate2(bonus.createdAt)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {bonus.username}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {getPlanName(bonus.planType)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        ¥ {formatCurrency(bonus.totalBuyPrice)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        ¥ {formatCurrency(bonus.bonus)}
                      </TableCell>
                    </TableRow>
                  ))
                : // {adminBonusByIdData}
                  // <div></div>
                  adminBonusByIdData &&
                  adminBonusByIdData?.data?.map((admin, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-black/10 hover:bg-black/2"
                    >
                      <TableCell className="px-6 py-4 text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {formatDate2(admin.transactionDate)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {admin.buyer.username}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-50">
                            {admin.order.orderItems && (
                              <ImageComponent
                                imgURL={getPublicUrl(
                                  admin?.order?.orderItems[index]?.product
                                    ?.images[0]?.imageUrl,
                                )}
                                imgName={`product-${admin?.order?.orderItems[0]?.product}`} // Add a meaningful name
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div className="flex-1 text-start ">
                            <div className="text-base text-dark line-clamp-2">
                              {admin?.order?.orderItems[index]?.product?.name}
                            </div>
                            <div className="mt-1">
                              <span className="text-sm font-normal">
                                ¥
                                {admin?.order?.orderItems[
                                  index
                                ]?.product?.salePrice.toLocaleString(
                                  "ja-JP",
                                )}{" "}
                                * {admin?.order?.orderItems[index]?.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {/* {bonus.introducedMembersGold}名 */}¥
                        {formatCurrency(admin.totalBuyPrice)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ¥{formatCurrency(admin.bonus)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Button
                          onClick={() =>
                            router.push(
                              `/admin/orders/${encryptString(
                                admin?.order?.orderId?.toString() || "",
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
              {memberBonusByIdDataLoading ||
                (adminBonusByIdDataLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index} className="border-b border-black/10">
                      <TableCell colSpan={10} className="text-center">
                        <Skeleton className="h-12 w-full bg-white-bg" />
                      </TableCell>
                    </TableRow>
                  )))}
              {((allMember.length === 0 && tab === "member") ||
                (adminBonusByIdData?.data?.length === 0 &&
                  tab === "admin")) && (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    レコードがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default BonusDetail;
