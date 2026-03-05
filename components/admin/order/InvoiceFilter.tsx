import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InvoiceFilterProps {
  onFilter: (filters: {
    orderId: string;
    userName: string;
    orderDate: string;
    invoiceStatus: string;
  }) => void;
  initialFilters?: {
    orderId: string;
    userName: string;
    orderDate: string;
    invoiceStatus: string;
  };
}

const statusOptions = [
  { value: "-1", label: "すべて" },
  { value: "1", label: "支払済み" },
  { value: "2", label: "未払い" },
];

export const InvoiceFilter: React.FC<InvoiceFilterProps> = ({
  onFilter,
  initialFilters = {
    orderId: "",
    userName: "",
    orderDate: "",
    invoiceStatus: "",
  },
}) => {
  const [filters, setFilters] = React.useState({
    orderId: initialFilters.orderId,
    userName: initialFilters.userName,
    orderDate: initialFilters.orderDate,
    invoiceStatus: initialFilters.invoiceStatus,
  });
  const [isOrderIdValid, setIsOrderIdValid] = useState(true);

  const handleSubmit = () => {
    onFilter({
      ...filters,
      userName: filters.userName.trim(),
    });
  };

  const handleReset = () => {
    const resetFilters = {
      orderId: "",
      userName: "",
      orderDate: "",
      invoiceStatus: "",
    };
    setFilters(resetFilters);
    onFilter(resetFilters); // This will update the parent component's state
    setIsOrderIdValid(true);
  };

  return (
    <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
      <div className="flex justify-between items-center gap-4 flex-col md:flex-row ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 w-full">
          {/* 注文ID */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              注文ID
            </label>
            <Input
              value={filters.orderId}
              onChange={(e) => {
                let value = e.target.value;

                // Remove any non-digit characters
                value = value.replace(/[^\d-]/g, "");

                // Handle hyphen - only allow one and only after at least one digit
                const parts = value.split("-");
                if (parts.length > 2) {
                  // If more than one hyphen, keep only the first one
                  value = parts[0] + "-" + parts.slice(1).join("");
                }

                // Don't allow hyphen at the start
                if (value.startsWith("-")) {
                  value = value.substring(1);
                }

                setFilters({ ...filters, orderId: value });
              }}
              onBlur={(e) => {
                const value = e.target.value;
                // Allow only digits and one hyphen
                const isValidFormat = /^\d{8}-\d{1,}$/.test(value);

                if (!isValidFormat && value !== "") {
                  toast.error("正しい形式で入力してください, 例: 20261201-200");
                  setIsOrderIdValid(false);
                  return;
                }

                if (value !== "") {
                  // Split into parts and validate
                  const [firstPart, secondPart] = value.split("-");
                  if (firstPart.length !== 8 || secondPart.length === 0) {
                    toast.error(
                      "正しい形式で入力してください, 例: 20261201-200"
                    );
                    setIsOrderIdValid(false);
                    return;
                  }
                }
                setIsOrderIdValid(true);
              }}
              placeholder="20261201-200"
              className={cn(
                "mt-2 text-sm border border-white-bg rounded-md p-2",
                !isOrderIdValid && "border-red-500"
              )}
            />
          </div>
          {/* 氏名 */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              氏名
            </label>
            <Input
              value={filters.userName}
              onChange={(e) =>
                setFilters({ ...filters, userName: e.target.value })
              }
              placeholder="山田"
              className="mt-2 text-sm border border-white-bg rounded-md p-2"
            />
          </div>
          {/* 購入日 */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              購入日
            </label>
            <AdminDatePicker
              value={filters.orderDate}
              onChange={(value) => setFilters({ ...filters, orderDate: value })}
              styleName="w-full border border-white-bg bg-white rounded-md"
            />
          </div>
          {/* ステータス */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <Select
              value={filters.invoiceStatus}
              onValueChange={(value) =>
                setFilters({ ...filters, invoiceStatus: value })
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
            className="px-6 w-[80px] border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            リセット
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isOrderIdValid}
            className="px-6 w-[80px] bg-primary text-white hover:bg-primary/80 cursor-pointer"
          >
            検索
          </Button>
        </div>
      </div>
    </div>
  );
};
