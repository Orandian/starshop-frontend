"use client";
import ImageComponent from "@/components/fc/ImageComponent";
import MobileTableCard from "@/components/fc/MobileTableCard";
import QrPopup from "@/components/fc/my-page/Qrpopup";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBonusTransactionList } from "@/hooks/fc/useBonus";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import { useGetAllOrderAmount, useOrder } from "@/hooks/fc/useOrder";
import { useProductPopular } from "@/hooks/fc/useProduct";
import { useTeam } from "@/hooks/fc/useTeam";
import { getUser } from "@/lib/api/auth";
import { Order, TeamList } from "@/types/fc";
import { BonusTransactionList } from "@/types/fc/bonus.type";
import {
  encodeShortString,
  encryptString,
  formatDate,
  formatDate2,
  formatId,
  getOrderStatus,
  getOrderStatusClass,
  getPublicUrl,
} from "@/utils";
import { generatePDF } from "@/utils/fc/generateVoucherPdf";
import { fetchOrderItemsById } from "@/utils/fc/getOrderItemById";
import { Copy, Crown, QrCode, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const getBonusTypeLabel = (transactionType: number) => {
  switch (transactionType) {
    case 1:
      return "お祝金";
    case 2:
      return "管理金";
    default:
      return "販売コミッション";
  }
};

const FCMyPage = () => {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  // popular products
  const { data: populatProduct } = useProductPopular();
  const product = populatProduct?.data || [];

  // get User Detail

  const { data: orderAmountData } = useGetAllOrderAmount();

  //get bonus info
  const { data: transactionData, isLoading: isTransactionLoading } =
    useBonusTransactionList("all", 1, 5, { bonus_type: 0 });

  const transactions: BonusTransactionList[] =
    transactionData?.data?.data || [];

  // recent orders
  const { data: ordersData, isLoading: isLoadingOrder } = useOrder(1, 5); // default 5 orders only
  const orders: Order[] = ordersData?.data?.data || [];

  // team info
  const { data: teamList } = useTeam();
  const users: TeamList[] =
    teamList?.data && Array.isArray(teamList?.data) ? teamList.data : [];

  // generate pdf
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadingInvoices, setDownloadingInvoices] = useState<
    Record<number, boolean>
  >({});

  // get userId
  const [uid, setUserId] = useState<number>();
  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user?.userId) {
        setUserId(Number(user.userId)); // Convert to number
      }
    };
    setOrigin(window.location.origin);

    loadUser();
  }, [router]);

  // QR
  const [isQrOpen, setIsQrOpen] = useState(false);
  const { userId, userDetail } = useFullUserDetail();

  // ... inside your component
  const referLink = useMemo(() => {
    return origin && userId
      ? `${origin}/partner/${encodeShortString(userId.toString())}`
      : "";
  }, [origin, userId]); // Only recalculate when origin or userId changes
  // clip board copy
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(referLink)
      .then(() => {
        toast.success("リンクをコピーしました");
      })
      .catch((error) => {
        console.error("Failed to copy link: ", error);
        toast.error("コピーに失敗しました");
      });
  };

  const transferred = transactions.reduce((sum, tx) => {
    if (tx.isActive) {
      return sum + Math.floor(tx.bonus);
    }
    return sum;
  }, 0);

  const notTransferred = transactions.reduce((sum, tx) => {
    if (!tx.isActive) {
      return sum + Math.floor(tx.bonus);
    }
    return sum;
  }, 0);

  const totalBonusAndAdminFees = transferred + notTransferred;

  const totalBonus = transactions.reduce((sum, tx) => {
    if (tx.transactionType === 1) {
      return sum + Math.floor(tx.bonus);
    }
    return sum;
  }, 0);

  const totalAdminFees = transactions.reduce((sum, tx) => {
    if (tx.transactionType === 2) {
      return sum + Math.floor(tx.bonus);
    }
    return sum;
  }, 0);

  /**
   * Generate pdf functions
   * @param orderItems
   */
  const handleGeneratePDF = async (orderId: number) => {
    try {
      setIsGeneratingPDF(true);
      setDownloadingInvoices((prev) => ({ ...prev, [orderId]: true }));
      const orderItems = await fetchOrderItemsById(orderId);
      if (orderItems.length > 0 && userDetail?.data) {
        //process invoice number
        const invoiceId = orderItems?.[0]?.order?.invoices?.[0].invoiceId || 0;
        const createdDate = orderItems?.[0]?.order?.invoices?.[0]
          .createdAt as number[];
        const invoiceNumber = formatId(createdDate, invoiceId);
        await generatePDF(userDetail?.data, orderItems, invoiceNumber);
      } else {
        toast.error("請求書の生成に失敗しました");
      }
    } catch (e) {
      console.error("請求書の生成に失敗しました", e);
      toast.error("請求書の生成に失敗しました");
    } finally {
      setIsGeneratingPDF(false);
      setDownloadingInvoices((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <section className="w-full">
      {/*  profile and stats */}
      <div className="w-full px-3  md:px-8 py-2 md:py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto ">
        <h2 className="my-4 font-bold">マイページ</h2>

        {userDetail?.data?.role !== 1 && (
          <div className="flex justify-between items-start md:items-center bg-foreground px-6 py-4 rounded-md ">
            <div className="flex flex-col md:flex-row justify-start item-center ">
              <p className="text-secondary text-sm mr-4">紹介リンク</p>
              <p className=" text-dark font-light text-sm break-all ">
                {referLink}{" "}
              </p>
            </div>
            <div className="flex justify-end item-center gap-4 ">
              <QrCode
                className="opacity-50 hover:opacity-85 cursor-pointer"
                onClick={() => setIsQrOpen(true)}
              />
              <Copy
                className="opacity-50 hover:opacity-85 cursor-pointer"
                onClick={handleCopyLink}
              />
            </div>
          </div>
        )}

        {/* fc data */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 mb-4">
          {/* Contract card */}
          <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            {userDetail?.data?.role !== 1 ? (
              <>
                <h3 className="text-secondary text-sm mb:text-base font-bold mb-1">
                  私のステータス
                </h3>
                <p className="text-sm my-5">
                  {userDetail?.data?.currentPlan.fcPlanMasterId === 1 ||
                  userDetail?.data?.currentPlan.fcPlanMasterId === 2
                    ? userDetail?.data?.currentPlan.planName
                    : "上級パートナーコース"}
                </p>
              </>
            ) : (
              <div className="h-10" />
            )}
            {userDetail?.data?.currentPlan.fcPlanMasterId !== 1 && (
              <Crown className="text-yellow-500" size={36} />
            )}
          </div>
          {/* Team card */}
          <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <h3 className="text-secondary text-sm mb:text-base font-bold mb-1">
              私のチーム
            </h3>
            <p className="text-xs  my-6">
              合計 {users.reduce((sum, user) => sum + user.underMemberCount, 0)}{" "}
              人
            </p>
            <div className="flex items-center">
              <div className="flex -space-x-2 items-center">
                {users
                  .filter((member) => member.referrerId === uid)
                  .slice(0, 5)
                  .map((member) => (
                    <div
                      key={member.fcId}
                      className="h-8 w-8 rounded-full flex  bg-gray-200 border-2 border-white overflow-hidden"
                      aria-hidden
                    >
                      {member.userPhoto && member.userPhoto.trim() !== "" ? (
                        <ImageComponent
                          imgURL={getPublicUrl(member.userPhoto)}
                          imgName={`${member.memberName}`}
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-300 rounded-full">
                          <User className="text-white w-full h-full" />
                        </div>
                      )}
                    </div>
                  ))}
                <span>
                  {users.filter((member) => member.referrerId === uid).length >
                    5 && (
                    <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-sm text-dark">
                      {`+${users.filter((member) => member.referrerId === uid).length - 5}`}
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Bonus card */}
          {/*TODO: Implement order summary */}
          <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <h3 className="text-secondary text-sm mb:text-base font-bold  mb-1">
              私の注文
            </h3>
            <p className="text-sm  my-6">合計</p>
            <p className="text-2xl font-light">
              ¥{orderAmountData?.data?.toLocaleString("ja-JP")}
            </p>
          </div>

          {/* Admin Fees */}
          {/*TODO: Implement admin fees summary */}
          <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <h3 className="text-secondary text-sm mb:text-base font-bold  mb-1">
              私のボーナス{" "}
            </h3>
            <p className="text-sm  my-6">合計</p>
            <p className="text-2xl font-light">
              ¥{(totalAdminFees + totalBonus).toLocaleString("ja-JP")}
            </p>
          </div>
        </div>
      </div>

      {/* Chart  */}
      {/* {userDetail?.data?.showRank && <SalesChart />} */}

      {/* Product data */}
      {product.length > 0 && (
        <div className="w-full mt-8 px-3 md:px-8   bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
          <div className="mt-8 ">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">人気商品</h3>
              <Link
                href={"/fc/purchase"}
                className="text-sm text-[#3020E0] underline"
              >
                すべて表示
              </Link>
            </div>

            <div className="grid  mb-6 grid-cols-2   md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {/* Product card 1 */}
              {product.map((prod, index) => {
                const taxIncludePrice = prod.discountSalePrice
                  ? Math.round(prod.discountSalePrice * (prod.tax / 100))
                  : 0;
                return (
                  <div
                    className="bg-[#eeedee] rounded-lg p-6 flex flex-col items-center text-center shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    key={prod.productId || index}
                    onClick={() =>
                      router.push(
                        `/fc/purchase/${encryptString(prod.productId?.toString())}`,
                      )
                    }
                  >
                    <div className="relative w-full aspect-square mb-4 rounded-md overflow-hidden">
                      <ImageComponent
                        imgURL={
                          prod.images.length > 0
                            ? getPublicUrl(prod.images[0].imageUrl)
                            : "/placeholder-product.jpg"
                        }
                        imgName={(prod.name as string) || "Product"}
                        fill
                        className="object-contain (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="text-xs text-dark ">
                      <span className="line-through mr-1">
                        {" "}
                        ¥
                        {(
                          prod.salePrice * 0.1 +
                          prod.salePrice
                        )?.toLocaleString("ja-JP")}{" "}
                      </span>
                      <span className="text-xs font-normal text-dark">
                        [税込]
                      </span>
                    </div>
                    <div className="text-base font-semibold">
                      ¥
                      {(
                        (prod.discountSalePrice as number) + taxIncludePrice
                      ).toLocaleString("ja-JP")}
                      <span className="text-xs font-normal text-dark">
                        [税込]
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-dark">
                      {prod.name as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* bonus */}
      <div className="w-full mt-8 px-3 md:px-8 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">ボーナス</h3>
            <Link
              href={"/fc/bonus"}
              className="text-sm text-[#3020E0] underline"
            >
              すべて表示
            </Link>
          </div>
          <div className="overflow-x-auto border border-none md:border-disabled/20 mb-6 rounded-lg">
            <div className="flex justify-between md:justify-start items-center px-0 md:px-6 py-1 md:py-4 gap-x-1 md:gap-x-4">
              <div className="bg-black text-white px-5 text-sm py-3 rounded-xl md:rounded-full flex flex-col md:flex-row w-full md:w-auto text-center md:text-start">
                <span>合計</span>{" "}
                <span className="hidden md:inline-block">:</span>{" "}
                <span>{`¥${totalBonusAndAdminFees.toLocaleString("ja-JP")}`}</span>
              </div>
              <div className="bg-black text-white px-5 text-sm py-3 rounded-xl md:rounded-full flex flex-col md:flex-row w-full md:w-auto text-center md:text-start">
                <span>未振込</span>{" "}
                <span className="hidden md:inline-block">:</span>{" "}
                <span>{`¥${notTransferred.toLocaleString("ja-JP")}`}</span>
              </div>
              <div className="bg-black text-white px-5 text-sm py-3 rounded-xl md:rounded-full flex flex-col md:flex-row w-full md:w-auto text-center md:text-start">
                <span>振込完了</span>{" "}
                <span className="hidden md:inline-block">:</span>{" "}
                <span>{`¥${transferred.toLocaleString("ja-JP")}`}</span>
              </div>
            </div>

            <div className="overflow-x-auto mt-2 border-t border-disabled/20 hidden md:block">
              <div className="overflow-x-auto">
                <div className="min-w-[800px] md:w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[80px]">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                          レベル
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                          氏名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                          購入日
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[200px]">
                          取引内容（初回/再購入）
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                          商品一覧
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                          購入金額（税別）
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                          ボーナス種類
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                          ボーナス金額
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[150px]">
                          ボーナス支払い日
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                          ステータス
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isTransactionLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow
                            key={index}
                            className="border-b border-black/10"
                          >
                            <TableCell
                              colSpan={12}
                              className="h-10 text-center"
                            >
                              <Skeleton className="w-full h-full bg-white-bg" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : transactions.length > 0 ? (
                        transactions.slice(0, 5).map((transaction, index) => (
                          <tr
                            key={transaction.transactionId}
                            className="hover:bg-gray-50 group"
                          >
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-3">
                                <div className="text-gray-900 font-medium">
                                  {index + 1}
                                </div>
                              </div>
                            </td>
                            {/* レベル */}
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              {transaction.level || "-"}
                            </td>

                            {/* user name */}
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              {transaction.buyer?.username || "-"}
                            </td>

                            {/* order date */}
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.transactionDate)}
                            </td>

                            <td className="px-6 py-3 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-3">
                                <div className="text-gray-900 font-medium">
                                  {transaction.remark}
                                </div>
                              </div>
                            </td>

                            {/* first product of order */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer">
                              {transaction.order.orderItems
                                .slice(0, 1)
                                .map((item) => (
                                  <div
                                    key={item.orderDetailId}
                                    className="flex items-center gap-3 mb-2"
                                  >
                                    <div className="shrink-0 w-10 h-10">
                                      <ImageComponent
                                        imgURL={getPublicUrl(
                                          item.product.images?.[0]?.imageUrl ||
                                            "",
                                        )}
                                        imgName="product"
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                    <div className="flex flex-col text-gray-500">
                                      <span className="text-gray-900 font-medium">
                                        {item.productName}
                                      </span>
                                      <span>
                                        ¥
                                        {Number(
                                          item.priceAtPurchase,
                                        ).toLocaleString("ja-JP")}{" "}
                                        * {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </td>

                            {/* total buy price /purchase price with no tax  */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              ¥{transaction?.totalBuyPrice?.toLocaleString()}
                            </td>

                            {/* transaction type */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full  text-white py-1
                          ${transaction.transactionType === 1 ? "bg-[#9399D4]" : transaction.transactionType === 2 ? "bg-[#E0BD00]" : "bg-[#00B8D4]"}`}
                              >
                                {transaction.transactionType === 1
                                  ? "お祝金"
                                  : transaction.transactionType === 2
                                    ? "管理金"
                                    : "販売コミッション"}
                              </span>
                            </td>

                            {/* bonus amount */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              ¥{transaction?.bonus?.toLocaleString()}
                            </td>

                            {/* payment date */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction?.paymentDate
                                ? formatDate2(transaction.paymentDate)
                                : "-"}
                            </td>

                            {/* status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={[
                                  "px-3 inline-flex text-xs leading-5 font-normal rounded-full  text-white py-1",
                                  transaction.isActive
                                    ? "bg-tertiary"
                                    : "bg-gray-500",
                                ].join(" ")}
                              >
                                {transaction.isActive ? "振込完了" : "未振込"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={11}
                            className="px-6 py-3 text-center text-sm text-gray-500"
                          >
                            レコードがありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Card Style */}
            <div className="sm:hidden mt-3">
              {isTransactionLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-32 my-2 w-full text-center">
                    <Skeleton className="w-full h-full bg-white-bg" />
                  </div>
                ))
              ) : transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction, index) => {
                  const items = [
                    { label: "No.", value: transaction.transactionId },
                    { label: "レベル", value: transaction.level || "-" },
                    {
                      label: "氏名",
                      value: transaction.buyer?.username || "-",
                    },
                    {
                      label: "購入日",
                      value: formatDate(transaction.transactionDate),
                    },
                    {
                      label: "取引内容（初回/再購入）",
                      value: transaction.remark,
                    },
                    {
                      label: "商品一覧",
                      value: transaction.order.orderItems.map((item) => ({
                        src: getPublicUrl(
                          item.product.images?.[0]?.imageUrl || "",
                        ),
                        alt: item.productName,
                        text: `¥${Number(item.priceAtPurchase).toLocaleString("ja-JP")} * ${item.quantity}`,
                      })),
                      type: "image" as const,
                    },
                    {
                      label: "購入金額（税別）",
                      value: `¥${transaction?.totalBuyPrice?.toLocaleString()}`,
                    },
                    {
                      label: "ボーナス種類",
                      value: getBonusTypeLabel(transaction.transactionType),
                      type: "badge" as const,
                      badgeColor:
                        transaction.transactionType === 1
                          ? "bg-[#9399D4] text-white"
                          : transaction.transactionType === 2
                            ? "bg-[#E0BD00] text-white"
                            : "bg-[#00B8D4] text-white",
                    },
                    {
                      label: "ボーナス金額",
                      value: `¥${transaction?.bonus?.toLocaleString()}`,
                    },
                    {
                      label: "ボーナス支払い日",
                      value: transaction?.paymentDate
                        ? formatDate2(transaction.paymentDate)
                        : "-",
                    },
                    {
                      label: "ステータス",
                      value: transaction.isActive ? "振込完了" : "未振込",
                      type: "badge" as const,
                      badgeColor: transaction.isActive
                        ? "bg-tertiary text-white"
                        : "bg-gray-500 text-white",
                    },
                  ];

                  return <MobileTableCard key={index} items={items} />;
                })
              ) : (
                <div>
                  <div className="px-6 py-3 text-center text-sm text-gray-500">
                    レコードがありません
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* recent Order */}
      <div className="w-full mt-8 px-3 md:px-8 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        <div className="flex justify-between items-center mt-8 mb-4">
          <h3 className="text-lg font-semibold">直近の注文</h3>
          <Link
            href={"/fc/myorder"}
            className="text-sm text-[#3020E0] underline"
          >
            すべて表示
          </Link>
        </div>
        <div className="bg-white rounded-lg mb-6 shadow overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] md:w-full">
              <table className="min-w-full divide-y divide-gray-200 border border-disabled/20">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-2.5">
                      NO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                      購入日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                      商品名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                      購入金額（税別）
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                      消費税
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                      送料
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                      合計購入金額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[100px]">
                      転送伝票番号
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[120px]">
                      請求書
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingOrder ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-black/10"
                      >
                        <TableCell colSpan={10} className="h-10 text-center">
                          <Skeleton className="w-full h-full bg-white-bg" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : orders.length > 0 ? (
                    orders.slice(0, 5).map((order, index) => (
                      <tr
                        key={order.orderId}
                        className="hover:bg-gray-50 group"
                      >
                        {/* NO */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          {index + 1}
                        </td>
                        {/* 購入日 */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          {formatDate(order.orderDate)}
                        </td>

                        {/* 商品名 */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer group-hover:bg-gray-50"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          {order.orderItems.map((item) => (
                            <div
                              key={item.orderDetailId}
                              className="flex items-center gap-3 mb-2"
                            >
                              <div className="shrink-0 w-10 h-10">
                                <ImageComponent
                                  imgURL={getPublicUrl(
                                    item.product.images?.[0]?.imageUrl || "",
                                  )}
                                  imgName="product"
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              <div className="flex flex-col text-gray-500">
                                <span className="text-gray-900 font-medium">
                                  {item.productName}
                                </span>
                                <span>
                                  ¥
                                  {Number(item.priceAtPurchase).toLocaleString(
                                    "ja-JP",
                                  )}{" "}
                                  * {item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </td>

                        {/* 購入金額（税別） */}
                        {/*TODO: Implement total price with no tax calculation */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer group-hover:bg-gray-50"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          {"¥" +
                            (order?.totalPriceNoTax?.toLocaleString("ja-JP") ??
                              "0")}
                        </td>

                        {/* 消費税 */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer group-hover:bg-gray-50"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          {"¥" +
                            (order?.totalTax?.toLocaleString("ja-JP") ?? "0")}
                        </td>

                        {/* 消費税 */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          {"¥" + order.shippingCost}
                        </td>

                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          {"¥" +
                            (order?.totalPrice?.toLocaleString("ja-JP") ?? "0")}
                        </td>

                        <td
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
                          <span
                            className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full py-1 ${getOrderStatusClass(order.orderStatus)}`}
                          >
                            {getOrderStatus(order.orderStatus)}
                          </span>
                        </td>

                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                          // onClick={() => handleViewOrder(order.orderId)}
                        >
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
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">
                          <button
                            key={order.orderId}
                            onClick={() => handleGeneratePDF(order?.orderId)}
                            disabled={
                              isGeneratingPDF ||
                              downloadingInvoices[order.orderId]
                            }
                            className="flex items-center justify-center gap-2"
                          >
                            {downloadingInvoices[order.orderId]
                              ? "ダウンロード中..."
                              : "ダウンロード"}
                          </button>
                        </td>
                      </tr>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-3">
          {isTransactionLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 my-2 w-full text-center">
                <Skeleton className="w-full h-full bg-white-bg" />
              </div>
            ))
          ) : orders.length > 0 ? (
            orders.slice(0, 5).map((order, index) => {
              const items = [
                { label: "No.", value: index + 1 },
                { label: "購入日", value: formatDate(order.orderDate) },
                {
                  label: "商品名",
                  value: order.orderItems.map((item) => ({
                    src: getPublicUrl(item.product.images?.[0]?.imageUrl || ""),
                    alt: item.productName,
                    text: `¥${Number(item.priceAtPurchase).toLocaleString("ja-JP")} * ${item.quantity}`,
                  })),
                  type: "image" as const,
                },
                {
                  label: "購入金額（税別）",
                  value:
                    "¥" +
                    (order?.totalPriceNoTax?.toLocaleString("ja-JP") ?? "0"),
                },
                {
                  label: "消費税",
                  value:
                    "¥" + (order?.totalTax?.toLocaleString("ja-JP") ?? "0"),
                },
                {
                  label: "送料",
                  value: "¥" + order.shippingCost,
                },
                {
                  label: "合計購入金額",
                  value:
                    "¥" + (order?.totalPrice?.toLocaleString("ja-JP") ?? "0"),
                },
                {
                  label: "ステータス",
                  value: getOrderStatus(order.orderStatus),
                  type: "badge" as const,
                  badgeColor: getOrderStatusClass(order.orderStatus),
                },
                {
                  label: "転送伝票番号",
                  value:
                    order.shippingCompany === 1
                      ? "ヤマト運輸"
                      : order.shippingCompany === 2
                        ? "佐川急便"
                        : order.shippingCompany === 3
                          ? "日本郵便"
                          : order.shippingCompany === 4
                            ? "DHL"
                            : order.shippingCompany === 5
                              ? "FedEx"
                              : "未設定" +
                                " " +
                                (order.trackingNumber
                                  ? order.trackingNumber
                                  : "-"),
                  type: "link" as const,
                },
                {
                  label: "請求書",
                  value: "ダウンロード",
                  href: "",
                  onClick: () => handleGeneratePDF(order?.orderId),
                  type: "link" as const,
                },
              ];

              return <MobileTableCard key={index} items={items} />;
            })
          ) : (
            <div>
              <div className="px-6 py-3 text-center text-sm text-gray-500">
                レコードがありません
              </div>
            </div>
          )}
        </div>
      </div>

      <QrPopup
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        value={referLink} // Replace with actual profile URL
      />
    </section>
  );
};

export default FCMyPage;
