"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import RegisterIndicator from "@/components/fc/RegisterIndicator";
import PlanBox from "@/components/fc/supply-sale/PlanBox";
import ProductDetail from "@/components/fc/supply-sale/ProductDetail";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFCPlan, useFCRegister, useUserDetail } from "@/hooks/fc";
import { useFCUploadFiles } from "@/hooks/fc/useFileUpload";
import { getUser } from "@/lib/api/auth";
import { SupplySaleFormValues, supplySaleFormSchema } from "@/lib/schema";
import { FCProduct, FCRegister } from "@/types/fc";
import { FCPlan, FCPlanProduct, FCPlanResponse } from "@/types/fc/plan.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SupplySalePage = () => {
  const queryClient = useQueryClient();
  /**
   * State
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FCPlanProduct | null>(
    null,
  );
  const [uid, setUserId] = useState<string>();
  const [planProducts, setPlanProducts] = useState<FCProduct[]>([]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  // const [shippingCost, setShippingCost] = useState<number>(0);

  /**
   * Hooks
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  const router = useRouter();

  /**
   * Form
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  const form = useForm<SupplySaleFormValues>({
    resolver: zodResolver(supplySaleFormSchema),
    defaultValues: {
      contractPeriod: {
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().add(1, "year").subtract(1, "day").format("YYYY-MM-DD"),
      },
      contractAutoRenewal: "有",
      guarantee: "1",
      guaranteeAmount: "",
      termsAccepted: false,
      signature: "",
      contractFcPlanMasterId: 0,
      productName: "EXOMERE",
      selectedPlan: 0,
      totalAmount: 0,
    },
  });

    const selectedPlan = form.watch("selectedPlan");

  /**
   * Mutation
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  const { mutate: register, isPending: isRegisterPending } = useFCRegister();
  const { data: planData } = useFCPlan() as {
    data: FCPlanResponse | undefined;
  };

  const { mutate: uploadFiles, isPending: isUploadPending } =
    useFCUploadFiles();
  /**
   * Queries
   * @author Paing Sett Kyaw
   * @created 2025-11-13
   * @updated ****-**-**
   */

  const { data: userDetail, isLoading: isLoadingUserDetail } = useUserDetail();

  /**
   * useEffect
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  useEffect(() => {
    if (planData?.data?.[0]?.fcPlanMasterId) {
      form.setValue("selectedPlan", planData.data[0].fcPlanMasterId);
    }
  }, [planData, form]);

  // Get user data on component mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user?.userId) {
        setUserId(user.userId);
      }
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    const details = userDetail?.data;
    if (details && details.step !== 2) {
      const values = {
        contractAutoRenewal: details.contractUpdateFlg,
        contractPeriod: {
          startDate: Array.isArray(details.contractStartDt)
            ? `${details.contractStartDt[0]}-${String(details.contractStartDt[1]).padStart(2, "0")}-${String(details.contractStartDt[2]).padStart(2, "0")}`
            : details.contractStartDt,
          endDate: Array.isArray(details.contractEndDt)
            ? `${details.contractEndDt[0]}-${String(details.contractEndDt[1]).padStart(2, "0")}-${String(details.contractEndDt[2]).padStart(2, "0")}`
            : details.contractEndDt,
        },
        termsAccepted: details.contSupplySalesAggree === 1 ? true : false,
        selectedPlan: details.currentPlan.fcPlanMasterId,
        guarantee: details.depositType,
        guaranteeAmount: details?.deposite?.toString(),
        signature: details.signPath ? details.signPath : "",
      };

      Object.entries(values).forEach(([key, value]) =>
        form.setValue(key as keyof SupplySaleFormValues, value as never, {
          shouldValidate: true,
          shouldDirty: true,
        }),
      );
    }
  }, [userDetail, form]);

  const initialQuantities =
    userDetail?.data?.user?.orders?.[0]?.orderItems?.reduce(
      (acc, item) => {
        if (item?.product?.productId && item.quantity) {
          acc[item.product.productId] = item.quantity;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

  /**
   * Handles form submission
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  const onSubmit = async (values: SupplySaleFormValues) => {
    const selectedPlanId = values.selectedPlan || 1;

    const payload: FCRegister = {
      fcId: Number(uid),
      contractEndDt: values.contractPeriod.endDate,
      contractStartDt: values.contractPeriod.startDate,
      contractUpdateFlg: values.contractAutoRenewal,
      contractFcPlanMasterId: selectedPlanId,
      currentFcPlanMasterId: selectedPlanId,
      contSupplySalesAggree: values.termsAccepted ? 1 : 0,
      products: planProducts,
      depositType: values.guarantee,
      deposite:
        values.guarantee === "2" ? Number(values.guaranteeAmount) : undefined,
      totalAmount: values.totalAmount,
      step: 3,
      // shippingCost:0.5,
    };

    if (
      values.signature &&
      validateTotalAmountWithPlan(
        selectedPlanId,
        payload.totalAmount?.toString() || "0",
      )
    ) {
      await handleSignatureUpload(values.signature, () => {
        register(payload, {
          onSuccess: () => {
            toast.success("登録が正常に完了しました");
            router.push("/fc/register/referral");
            queryClient.invalidateQueries({
              queryKey: ["user-detail"],
            });
          },
          onError: (err: Error) => {
            toast.error("登録に失敗しました: " + err.message);
          },
        });
      });
    }

    // window.location.href = "/fc/register/referral";
  };

  const validateTotalAmountWithPlan = (
    currentPlan: number,
    totalAmount: string,
  ) => {
    const plan2Amount = planData?.data.find(
      (p) => p.fcPlanMasterId === 2,
    )?.contractPurchaseAmount;
    if (
      currentPlan === 1 &&
      plan2Amount &&
      Number(totalAmount.replace(/,/g, "")) > plan2Amount
    ) {
      toast.warning(
        "プラン1の上限額を超えました。プラン2（300,000円）へのアップグレードをご検討ください。",
      );
      return false;
    } else if (
      currentPlan === 2 &&
      plan2Amount &&
      Number(totalAmount.replace(/,/g, "")) < plan2Amount
    ) {
      toast.warning(
        "プラン2の最低購入金額は300,000円です。300,000円以上になるように数量を調整してください。",
      );
      return false;
    }
    return true;
  };

  const handleProductClick = (product: FCPlanProduct) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSignatureUpload = async (
    signatureDataUrl: string,
    successCallback: () => void,
  ) => {
    if (!signatureDataUrl) return null;

    try {
      // Convert data URL to blob
      // const response = await fetch(signatureDataUrl);
      // const blob = await response.blob();
      // const file = new File([blob], `signature-${Date.now()}.png`, {
      //   type: "image/png",
      // });

      // Upload the file
      await new Promise<string | null>((resolve) => {
        uploadFiles(
          { signPath: signatureDataUrl },

          {
            onSuccess: () => {
              successCallback();
            },
            onError: (error) => {
              console.error("Error uploading signature:", error);
              toast.error("署名のアップロード中にエラーが発生しました");
              resolve(null);
            },
          },
        );
      });
    } catch (error) {
      toast.error("署名のアップロード中にエラーが発生しました");
      return error;
    }
  };

  //   const copyBankInfoToClipboard = async () => {
  //     const bankInfo = `銀行名：みずほ銀行（0001）
  // 支店名：中央支店（123）
  // 口座番号：12345678
  // 口座名義：ビューテックカブシキガイシャ`;

  //     try {
  //       await navigator.clipboard.writeText(bankInfo);
  //       toast.success("口座情報をコピーしました");
  //     } catch (err) {
  //       console.error("Failed to copy: ", err);
  //       toast.error("コピーに失敗しました");
  //     }
  //   };

  //   const downloadBankInfo = () => {
  //     const bankInfo = `銀行名：みずほ銀行（0001）
  // 支店名：中央支店（123）
  // 口座番号：12345678
  // 口座名義：ビューテックカブシキガイシャ`;

  //     const element = document.createElement("a");
  //     const file = new Blob([bankInfo], { type: "text/plain" });
  //     element.href = URL.createObjectURL(file);
  //     element.download = "bank-info.txt";
  //     document.body.appendChild(element);
  //     element.click();
  //     document.body.removeChild(element);
  //     toast.success("口座情報をダウンロードしました");
  //   };

  return (
    <section className="w-full px-1 md:px-6 py-10 flex justify-center">
      <div className="max-w-4xl w-full">
        <RegisterIndicator active={2} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-foreground rounded-lg shadow-sm"
          >
            <div className="sm:hidden bg-product-card-btn w-full p-2 rounded-t-lg">
              <h2 className="text-lg text-white font-semibold text-center">
                継続供給販売申込
              </h2>
            </div>
            <div className="p-3">
              <div className="space-y-4 ">
                <div>
                  <Label>契約期間</Label>
                  <div className="mt-4 p-3 bg-disabled/20 rounded-md">
                    {form.watch("contractPeriod").startDate} ~{" "}
                    {form.watch("contractPeriod").endDate}
                  </div>
                </div>

                <div className="mt-6">
                  <Label>契約自動更新</Label>
                  <FormField
                    control={form.control}
                    name="contractAutoRenewal"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="有"
                                id="auto-renewal-yes"
                              />
                              <Label htmlFor="auto-renewal-yes">
                                有（1年間）
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="無" id="auto-renewal-no" />
                              <Label htmlFor="auto-renewal-no">無</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <Label>商品名</Label>
                  <div className="mt-4 p-3 bg-disabled/20 rounded-md">
                    EXOMERE
                  </div>
                </div>
              </div>

              <div>
                <div className="mt-6">
                  <Label>
                    契約時の初期購入{" "}
                    <span className="text-required text-xl">*</span>{" "}
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:hidden">
                    {(planData?.data[0] && selectedPlan === planData?.data[0]?.fcPlanMasterId) &&  <PlanBox
                      handleProductClick={handleProductClick}
                      key={planData?.data[0]?.fcPlanMasterId}
                      plan={planData?.data[0]}
                      form={form}
                      setPlanProducts={setPlanProducts}
                        initialQuantities={initialQuantities}
                        currentPlan={
                          userDetail?.data?.step && userDetail.data.step > 2
                            ? userDetail.data.currentPlan?.fcPlanMasterId
                            : null
                        }
                        allPlans={planData?.data || []}
                        // setShippingCost={setShippingCost}
                      />}

                      {(planData?.data[1] && selectedPlan === planData?.data[1]?.fcPlanMasterId) &&  <PlanBox
                      handleProductClick={handleProductClick}
                      key={planData?.data[1]?.fcPlanMasterId}
                      plan={planData?.data[1]}
                      form={form}
                      setPlanProducts={setPlanProducts}
                        initialQuantities={initialQuantities}
                        currentPlan={
                          userDetail?.data?.step && userDetail.data.step > 2
                            ? userDetail.data.currentPlan?.fcPlanMasterId
                            : null
                        }
                        allPlans={planData?.data || []}
                        // setShippingCost={setShippingCost}
                      />}
                  </div>

                  <div className=" grid-cols-1 md:grid-cols-2 gap-4 hidden md:grid">
                    {planData?.data?.map((plan: FCPlan) => (
                      <PlanBox
                        handleProductClick={handleProductClick}
                        key={plan.fcPlanMasterId}
                        plan={plan}
                        form={form}
                        setPlanProducts={setPlanProducts}
                        initialQuantities={initialQuantities}
                        currentPlan={
                          userDetail?.data?.step && userDetail.data.step > 2
                            ? userDetail.data.currentPlan?.fcPlanMasterId
                            : null
                        }
                        allPlans={planData?.data}
                        // setShippingCost={setShippingCost}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bank / payment info box */}
              <div className="mt-6 space-y-4">
                <Label>送料</Label>
                <div className="p-4 bg-disabled/20 rounded-md text-sm">
                  ご注文金額3万円（税込）以上は送料無料。 <br />
                  3万円（税込）未満の場合、地域別送料を実費にてご精算いただきます。
                </div>

                <div className="space-y-4 flex flex-col-reverse md:flex-col gap-3 md:gap-0">
                  {/* Guarantee (保険金) */}
                  <div className="grid items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <FormLabel className="m-0">
                        保証金 <span className="text-required text-xl">*</span>
                      </FormLabel>
                    </div>
                    <FormField
                      control={form.control}
                      name="guarantee"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center space-x-2">
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem value="1" id="guarantee-no" />
                                  <Label htmlFor="guarantee-no">無</Label>
                                  <RadioGroupItem
                                    value="2"
                                    id="guarantee-yes"
                                  />
                                  <Label htmlFor="guarantee-yes">有</Label>
                                </RadioGroup>
                              </div>
                              {/* small input when 有 selected */}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* show guarantee amount input when user selects 有 */}
                    {form.watch("guarantee") === "2" && (
                      <FormField
                        control={form.control}
                        name="guaranteeAmount"
                        render={({ field }) => (
                          <FormItem className="max-w-xs">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="金額を入力"
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Agreement checkbox */}
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex mt-6  items-center bg-disabled/20 p-4 rounded-lg">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(!!v)}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="link"
                          className="text-sm text-black  md:underline md:text-alink focus:outline-none bg-transparent hover:bg-transparent cursor-pointer"
                          onClick={() => setTermsAccepted(true)}
                        >
                          継続供給販売規約に同意いたします。
                        </Button>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Signature textarea */}
                <FormInputComponent
                  id="signature"
                  control={form.control}
                  name="signature"
                  label="署名"
                  required
                  className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                />
                {/* <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FormLabel className="m-0">
                          署名 <span className="text-required text-xl">*</span>
                        </FormLabel>
                      </div>
                      <div className="text-sm">
                        ※フルネームでサインしてください
                      </div>
                    </div>
                    <FormControl>
                      <div className="mt-2 bg-white p-4 rounded-lg border border-gray-200">
                        <SignaturePad
                          onSave={(signature: string) =>
                            field.onChange(signature)
                          }
                          value={field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 bg-black md:bg-primary text-white rounded-md cursor-pointer"
                  disabled={
                    !form.formState.isValid ||
                    isRegisterPending ||
                    isLoadingUserDetail ||
                    isUploadPending ||
                    !form.watch("termsAccepted")
                  }
                >
                  {isRegisterPending ||
                  isLoadingUserDetail ||
                  isUploadPending ? (
                    <LoadingIndicator size="sm" />
                  ) : (
                    "次へ"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      {isPopupOpen && selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={handleClosePopup} />
      )}

      {/* 個人情報 popup */}
      {termsAccepted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-center">
              継続供給販売規約
            </h2>
            <div className="text-sm space-y-6 text-dark">
              {/* Article 1 */}
              <div>
                <b>第1条(目的)</b>
                <p className="mt-1">
                  本規約は、BEAUTECH株式会社（以下甲という。）と申込者（以下乙という。）との間で、甲は、甲の商品を継続して乙に売り渡すものとし、乙は、これを買い受けた上で、甲の商品を適正に販売するにつき基本的な事項を規定することを目的とする。
                </p>
              </div>

              {/* Article 2 */}
              <div>
                <b>第2条（商品の引渡し）</b>
                <p className="mt-1">
                  甲は、乙の注文により乙の指定する品目、数量の商品を、甲の承諾した乙指定の場所に発送し引渡すとともに、併せて当該納品書を送付する。なお納品のための荷作りおよび、運賃（運送保険料含む）は、継続供給販売申込書に記載の通りとする。
                </p>
              </div>

              {/* Article 3 */}
              <div>
                <b>第3条（所有権の移転と危険負担）</b>
                <p className="mt-1">
                  甲の納入する商品の所有権は、前条の商品引渡し後、第4条の検査に合格した時に移転するものとする。この商品についての危険は、甲が商品を引き渡すときまでは、甲が負担するものとし、商品引渡し後は乙の負担とする。
                </p>
              </div>

              {/* Article 4 */}
              <div>
                <b>第4条（検査通知義務）</b>
                <p className="mt-1">
                  乙は、甲の商品の引渡しを受けた後、直ちに当該商品を検査し、商品の破損、瑕疵、数量不足等、検査の結果を甲に報告しなければならない。乙の申し出があった場合は、甲は直ちに返品・代品納入の措置をとるものとする。
                </p>
              </div>

              {/* Article 5 */}
              <div>
                <b>第5条（卸価格）</b>
                <p className="mt-1">
                  甲が乙に対し販売する際の商品の価格は、継続供給販売申込書に記載の通りとする。
                </p>
              </div>

              {/* Article 6 */}
              <div>
                <b>第6条（紹介料）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    乙が紹介した新規顧客との取引が成立した場合における紹介料の支払については、別紙「紹介料条件書」に定める条件に従い、甲は乙に対して紹介料を支払うものとする。
                  </li>
                  <li>
                    別紙に定めのない事項または疑義が生じた事項については、甲乙別途協議のうえ決定するものとする。
                  </li>
                </ol>
              </div>

              {/* Article 7 */}
              <div>
                <b>第7条（代金の支払い）</b>
                <p className="mt-1">
                  甲が乙に対し販売する商品代金を、乙は継続供給販売申込書の方法で支払う。その詳細は以下のとおりとする。
                </p>
                <ul className="pl-5 mt-1 space-y-2">
                  <li>
                    (1) 後払いのとき
                    <br />
                    甲は乙に対し毎月末日で当月中に売り渡した商品の数量と代金を締め、請求書を発行する。乙は甲から請求を受けた商品代金を締日の翌月末日迄に甲の指定する金融機関口座に振込み支払うものとする。振込手数料は乙の負担とする。
                  </li>
                  <li>
                    (2) 先払いのとき
                    <br />
                    乙は商品の発注時に当該商品の代金を甲の指定する金融機関口座に振込み支払うものとする。甲は、入金を確認後、商品を発送する。振込手数料は乙の負担とする。
                  </li>
                </ul>
              </div>

              {/* Article 8 */}
              <div>
                <b>第8条（保証金）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    甲は乙に対して本契約から生ずる一切の責務を担保するため、保証金の預け入れを求めることができる。なお、保証金に利息は付さないものとする。
                  </li>
                  <li>
                    甲および乙は、１年に１回、甲乙間の取引額を確認し、保証金の増減について協議を行う。保証金の増額が適当と認められた場合は、乙は保証金の増額分を甲へ預け入れる。一方、保証金の減額が適当と認められた場合は、甲は保証金の減額分を乙へ返還する。
                  </li>
                  <li>
                    乙が甲に対する債務の支払を遅延したときは、甲はいつでも保証金をこれに充当することができるものとする。この場合、乙は直ちにこれにより生じた保証金の不足額を補填しなければならない。
                  </li>
                  <li>
                    理由の如何を問わず本契約が終了した場合、甲は乙が負担すべき債務の弁済に、保証金を充当した後、契約終了の翌日から2ヶ月以内にその残額を乙に返還する。
                  </li>
                </ol>
              </div>

              {/* Article 9 */}
              <div>
                <b>第9条（債務支払い遅延）</b>
                <p className="mt-1">
                  乙が甲に対する債務の支払を遅延した時は、遅延利息金年6％の支払い義務が発生するものとする。
                </p>
              </div>

              {/* Article 10 */}
              <div>
                <b>第10条（返品の基準）</b>
                <p className="mt-1">
                  甲乙間で引渡しが終了した商品（但し、第4条の報告により乙が返品を請求した場合は、引渡し終了後といえども本条但し書きによる。）については、返品できないものとする。但し、甲が乙の請求により調査し、輸送上の破損、その他取引の信義上、返品に相当する特別の事情があると認められた場合に限り、その都度、甲乙間で協議して返品の数量、方法、期限等を決定する。
                </p>
              </div>

              {/* Article 11 */}
              <div>
                <b>第11条（商品の変更）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    本契約期間中といえども、甲は商品の全部または一部の販売を中止し、あるいはその内容、包装を変更することができる。
                  </li>
                  <li>
                    前項の変更の際に乙が保管している商品の取扱いについては、甲乙別途協議のうえ決定するものとする。
                  </li>
                </ol>
              </div>

              {/* Article 12 */}
              <div>
                <b>第12条（製造物責任）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    甲は、製造者ではないが、本契約に基づき乙に供給する製品について、当該製品の製造者（製造委託先を含む）から提供された情報に基づき、製品の品質管理に努めるものとする。また、甲は乙に対して、製造者の責任に関する情報を適切に提供し、製品の流通管理に努めるものとする。
                  </li>
                  <li>
                    製品に製造上、設計上または表示上の欠陥があったことにより、第三者に損害が生じ、乙が製造物責任法その他の法令に基づき責任を負担した場合には、甲は当該欠陥が甲または製造者に起因するものであるに場合に限り、乙が被った損害について合理的な範囲で保証するものとする。
                  </li>
                  <li>
                    前項の定めに関わらず、次のいずれかに該当する場合には、甲は乙に対し保証の責任を負わないものとする。
                    <ul className="list-disc pl-5 mt-1">
                      <li>
                        乙の保管、取扱いまたは販売方法に起因して製品に欠陥が生じた場合
                      </li>
                      <li>乙が甲の指示に反して製品を使用または販売した場合</li>
                      <li>乙の故意または重大な過失によって損害が生じた場合</li>
                    </ul>
                  </li>
                  <li>
                    甲は、前項の責任分担に基づき、必要に応じて製造者に対し求償等の処置を講じるものとし、乙に対して協議のうえ、その結果を遅延なく誠実に報告するものとする。
                  </li>
                  <li>
                    乙は製品の最終販売者として、製品に記載された取扱説明、使用上の注意、警告表示等を適切に顧客に伝達するとともに、必要に応じて販売先からの問い合わせに対応する責任を負うものとする。
                  </li>
                </ol>
              </div>

              {/* Article 13 */}
              <div>
                <b>第13条（商標）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    甲は乙に対し、本契約期間中、乙の営業地域内において、商品の販売、販売促進および広告に関してのみ、甲が認めた甲の商標（以下、本件商標という。）を無償で使用する権利を許諾する。
                  </li>
                  <li>
                    乙は本件商標の実際の使用に際しては、事前に甲に対して商標を付す対象物・その使用態様等を提出し、甲の確認を得るものとする。
                  </li>
                  <li>
                    乙は本件商標を本契約および甲の指示に厳格に従って使用するものとし、本契約の目的以外のためにこれらを使用してはならない。また、乙は本件商標の全部または一部を改変し、もしくは本件商標の信用を損なうような方法にて使用してはならない。
                  </li>
                  <li>
                    理由の如何を問わず本契約が終了した場合、乙は直ちに本件商標の使用を中止しなければならない。乙の設備において本件商標が付されたものがある場合は、乙の費用でこれを撤去し、商品のカタログその他の本件商標が付されたものについては、甲の指示に従い甲に返還するか、乙の費用で廃棄する。
                  </li>
                  <li>
                    乙は乙の営業地域内において、本件商標が第三者に侵害され、または侵害する恐れがある場合は、直ちに甲に通知するものとする。
                  </li>
                </ol>
              </div>

              {/* Article 14 */}
              <div>
                <b>第14条（守秘義務）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    甲および乙は、本契約期間中およびその終了後5年間、本契約に基づき相手方から開示、提供を受けた営業上または技術上の情報を守秘し、第三者に開示、漏洩してはならない。
                  </li>
                  <li>
                    甲および乙は、本契約の目的を達成するために必要な役職員に対し前項の情報を開示することができる。この場合、甲および乙は当該役職員に対しても自己と同様の守秘義務を負わせるものとし、当該役職員からの情報漏洩に関するすべての責任を負う。
                  </li>
                  <li>
                    理由の如何を問わず本契約が終了した場合及び相手方が請求した場合は、甲および乙は相手方から提供を受けた情報を相手方に返還し、以後一切保有しない。
                  </li>
                  <li>
                    本条に定める守秘義務は、次の一に該当することが客観的に立証できる場合には適用しない。
                    <ul className="list-disc pl-5 mt-1">
                      <li>
                        公知の事実もしくは当事者の責に帰すべき事由によらずして公知となった事実
                      </li>
                      <li>第三者から適法に取得した事実</li>
                      <li>開示の時点で保有していた事実</li>
                      <li>
                        法令、政府機関、裁判所の命令により開示が義務付けられたとき
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>

              {/* Article 15 */}
              <div>
                <b>第15条（写真等の使用）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    乙が、甲の作成または使用に係る出版物・HP等に掲載される写真・文章等全ての内容（データを含む。以下「写真等」という。）の使用を希望する場合には、必ず事前に甲に対して使用目的、使用物（パンフレット等の内容につき、先に具体案を甲に提出）、掲載時期等を連絡し、甲の承諾を得た上で使用できるものとする。なお、使用物が完成した後は、当該使用物を遅滞なく甲に送付または通知するものとする。なお、使用物の範囲は製品パンフレット、小冊子、ポスター等、本契約に基づき甲の製造する商品を販売する上で必要となる広告物に限定する。
                  </li>
                  <li>
                    前項の定めにより、甲が使用を承諾した写真等の使用期間は、甲が定めるものとし、乙はその使用期間経過後は直ちに使用を中止する。ただし、使用期間終了前に延長を申し出て、甲がこれを許可した場合はこの限りではない。
                  </li>
                  <li>
                    乙が甲の写真等につき、無断使用・目的外使用その他本条の規定に違反した場合は、甲は以降一切の写真等の使用を禁ずることができる。
                  </li>
                  <li>
                    乙が甲の写真等につき、無断使用・目的外使用その他本条の規定に違反した場合は、甲は甲の定める違約金を乙に対して請求することができる。この場合、乙は速やかに違約金を支払わなければならない。また、上記の使用により甲が何らかの損害を被った場合、乙はその損害につき賠償するものとする。
                  </li>
                  <li>
                    理由の如何を問わず本契約が終了した場合、乙は直ちに写真等の使用を中止し、使用中の広告物については甲の指示に従い、甲に返還するか、乙の費用で破棄するものとする。
                  </li>
                </ol>
              </div>

              {/* Article 16 */}
              <div>
                <b>第16条（報告義務）</b>
                <p className="mt-1">
                  乙は、甲の請求を受けたときは、その営業状況および、経理内容を報告し、必要な関係資料を提出するものとする。
                </p>
              </div>

              {/* Article 17 */}
              <div>
                <b>第17条（申請義務）</b>
                <p className="mt-1">
                  乙は、自己の営業を拡張し、法人の設立、支社または、営業所、代理店などを設置、開店する場合、および、会社合併、譲渡、組織変更をなさんとするときは、予め甲にその旨を連絡しなければならない。また、乙が傘下の支社または、営業所を廃止する場合、および会社役員の異動、その他の重要事項の変更についても同様とする。
                </p>
              </div>

              {/* Article 18 */}
              <div>
                <b>第18条（法令遵守義務）</b>
                <p className="mt-1">
                  乙は、本契約に基づき甲の商品を販売するにあたっては、特定商取引法をはじめとし、関連する法律を遵守するものとする。
                </p>
              </div>

              {/* Article 19 */}
              <div>
                <b>第19条（相殺予約）</b>
                <p className="mt-1">
                  甲が、乙に対し、債務を負担するときは、甲は、その債務と甲が乙に対して有する債権とをその弁済期の奴何にかかわらず、いつでも相殺できる。
                </p>
              </div>

              {/* Article 20 */}
              <div>
                <b>第20条（禁止行為）</b>
                <p className="mt-1">乙は、下記の事項を行ってはならない。</p>
                <ul className="pl-5 mt-1 space-y-1">
                  <li>
                    (1)
                    甲の商品イメージを失墜させるようなその他商品の販売等をすること
                  </li>
                  <li>
                    (2) 第三者に対し、消費目的以外で甲の商品を販売すること
                  </li>
                  <li>(3) 甲との信頼関係を著しく損ねるような行為をすること</li>
                </ul>
              </div>

              {/* Article 21 */}
              <div>
                <b>第21条（期限の利益の喪失・契約解除と出荷停止）</b>
                <p className="mt-1">
                  乙が次の各号の一に該当した場合、何らの催告を要することなく乙の甲に対する債務は、当然に期限の利益を失い、乙はその全額を直ちに甲に支払わなければならない。また、甲は催告なくして本契約または本契約に付帯して締結した契約の全部または一部を解除することができるとともに、すでに乙から請求のあった製品の出荷を停止できる。
                </p>
                <ul className="pl-5 mt-1 space-y-1">
                  <li>
                    (1)
                    本契約または本契約に付帯して締結した契約の一に違反した場合
                  </li>
                  <li>(2) 支払停止、支払不能に陥った場合</li>
                  <li>
                    (3)
                    自ら振り出しもしくは裏書した手形、小切手の不渡りを出したとき
                  </li>
                  <li>
                    (4)
                    差押、仮差押、仮処分、競売の申立て、公租公課の滞納処分その他公権力の処分を受けた場合
                  </li>
                  <li>
                    (5)
                    破産、民事再生、特別清算の申立てを受け、またはなした場合もしくは特定調停の申立てをなした場合
                  </li>
                  <li>(6) 営業を廃止した場合</li>
                  <li>
                    (7)
                    監督官庁より営業停止命令または営業に必要な許認可の取消し処分を受けた場合
                  </li>
                  <li>
                    (8)
                    会社の実質的支配関係が変化し従前の会社との同一性が失われたとき
                  </li>
                  <li>
                    (9)
                    反社会的勢力に、乙もしくは乙の子会社（以下、「乙等」という。）、乙等の役職員または取引先等が該当し、または関与（直接、間接を問わない）していると合理的に疑われることが判明しているにもかかわらず、関係遮断を図るための措置を講じることなく、放置しているとき
                  </li>
                  <li>
                    (10)
                    その他、甲が本契約を存続させることが適正でないと判断するような事由が発生したとき
                  </li>
                </ul>
              </div>

              {/* Article 22 */}
              <div>
                <b>第22条（存続期間）</b>
                <p className="mt-1">
                  本契約の有効期間は、継続供給販売申込書記載の通りとする。但し、期間満了１ヶ月前迄に、甲乙いずれか一方より、書面による更新拒絶の申し出がないときは、本契約は、さらに1年間更新され、以降も同様とする。なお、取引条件については更新の都度、見直すものとする。
                </p>
              </div>

              {/* Article 23 */}
              <div>
                <b>第23条（弁済）</b>
                <p className="mt-1">
                  前21条の規定による本契約の期間満了または、解除により本契約が終了した場合、乙は即時に現金をもって残存債務を弁済しなければならない。
                </p>
              </div>

              {/* Article 24 */}
              <div>
                <b>第24条（譲渡禁止）</b>
                <p className="mt-1">
                  乙は、本契約上の地位もしくは本契約から生じる権利義務の全部または一部を、事前の書面による甲の承諾なくして第三者に譲渡してはならない。
                </p>
              </div>

              {/* Article 25 */}
              <div>
                <b>第25条（合意管轄）</b>
                <p className="mt-1">
                  本契約に基づく諸取引に関し、訴訟を提起する場合、訴額に応じて東京地方裁判所または東京簡易裁判所を専属的な管轄裁判所とする。
                </p>
              </div>

              {/* Article 26 */}
              <div>
                <b>第26条（特約条項）</b>
                <p className="mt-1">
                  本契約について別途書面により特約した場合は、その特約は本契約と一体となり、本契約を補完および修正することを承認する。
                </p>
              </div>

              {/* Article 27 */}
              <div>
                <b>第27条（本規約の変更）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    甲は、次に掲げる場合には、本規約の内容を変更することがある。
                    <ul className="list-disc pl-5 mt-1">
                      <li>
                        (1) 本規約の変更が、申込者の一般の利益に適合するとき
                      </li>
                      <li>
                        (2)
                        本規約の変更が、契約をした目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき
                      </li>
                    </ul>
                  </li>
                  <li>
                    前項により本規約を変更するときは、当社は、その効力発生時期を定め、かつ、本規約を変更する旨および変更後の規約の内容並びにその効力発生時期を公表するものとします。
                  </li>
                </ol>
              </div>

              {/* Article 28 */}
              <div>
                <b>第28条（商品の販売地域）</b>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    本契約に基づき、乙が商品を販売できる地域は日本国内（以下「販売地域」という）とする。
                  </li>
                  <li>
                    乙が、販売地域以外の地域で商品を販売することを希望する場合、別途条件等を協議のうえ、甲の書面による同意を得なければならない。
                  </li>
                  <li>
                    販売地域での商品の販売において必要とされる諸条件への申請、認可取得及びその費用等については乙がその責めを負う。
                  </li>
                  <li>
                    乙は、甲の事前の書面による承諾を得ることなく、インターネット上において本商品を販売してはならない。ここでいう「インターネット上の販売」とは、乙が自ら運営するウェブサイト、第三者が運営するショッピングモール型サイト（Amazon、楽天市場、Yahoo!ショッピング等）フリマアプリ（メルカリ、ラクマ等）、オークションサイトその他これに準ずるオンライン媒体を通じた販売を含むものとする。
                  </li>
                  <li>
                    乙が事項に違反して販売を行った場合、甲は本契約を解除することができ、また乙は甲が被った損害を賠償するものとする。
                    本契約の成立を証するため、本条件書の電磁的記録を作成し、甲及
                    び乙が合意の後、電子署名を施し、各自その電磁的記録を保管する。
                    なお、本契約においては、電子データである本条件書ファイルを原
                    本とし、同ファイルを印刷した文書はその写しとする。
                  </li>
                </ol>
              </div>

              {/* Footer */}
              <div className="mt-6 border-t pt-4"></div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                className="w-60 h-12 bg-primary text-white rounded-md cursor-pointer"
                onClick={() => {
                  form.setValue("termsAccepted", true, {
                    shouldValidate: true,
                  });
                  setTermsAccepted(false);
                }}
              >
                同意します
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SupplySalePage;
