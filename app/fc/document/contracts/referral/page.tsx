"use client";

import { Button } from "@/components/ui/button";
import { DownloadCircleIcon } from "@/public/fc/icons/downloadCircle";
import { generatePDF } from "@/utils/fc/pdfGenerate";
import { useRef, useState } from "react";
//import signature from "@/public/fc/sign.png";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";

const FCReferralPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const { userDetail, isUserLoading, getDate } = useFullUserDetail();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  //css constants
  const pClass = "text-xs";
  const tableClass =
    "w-full md:w-2/5   border-[1px] border-black text-xs md:ml-4";
  const tdClass = "p-2 border-[1px] border-black bg-[#E6E6E6]";

  /**
   * Handle download of the referral form
   * @returns void
   */
  const handleDownload = async () => {
    if (!formRef.current) return;
    try {
      setIsGeneratingPdf(true);
      await generatePDF(formRef.current, "紹介制度同意書.pdf");
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
            紹介制度同意書
          </h1>
          <div className="space-y-6">
            <p className={pClass}>
              1.
              紹介料の支払対象は、乙が紹介した新規顧客との初回契約に限るものとし、紹介料は以下の通りとします。
            </p>
            {/* table */}
            <table className={tableClass}>
              <tbody>
                <tr>
                  <td className={tdClass}>契約購入金額（税別）</td>
                  <td className={tdClass}>紹介料</td>
                </tr>
                <tr>
                  <td className={tdClass}>100,000円</td>
                  <td className={tdClass}>10,000円</td>
                </tr>
                <tr>
                  <td className={tdClass}>300,000円</td>
                  <td className={tdClass}>20,000円</td>
                </tr>
              </tbody>
            </table>
            <p className={`ml-4 ${pClass}`}>
              ※補足：乙が10万円契約の場合、乙が紹介した新規顧客が30万円契約をしても紹介料は1万円とする。
            </p>
            <p className={`mt-8 ${pClass}`}>
              2.
              甲は、紹介先より当該契約金額全額を受領した後、翌月月末までに乙に対して紹介料を支払うものとする。
            </p>
            <p className={`mt-8 ${pClass}`}>
              3.
              契約がキャンセル、解除、返金等により無効となった場合、甲は紹介料の支払義務を負わず、
              既に支払い済の紹介料がある場合は、乙はこれを返還する。
            </p>
            {/* Date & Signature */}
            <p className="mt-12 text-right text-xs">{getDate() || "-"}</p>
            <p className="text-right text-xs">
              {userDetail?.data?.tantoName || "-"}
            </p>
            <div className="float-right w-fit">
              {userDetail?.data?.signPath && (
                // <ImageComponent
                //   imgName="signature"
                //   imgURL={getPublicUrl(userDetail?.data?.signPath) || ""}
                //   className="w-[150px] h-auto object-contain"
                // />
                <p className="text-xs text-end">{userDetail?.data?.signPath}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FCReferralPage;
