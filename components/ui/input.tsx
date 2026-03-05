import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  preventAutoSelect = false,
  onFocus,
  ...props
}: React.ComponentProps<"input"> & { preventAutoSelect?: boolean }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasInteracted = React.useRef(false);

  React.useEffect(() => {
    if (preventAutoSelect && inputRef.current && !hasInteracted.current) {
      // Only run for input types that support text selection
      if (type !== "date" && type !== "time" && type !== "datetime-local") {
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }
  }, [preventAutoSelect, type]);
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (preventAutoSelect && !hasInteracted.current) {
      // Only prevent selection for input types that support it
      if (type !== "date" && type !== "time" && type !== "datetime-local") {
        e.target.setSelectionRange(
          e.target.value.length,
          e.target.value.length
        );
      }
      hasInteracted.current = true;
    }
    onFocus?.(e);
  };
  return (
    <input
      ref={inputRef}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground",
        preventAutoSelect
          ? "selection:bg-transparent select-none"
          : "selection:bg-primary selection:text-primary-foreground",
        "dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      onFocus={handleFocus}
      {...props}
    />
  );
}

export { Input };
