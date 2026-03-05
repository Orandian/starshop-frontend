"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const PublicHeaderLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || pathname.startsWith(`${href}/`); 
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "group inline-flex h-[84px] w-max items-center justify-center rounded-md px-4 md:px-2 lg:px-6 text-sm font-semibold transition-colors uppercase tracking-wide text-[#786464]",
        className
      )}
    >
      <span
        className={cn(
          "transition-all border-b-2",
          isActive
            ? "border-[#666666]"
            : "border-transparent group-hover:border-[#666666]"
        )}
      >
        {children}
      </span>
    </Link>
  );
};

export default PublicHeaderLink;
