import Logo from "@/public/icons/logo.png";
import {
  Activity,
  BadgePercent,
  Blocks,
  Book,
  Boxes,
  BanknoteArrowUp,
  Contact,
  FileQuestion,
  FileSliders,
  Headset,
  Inbox,
  // Box,
  LayoutDashboard,
  Mails,
  Megaphone,
  MonitorCog,
  Plus,
  ReceiptText,
  Settings,
  Truck,
  User,
  UserCog2,
  UserSquare,
  Users,
  WalletCards
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BitCoinIcon, CirclePileIcon, PLetterIcon } from "@/public/admin/icons";
import Link from "next/link";

type MenuItem = {
  title: string;
  id: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: MenuItem[];
  isSubItem?: boolean;
};

// Menu items.
const items: MenuItem[] = [
  {
    title: "ダッシュボード",
    id: "dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "注文管理",
    id: "orders",
    url: "/admin/orders",
    icon: Inbox,
    subItems: [
      {
        title: "注文一覧",
        id: "all-orders",
        url: "/admin/orders",
        icon: Inbox,
        isSubItem: true,
      },
      // {
      //   title: "返品・交換",
      //   id: "return-orders",
      //   url: "/admin/orders/returns",
      //   icon: RotateCcw,
      // },
      {
        title: "請求書・領収書管理",
        id: "invoice-management",
        url: "/admin/orders/invoices",
        icon: ReceiptText,
      },
    ],
  },
  {
    title: "顧客管理",
    id: "customers",
    url: "/admin/customers",
    icon: User,
    subItems: [
      {
        title: "顧客一覧",
        id: "customer-list",
        url: "/admin/customers",
        icon: Users,
        isSubItem: true,
      },
      {
        title: "代理店管理",
        id: "fc-customers",
        url: "/admin/customers/fc-manage",
        icon: UserCog2,
        isSubItem: true,
      },
      {
        title: "ボーナス管理",
        id: "bonus-management",
        url: "/admin/customers/bonus",
        icon: BitCoinIcon,
        isSubItem: true,
      },
      {
        title: "代理店組織図",
        id: "fc-organization",
        url: "/admin/customers/fc-organization",
        icon: CirclePileIcon,
        isSubItem: true,
      },
    ],
  },
  {
    title: "商品管理",
    id: "products",
    url: "/admin/products",
    icon: PLetterIcon,
    subItems: [
      {
        title: "商品一覧",
        id: "product-list",
        url: "/admin/products",
        icon: PLetterIcon,
        isSubItem: true,
      },
      {
        title: "在庫管理",
        id: "inventory-management",
        url: "/admin/products/inventory",
        icon: Boxes,
        isSubItem: true,
      },
      {
        title: "収益管理",
        id: "profit-management",
        url: "/admin/products/profit",
        icon: BanknoteArrowUp,
        isSubItem: true,
      },
      {
        title: "カテゴリ管理",
        id: "category-management",
        url: "/admin/products/categories",
        icon: Blocks,
      },
      // {
      //   title: "レビュー管理",
      //   id: "review-management",
      //   url: "/admin/products/reviews",
      //   icon: Star,
      // },
    ],
  },
  {
    title: "代理店機能",
    id: "fc-functions",
    url: "/admin/fc-functions",
    icon: UserSquare,
    subItems: [
      {
        title: "代理店ダッシュボード",
        id: "fc-dashboard",
        url: "/admin/fc-functions/dashboard",
        icon: LayoutDashboard,
        isSubItem: true,
      },
      // {
      //   title: "FC活動報告",
      //   id: "fc-activity-reports",
      //   url: "/admin/fc-functions/activity",
      //   icon: SquareActivity,
      // },
      {
        title: "代理店作成",
        id: "fc-create",
        url: "/admin/fc-functions/fc-create",
        icon: Plus,
        isSubItem: true,
      },
      {
        title: "代理店設定",
        id: "fc-plans",
        url: "/admin/fc-functions/fc-plans",
        icon: Settings,
        isSubItem: true,
      },

      {
        title: "推奨セット設定",
        id: "fc-default-products",
        url: "/admin/fc-functions/fc-default-products",
        icon: ReceiptText,
        isSubItem: true,
      },
      {
        title: "代理店承認",
        id: "fc-approvals",
        url: "/admin/fc-functions/fc-approvals",
        icon: UserCog2,
        isSubItem: true,
      },
    ],
  },
  // {
  //   title: "レポート",
  //   id: "reports",
  //   url: "/admin/reports",
  //   icon: FileChartPie,
  //   subItems: [
  //     {
  //       title: "売上分析",
  //       id: "sales-analysis",
  //       url: "/admin/reports/sales",
  //       icon: TrendingUp,
  //     },
  //     {
  //       title: "顧客分析",
  //       id: "customer-analysis",
  //       url: "/admin/reports/customers",
  //       icon: UserCheck,
  //     },
  //     {
  //       title: "ボーナス分析",
  //       id: "bonus-analysis",
  //       url: "/admin/reports/bonus",
  //       icon: ChartNoAxesCombined,
  //     },
  //     {
  //       title: "商品分析",
  //       id: "product-analysis",
  //       url: "/admin/reports/product",
  //       icon: PackageSearch,
  //     },
  //     {
  //       title: "FC分析",
  //       id: "fc-analysis",
  //       url: "/admin/reports/fc",
  //       icon: UserRoundSearch,
  //     },
  //   ],
  // },
  {
    title: "販売促進",
    id: "promotion",
    url: "/admin/promotion",
    icon: BadgePercent,
    subItems: [
      // {
      //   title: "メール配信",
      //   id: "email-delivery",
      //   url: "/admin/promotion/email-delivery",
      //   icon: MailCheck,
      // },
      {
        title: "ニュース管理",
        id: "news",
        url: "/admin/promotion/news",
        icon: Megaphone,
        isSubItem: true,
      },
    ],
  },
  {
    title: "システム設定",
    id: "system-settings",
    url: "/admin/settings",
    icon: MonitorCog,
    subItems: [
      {
        title: "管理者権限",
        id: "admin-permissions",
        url: "/admin/settings/admin-permissions",
        icon: FileSliders,
        isSubItem: true,
      },
      {
        title: "配送設定",
        id: "shipping-settings",
        url: "/admin/settings/shipping",
        icon: Truck,
        isSubItem: true,
      },
      {
        title: "メール設定",
        id: "email-settings",
        url: "/admin/settings/email",
        icon: Mails,
        isSubItem: true,
      },
      {
        title: "ブランド設定",
        id: "brand-settings",
        url: "/admin/settings/brands",
        icon: WalletCards,
        isSubItem: true,
      },
    ],
  },
  {
    title: "サポート",
    id: "support",
    url: "/admin/support",
    icon: Headset,
    subItems: [
      {
        title: "お問い合わせ",
        id: "contact",
        url: "/admin/support/contacts",
        icon: Contact,
        isSubItem: true,
      },
      {
        title: "FAQ管理",
        id: "faq-management",
        url: "/admin/support/faqs",
        icon: FileQuestion,
        isSubItem: true,
      },
      {
        title: "ドキュメント",
        id: "documents",
        url: "/admin/support/documents",
        icon: Book,
        isSubItem: true,
      },
      {
        title: "アクティビティ",
        id: "activity",
        url: "/admin/support/activities",
        icon: Activity,
        isSubItem: true,
      },
    ],
  },

  // {
  //   title: "書類",
  //   id: "documents",
  //   url: "/admin/documents",
  //   icon: DocsIcon,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  /**
   * Check if a menu item is active based on the current pathname
   */
  const isItemActive = (item: MenuItem): boolean => {
    // Exactly on this item's URL
    if (pathname === item.url) {
      return true;
    }

    if (item.isSubItem) {
      // Get all subItem URLs
      const allSubItemUrls = items.flatMap(
        (parent) => parent.subItems?.map((sub) => sub.url) || [],
      );

      // Find the subItem URL that best matches the current path
      let bestMatchUrl = "";
      let bestMatchLength = 0;

      allSubItemUrls.forEach((subItemUrl) => {
        if (pathname.startsWith(subItemUrl + "/") || pathname === subItemUrl) {
          const matchLength = subItemUrl.length;
          if (matchLength > bestMatchLength) {
            bestMatchLength = matchLength;
            bestMatchUrl = subItemUrl;
          }
        }
      });

      // If the best match is the current item, it's active
      // If the best match is another subItem, it's not active
      return bestMatchUrl === item.url;
    }

    // For parent items: check if current path starts with their URL
    return pathname.startsWith(item.url + "/");
  };

  /**
   * Renders a menu item with optional sub-items and proper active state handling.
   * @param item The menu item to render
   * @param pathname The current route path
   * @param level The nesting level (0 for top-level, 1+ for sub-items)
   * @returns JSX element for the menu item
   * @author Ayena Di Kyaw
   */
  const renderMenuItem = (item: MenuItem, pathname: string, level = 0) => {
    const hasChildren = item.subItems && item.subItems.length > 0;
    const isActive = isItemActive(item);
    const isExpanded = expandedItems[item.id] ?? false;

    const toggleExpand = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      setExpandedItems((prev) => {
        // If the clicked item is already expanded, collapse it
        if (prev[id]) {
          return { ...prev, [id]: false };
        }
        // Otherwise, close all items and open the clicked one
        return { [id]: true };
      });
    };
    return (
      <div key={item.id} className="mb-3">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className={cn(
              "px-3 py-3 group relative h-10",
              isActive &&
                "bg-black rounded-[7px] text-white hover:bg-black/80 hover:text-white",
              level > 0 && "pl-8", // Add indentation for subitems
            )}
          >
            <Link
              href={item.url}
              onClick={(e) => {
                if (hasChildren) {
                  toggleExpand(e, item.id);
                } else {
                  setOpenMobile(false);
                }
              }}
            >
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
          {hasChildren && isExpanded && (
            <ul className="ml-2 mt-2 list-none">
              {item.subItems?.map((subItem) =>
                renderMenuItem(subItem, pathname, level + 1),
              )}
            </ul>
          )}
        </SidebarMenuItem>
      </div>
    );
  };

  return (
    <Sidebar>
      {/* Sticky Sidebar Header */}
      <SidebarHeader className="top-0 z-10 flex items-center justify-between px-4 py-3">
        <div className="relative w-[120px] h-[120px] flex items-center gap-5 p-5">
          <Image
            src={Logo.src}
            alt="Logo"
            width={160}
            height={160}
            priority={true}
            style={{ objectFit: "contain", width: "auto", height: "auto" }}
          />
        </div>
      </SidebarHeader>
      <div className="border-b mx-4 mb-5 border-black/10"></div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {items.map((item) => renderMenuItem(item, pathname))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
