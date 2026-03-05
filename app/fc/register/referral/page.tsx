"use client";
import RegisterIndicator from "@/components/fc/RegisterIndicator";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFCStep } from "@/hooks/fc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ReferralPage = () => {
  /**
   * States
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  const [agreed, setAgreed] = useState(false);

  /**
   * Mutation
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   */
  const { mutate: updateStep, isPending: isUpdateStepPending } = useFCStep();

  const router = useRouter();

  const handleNext = () => {
    updateStep(4, {
      onSuccess: () => {
          toast.success("手続きが正常に完了しました");
        router.push("/fc/register/account-confirm");
      },
        onError: () => {
      toast.error("手続きの更新に失敗しました");
    },
    });
  };

  return (
    <section className="w-full px-6 py-10 flex justify-center">
      <div className="max-w-4xl w-full">
        <RegisterIndicator active={3} />

        {/* Terms / referral info block */}
        <div className="mt-6 bg-foreground rounded-lg shadow-sm">
              <div className="sm:hidden bg-product-card-btn w-full p-2 rounded-t-lg">
              <h2 className="text-lg text-white font-semibold text-center">紹介制度</h2>
            </div>
            
          <div className="prose text-sm text-justify p-3 md:p-6">
            <ol className="list-decimal list-inside p-4 ">
              <li className="mb-6 ">
                紹介料の支払対象は、乙が紹介した新規顧客と甲との間で成立した初回契約に限るものとする。<br/>
                 <span className="ms-4">当該初回契約に基づき、甲は乙に対し、以下の区分に従い紹介料を支払う。</span>
                <div className="mt-3 w-full flex justify-center  flex-col">
                  <div className="overflow-x-auto w-full md:w-1/2 text-center self-center">
                    <table className="w-full border-collapse border border-disabled/20 text-sm">
                      <thead>
                        <tr className="bg-disabled/20">
                          <th className="p-3 border">契約購入金額（税別）</th>
                          <th className="p-3 border">紹介料</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-disabled/20">
                          <td className="p-3 border text-center">100,000円</td>
                          <td className="p-3 border text-center">10,000円</td>
                        </tr>
                        <tr className="bg-disabled/20">
                          <td className="p-3 border text-center">300,000円</td>
                          <td className="p-3 border text-center">20,000円</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ※補足：乙が紹介した新規顧客が100,000円の契約を締結した場合、その後同顧客が300,000円の契約を締結した場合であっても、当該紹介に係る紹介料は10,000円とする。
                  </p>
                     <p className="text-xs text-gray-500 mt-2">
                    乙が10万円契約の場合、乙が紹介した新規顧客が30万円契約をしても紹介料は1万円とする。
                  </p>
                </div>
              </li>

              <li className="mb-6">
                甲は、紹介先より当該契約金額の全額を受領したことを確認した後、翌月末日までに、乙指定の方法により紹介料を支払うものとする。
              </li>

              <li className="mb-6">
                当該契約が、キャンセル、解除、返金その他の事由により無効となった場合、甲は乙に対して紹介料の支払義務を負わないものとする。<br/>
                <span>また、既に紹介料が支払われている場合、乙は甲の請求に基づき、速やかに当該紹介料を返還するものとする。  </span>
              </li>
            </ol>
          </div>

          {/* Agreement checkbox */}
          <div className="mt-2 px-6">
            <div className="bg-disabled/20 rounded-lg p-4 flex items-center">
              <Checkbox
                id="agreement"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(!!v)}
              />
              <Label htmlFor="agreement" className="ml-3">同意いたします。</Label>
            </div>
          </div>

          {/* Next button */}
          <div className=" p-6">
            <Button
              type="button"
              disabled={!agreed || isUpdateStepPending}
              onClick={handleNext}
              className={`cursor-pointer w-full  h-12 bg-black md:bg-primary   ${agreed ? " text-white" : " text-white/70 cursor-not-allowed"}`}
            >
              {isUpdateStepPending ? <LoadingIndicator size="sm" /> : "次へ"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralPage;
