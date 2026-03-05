"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoHolderProps {
    className?: string;
}

const LogoHolder = ({ className }: LogoHolderProps) => {
  return (
    <h1 className="font-cormorant text-2xl md:text-3xl tracking-wider font-bold text-[#786464]">
      <Link href="/" className={cn("flex", className)} prefetch={false}>
        Star Shop
      </Link>
    </h1>
  );
};

export default LogoHolder;
