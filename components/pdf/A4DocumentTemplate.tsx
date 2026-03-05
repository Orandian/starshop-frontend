"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface A4DocumentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  mode?: "portrait" | "landscape";
}

/**
 * A4DocumentTemplate - A responsive A4 page layout component for PDF generation
 * Uses standard A4 dimensions: 210mm x 297mm at 96dpi
 */
const A4DocumentTemplate: React.FC<A4DocumentProps> = ({
  children,
  className,
  style,
  mode = "portrait",
}) => {
  // A4 dimensions in pixels at 96dpi
  const a4Width = mode === "portrait" ? 794 : 1123; // 210mm in pixels
  const a4Height = mode === "portrait" ? 1123 : 794; // 297mm in pixels

  return (
    <div
      className={cn(
        "px-8 py-2 bg-white mx-auto w-full border-0 shadow-[0_0_15px_0_rgba(0,0,0,0.1)]",
        className
      )}
      style={{
        maxWidth: a4Width, // A4 width
        minHeight: a4Height, // A4 height
        ...style,
      }}
    >
      <div className="w-full h-full flex flex-col">{children}</div>
    </div>
  );
};

export default A4DocumentTemplate;
