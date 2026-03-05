"use client";
import { Button } from "@/components/ui/button";
import {
  useBonusTransactionListByUser,
  useTotalBonusAmount,
} from "@/hooks/admin/useBonus";
import { formatDate, encryptString, decryptString } from "@/utils";
import { BonusTransactionList } from "@/types/admin/bonus.type";
import { use, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationComponent from "@/components/app/PaginationComponent";
import { useCustomerStore } from "@/store/Admin/useCustomerStore";

interface BonusProp {
  params: Promise<{
    id?: string;
    date?: string;
  }>;
}

const AdminBonusPage = (props: BonusProp) => {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id ? decryptString(params.id) : "";
  const date = params.date || null;
  const searchParams = useSearchParams();
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const pageSize = 10;

  //store
  const { downloadInvoice, isDownloading } = useCustomerStore();

  const { data: transactionData, isLoading } = useBonusTransactionListByUser(
    id ? parseInt(id, 10) : 0,
    date || null,
    page,
    pageSize
  );
  const { data: totalBonusAmountData, isLoading: isTotalLoading } =
    useTotalBonusAmount(date || null, id ? parseInt(id, 10) : 0);

  const pagination = transactionData?.data?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const totalElements = pagination?.totalElements || 0;

  const transactions: BonusTransactionList[] = Array.isArray(
    transactionData?.data?.data
  )
    ? (transactionData?.data?.data ?? [])
    : [];

  const totalBonusAmount: BonusTransactionList[] = Array.isArray(
    totalBonusAmountData?.data
  )
    ? (totalBonusAmountData?.data ?? [])
    : [];

  const bannerData = [
    {
      title: "合計金額",
      amount: totalBonusAmount.reduce(
        (sum, tx) => sum + Math.floor(tx.amountWithTax),
        0
      ),
    },
    {
      title: "管理金",
      amount: totalBonusAmount.reduce((sum, tx) => {
        if (tx.transactionType === 2) {
          return sum + Math.floor(tx.amountWithTax);
        }
        return sum;
      }, 0),
    },
    {
      title: "お祝金",
      amount: totalBonusAmount.reduce((sum, tx) => {
        if (tx.transactionType === 1) {
          return sum + Math.floor(tx.amountWithTax);
        }
        return sum;
      }, 0),
    },
    {
      title: "商品紹介",
      amount: 0,
    },
  ];

  /**
   * Handle page change for pagination
   * @param newPage new page number
   * @author Phway
   * @date 2025-11-27
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL without causing a full page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    if (id) {
      const encryptedId = encryptString(id);
      router.push(
        `/admin/bonus/receipt/${encryptedId}/${date}?${params.toString()}`,
        { scroll: false }
      );
    }
  };

  return (
    <section className="w-full">
      <div className="w-full px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        {/* back */}
        <div className="flex gap-2 text-left items-center">
          <ArrowLeft size={20} onClick={() => router.push("/admin/bonus")} />
        </div>
        {/* 契約書 */}
        <div className="flex justify-between items-center">
          <h2 className="my-4 font-bold">請求書</h2>
          <Button
            className="cursor-pointer underline hover:bg-dark/50 text-white bg-dark"
            onClick={() => {
              if (id && date) {
                downloadInvoice(id, date);
              }
            }}
            disabled={isDownloading}
          >
            <span className="flex justify-center items-center gap-3">
              <Download />
              {isDownloading ? "ダウンロード中..." : "ダウンロード"}
            </span>
          </Button>
        </div>

        {/* banner */}
        <div className="mt-6">
          {isTotalLoading ? (
            <div className="flex justify-center items-center w-full h-24">
              <span>Loading...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          )}
        </div>
        <div className="mt-8">
          <span className="text-sm">{totalElements}件</span>

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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center">
                          <span>Loading...</span>
                        </td>
                      </tr>
                    ) : transactions.length > 0 ? (
                      transactions.map((transaction, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.transactionDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 inline-flex text-xs leading-5 font-normal rounded-full  text-white py-1
                          ${transaction?.transactionType === 1 ? "bg-[#9399D4]" : transaction?.transactionType === 2 ? "bg-[#E0BD00]" : "bg-[#00B8D4]"}`}
                            >
                              {transaction?.transactionType === 1
                                ? "お祝金"
                                : transaction?.transactionType === 2
                                  ? "管理金"
                                  : "愛用者購入"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-3">
                              <div className="text-gray-900 font-medium">
                                {transaction?.remark}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            ¥{transaction.amount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            ¥{transaction.amountWithTax?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction?.paymentDate)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
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
          {!isLoading && transactions?.length > 0 && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminBonusPage;
