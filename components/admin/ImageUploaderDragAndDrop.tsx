import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CircleX, GripVertical, Camera, Lightbulb, CheckCircle, Save } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { getPublicUrl } from "@/utils";
import Image from "next/image";

export type ImageFormValue = {
  file?: File;
  image_url?: string;
  del_flg: boolean;
};

interface ImageUploaderProps {
  value: ImageFormValue[];
  onChange: (images: ImageFormValue[]) => void;
}

interface SortableImageItemProps {
  id: string;
  imgValue: ImageFormValue;
  index: number;
  onRemove: (index: number) => void;
}

function SortableImageItem({ id, imgValue, index, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const src = imgValue.image_url 
    ? getPublicUrl(imgValue.image_url) 
    : imgValue.file 
    ? URL.createObjectURL(imgValue.file) 
    : "";
  const altText = imgValue.file?.name ?? imgValue.image_url ?? `image-${index}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 scale-105 shadow-xl z-50" : ""
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:bg-white cursor-grab active:cursor-grabbing">
          <GripVertical size={14} className="text-gray-600" />
        </div>
      </div>

      {/* Order Badge */}
      <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
          {index + 1}
        </div>
      </div>

      {/* Remove Button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onRemove(index)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors duration-200"
        >
          <CircleX size={16} />
        </button>
      </div>

      {/* Image */}
      <Image
        src={src}
        alt={altText}
        className="w-full h-40 object-cover"
        draggable={false}
        width={500}
        height={500}
      />
    </div>
  );
}

function DragOverlayImage({ imgValue }: { imgValue: ImageFormValue }) {
  const src = imgValue.image_url 
    ? getPublicUrl(imgValue.image_url) 
    : imgValue.file 
    ? URL.createObjectURL(imgValue.file) 
    : "";
  const altText = imgValue.file?.name ?? imgValue.image_url ?? `image`;

  return (
    <div className="relative bg-white border border-gray-300 rounded-xl overflow-hidden shadow-xl transform rotate-3 scale-105">
      <Image
        src={src}
        alt={altText}
        className="w-32 h-32 object-cover"
        draggable={false}
        width={500}
        height={500}
      />
    </div>
  );
}

export default function ImageUploaderDragAndDrop({ value, onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFormValue[]>(value || []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedImage, setDraggedImage] = useState<ImageFormValue | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setImages(value || []);
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImageObjects: ImageFormValue[] = acceptedFiles.map((file) => ({
        file,
        del_flg: false,
      }));
      const newImages: ImageFormValue[] = [...images, ...newImageObjects];
      setImages(newImages);
      onChange(newImages);
    },
    [images, onChange]
  );

  const removeImage = (index: number) => {
    const newImages = images.map((img, i) =>
      i === index
        ? { ...img, del_flg: true } // Mark as deleted
        : img
    );
    setImages(newImages);
    onChange(newImages);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    const draggedIndex = Number.parseInt(active.id as string);
    setDraggedImage(images[draggedIndex]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = Number.parseInt(active.id as string);
      const newIndex = Number.parseInt(over.id as string);

      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);
      onChange(newImages);
    }

    setActiveId(null);
    setDraggedImage(null);
  };

  const handleSave = () => {
    onChange(images);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    maxSize: 10 * 1024 * 1024,
  });

  const visibleImages = images.filter(img => !img.del_flg);
  const items = visibleImages.map((_, index) => {
    const originalIndex = images.findIndex(img => img === visibleImages[index]);
    return originalIndex.toString();
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Upload Area */}
      <div className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group ${
            isDragActive
              ? "border-blue-400 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
              <Camera size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                {isDragActive ? "画像をここにドロップしてください" : "画像をここにドラッグ＆ドロップ"}
              </p>
              <p className="text-sm text-gray-500">
                または <span className="text-blue-600 font-medium">クリックしてファイルを選択</span>
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, GIF ファイルをサポート (最大 10MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Images Section */}
      {visibleImages.length > 0 && (
        <div className="border-t border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">アップロード済み画像</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {visibleImages.length} 枚
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <GripVertical size={12} />
              <span>ドラッグして順序を変更</span>
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleImages.map((imgValue, index) => {
                  // Get the actual index in the original array for proper drag handling
                  const originalIndex = images.findIndex(img => img === imgValue);
                  return (
                    <SortableImageItem
                      key={originalIndex}
                      id={originalIndex.toString()}
                      imgValue={imgValue}
                      index={index}
                      onRemove={() => removeImage(originalIndex)}
                    />
                  );
                })}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId && draggedImage ? <DragOverlayImage imgValue={draggedImage} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Instructions Section */}
      {visibleImages.length > 1 && (
        <div className="border-t border-gray-200 bg-blue-50 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Lightbulb size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">使用方法</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle size={12} className="text-blue-600" />
                  <span>画像にマウスを合わせると、ドラッグハンドル（⋮⋮）が表示されます</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={12} className="text-blue-600" />
                  <span>ハンドルをドラッグして画像の順序を変更できます</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={12} className="text-blue-600" />
                  <span>右上の×ボタンで画像を削除できます</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={12} className="text-blue-600" />
                  <span>左下の番号で現在の順序を確認できます</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {visibleImages.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              <Save size={16} className="mr-2" />
              画像を保存
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
