import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
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
  className
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={cn("w-full max-w-xl rounded-lg bg-white shadow-lg p-10 relative", className)}>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 absolute top-4 right-4 cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

         {/* Content */}
        <div className="max-h-[62vh] overflow-y-hidden p-6">
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
          {showConfirmButton && <Button
            onClick={onConfirm}
            variant="default"
            className={`w-full font-bold hover:bg-primary/90 text-white ${showCancelButton ? "w-1/2" : "w-full"}`}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingIndicator size="sm" />
            ) : (
              confirmButtonText
            )}
          </Button>}
       </div>
      </div>
    </div>
  );
};

export default PopupBox;
