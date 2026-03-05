"use client"

import { useState, useCallback } from "react"
import type { ImageSource } from "@/components/app/EnhancedImageUploader"

export function useImageReorder(initialImages: ImageSource[] = []) {
  const [images, setImages] = useState<ImageSource[]>(initialImages)
  const [reorderHistory, setReorderHistory] = useState<ImageSource[][]>([initialImages])
  const [historyIndex, setHistoryIndex] = useState(0)

  const updateImages = useCallback(
    (newImages: ImageSource[]) => {
      setImages(newImages)

      // Add to history for undo functionality
      const newHistory = reorderHistory.slice(0, historyIndex + 1)
      newHistory.push(newImages)
      setReorderHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [reorderHistory, historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setImages(reorderHistory[newIndex])
    }
  }, [historyIndex, reorderHistory])

  const redo = useCallback(() => {
    if (historyIndex < reorderHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setImages(reorderHistory[newIndex])
    }
  }, [historyIndex, reorderHistory])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < reorderHistory.length - 1

  return {
    images,
    updateImages,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
