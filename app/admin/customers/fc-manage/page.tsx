"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetFcWithPlanInfo } from "@/hooks/admin/useFc";
import { formatDate2, convertToYen, encryptString } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PaginationComponent from "@/components/app/PaginationComponent";

const FcManagePage = () => {
  const router = useRouter();
  const [pageSize] = useState(10); // Page size
  const [page, setPage] = useState(1); // Page

  const { data: fcData, isLoading } = useGetFcWithPlanInfo(page, pageSize);

  const pagination = fcData?.pagination;
  const total = pagination?.totalElements || 0; // Total
  const totalPages = Math.ceil(total / pageSize); // Total pages

  const getStatusStyle = (status: number) => {
    if (status === 2) {
      //2 is gold plan
      return "bg-yellow-100 text-yellow-700 font-bold";
    } else if (status === 1) {
      //1 is silver plan (standard)
      return "bg-gray-100 text-gray-700 font-bold";
    }
    return "bg-blue-50 text-blue-700";
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h2>代理店管理</h2>
          </div>
        </div>

        {/* Count */}
        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm mb-5">{total}件</p>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10 bg-white">
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  No
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  氏名
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  現在ステータス
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  契約開始日
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center whitespace-nowrap">
                  ランクアップ満了日
                  <br />
                  (3ヶ月)
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-right whitespace-nowrap">
                  累計購入額
                  <br />
                  (円)
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-right whitespace-nowrap">
                  目標額
                  <br />
                  (300,000円)
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-right">
                  残額
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  最終購入日
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  目標達成月
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center whitespace-nowrap">
                  ゴールドプラン
                  <br />
                  開始月
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs text-center">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                fcData?.data &&
                fcData?.data?.length > 0 &&
                fcData.data.map((fc, index) => (
                  <TableRow
                    key={fc.userId}
                    className="border-b border-black/10 hover:bg-black/2 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/admin/customers/${encryptString(fc.userId.toString())}`,
                      )
                    }
                  >
                    <TableCell className="px-6 py-3 text-center">
                      {pagination?.currentPage && pagination?.pageSize
                        ? (pagination.currentPage - 1) * pagination.pageSize +
                          index +
                          1
                        : index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-3 font-medium">
                      {fc.userName}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-md  font-medium ${getStatusStyle(
                          fc.currentPlanId,
                        )}`}
                      >
                        {fc.currentPlan}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {formatDate2(fc.contractStartDate)}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {fc.role === 5
                        ? formatDate2(fc.rankUpExpirationDate)
                        : "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right">
                      {convertToYen(fc.totalPurchaseAmount)}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right">
                      {fc.currentPlanId === 1
                        ? convertToYen(fc.targetAmount)
                        : "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right font-medium">
                      {fc.remainingBalance > 0 || fc.currentPlanId === 1
                        ? convertToYen(fc.remainingBalance)
                        : "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {fc.lastPurchaseDate || fc.role === 5
                        ? formatDate2(fc.lastPurchaseDate)
                        : "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {fc.targetAchievementMonth || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      {fc.goldPlanStartMonth || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                        onClick={() =>
                          router.push(
                            `/admin/customers/${encryptString(fc.userId.toString())}`,
                          )
                        }
                      >
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={12} className="text-center">
                      <Skeleton className="h-12 w-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && fcData?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="h-24 text-center">
                    FCデータがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading &&
          fcData &&
          fcData?.data?.length > 0 &&
          fcData?.pagination?.totalElements &&
          fcData?.pagination?.totalElements > pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default FcManagePage;
