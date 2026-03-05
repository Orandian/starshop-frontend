"use client";

import PaginationComponent from "@/components/app/PaginationComponent";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAdminProfilePeriod,
  useGetAdminProfit,
} from "@/hooks/admin/useProduct";
import { MemberBonusProduct } from "@/types/dashboard/products";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductProfitPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    yearMonth: "",
  });

  const pageSize = 10;

  const { data: profitTimePeriod } = useGetAdminProfilePeriod();
  const { data: profitData, isLoading: profitDataLoading } = useGetAdminProfit(
    page,
    pageSize,
    {
      yearMonth: filters.yearMonth.replace("-", ""),
    }
  );
  const total = profitData?.pagination?.totalElements || 0;
  const totalPages = Math.ceil(total / pageSize);

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const periodList = profitTimePeriod?.data
    ? [
        "All",
        ...(profitTimePeriod.data.map((yearMonth) => {
          if (yearMonth && yearMonth.length === 6) {
            const year = yearMonth.slice(0, 4);
            const month = yearMonth.slice(4, 6);
            return `${year}-${month}`;
          }
          return yearMonth;
        }) || []),
      ]
    : ["All"];

  /***** helper functions ******/
  const calTotalSales = (item: MemberBonusProduct) => {
    return item.averageSalePrice * item.totalSaleCount || 0;
  };

  const calTotalCost = (item: MemberBonusProduct) => {
    return item.averageBuyPrice * item.totalSaleCount || 0;
  };

  const calProfit = (item: MemberBonusProduct) => {
    const totalCost = calTotalCost(item);
    if (totalCost === 0) return 0;
    else return calTotalSales(item) - (calTotalCost(item) + item.totalBonus);
  };

  const calProfitMargin = (item: MemberBonusProduct) => {
    return (calProfit(item) / calTotalSales(item)) * 100 || 0;
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left pt-2">
            <h2>商品別利益管理</h2>
          </div>
        </div>

        {/* Period Filter */}
        <div className="w-full bg-white h-auto">
          <div className="flex gap-4 items-center">
            {periodList.map((dateString: string) => (
              <Button
                key={dateString}
                className={`w-28 flex justify-center items-center text-white rounded-full text-sm hover:bg-dark ${
                  (dateString === "All" && !filters.yearMonth) ||
                  filters.yearMonth === dateString
                    ? "bg-black text-white hover:bg-black"
                    : "bg-transparent border border-black text-black hover:bg-black/20"
                }`}
                onClick={() => {
                  setFilters({
                    ...filters,
                    yearMonth: dateString === "All" ? "" : dateString,
                  });
                  // setPage(1);
                }}
              >
                {dateString} {/* Or format this date as needed */}
              </Button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="flex justify-between items-center gap-2 mb-1">
          <p className="text-sm my-3 mb-5">{total}件</p>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden border border-black/10">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="border-b border-black/10 bg-white">
                <TableHead className="w-12 px-6 py-3 font-bold text-black text-xs text-center uppercase">
                  No
                </TableHead>
                <TableHead className="w-32 px-6 py-3 font-bold text-black text-xs uppercase">
                  ブランド名
                </TableHead>
                <TableHead className="w-40 px-6 py-3 font-bold text-black text-xs uppercase">
                  商品名
                </TableHead>
                <TableHead className="w-20 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  販売数
                </TableHead>
                <TableHead className="w-24 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  平均単価
                </TableHead>
                <TableHead className="w-24 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  平均原価
                </TableHead>
                <TableHead className="w-28 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  総売上
                </TableHead>
                <TableHead className="w-28 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  総原価
                </TableHead>
                <TableHead className="w-24 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  ボナス
                </TableHead>
                <TableHead className="w-28 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  利益
                </TableHead>
                <TableHead className="w-24 px-6 py-3 font-bold text-black text-xs text-right uppercase">
                  利益率
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!profitDataLoading &&
                profitData?.data?.map((item, index) => (
                  <TableRow
                    key={item.productId}
                    className="border-b border-black/10 hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-3 text-center">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-3 truncate">
                      {item?.brandName || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 truncate">
                      {item?.productName}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right">
                      {item?.totalSaleCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right">
                      {formatCurrency(item.averageSalePrice)}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right">
                      {formatCurrency(item.averageBuyPrice)}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right font-medium">
                      {formatCurrency(calTotalSales(item))}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right font-medium">
                      {formatCurrency(calTotalCost(item))}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right font-medium">
                      {formatCurrency(item.totalBonus || 0)}
                    </TableCell>
                    <TableCell
                      className={`px-6 py-3 text-right font-bold ${
                        calProfit(item) >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(calProfit(item))}
                    </TableCell>
                    <TableCell
                      className={`px-6 py-3 text-right font-bold ${
                        calProfitMargin(item) >= 30
                          ? "text-green-600"
                          : calProfitMargin(item) >= 15
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {formatPercentage(calProfitMargin(item))}
                    </TableCell>
                  </TableRow>
                ))}
              {/* skeleton and no record section */}
              {profitData?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    利益データがありません
                  </TableCell>
                </TableRow>
              )}
              {profitDataLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="border-b border-black/10">
                    <TableCell colSpan={11} className="h-12 text-center">
                      <Skeleton className="h-12 w-full bg-white-bg rounded-[10px]" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && total && total > pageSize && (
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

export default ProductProfitPage;
