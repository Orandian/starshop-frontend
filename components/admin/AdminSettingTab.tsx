"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Newspaper, BookmarkCheck, BadgePercent, Crown } from "lucide-react";
import React from "react";
interface TabItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    label: "ニュース",
    href: "/admin/settings/news",
    icon: <Newspaper />,
  },
  {
    label: "FAQ",
    href: "/admin/settings/faqs",
    icon: <BookmarkCheck />,
  },
  {
    label: "ブランド",
    href: "/admin/settings/brands",
    icon: <BadgePercent />,
  },
  {
    label: "FCプラン",
    href: "/admin/settings/fc-plans",
    icon: <Crown />,
  },
];

const AdminSettingTab = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3 mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex justify-between items-center gap-2 px-2 py-1 rounded-full text-sm font-medium transition-colors",
              isActive
                ? "bg-black text-white"
                : "bg-[#9F9F9F] text-white hover:bg-gray-300"
            )}
          >
            <span className="text-center mx-2"> {tab.label}</span>
            <span className={cn("rounded-full p-1 bg-white")}>
              {React.cloneElement(tab.icon as React.ReactElement, {
                className: cn(
                  "w-4 h-4",
                  isActive ? "text-black" : "text-[#9F9F9F]",
                  tab.label === "FCプラン"
                    ? isActive
                      ? "fill-black"
                      : "fill-[#9F9F9F]"
                    : ""
                ),
              })}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSettingTab;
