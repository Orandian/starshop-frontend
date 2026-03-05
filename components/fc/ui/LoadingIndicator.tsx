import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "md",
  color = "currentColor",
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        className
      )}
      aria-busy="true"
      aria-live="polite"
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeMap[size],
          className
        )}
        style={{ color }}
      />
      <span className="sr-only">Loading...</span>
    </span>
  );
};

export default LoadingIndicator;