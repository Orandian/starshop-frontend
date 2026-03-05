import Link from "next/link";
import { cn } from "@/lib/utils";

const PublicFooterIconLink = ({
    href,
    children,
    className,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) => {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "text-white-bg tracking-wider uppercase text-base p-3 rounded-full bg-[#786464]",
        className
      )}
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default PublicFooterIconLink