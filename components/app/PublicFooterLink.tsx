import Link from "next/link";
import { cn } from "@/lib/utils";

const PublicFooterLink = ({
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
        "tracking-wider uppercase text-xs md:text-sm",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default PublicFooterLink;
