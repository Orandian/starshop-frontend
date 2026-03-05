"use client";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { useBonusTransactionList, useBonusPeriod } from "@/hooks/fc/useBonus";
import { formatDate2 } from "@/utils";
import {Download} from "lucide-react";
import { BonusPeriodList, BonusTransactionList } from "@/types/fc/bonus.type";
import { useState } from "react";

const FCReciptPage = () => {
  const [period, setPeriod] = useState("all");

  const { data: periodList } = useBonusPeriod();
  const { data: transactionData , isLoading} = useBonusTransactionList(period);

  const periods: BonusPeriodList[] = periodList?.data && Array.isArray(periodList?.data)
    ? periodList.data
    : [];

  const transactions: BonusTransactionList[] = transactionData?.data && Array.isArray(
    transactionData?.data
  )
    ? transactionData.data
    : [];

  const handlePeriodChange = (selectedPeriod: string) => {
    return () => {
      setPeriod(selectedPeriod);
    };
  };

  const convertDate = (dateString: string) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    return `${year}-${month}`;
  };

  const bannerData = [
    {
      title: "合計金額",
      amount: transactions.reduce((sum, tx) => {
        if (tx.transactionType === 2) {
          return sum + Math.floor(tx.bonus * 0.02);
        } else {
          return sum + Math.floor(tx.bonus);
        }
      }, 0),
    },
    {
      title: "管理金",
      amount: transactions.reduce((sum, tx) => {
        if (tx.transactionType === 2) {
          return sum + Math.floor(tx.bonus * 0.02);
        }
        return sum;
      }, 0),
    },
    {
      title: "お祝金",
      amount: transactions.reduce((sum, tx) => {
        if (tx.transactionType === 1) {
          return sum + Math.floor(tx.bonus);
        }
        return sum;
      }, 0),
    },
    {
      title: "商品紹介",
      amount: 0,
    },
  ];

  return (
    <section className="w-full">
      <div className="w-full px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        {/* 契約書 */}
        <div className="flex justify-between items-center">
          <h2 className="my-4 font-bold">請求書</h2>
          <Button className="cursor-pointer underline hover:bg-dark/50 text-white bg-dark">
            <span className="flex justify-center items-center gap-3">
              <Download />
              ダウンロード
            </span>
          </Button>
        </div>
        <div className="w-full   bg-white h-auto">
          <div className="flex gap-4  items-center">
            <Button
              onClick={handlePeriodChange("all")}
              className={`w-14 md:w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark ${period === "all" ? "bg-black" : "bg-disabled"}`}
            >
              All
            </Button>
            {periods?.map((p) => (
              <Button
                key={p.invoiceYearMonth}
                onClick={handlePeriodChange(p.invoiceYearMonth)}
                className={`w-18 md:w-28  flex justify-center items-center   text-white rounded-full text-sm hover:bg-dark ${period === p.invoiceYearMonth ? "bg-black" : "bg-disabled"}`}
              >
                {convertDate(String(p.invoiceYearMonth))}
              </Button>
            ))}
          </div>
        </div>
        {/* banner */}
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black text-white rounded-lg p-6 flex flex-col items-center text-center">
              <p className="">{bannerData[0].title}</p>
              <p className="mt-3 text-xl font-semibold">
                ¥{bannerData[0].amount.toLocaleString()}
              </p>
            </div>

            <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center">
              <p className="">{bannerData[1].title}</p>
              <p className="mt-3 text-xl font-semibold">
                ¥{bannerData[1].amount.toLocaleString()}
              </p>
            </div>

            <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center">
              <p className="">{bannerData[2].title}</p>
              <p className="mt-3 text-xl font-semibold">
                ¥{bannerData[2].amount.toLocaleString()}
              </p>
            </div>

            <div className="bg-foreground rounded-lg p-6 flex flex-col items-center text-center">
              <p className="">{bannerData[3].title}</p>
              <p className="mt-3 text-xl font-semibold">
                ¥{bannerData[3].amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <span className="text-sm p-2">{transactions.length}件</span>
          <div className="overflow-x-auto mt-2 border border-disabled/20 mb-6 rounded-lg">
            <div className="overflow-x-auto">
              <div className="min-w-[800px] md:w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        取引日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                        ボーナス種類
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        取引内容
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        購入金額
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        ボーナス金額
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        ボーナス支払い日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        ステータス
                      </th>
                    </tr>
                  </thead>
                  {isLoading && (
                    <div className="col-span-4 h-20 flex justify-center items-center w-full">
                      <LoadingIndicator size="lg" />
                    </div>
                  )}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate2(transaction.transactionDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full  text-white py-1
                          ${transaction.transactionType === 1 ? "bg-[#9399D4]" : transaction.transactionType === 2 ? "bg-[#E0BD00]" : "bg-[#00B8D4]"}`}
                          >
                            {transaction.transactionType === 1
                              ? "お祝金"
                              : transaction.transactionType === 2
                                ? "管理金"
                                : "愛用者購入"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-3">
                            <div className="text-gray-900 font-medium">
                              {transaction.remark}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          ¥{transaction.bonus.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          ¥
                          {transaction.transactionType === 1
                            ? transaction.bonus.toLocaleString()
                            : transaction.transactionType === 2
                              ? (transaction.bonus * 0.02).toLocaleString()
                              : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.invoiceYearMonth
                            ? convertDate(transaction.invoiceYearMonth)
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 inline-flex text-xs leading-5 font-normal rounded-full bg-tertiary text-white py-1">
                            {"無効"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* <div className="w-full flex justify-end mt-4">
            <div className="flex items-center gap-2">
              <Button size="icon" className="bg-transparent mr-5">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8  hover:bg-disabled/20"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8  hover:bg-disabled/20"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8  hover:bg-disabled/20"
              >
                3
              </Button>
              <Button
                size="icon"
                className="bg-transparent hover:bg-transparent ml-5"
              >
                <span>Next</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
        </div> 
          */}
        </div>
      </div>
    </section>
  );
};

export default FCReciptPage;
