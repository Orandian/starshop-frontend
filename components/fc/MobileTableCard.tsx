import React from "react";
import Image from "next/image";

interface ImageItem {
  src: string;
  alt: string;
  text: string;
}

type CardItem = {
  label: string;
  value: React.ReactNode;
  type?: 'text' | 'badge';
  badgeColor?: string;
} | {
  label: string;
  value: ImageItem[] | string;
  type: 'image';
} | {
  label: string;
  value: string;
  type: 'link';
  href?: string;
  onClick?: () => void;
};

interface MobileTableCardProps {
  items: CardItem[];
  className?: string;
}

const MobileTableCard = ({ items, className = "" }: MobileTableCardProps) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-start py-2  last:border-b-0">
          <span className="text-sm font-medium text-gray-600 min-w-[100px]">
            {item.label}
          </span>
          <div className="text-sm text-gray-900 text-right flex-1 ml-4">
            {renderValue(item)}
          </div>
        </div>
      ))}
    </div>
  );
};

const renderValue = (item: CardItem) => {
  switch (item.type) {
    case 'image':
      return (
        <div className="flex flex-col items-end">
          {Array.isArray(item.value) ? (
            item.value.map((img, idx) => (
              <div key={idx} className="flex items-center mb-1">
                <Image 
                  src={img.src} 
                  alt={img.alt || 'Product'} 
                  width={32} 
                  height={32}
                  className="mr-2 object-cover rounded" 
                />
                <span className="w-24">{img.text}</span>
              </div>
            ))
          ) : (
            <Image 
              src={item.value} 
              alt="Product" 
              width={32} 
              height={32}
              className="object-cover rounded" 
            />
          )}
        </div>
      );
    
    case 'badge':
      return (
        <span className={`inline-block px-3 py-1 text-xs leading-5 font-normal rounded-full  ${item.badgeColor ? item.badgeColor : 'text-white'}`}>
          {item.value}
        </span>
      );
    
    case 'link':
      return (
        <a 
          href={item.href} 
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault();
              item.onClick();
            }
          }}
        >
          {item.value}
        </a>
      );
    
    default:
      return item.value;
  }
};

export default MobileTableCard;
