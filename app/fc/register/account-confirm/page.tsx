"use client";
import RegisterIndicator from "@/components/fc/RegisterIndicator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import ImageComponent from "@/components/fc/ImageComponent";
import FCPaymentForm from "@/components/fc/stripe/FCPaymentForm";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Skeleton } from "@/components/ui/skeleton";
import { useFCStep, useGetCart, useUserDetail } from "@/hooks/fc";
import {
  useFcPaymentWithCard
} from "@/hooks/fc/useFcPayment";
import { getPublicUrl } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SectionHeaderProps {
  number: string;
  title: string;
  editHref: string;
}

const SectionHeader = ({ number, title, editHref }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4 ">
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold">{number}</span>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    <Link href={editHref} className="text-sm text-alink hover:underline">
      変更
    </Link>
  </div>
);

const ConfirmPage = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  // const [isPaymentCash, setIsPaymentCash] = useState(false);
  const [isCreditCard, setIsCreditCard] = useState(false);
  const { mutate: updateStep, isPending: isUpdateStepPending } = useFCStep();
  const { data: userDetail } = useUserDetail();
  const { data: userCart, isLoading: isuserCarLoading } = useGetCart();
  // const { data: paymentData, isLoading: isPaymentLoading } =
  //   useFcPaymentWithCash(isPaymentCash);
  const { data: paymentDataCard, isLoading: isPaymentLoadingCard } =
    useFcPaymentWithCard(isCreditCard);

  // const handleConfirmWithCash = () => setIsPaymentCash(true);

  const handleConfirmWithCreditCard = () => setIsCreditCard(true);

  // useEffect(() => {
  //   if (paymentData) handleSuccessClick();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [paymentData]);

  const handleSuccessClick = () => {
    updateStep(5, {
      onSuccess: () => {
        toast.success("登録手続きが完了しました");
        queryClient.invalidateQueries({ queryKey: ["user-detail"] });
        router.push("/fc/mypage");
      },
      onError: () => {
        toast.error("手続きの更新に失敗しました");
      },
    });
  };

  // const calculateWholesalePrice = (
  //   originalPrice: number,
  //   wholesaleRate: number
  // ) => {
  //   const discountMultiplier = (100 - wholesaleRate) / 100;
  //   return originalPrice * discountMultiplier;
  // };

  // const orderItems = useMemo(() => {
  //   if (!userDetail?.data?.user?.orders?.[0]?.orderItems) return [];

  //   // Use flatMap to flatten the nested arrays into a single array
  //   return userDetail.data.user.orders.flatMap((order) =>
  //     order.orderItems.map((item) => ({
  //       id: item.orderDetailId,
  //       name: item.productName,
  //       originalPrice: item.product.salePrice,
  //       price: item.product.discountSalePrice,
  //       defaultQTY: item.quantity || 0,
  //       image: {
  //         src: item.product?.images?.[0]?.imageUrl || "",
  //       },
  //     }))
  //   );
  // }, [userDetail]);

  // const products = orderItems.length > 0 ? orderItems : [];

  return (
    <section className="w-full px-1 md:px-6 py-10 flex justify-center ">
      <div className="max-w-4xl w-full">
        <RegisterIndicator active={4} />

        <div>
           <div className="sm:hidden bg-product-card-btn w-full p-2 rounded-t-lg">
              <h2 className="text-lg text-white font-semibold text-center">完了</h2>
            </div>

          {!isCreditCard && !sessionId ? (
          <div className="bg-foreground p-3 md:p-6 rounded-md">
            <p className="text-red-500 mt-6 text-sm md:text-md">申し込みは完了していません。</p>
            <p className="text-sm mb-6">
              下記の内容をご確認の上、申し込みボタンを押してください。
            </p>

            {/* Account Info Section */}
            <div className=" rounded-lg p-3 md:p-6  mb-4 border-b border-disabled/20">
              <SectionHeader
                number="01"
                title="アカウント作成"
                editHref="/fc/register/account-create"
              />
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">氏名</div>
                  <div>{userDetail?.data?.tantoName}</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">電話番号</div>
                  <div>
                    {userDetail?.data?.user.userAddresses[0]?.phoneNumber ||
                      "-"}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">メール</div>
                  <div>{userDetail?.data?.user.email}</div>
                </div>
              </div>
            </div>

            {/* Supply Agreement Section */}
            <div className="rounded-lg p-3 md:p-6  mb-4 border-b border-disabled/20">
              <SectionHeader
                number="02"
                title="継続仕入販売申込"
                editHref="/fc/register/supply-sale"
              />
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">会社名</div>
                  <div>{userDetail?.data?.user.username}</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">会社名（フリガナ）</div>
                  <div>{userDetail?.data?.user.usernameKana}</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">役職・部署名</div>
                  <div>{userDetail?.data?.tantoPosition}</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">代表者名</div>
                  <div>{userDetail?.data?.representativeName}</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">住所</div>
                  <div>{userDetail?.data?.user.userAddresses[0].address1}</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">契約期間</div>
                  <div>
                    {userDetail?.data?.contractStartDt &&
                    userDetail?.data?.contractEndDt
                      ? `${userDetail.data.contractStartDt.join("-")} ~ ${userDetail.data.contractEndDt.join("-")}`
                      : "-"}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">契約自動更新</div>
                  <div>
                    {userDetail?.data?.contractUpdateFlg === "有"
                      ? "有（1年間）"
                      : "無"}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">商品名</div>
                  <div>EXOMERE</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">初期購入</div>
                  <div className="flex-1">
                    <div>
                      ¥
                      {userCart?.data && Array.isArray(userCart.data)
                        ? userCart.data
                            .reduce(
                              (total, item) =>
                                total +
                                (item.product.discountSalePrice
                                  ? item.product.discountSalePrice *
                                    item.productQty
                                  : 0),
                              0
                            )
                            .toLocaleString("ja-JP")
                        : "0"}
                      （税別）
                    </div>

                    {/* Products grid */}
                    <div className="mt-6 bg-white px-4 md:px-6 py-1 rounded-md ">
                      {isuserCarLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                              key={index}
                              className="w-full h-14 my-2 bg-white-bg"
                            />
                          ))
                        : userCart?.data &&
                          Array.isArray(userCart?.data) &&
                          userCart?.data.map((item) => (
                            <div
                              key={item.cartItemId}
                              className="flex flex-col md:flex-row  mt-4 items-start md:items-center w-full justify-between  bg-gray-100 p-3  rounded-md"
                            >
                              <div className="flex items-center justify-between w-full md:w-60 ">
                                <div className="flex justify-between items-center gap-3 ">
                                  {item.product.images?.[0]?.imageUrl && (
                                    <ImageComponent
                                      imgURL={getPublicUrl(
                                        item.product.images[0].imageUrl
                                      )}
                                      imgName={`product-${item.product.productId}`} // Add a meaningful name
                                      className="w-16 h-16 rounded object-contain bg-disabled/20 border"
                                    />
                                  )}
                                  <div className="flex flex-col">
                                    <div className="text-alink cursor-pointer text-base font-medium hover:underline">
                                      {item.product.name}
                                    </div>
                                    <div className="text-xs text-gray-400 line-through">
                                      {item.product.salePrice
                                        ? `¥${item.product.salePrice.toLocaleString("ja-JP")}`
                                        : ""}
                                    </div>
                                    <div className="text-sm text-dark">
                                      {" "}
                                      {item.product.discountSalePrice
                                        ? `¥${item.product.discountSalePrice.toLocaleString("ja-JP")}`
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-6 justify-end text-right  w-full md:w-auto">
                                
                                <div className="flex items-center ">
                                <span className=" text-center flex flex-row ">
                                  {item.productQty}個
                                </span>
                              </div>
                              <div className="w-16 text-right text-dark ">
                                ¥
                                {item.product.discountSalePrice
                                  ? (
                                      item.product.discountSalePrice *
                                      item.productQty
                                    ).toLocaleString("ja-JP")
                                  : "0"}
                              </div>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">送料</div>
                  <div>
                    注文3万円以上は、無料です。3万円以下の場合は、地域により送料を精算します。
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">支払い方法</div>
                  <div>
                    初期注文の金額に関しては、下記の口座へ振込お願いします。
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-80"></div>
                  {/* <div className="  rounded-md w-full">
                    <div className="flex justify-end items-start">
                      <div className="text-sm space-x-4">
                        <a className="text-alink underline">口座情報コピー</a>
                        <a className="text-alink underline">
                          口座情報ダウンロード
                        </a>
                      </div>
                    </div>
                    <div className="mt-4 space-y-4 p-4  bg-white border-none rounded-lg">
                      <p>銀行名：みずほ銀行（0001）</p>
                      <p>支店名：中央支店（123）</p>
                      <p>口座番号：12345678</p>
                      <p>口座名義：ビューテックカブシキガイシャ</p>
                    </div>
                  </div> */}
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">保証金</div>
                  <div>
                    有{" "}
                    {userDetail?.data?.deposite?.toLocaleString("ja-JP", {
                      style: "currency",
                      currency: "JPY",
                    }) ?? "(¥0)"}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">継続供給販売規約</div>
                  <div>同意します</div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-60 text-gray-500">署名</div>
                  <div>
                    {userDetail?.data?.signPath && (
                      <div>{userDetail?.data?.signPath}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Agreement Section */}
            <div className="p-3 md:p-6 mb-8">
              <SectionHeader
                number="03"
                title="紹介制度"
                editHref="/fc/register/referral"
              />
              <div>
                <div className="text-sm">同意します</div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex w-full justify-between gap-5 mt-10 p-2">
              {/* <Button
                type="button"
                onClick={handleConfirmWithCash}
                className="w-[50%] h-12 bg-primary text-white cursor-pointer"
                disabled={isUpdateStepPending || isPaymentLoading}
              >
                {isUpdateStepPending || isPaymentLoading ? (
                  <LoadingIndicator size="sm" />
                ) : (
                  "銀行振込で支払う"
                )}
              </Button> */}

              <Button
                type="button"
                onClick={handleConfirmWithCreditCard}
                className="w-full  h-12 bg-black md:bg-primary text-white cursor-pointer"
                disabled={isUpdateStepPending}
              >
                {isUpdateStepPending ? (
                  <LoadingIndicator size="sm" />
                ) : (
                  "クレジットカードで支払う"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-foreground p-6 rounded-md w-full">
            {isPaymentLoadingCard ? (
              <div className="w-full flex justify-center items-center">
                <LoadingIndicator size="md" />
              </div>
            ) : (
              <FCPaymentForm
                sessionId={sessionId}
                orderId={Number(paymentDataCard?.data?.orderId)}
                onBack={() => setIsCreditCard(false)}
                returnUrl="/fc/register/account-confirm"
                transactionType={1}
                isLoading={isUpdateStepPending}
                successBtnText="マイページへ"
                successClick={handleSuccessClick}
                failureBtnText="もう一度試す"
                failureClick={() => setIsCreditCard(false)}
              />
            )}
          </div>
        )}
        </div>
      </div>
    </section>
  );
};

export default ConfirmPage;
