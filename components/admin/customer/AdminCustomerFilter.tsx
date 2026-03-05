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
import { FcUserRole } from "@/utils/fc/fc-user-roles";

interface AdminCustomerFilterProps {
  onFilter: (filters: {
    userType: string;
    bonusType: string;
    searchQuery: string;
  }) => void;
  initialFilters?: {
    userType: string;
    bonusType: string;
    searchQuery: string;
  };
}

const userTypeOptions = [
  { value: "All", label: "すべて" },
  { value: "General", label: "一般顧客" },
  { value: `Type${FcUserRole.MANAGER}`, label: "代理店マネージャー" }, //fc role 1
  { value: `Type${FcUserRole.CONSULTANT}`, label: "代理店コンサルタント" }, //fc role 2
  { value: `Type${FcUserRole.LEADER}`, label: "代理店リーダー" }, //fc role 3
  { value: `Type${FcUserRole.SPECIALIST}`, label: "代理店スペシャリスト" }, //fc role 4
  { value: `Type${FcUserRole.NORMAL}`, label: "代理店メンバー" }, // fc role 5
];

const bonusTypeOptions = [
  { value: "All", label: "すべて" },
  { value: "Type1", label: "募集お祝金" },
  { value: "Type2", label: "管理費" },
];

export const AdminCustomerFilter: React.FC<AdminCustomerFilterProps> = ({
  //period,
  onFilter,
  initialFilters = { userType: "", bonusType: "", searchQuery: "" },
}) => {
  const [filters, setFilters] = React.useState({
    userType: initialFilters.userType,
    bonusType: initialFilters.bonusType,
    searchQuery: initialFilters.searchQuery,
  });

  const handleSubmit = () => {
    onFilter({
      ...filters,
      searchQuery: filters.searchQuery.trim(),
    });
  };

  const handleReset = () => {
    const resetFilters = {
      userType: "",
      bonusType: "",
      searchQuery: "",
    };
    setFilters(resetFilters);
    onFilter(resetFilters); // This will update the parent component's state
  };

  return (
    <div className="content-card bg-white border border-gray-200 rounded-lg p-6 my-4">
      <div className="flex justify-between items-center gap-4 flex-col md:flex-row ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 w-full">
          {/* User Type */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              顧客タイプ
            </label>
            <Select
              value={filters.userType}
              onValueChange={(value) =>
                setFilters({ ...filters, userType: value })
              }
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md">
                {userTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Bonus Type */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ボーナス対象
            </label>
            <Select
              value={filters.bonusType}
              onValueChange={(value) =>
                setFilters({ ...filters, bonusType: value })
              }
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md">
                {bonusTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* 氏名 */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名前・メールアドレス
            </label>
            <Input
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              placeholder="お客様名 / メールを入力"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
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
            className="px-6 w-[80px] bg-primary text-white hover:bg-primary/80 cursor-pointer"
          >
            検索
          </Button>
        </div>
      </div>
    </div>
  );
};
