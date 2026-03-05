"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFcApprovedHistory } from "@/hooks/admin/useFc";
import PaginationComponent from "@/components/app/PaginationComponent";
import { FCApprovedHistory } from "@/types/admin/fcUser.type";

const FCApprovalsHistoryPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const size = 10;

  const { data, isLoading } = useGetFcApprovedHistory(page, size);
  const historyData = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCount = data?.pagination?.totalElements || 0;

  const getStatusBadge = (status: string) => {
    if (status === "承認" || status === "1") {
      return (
        <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          承認
        </span>
      );
    } else if (status === "却下" || status === "2") {
      return (
        <span className="px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          却下
        </span>
      );
    }
    return null;
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2 flex items-center gap-3">
            <h2>代理店承認</h2>

            <div className="flex gap-4 items-center">
              <Button
                className="w-28 flex justify-center items-center rounded-full text-sm bg-transparent border border-black text-black hover:bg-black/20"
                onClick={() => router.push("/admin/fc-functions/fc-approvals")}
              >
                承認待ち
              </Button>

              <Button className="w-28 flex justify-center items-center text-white rounded-full text-sm hover:bg-dark bg-black">
                承認履歴
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm my-3 mb-5">{totalCount}件</p>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10 bg-white">
                <TableHead className="px-6 py-4 font-bold text-black text-xs">
                  NO
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs">
                  ユーザー名
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs">
                  申請プラン
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs">
                  申請日
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-right">
                  支払い金額
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs">
                  代理店承認日
                </TableHead>
                <TableHead className="px-6 py-4 font-bold text-black text-xs text-center">
                  ステータス
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={7} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : historyData && historyData.length > 0 ? (
                historyData.map((fc: FCApprovedHistory, index: number) => (
                  <TableRow
                    key={fc.fcApprovedId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-4">
                      {(page - 1) * size + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium">
                      {fc.fcName}
                    </TableCell>
                    <TableCell className="px-6 py-4">{fc.plan}</TableCell>
                    <TableCell className="px-6 py-4">{fc.applyDate}</TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      ¥{fc.totalAmount.toLocaleString("ja-JP")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {fc.approvedDate}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {getStatusBadge(fc.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    承認履歴がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && totalCount > size && (
          <div className="flex justify-end">
            <div className="mt-6">
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FCApprovalsHistoryPage;
