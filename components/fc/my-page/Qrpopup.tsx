'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QrPopupProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
}

const QrPopup: React.FC<QrPopupProps> = ({ isOpen, onClose, value }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple QR code pattern (this is a very basic example)
      // In a real app, you might want to use a more sophisticated algorithm
      // or a lightweight QR code library that can be bundled without installation
      const size = 200;
      const cellSize = 5;
      const cells = Math.floor(size / cellSize);
      
      // Draw a simple pattern (this is just a placeholder)
      for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
          if ((i + j) % 3 === 0 || (i * j) % 5 === 0) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }, [isOpen, value]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-xs mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 p-4 bg-white rounded-lg flex items-center justify-center">
            <div className="relative w-full h-full">
              <QRCodeSVG value={value} size={220} />
            </div>
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default QrPopup;