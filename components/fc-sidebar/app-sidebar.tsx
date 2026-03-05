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
import {
  BitCoinIcon,
  BoxIcon,
  CircleIcon,
  DocsIcon,
  PersonIcon,
  StatusIcon,
  TreeIcon,
} from "@/public/fc/icons";
import Logo from "@/public/icons/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Line from "@/public/fc/line.jpg";
import ImageComponent from "../fc/ImageComponent";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";

// Menu items.
const items = [
  {
    title: "マイページ",
    id: "mypage",
    url: "/fc/mypage",
    icon: PersonIcon,
  },
  {
    title: "商品購入",
    id: "purchase",
    url: "/fc/purchase",
    icon: BoxIcon,
  },
  {
    title: "私のステータス",
    id: "mystatus",
    url: "/fc/mystatus",
    icon: StatusIcon,
  },
  {
    title: "私の注文",
    id: "myorder",
    url: "/fc/myorder",
    icon: CircleIcon,
  },
  {
    title: "私のチーム",
    id: "myteam",
    url: "/fc/myteam/graph",
    icon: TreeIcon,
  },
  {
    title: "私のボーナス",
    id: "bonus",
    url: "/fc/bonus",
    icon: BitCoinIcon,
  },
  {
    title: "書類",
    id: "documents",
    url: "/fc/document",
    icon: DocsIcon,
  },
  // {
  //   title: "商品紹介",
  //   id: "introduction",
  //   url: "/fc/introduction",
  //   icon: PLetterIcon,
  // },
];

const accessCheckRoute = ["mystatus", "documents"];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { userDetail } = useFullUserDetail();

  const filteredItems = items.filter(
    (item) =>
      !(accessCheckRoute.includes(item.id) && userDetail?.data?.role === 1),
  );

  return (
    <Sidebar>
      {/* Sticky Sidebar Header */}
      <SidebarHeader className="top-0 z-10 flex items-center justify-between px-4 py-3">
        <div className="relative w-[120px] h-[120px] flex items-center gap-5 p-5">
          <ImageComponent
            imgURL={Logo.src}
            imgName="Logo"
            width={160}
            height={160}
            className="object-contain w-auto h-auto"
          />
        </div>
      </SidebarHeader>
      <div className="border-b mx-4 mb-5 border-black/10"></div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.id} className="mb-3">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "px-3 py-5",
                      (pathname.includes(item.url) || 
                       (item.id === "myteam" && pathname.includes("/fc/myteam")) ||
                       (item.id === "myorder" && pathname.includes("/fc/myorder")))
                        ? "bg-black rounded-[7px] text-white hover:bg-black/80 hover:text-white"
                        : "",
                    )}
                  >
                    <Link
                      href={item.url}
                      onClick={() => setOpenMobile(false)}
                      className="flex items-center gap-2"
                    >
                      <item.icon
                        className={
                          (pathname.includes(item.url) || 
                           (item.id === "myteam" && pathname.includes("/fc/myteam")) ||
                           (item.id === "myorder" && pathname.includes("/fc/myorder")))
                            ? "text-white" 
                            : ""
                        }
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className=" flex justify-center px-4">
          <Link
            href={"https://lin.ee/tgFsxgK"}
            target="_blank"
            className="flex items-center gap-2"
          >
            <ImageComponent
              imgURL={Line.src}
              imgName="line"
              width={180}
              height={180}
            />
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
