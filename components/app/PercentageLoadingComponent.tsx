"use client";

import { useEffect, useState } from "react";

export default function PercentageLoadingComponent({ images }: { images: string[] }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loaded = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded += 1;
        setProgress(Math.floor((loaded / images.length) * 100));
        if (loaded === images.length) {
          setTimeout(() => setIsLoaded(true), 300);
        }
      };
    });
  }, [images]);

  if (isLoaded) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-[9999] transition-opacity duration-500">
      <div className="text-2xl font-bold mb-4 text-additional animate-pulse">読み込み中。。。 {progress}%</div>
      <div className="w-64 h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-additional rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
