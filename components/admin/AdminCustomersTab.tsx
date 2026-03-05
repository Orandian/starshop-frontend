"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabItem {
  label: string;
  value: string;
  count: number;
}

const tabs: TabItem[] = [
  {
    label: "All",
    value: "",
    count: 0,
  },
  {
    label: "一般",
    value: "3",
    count: 0,
  },
  {
    label: "代理店",
    value: "2",
    count: 0,
  },
];

const AdminCustomersTab = ({
  onUserTypeChange,
  allCount,
  fcCount,
  generalCount,
  currentUserType,
}: {
  onUserTypeChange: (userType: string) => void;
  allCount: number;
  fcCount: number;
  generalCount: number;
  currentUserType: string;
}) => {
  tabs[0].count = allCount;
  tabs[1].count = generalCount;
  tabs[2].count = fcCount;
  return (
    <div className="flex items-center gap-3">
      {tabs.map((tab) => {
        const isActive =
          tab.value === ""
            ? !currentUserType || currentUserType === ""
            : currentUserType === tab.value;
        return (
          <Button
            key={tab.label}
            onClick={() => {
              onUserTypeChange(tab.value);
            }}
            className={cn(
              "flex justify-between items-center gap-2 px-2 py-1 rounded-full text-sm font-medium transition-colors",
              isActive
                ? "bg-black text-white"
                : "bg-gray-400 text-white hover:bg-gray-300"
            )}
          >
            <span className="mx-2">{tab.label}</span>
            <span className="ml-2 text-xs rounded-full py-1 px-2 font-medium text-black bg-gray-200">
              {tab.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default AdminCustomersTab;
