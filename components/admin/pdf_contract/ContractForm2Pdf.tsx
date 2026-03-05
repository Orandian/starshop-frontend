import { forwardRef } from "react";
import { CustomerDetail } from "@/types/customers";

type Props = {
  userDetail: CustomerDetail;
};

const ContractForm2Pdf = forwardRef<HTMLDivElement, Props>(
  ({ userDetail }: Props, formRef) => {
    //css constants
    const pClass = "text-xs";
    const tableClass = "w-2/5 border-[1px] border-black text-xs ml-4";
    const tdClass = "p-2 border-[1px] border-black bg-[#E6E6E6]";

    //helper
    /**
     * Get user created date
     * @param userDetail
     * @returns
     */
    const getDate = (userDetail: CustomerDetail) => {
      const created = userDetail?.fc_info?.createdAt;
      if (!created) return "";
      return `${created[0]}-${created[1]}-${created[2]}`;
    };

    return (
      <>
        {/* Application Form Section (Captured for PDF Only) */}
        <div
          ref={formRef}
          className="p-8 bg-white mx-auto w-full border-0 shadow-[0_0_15px_0_rgba(0,0,0,0.1)]"
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
            <p className="mt-12 text-right text-xs">
              {getDate(userDetail) || "-"}
            </p>
            <p className="text-right text-xs">{userDetail?.tantoName || "-"}</p>
            <div className="float-right w-fit">
              {userDetail?.fc_info?.signPath && (
                // <ImageComponent
                //   imgName="signature"
                //   imgURL={getPublicUrl(userDetail?.signPath) || ""}
                //   className="w-[150px] h-auto object-contain"
                // />
                <p className="text-xs text-end">
                  {userDetail?.fc_info?.signPath}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  },
);
ContractForm2Pdf.displayName = "ContractFormPdf";
export default ContractForm2Pdf;
