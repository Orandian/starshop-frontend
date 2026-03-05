import Link from "next/link";
import React from "react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, children, className }) => {
  return (
    <Link
      href={href}
      className={`relative inline-block border-b border-[#5f4d4d] text-[#5f4d4d] transition-all duration-300 after:absolute after:block after:bottom-1 after:right-[-2px] after:w-4 after:h-[1px] after:rotate-45 after:bg-[#5f4d4d] pr-8 pb-1 text-sm md:text-xs font-medium font-noto ${className ?? ""}`}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
