import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { forwardRef } from "react";

interface CustomCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CustomCheckbox = forwardRef<HTMLButtonElement, CustomCheckboxProps>(
  ({ checked = false, onChange, disabled = false, className, children }, ref) => {
    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg transition-all",
           checked
            ? "bg-primary text-primary-foreground"
            : "bg-background  hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          "cursor-pointer",
          className
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded  flex items-center justify-center transition-all",
            checked
              ? "bg-primary-foreground border-primary-foreground bg-white"
              : "border border-black"
          )}
        >
          {checked && <Check className="w-3 h-3 text-black" />}
        </div>
        {children}
      </button>
    );
  }
);

CustomCheckbox.displayName = "CustomCheckbox";

export default CustomCheckbox;
