"use client";

import { useState } from "react";
import EnhancedImageUploader, { ImageSource } from "@/components/app/EnhancedImageUploader"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  value: ImageSource[];
  onChange: (files: ImageSource[]) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageSource[]>(value)

  const handleImagesChange = (newImages: ImageSource[]) => {
    setImages(newImages)
    onChange(newImages)
  }

  const handleSubmit = () => {
    onChange(images)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">画像アップロード</h1>
        <p className="text-gray-600">画像をアップロードして並び替え</p>
      </div>

      <EnhancedImageUploader value={images} onChange={handleImagesChange} />

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">画像順序:</h3>
            <div className="space-y-1">
              {images.map((img, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {index + 1}. {typeof img === "string" ? img : img.name}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            画像を保存
          </Button>
        </div>
      )}
    </div>
  )
}
