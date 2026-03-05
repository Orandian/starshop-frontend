import React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface AlertBoxProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  showActionButtons?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
  isOpen?: boolean;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  type = "info",
  message,
  showCloseButton = true,
  onClose,
  showActionButtons = false,
  onConfirm,
  confirmText = "OK",
  onCancel,
  cancelText = "Cancel",
  isOpen = false,
}) => {
  const alertStyles = {
    success: "bg-green-50 border-green-400 text-green-700",
    error: "bg-red-50 border-red-400 text-red-700",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
    info: "bg-blue-50 border-blue-400 text-blue-700",
  };

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div
        className={`relative border rounded-lg p-6 bg-white shadow-lg max-w-md w-full ${alertStyles[type]}`}
        role="alert"
      >
        <div className="flex">
          <div className="shrink-0 mr-3">{iconMap[type]}</div>
          <div className="flex-1">
            <div className="text-sm">{message}</div>

            {showActionButtons && (
              <div className="mt-3 space-x-2">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  >
                    {cancelText}
                  </button>
                )}
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    className={`px-3 py-1 text-sm text-white rounded ${
                      type === "success"
                        ? "bg-green-600 hover:bg-green-700"
                        : type === "error"
                          ? "bg-red-600 hover:bg-red-700"
                          : type === "warning"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {confirmText}
                  </button>
                )}
              </div>
            )}
          </div>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
