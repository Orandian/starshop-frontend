"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (signature: string) => void;
  value?: string;
}

export const SignaturePad = ({ onSave, value }: SignaturePadProps) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const [mounted, setMounted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up canvas size on mount and window resize
  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setCanvasSize({
          width,
          height: Math.min(200, Math.max(100, window.innerHeight * 0.2)),
        });
      }
    };
    const currentRef = sigRef.current;
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      if (currentRef) {
        currentRef.off(); // Use the captured ref value
      }
    };
  }, []);

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
    onSave(""); // Clear the parent form value
    setIsDrawing(false);
  };

  const handleBegin = () => {
    setIsDrawing(true);
  };

  const handleEnd = () => {
    try {
      if (!sigRef.current) {
        console.error("Signature canvas reference is not available");
        return;
      }

      // Check if the canvas has any drawing
      if (sigRef.current.isEmpty()) {
        setIsDrawing(false);
        return;
      }

      // Get the canvas data URL
      const dataUrl = sigRef.current.toDataURL("image/png");
      if (dataUrl) {
        onSave(dataUrl);
      } else {
        console.error("Failed to get signature data URL");
      }
    } catch (error) {
      console.error("Error processing signature:", error);
    } finally {
      setIsDrawing(false);
    }
  };

  const isDataURL = (str: string) => {
    return str.startsWith("data:");
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={`border-2 rounded-lg overflow-hidden ${
          isDrawing ? "border-primary" : "border-gray-200"
        } transition-colors min-h-[100px]`}
      >
        {value && isDataURL(value) ? (
          <div className="relative w-full h-full">
            <Image
              src={value}
              alt="Signature"
              width={500} // Set appropriate width
              height={200} // Set appropriate height
              className="w-full h-auto max-h-[200px] object-contain"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ) : value ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={value}
              alt="Signature"
              width={500} // Set appropriate width
              height={200} // Set appropriate height
              className="w-full h-auto max-h-[200px] object-contain"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ) : (
          mounted &&
          canvasSize.width > 0 && (
            <SignatureCanvas
              ref={sigRef}
              penColor="#000000"
              minWidth={1.5}
              maxWidth={2.5}
              velocityFilterWeight={0.7}
              dotSize={1}
              throttle={16}
              backgroundColor="rgba(255, 255, 255, 1)"
              canvasProps={{
                width: canvasSize.width,
                height: canvasSize.height,
                className: "w-full bg-white touch-none",
                style: {
                  touchAction: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                },
              }}
              onBegin={handleBegin}
              onEnd={handleEnd}
            />
          )
        )}
      </div>
      {/* <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {isDrawing ? '署名中...' : value ? '署名済み' : 'ここにサインしてください'}
        </p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClear();
          }}
          disabled={!value}
          className="z-10"
        >
          クリア
        </Button>
      </div> */}
    </div>
  );
};
