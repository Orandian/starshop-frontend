"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";

interface LoadingScreenProps {
  loading: boolean;
  message?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function LoadingScreen({
  loading,
  message = "Processing...",
  onCancel,
  showCancelButton = true,
}: LoadingScreenProps) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 border-none bg-white/40 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Loading Spinner */}
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="absolute inset-0 rounded-full" />
            </div>

            {/* Loading Message */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{message}</h3>
              <p className="text-sm text-muted-foreground">
                リクエストを処理中です。しばらくお待ちください。
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
            </div>

            {/* Cancel Button */}
            {showCancelButton && onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
