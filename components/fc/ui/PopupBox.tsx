import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "./LoadingIndicator";
import { cn } from "@/lib/utils";

interface PopupBoxProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const PopupBox: React.FC<PopupBoxProps> = ({
  isOpen,
  onClose,
  onConfirm,
  confirmButtonText = "閉じる",
  cancelButtonText = "キャンセル",
  showCancelButton = false,
  showConfirmButton = true,
  children,
  isLoading = false,
  disabled = false,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-screen z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "w-full mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 ", // Responsive horizontal padding
          "max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[20vw]", // Responsive max width
          "rounded-lg bg-white shadow-lg p-4 sm:p-6 md:p-8 lg:p-5 relative", // Responsive padding
          className
        )}
      >
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 absolute top-4 right-4 cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="  p-6 h-full">
          <div className="text-sm text-gray-700">{children}</div>
        </div>

        {/* Footer */}
        <div className="flex justify-end rounded-lg gap-3 px-6 ">
          {showCancelButton && (
            <Button
              variant="outline"
              onClick={onClose}
              className={`w-full ${showCancelButton ? "w-1/2" : "w-full"}`}
            >
              {cancelButtonText}
            </Button>
          )}
          {showConfirmButton && (
            <Button
              onClick={onConfirm}
              variant="default"
              className={`w-full font-bold hover:bg-primary/90 text-white ${showCancelButton ? "w-1/2" : "w-full"}`}
              disabled={disabled}
            >
              {isLoading ? <LoadingIndicator size="sm" /> : confirmButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupBox;
