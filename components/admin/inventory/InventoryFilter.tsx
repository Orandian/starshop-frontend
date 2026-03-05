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

interface InventoryFilterProps {
  onFilter: (filters: {
    brandName: string;
    productName: string;
    safeStockQuantity: string;
    status: string;
  }) => void;
  initialFilters?: {
    brandName: string;
    productName: string;
    safeStockQuantity: string;
    status: string;
  };
}

const statusOptions = [
  { value: "-1", label: "すべて" },
  { value: "1", label: "在庫あり" },
  { value: "0", label: "在庫切れ" },
];

export const InventoryFilter: React.FC<InventoryFilterProps> = ({
  onFilter,
  initialFilters = {
    brandName: "",
    productName: "",
    safeStockQuantity: "",
    status: "-1",
  },
}) => {
  const [filters, setFilters] = React.useState({
    brandName: initialFilters.brandName,
    productName: initialFilters.productName,
    safeStockQuantity: initialFilters.safeStockQuantity,
    status: initialFilters.status,
  });

  const handleSubmit = () => {
    onFilter({
      ...filters,
      brandName: filters.brandName.trim(),
      productName: filters.productName.trim(),
    });
  };

  const handleReset = () => {
    const resetFilters = {
      brandName: "",
      productName: "",
      safeStockQuantity: "",
      status: "-1",
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
      <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 w-full">
          {/* ブランド名 */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ブランド名
            </label>
            <Input
              value={filters.brandName}
              onChange={(e) =>
                setFilters({ ...filters, brandName: e.target.value })
              }
              placeholder="ブランド名を入力"
              className="mt-2 text-sm border border-white-bg rounded-md p-2"
            />
          </div>

          {/* 商品名 */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品名
            </label>
            <Input
              value={filters.productName}
              onChange={(e) =>
                setFilters({ ...filters, productName: e.target.value })
              }
              placeholder="商品名を入力"
              className="mt-2 text-sm border border-white-bg rounded-md p-2"
            />
          </div>

          {/* 安全在庫 */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              安全在庫
            </label>
            <Input
              value={filters.safeStockQuantity}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers
                if (value === "" || /^\d+$/.test(value)) {
                  setFilters({ ...filters, safeStockQuantity: value });
                }
              }}
              placeholder="0"
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

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6 w-20 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            リセット
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-6 w-20 bg-primary text-white hover:bg-primary/80 cursor-pointer"
          >
            検索
          </Button>
        </div>
      </div>
    </div>
  );
};
