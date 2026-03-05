"use client"

import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { CircleX, GripVertical } from "lucide-react"
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
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export type ImageSource = File | string

interface ImageUploaderProps {
  value: ImageSource[]
  onChange: (files: ImageSource[]) => void
}

interface SortableImageItemProps {
  id: string
  imgSource: ImageSource
  index: number
  onRemove: (index: number) => void
}

function SortableImageItem({ id, imgSource, index, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Determine the source for the Image component
  const src = typeof imgSource === "string" ? imgSource : URL.createObjectURL(imgSource)
  const altText = typeof imgSource === "string" ? imgSource : imgSource.name

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border border-black/10 rounded-md bg-white-bg transition-all duration-200 ${
        isDragging ? "opacity-50 scale-105 shadow-lg z-50" : "hover:shadow-md"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1 bg-white/80 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
      >
        <GripVertical size={16} className="text-gray-600" />
      </div>

      {/* Image */}
      <Image
        src={src || "/placeholder.svg"}
        alt={altText}
        width={300}
        height={300}
        className="object-cover rounded-lg h-40 w-full"
        draggable={false}
      />

      {/* Remove Button */}
      <CircleX
        size={20}
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 text-red-400 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-600 bg-white/80 hover:bg-white"
      />

      {/* Order Number Badge */}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {index + 1}
      </div>
    </div>
  )
}

function DragOverlayImage({ imgSource }: { imgSource: ImageSource }) {
  const src = typeof imgSource === "string" ? imgSource : URL.createObjectURL(imgSource)
  const altText = typeof imgSource === "string" ? imgSource : imgSource.name

  return (
    <div className="relative border border-black/10 rounded-md bg-white-bg shadow-xl rotate-3 scale-105">
      <Image
        src={src || "/placeholder.svg"}
        alt={altText}
        width={300}
        height={300}
        className="object-cover rounded-lg h-40 w-full"
        draggable={false}
      />
    </div>
  )
}

export default function EnhancedImageUploader({ value, onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageSource[]>(value)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedImage, setDraggedImage] = useState<ImageSource | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    setImages(value)
  }, [value])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // When new files are dropped, they are File objects
      const newImages: ImageSource[] = [...images, ...acceptedFiles]
      setImages(newImages)
      onChange(newImages)
    },
    [images, onChange],
  )

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onChange(newImages)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    // Find the dragged image
    const draggedIndex = Number.parseInt(active.id as string)
    setDraggedImage(images[draggedIndex])
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = Number.parseInt(active.id as string)
      const newIndex = Number.parseInt(over.id as string)

      const newImages = arrayMove(images, oldIndex, newIndex)
      setImages(newImages)
      onChange(newImages)
    }

    setActiveId(null)
    setDraggedImage(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  })

  // Create items array for sortable context
  const items = images.map((_, index) => index.toString())

  return (
    <div className="space-y-4">
      {/* Dropzone area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-blue-500 bg-blue-50 scale-[1.02]"
            : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl">📸</div>
          <p className="text-gray-500 font-medium">
            {isDragActive
              ? "画像をここにドロップしてください"
              : "ここに画像をドラッグ＆ドロップ、またはクリックしてアップロード"}
          </p>
          <p className="text-sm text-gray-400">アップロード後、画像をドラッグして順序を変更できます</p>
        </div>
      </div>

      {/* Image previews with drag and drop */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">アップロード済み画像 ({images.length})</h3>
            <p className="text-xs text-gray-500">ドラッグして順序を変更</p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((imgSource, index) => (
                  <SortableImageItem
                    key={index}
                    id={index.toString()}
                    imgSource={imgSource}
                    index={index}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>{activeId && draggedImage ? <DragOverlayImage imgSource={draggedImage} /> : null}</DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Instructions */}
      {images.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 mt-0.5">💡</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium">画像の並び替え方法:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• 画像にマウスを合わせると、左上にドラッグハンドル（⋮⋮）が表示されます</li>
                <li>• ハンドルをドラッグして画像の順序を変更できます</li>
                <li>• 右上の×ボタンで画像を削除できます</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
