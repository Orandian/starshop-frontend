"use client";

import { cn } from "@/lib/utils";

interface TitleTextProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const TitleText = ({ title, subtitle, className }: TitleTextProps) => {
  return (
    <div className={cn("text-center my-8", className)}>
      <h1 className="text-4xl md:text-5xl font-serif tracking-wide font-cormorant flex flex-col uppercase">
        {title}
        {subtitle && (
          <span className="text-base md:text-lg font-noto block mt-1">{subtitle}</span>
        )}
      </h1>
    </div>
  );
};

export default TitleText;
