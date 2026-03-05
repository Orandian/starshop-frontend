// components/fc/order/OrderFilter.tsx
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface OrderFilterProps {
  period: string;
  onFilter: (filters: {
    search: string;
    orderDate: string;
    status: string;
  }) => void;
  initialFilters?: {
    search: string;
    orderDate: string;
    status: string;
  };
  className?: string;
}

const statusOptions = [
  { value: "all", label: "すべて" },
  { value: "1", label: "支払済" },
  { value: "2", label: "配送済" },
  { value: "3", label: "未支払" },
  { value: "4", label: "失敗" },
  { value: "5", label: "キャンセル" },
];

export const OrderFilter: React.FC<OrderFilterProps> = ({
  period,
  onFilter,
  initialFilters = { search: "", orderDate: "", status: "" },
  className,
}) => {
  const [filters, setFilters] = React.useState({
    search: initialFilters.search,
    orderDate: initialFilters.orderDate,
    status: initialFilters.status,
  });

  const handleSubmit = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      orderDate: "",
      status: "",
    };
    setFilters(resetFilters);
    onFilter(resetFilters); // This will update the parent component's state
  };

  return (
    <div className={`content-card bg-white border border-gray-200 rounded-lg p-6 my-4 ${className}`}>
      <div className="flex justify-between items-center gap-4 flex-col md:flex-row ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 w-full">
          {/* 購入日 */}
          {period === "all" && (
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                購入日
              </label>
              <AdminDatePicker
                value={filters.orderDate}
                onChange={(e) => setFilters({ ...filters, orderDate: e })}
                styleName="w-full border border-white-bg bg-white rounded-md"
              />
            </div>
          )}
          {/* 商品名 */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品名
            </label>
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="検索"
              className="mt-2 text-sm border border-white-bg rounded-md p-2"
            />
          </div>

          {/* ステータス */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4  w-full md:w-auto">
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6 w-[80px] border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            リセット
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-6 w-[80px] bg-primary text-white hover:bg-primary/80 cursor-pointer"
          >
            検索
          </Button>
        </div>
      </div>
    </div>
  );
};
