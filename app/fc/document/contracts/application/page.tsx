"use client";

import { Button } from "@/components/ui/button";
import { DownloadCircleIcon } from "@/public/fc/icons/downloadCircle";
import { generatePDF } from "@/utils/fc/pdfGenerate";
import { useEffect, useRef, useState } from "react";
//import signature from "@/public/fc/sign.png";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import { useGetAllPlan } from "@/hooks/fc/usePlan";
import { FCMasterPlan } from "@/types/fc/plan.type";

const FCApplicationPage = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const {
    userDetail,
    referralUserDetail,
    isUserLoading,
    isReferralUserLoading,
    getDate,
    getAddress,
  } = useFullUserDetail();

  //fc plans
  const { data: plans, isLoading: isPlansLoading } = useGetAllPlan();

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [filteredPlans, setFilteredPlans] = useState<FCMasterPlan[]>([]);

  //mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //if role 4, filter only active plans
  useEffect(() => {
    if (isPlansLoading) return;
    const filteredPlans =
      userDetail?.data?.role === 5
        ? plans?.data?.filter((plan: FCMasterPlan) => plan.isActive)
        : plans?.data;
    if (filteredPlans) setFilteredPlans(filteredPlans);
  }, [isPlansLoading, userDetail?.data?.role, plans?.data]);

  //css constants
  const tableClass = "p-2 align-middle";
  const labelClass = "bg-[#E6E6E6] p-2 align-middle";
  const borderRightClass = "border-r-[1px] border-black";
  const borderDownClass = "border-b-[1px] border-black";
  const borderLeftRightClass = "border-l-[1px] border-black border-r-[1px]";
  const checkboxClass = "w-3 h-3";
  const checkBoxLabelClass = `ml-2 ${isGeneratingPdf ? "-mt-3" : ""}`;

  /**
   * Handle download of the application form
   * @returns void
   */
  const handleDownload = async () => {
    if (!formRef.current) return;
    try {
      setIsGeneratingPdf(true);
      //add delay to ensure UI updates
      await new Promise((resolve) => setTimeout(resolve, 100));
      await generatePDF(formRef.current, "継続供給販売申込書.pdf");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isUserLoading || isReferralUserLoading) {
    return <LoadingIndicator size="md" />;
  }

  return (
    <section className="w-full flex justify-center">
      <div className="w-full px-3 md:px-8 py-2 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        {/* Download Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleDownload}
            disabled={isUserLoading}
            className="bg-black h-8 hover:bg-black/80 gap-2 flex items-center py-4 text-white border border-disabled/30 rounded-md"
          >
            <DownloadCircleIcon className="w-5 h-5" />
            {isGeneratingPdf ? "ダウンロード中..." : "ダウンロード"}
          </Button>
        </div>

        {/* Application Form Section (Captured for PDF Only) */}
        <div
          ref={formRef}
          className="px-8 py-2 bg-white mx-auto w-full border-0 shadow-none md:shadow-[0_0_15px_0_rgba(0,0,0,0.1)]"
          style={{
            maxWidth: "210mm", // A4 width
            minHeight: "297mm", // A4 height
          }}
        >
          <h1 className="text-xl font-bold text-center my-4">
            継続供給販売申込書
          </h1>
          <p className="text-xs mb-2">
            記載の各事項に同意のうえ、下記のとおり申し込みます。
          </p>
          <p className="text-xs mb-2">1.申込者 </p>

          <div className="space-y-4">
            {/* table 1 */}
            <table
              className={`w-full ${tableClass} border border-black text-xs`}
              cellSpacing="0"
              cellPadding="0"
            >
              <tbody>
                <tr className={tableClass}>
                  <td
                    className={[labelClass, borderDownClass].join(" ")}
                    colSpan={4}
                  >
                    御申込会社
                  </td>
                </tr>
                {/* furigana */}
                <tr className={tableClass}>
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    フリガナ
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={3}
                  >
                    {userDetail?.data?.user?.usernameKana || "-"}
                  </td>
                </tr>
                <tr className={tableClass}>
                  {/* company name */}
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    貴社名
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={3}
                  >
                    {userDetail?.data?.user?.username || "-"}
                  </td>
                </tr>
                <tr className={tableClass}>
                  {/* address */}
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    住所
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={3}
                  >
                    {/* 1040045 東京都中央区tr-12-17 グランビル5階 wait */}
                    {getAddress()}
                  </td>
                </tr>
                <tr className={tableClass}>
                  {/* company representative */}
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    貴社代表者名
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={3}
                  >
                    {userDetail?.data?.representativeName || "-"}
                  </td>
                </tr>
                <tr className={tableClass}>
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                    colSpan={4}
                  >
                    担当者
                  </td>
                </tr>
                <tr className={tableClass}>
                  {/* department / position */}
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    部署名/役職
                  </td>
                  <td className={[tableClass, borderDownClass].join(" ")}>
                    {userDetail?.data?.tantoPosition || "-"}
                  </td>
                  {/* name */}
                  <td
                    className={[
                      labelClass,
                      borderLeftRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    氏名
                  </td>
                  <td className={[tableClass, borderDownClass].join(" ")}>
                    {userDetail?.data?.tantoName || "-"}
                  </td>
                </tr>
                <tr className={tableClass}>
                  {/* phone number */}
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    電話番号
                  </td>
                  <td className={[tableClass, borderDownClass].join(" ")}>
                    {userDetail?.data?.user?.phoneNumber || "-"}
                  </td>
                  {/* mail */}
                  <td
                    className={[
                      labelClass,
                      borderLeftRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    MAIL
                  </td>
                  <td className={[tableClass, borderDownClass].join(" ")}>
                    {userDetail?.data?.user?.email || "-"}
                  </td>
                </tr>
                <tr className={tableClass}>
                  <td
                    className={[labelClass, borderDownClass].join(" ")}
                    colSpan={4}
                  >
                    {" "}
                    次ページ以降の継続供給販売規約をご確認の上、チェックをお願いします。
                  </td>
                </tr>
                <tr className={tableClass}>
                  <td
                    className={[labelClass, borderRightClass].join(" ")}
                    colSpan={3}
                  >
                    継続供給販売規約に同意いたします
                  </td>
                  <td className={tableClass}>
                    <input
                      type="checkbox"
                      className={checkboxClass}
                      checked={userDetail?.data?.contSupplySalesAggree === 1}
                      disabled
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs mb-2">2. 契約概要 </p>

          <div className="space-y-4">
            {/* table 2 */}
            <table
              className={`w-full ${tableClass} border border-black text-xs`}
              cellSpacing="0"
              cellPadding="0"
            >
              <tbody>
                {/* contract period */}
                <tr className={tableClass}>
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                    rowSpan={2}
                  >
                    契約期間
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={5}
                  >
                    {userDetail?.data?.contractStartDt[0]}年
                    {userDetail?.data?.contractStartDt[1]}月
                    {userDetail?.data?.contractStartDt[2]}日 〜{" "}
                    {userDetail?.data?.contractEndDt[0]}年
                    {userDetail?.data?.contractEndDt[1]}月
                    {userDetail?.data?.contractEndDt[2]}日
                  </td>
                </tr>
                <tr>
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    契約更新
                  </td>
                  <td className={`pl-2 ${borderDownClass}`}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="contract-period"
                        className={checkboxClass}
                        checked={userDetail?.data?.contractUpdateFlg === "有"}
                        disabled
                        readOnly
                      />
                      <label
                        htmlFor="contract-period"
                        className={checkBoxLabelClass}
                      >
                        有（1年間）
                      </label>
                    </div>
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={3}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="contract-period"
                        className={checkboxClass}
                        checked={userDetail?.data?.contractUpdateFlg === "無"}
                        disabled
                        readOnly
                      />
                      <label
                        htmlFor="contract-period"
                        className={checkBoxLabelClass}
                      >
                        無
                      </label>
                    </div>
                  </td>
                </tr>
                {/* Calculate total rows needed for plans */}
                {(() => {
                  const planRows = filteredPlans
                    ? Math.ceil(filteredPlans.length / (isMobile ? 2 : 5)) // max items per row based on screen size
                    : 0;
                  const totalRows = 4 + planRows; // 4=> extra 4 rows for other descriptions

                  return (
                    <>
                      <tr className={tableClass}>
                        <td
                          className={[
                            labelClass,
                            borderRightClass,
                            borderDownClass,
                          ].join(" ")}
                          rowSpan={totalRows}
                        >
                          貴社名
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="pl-2 pt-2 pb-2">
                          契約購入金額（商品カタログ等に記載された税抜き本体金額に各掛率を乗じた額を指す）
                        </td>
                      </tr>
                      {/* Plan rows */}
                      {filteredPlans
                        ?.reduce((rows: FCMasterPlan[][], plan, index) => {
                          // for mobile, show 2 items per row
                          const itemsPerRow = isMobile ? 2 : 5;
                          if (index % itemsPerRow === 0) rows.push([]);
                          rows[rows.length - 1].push(plan);
                          return rows;
                        }, [])
                        .map((row, rowIndex) => (
                          <tr key={`row-${rowIndex}`}>
                            {row.map((plan: FCMasterPlan) => (
                              <td
                                key={`plan-${plan.planId}`}
                                className="pl-2 pb-2"
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name={`plan-${plan.planId}`}
                                    className={checkboxClass}
                                    checked={
                                      userDetail?.data?.contractPlan
                                        ?.fcPlanMasterId === plan.planId
                                    }
                                    disabled
                                    readOnly
                                  />
                                  <label
                                    htmlFor={`plan-${plan.planId}`}
                                    className={checkBoxLabelClass}
                                  >
                                    ¥
                                    {plan.contractPurchaseAmount?.toLocaleString()}
                                  </label>
                                </div>
                              </td>
                            ))}
                            {row.length < (isMobile ? 2 : 5) &&
                              Array((isMobile ? 2 : 5) - row.length)
                                .fill(null)
                                .map((_, i) => (
                                  <td
                                    key={`empty-${rowIndex}-${i}`}
                                    className="pl-2"
                                  ></td>
                                ))}
                          </tr>
                        ))}
                    </>
                  );
                })()}
                {/* <td className="pl-2 pt-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="plan-2"
                        className={checkboxClass}
                        checked={
                          userDetail?.data?.contractPlan?.fcPlanMasterId === 2
                        }
                        disabled
                        readOnly
                      />
                      <label htmlFor="plan-2" className={checkBoxLabelClass}>
                        ¥300,000
                      </label>
                    </div>
                  </td> */}
                {/* </tr> */}
                <tr>
                  <td className="pl-2 pt-1" colSpan={4}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="plan-3"
                        className={checkboxClass}
                        checked
                        disabled
                        readOnly
                      />
                      <label htmlFor="plan-3" className={checkBoxLabelClass}>
                        販売金額（製品カタログ等に記載された税抜き本体金額を指す）に〇〇を乗じた額
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={5}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="plan-4"
                        className={checkboxClass}
                        checked
                        disabled
                        readOnly
                      />
                      <label htmlFor="plan-4" className={checkBoxLabelClass}>
                        そのほか、見積書にて定める額
                      </label>
                    </div>
                  </td>
                </tr>

                <tr className={tableClass}>
                  {/* company name */}
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                    rowSpan={3}
                  >
                    貴社名
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className={tableClass}>
                    申込者負担{" "}
                    <span>
                      （実費・金
                      <span
                        className={
                          userDetail?.data?.contractPlan?.introIncentive
                            ? "px-1 border ml-0.5"
                            : ""
                        }
                        style={{
                          borderRadius: "20px/50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          verticalAlign: "middle",
                          height: "1.5rem",
                          minWidth: "2.5rem",
                          borderColor: "#ef4444",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          lineHeight: "1.2",
                          transform: "translateY(4px)",
                        }}
                      >
                        <span
                          style={
                            isGeneratingPdf
                              ? {
                                  display: "inline-block",
                                  transform: "translateY(-6px)",
                                }
                              : undefined
                          }
                        >
                          {userDetail?.data?.contractPlan?.introIncentive?.toLocaleString() ??
                            "0"}
                        </span>
                      </span>
                      円／1回）
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className={`pb-2 ${borderDownClass}`} colSpan={5}>
                    （注文商品代金（下代）が3万円（税抜き）以上の場合は、BEAUTECH(株)が負担）
                  </td>
                </tr>

                <tr className={tableClass}>
                  {/* company name */}
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                    rowSpan={3}
                  >
                    貴社名
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className={tableClass}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="plan-5"
                        className={checkboxClass}
                        checked
                        disabled
                        readOnly
                      />
                      <label htmlFor="plan-5" className={checkBoxLabelClass}>
                        契約古運輸については、先払い（入金確認後の商品配送）
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className={`pl-2 pb-2 ${borderDownClass}`} colSpan={5}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="plan-6"
                        className={checkboxClass}
                        disabled
                        checked
                        readOnly
                      />
                      <label htmlFor="plan-6" className={checkBoxLabelClass}>
                        初回以降、注文お支払い方法に準じて選択（現金振込・カード決済等）
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    保証金
                  </td>
                  <td className={[tableClass, borderDownClass].join(" ")}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="plan-7"
                        className={checkboxClass}
                        checked={userDetail?.data?.depositType === ""}
                        disabled
                      />
                      <label htmlFor="plan-7" className={checkBoxLabelClass}>
                        無
                      </label>
                    </div>
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={5}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="plan-8"
                        className={checkboxClass}
                        checked={
                          userDetail?.data?.depositType !== "" &&
                          userDetail?.data?.deposite !== null
                        }
                        disabled
                        readOnly
                      />
                      <label htmlFor="plan-8" className={checkBoxLabelClass}>
                        有
                        {userDetail?.data?.depositType !== "" &&
                          userDetail?.data?.deposite !== null && (
                            <span>
                              （
                              {userDetail?.data?.deposite !== null
                                ? userDetail?.data?.deposite.toLocaleString()
                                : ""}{" "}
                              円）※契約書内容に準する
                            </span>
                          )}
                      </label>
                    </div>
                  </td>
                </tr>
                {/* referral */}
                <tr>
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    紹介者
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={5}
                  >
                    {/* 渡辺　太郎（ID:211223322） */}
                    {userDetail?.data?.referrerId !== null
                      ? referralUserDetail?.data?.user?.username +
                        "（ID:" +
                        referralUserDetail?.data?.user?.userId +
                        "）"
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td
                    className={[
                      labelClass,
                      borderRightClass,
                      borderDownClass,
                    ].join(" ")}
                  >
                    特約事項
                  </td>
                  <td
                    className={[tableClass, borderDownClass].join(" ")}
                    colSpan={3}
                  ></td>
                </tr>
              </tbody>
            </table>
            {/* table 3 */}
            <table className={`w-full text-xs`} cellSpacing="0" cellPadding="0">
              <tbody>
                <tr>
                  <td className="text-center">請書</td>
                  <td className="text-right">{getDate() || "-"}</td>
                </tr>
                <tr>
                  <td>
                    {userDetail?.data?.user?.username}
                    <span> 株式会社 御中</span>
                  </td>
                  <td className="text-right">
                    {userDetail?.data?.tantoName || "-"}
                  </td>
                </tr>
                <tr>
                  <td>上記申込を請けましたので、その旨通知します。</td>
                </tr>
                <tr>
                  <td>
                    BEAUTECH株式会社　東京都中央区築地6丁目1-9 門跡木村ビル2F
                  </td>
                  <td rowSpan={2}>
                    <div className="float-right" style={{ width: "150px" }}>
                      {userDetail?.data?.signPath && (
                        // <ImageComponent
                        //   imgName="signature"
                        //   imgURL={getPublicUrl(userDetail?.data?.signPath) || ""}
                        //   className="w-[150px] h-auto object-contain"
                        // />
                        <p className="font-bold text-end">
                          {userDetail?.data?.signPath}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    代表取締役 <span>西村</span>
                  </td>
                </tr>
                <tr>
                  <td>＜連絡先＞電話番号 03-5801-5968（営業部：金本）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FCApplicationPage;
