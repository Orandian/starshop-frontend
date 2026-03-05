"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface TabItem {
  label: string;
  href: string;
  hide: boolean;
}

const DetailCustomerHeader = ({ slug }: { slug: string }) => {
  const tabs: TabItem[] = [
    {
      label: "基本情報",
      href: `/admin/customers/${slug}`,
      hide: false,
    },
    {
      label: "注文履歴",
      href: `/admin/customers/${slug}/order`,
      hide: false,
    },
  ];
  const pathname = usePathname();

  return (
    <div className="w-full flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        {tabs.map((tab) => {
          const isActive = tab.href.includes("/team/")
            ? pathname.startsWith(`/admin/customers/${slug}/team`)
            : pathname === tab.href;
          return (
            !tab.hide && (
              <Link
                key={tab.label}
                href={tab.href}
                className={cn(
                  "w-28 flex justify-center items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-black text-white hover:bg-black"
                    : "bg-transparent border border-black text-black hover:bg-black/20",
                )}
              >
                {tab.label}
              </Link>
            )
          );
        })}
      </div>
    </div>
  );
};

export default DetailCustomerHeader;
