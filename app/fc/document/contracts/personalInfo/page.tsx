"use client";

import { Button } from "@/components/ui/button";
import { DownloadCircleIcon } from "@/public/fc/icons/downloadCircle";
import { generatePDF } from "@/utils/fc/pdfGenerate";
import { useRef, useState } from "react";
//import signature from "@/public/fc/sign.png";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";

const FCPersonalInfoPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const { userDetail, isUserLoading, getDate } = useFullUserDetail();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  //css constants
  const pClass = "text-xs";
  const liHeaderClass = "text-sm font-bold";

  //company address ( Beautech)
  const companyInfo = {
    name: "BEAUTECH株式会社",
    address: "〒104-0045 東京都中央区築地6丁目1-9 門跡木村ビル2F ",
    tel: "03-5801-5968  ",
    email: "starshop@beau-tech.jp",
    openingDuration: "平日　09:00～18:00 "
  };


  /**
   * Handle download of the personal info form
   * @returns void
   */
  const handleDownload = async () => {
    if (!formRef.current) return;
    try {
      setIsGeneratingPdf(true);
      await generatePDF(formRef.current, "個人情報扱い同意書.pdf");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isUserLoading) {
    return <LoadingIndicator size="md" />;
  }

  return (
    <section className="w-full flex justify-center">
      <div className="w-full px-3 md:px-8 py-2 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        {/* Download Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleDownload}
            className="bg-black h-8 hover:bg-black/80 gap-2 flex items-center py-4 text-white border border-disabled/30 rounded-md"
          >
            <DownloadCircleIcon className="w-5 h-5" />
            {isGeneratingPdf ? "ダウンロード中..." : "ダウンロード"}
          </Button>
        </div>

        {/* Application Form Section (Captured for PDF Only) */}
        <div
          ref={formRef}
          className="p-8 bg-white mx-auto w-full border-0 shadow-none md:shadow-[0_0_15px_0_rgba(0,0,0,0.1)]"
          style={{
            maxWidth: "210mm", // A4 width
            minHeight: "297mm", // A4 height
          }}
        >
          <h1 className="text-xl font-bold text-center mb-8 mt-8">
            個人情報扱い同意書
          </h1>
          <div className="space-y-6">
            {/* Personal Information */}
            <p className={pClass}>
              BEAUTECH株式会社（以下、「当社」といいます）は、当社が運営するStar Shopサイト（以下、「本サービス」）において、お客様の個人情報の適切な取扱いと保護に努めます。
            </p>
            <ol className={`ml-4 ${liHeaderClass}`}>
              {/* No.1 */}
              <li className="mb-2">
                1. 取得する個人情報について
                <p className={`font-normal ${pClass}`}>
                  当社は、本サービスの提供にあたり、以下の個人情報を取得いたします。
                </p>
                <ul className={`ml-4 font-normal ${pClass}`}>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span> <span>氏名</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span> <span>電話番号</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span> <span>メールアドレス</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span> <span>郵便番号・住所</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>アカウント情報（ユーザーID・パスワード 等）</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>
                      ご注文履歴、お問い合わせ内容などのサービス利用履歴
                    </span>
                  </li>
                </ul>
              </li>
              {/* No.2 */}
              <li className="mb-2">
                2. 利用目的
                <p className={`font-normal ${pClass}`}>
                  取得した個人情報は、以下の目的のために利用いたします。
                </p>
                <ul className={`ml-4 font-normal ${pClass}`}>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>商品の発送、代金の請求・決済処理</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>ご注文内容や配送に関する確認・連絡</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>アカウントの作成、本人確認</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>
                      本サービスに関するご案内、キャンペーン情報の提供
                    </span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>お問い合わせへの対応</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>サービス改善および新サービス開発のための分析</span>
                  </li>
                  <li className="flex items-start">
                    {" "}
                    <span className="mr-2">•</span>{" "}
                    <span>法令に基づく対応や、不正・違反行為の防止</span>
                  </li>
                </ul>
              </li>
              {/* No.3 */}
              <li className="mb-2">
                3. 第三者提供について
                <p className={`font-normal ${pClass}`}>
                  当社は、法令に基づく場合を除き、事前にお客様の同意を得ることなく、個人情報を第三者に提供することはありません。
                </p>
              </li>
              {/* No.4 */}
              <li className="mb-2">
                4. 委託について
                <p className={`font-normal ${pClass}`}>
                  業務遂行上必要な範囲内で、個人情報の取扱いを外部業者に委託する場合があります。この場合、当社は委託先に対して適切な監督を行います。
                </p>
              </li>
              {/* No.5 */}
              <li className="mb-2">
                5. 個人情報の管理
                <p className={`font-normal ${pClass}`}>
                  当社は、取得した個人情報について、漏洩、滅失または毀損の防止その他安全管理のために必要かつ適切な措置を講じます。
                </p>
              </li>
              {/* No.6 */}
              <li className="mb-2">
                6. 開示・訂正・削除等の請求について
                <p className={`font-normal ${pClass}`}>
                  お客様ご本人から、当社が保有する個人情報の開示、訂正、利用停止、削除等希望される場合は、当社所定の手続きに基づき、適切に対応いたします。
                </p>
              </li>
              {/* No.7 */}
              <li className="mb-2">
                7. お問い合わせ窓口
                <p className={`font-normal ${pClass}`}>
                  個人情報の取扱いに関するお問い合わせは、下記窓口までご連絡ください。
                </p>
                <ul className={`ml-4 font-normal ${pClass}`}>
                  <li>{companyInfo.name}</li>
                  <li>{companyInfo.address}</li>
                  <li>【コスメ事業】  専用窓口：{companyInfo.tel}</li>
                  <li>メールアドレス：{companyInfo.email}</li>
                  <li>※営業時間：{companyInfo.openingDuration}</li>
                </ul>
              </li>
              {/* No.8 */}
              <li>
                8. 改定について
                <p className={`font-normal ${pClass}`}>
                  本ポリシーの内容は、法令等の改正や当社の方針により、予告なく変更されることがあります。最新の内容は当社サイト上にて随時掲載いたします。
                </p>
              </li>
            </ol>

            {/* Signature & Date */}
            <p className="mt-12 text-right text-xs">{getDate() || "-"}</p>
            <p className="text-right text-xs">
              {userDetail?.data?.tantoName || "-"}
            </p>
            <div className="float-right" style={{ width: "150px" }}>
              {userDetail?.data?.signPath && (

                // <ImageComponent
                //   imgName="signature"
                //   imgURL={getPublicUrl(userDetail?.data?.signPath) || ""}
                //   className="w-[150px] h-auto object-contain"
                // />
                       <p className="font-bold text-end">{userDetail?.data?.signPath}</p>

             
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FCPersonalInfoPage;
