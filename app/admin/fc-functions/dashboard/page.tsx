"use client";

import DashboardCardComponent from "@/components/admin/DashboardCardComponent";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFcUsers,
  useFcDashboardData,
  useFcDashboardPeriodList,
} from "@/hooks/admin/useFc";
import { userType } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

const FcDashboardPage = () => {
  const [period, setPeriod] = useState("all");

  const { data: fcUsers, isLoading: fcUsersLoading } = useFcUsers(period);
  const { data: dashboardData } = useFcDashboardData(period);
  const { data: periodList } = useFcDashboardPeriodList();
  return (
    <section className="w-full">
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between">
          <div className="flex items-center gap-10">
            <h2>代理店ダッシュボード</h2>
          </div>
        </div>
        {/* Filter & Search */}
        {/* All and Month Filter */}
        <div className="w-full   bg-white h-auto">
          <div className="flex gap-4  items-center">
            <Button
              className={`w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark ${period === "all" ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}
              onClick={() => setPeriod("all")}
            >
              All
            </Button>
            {periodList?.map((p, index) => (
              <Button
                key={`period-${index}`}
                className={`w-28  flex justify-center items-center  text-white rounded-full text-sm hover:bg-dark ${period === p.period ? "bg-black text-white hover:bg-black" : "bg-transparent border border-black text-black hover:bg-black/20"}`}
                onClick={() => setPeriod(p.period)}
              >
                {p.period}
              </Button>
            ))}
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 justify-between mb-6">
          <DashboardCardComponent
            value={dashboardData?.totalFcUsers || 0}
            description="代理店数"
          />
          <DashboardCardComponent
            value={dashboardData?.totalSales || 0}
            description="売上"
            isCurrency
          />
          <DashboardCardComponent
            value={dashboardData?.totalBonus || 0}
            description="ボーナス"
            isCurrency
          />
        </div>

        {/* FC Sales Ranking Table */}

        <div className="rounded-[10px] overflow-hidden border border-black/10 ">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-20">
                  順位
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-30">
                  FC名
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider min-w-35">
                  代理店階層
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-30">
                  自身売上額
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider min-w-35">
                  紹介メンバー数
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-38">
                  チーム全体売上額
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-30">
                  募集お祝金
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider min-w-25">
                  管理金
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fcUsers?.map((fc, index) => (
                <TableRow
                  key={fc.fcId}
                  className="border-b border-black/10 hover:bg-black/2"
                >
                  <TableCell className="px-6 py-3 text-sm text-gray-900">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm font-medium text-gray-900">
                    {fc.username}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {userType(fc.role)}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-right text-gray-900">
                    ¥{fc.totalBuyingAmount?.toLocaleString("ja-JP")}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-center text-gray-900">
                    {fc?.underMember}名
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-right text-gray-900">
                    ¥{fc?.teamBuyingAmount?.toLocaleString("ja-JP")}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-right text-gray-900">
                    ¥{fc.memberFeeAmount.toLocaleString("ja-JP")}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm text-right text-gray-900">
                    ¥{fc.adminFeeAmount.toLocaleString("ja-JP")}
                  </TableCell>
                </TableRow>
              ))}
              {fcUsers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    データがありません
                  </TableCell>
                </TableRow>
              )}
              {fcUsersLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={8} className="h-12 text-center">
                      <Skeleton className="h-12 w-full bg-white-bg rounded-[10px]" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default FcDashboardPage;
