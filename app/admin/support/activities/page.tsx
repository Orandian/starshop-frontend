"use client";
import PaginationComponent from "@/components/app/PaginationComponent";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminActivity } from "@/hooks/admin/useDashboard";
import { formatDate } from "@/utils";
import { useState } from "react";

const ActivitiesPage = () => {
  const [page, setPage] = useState(1);
  const { data: activities, isLoading: isLoadingActivities } = useAdminActivity(
    page,
    10,
  );

  const pagination = activities?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.totalElements || 0;
  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2">
            <h2>アクティビティ</h2>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 mb-5">
          <p className="text-sm">{total ? total : 0}件</p>
        </div>

        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  No
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  タイトル
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  メッセージ
                </TableHead>
                <TableHead className="px-6 py-3 uppercase font-bold text-black text-xs">
                  作成日時
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingActivities ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={4} className="h-10 text-center">
                      <Skeleton className="w-full h-full bg-white-bg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : activities?.data && activities.data.length > 0 ? (
                activities?.data?.map((activity, index) => (
                  <TableRow
                    key={activity.activityId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-3">
                      {(page - 1) * (pagination?.pageSize || 0) + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {activity.title}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {activity.message}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {formatDate(activity.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    アクティビティがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoadingActivities &&
          pagination &&
          totalPages > 0 &&
          total > pagination?.pageSize && (
            <div className="flex justify-end">
              <div>
                <PaginationComponent
                  currentPage={pagination.currentPage}
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

export default ActivitiesPage;
