"use client"

import React, { useState } from "react"
import Image from "next/image"
import { convertToYen, getPublicUrl } from "@/utils"

interface SalesData {
  product_id: number
  product_name: string
  product_images: string[]
  sale_count: number
  sale_price: number
}

interface TooltipData {
  product: SalesData
  x: number
  y: number
}

const BarComparisonChartComponent = ({
  salesData,
}: {
  salesData: SalesData[]
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const maxSaleCount = Math.max(...salesData.map((item) => item.sale_count))

  const handleMouseEnter = (event: React.MouseEvent, product: SalesData) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      product,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const handleMouseMove = (event: React.MouseEvent, product: SalesData) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      product,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className="space-y-10">
      {salesData?.map((item) => {
        const barWidth = (item.sale_count / maxSaleCount) * 100

        return (
          <div key={item.product_id} className="flex items-center space-x-4 w-full">
            {/* Product Image and Name */}
            <div className="space-y-2 relative min-w-[80px]">
              <div className="w-[80px] h-[80px] bg-white-bg flex items-center justify-center rounded-lg border border-black/10">
                <Image
                  src={getPublicUrl(item.product_images[0]) || "/placeholder.svg"}
                  alt={item.product_name}
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>
              <div className="text-normal absolute -bottom-5 w-full text-center">
                <p className="text-sm font-medium truncate">{item.product_name}</p>
              </div>
            </div>

            {/* Bar Chart with Sale Count */}
            <div className="flex-1 relative">
              <div
                className="relative cursor-pointer"
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseMove={(e) => handleMouseMove(e, item)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Background bar */}
                <div className="h-[20px] w-full bg-gray-200 rounded-md"></div>

                {/* Actual bar */}
                <div
                  className="h-[20px] bg-secondary rounded-md absolute top-0 left-0 flex items-center justify-end pr-2 hover:bg-opacity-80 transition-all duration-200"
                  style={{ width: `${Math.max(barWidth, 10)}%` }}
                >
                  {/* Sale count inside the bar if there's enough space */}
                  {barWidth > 15 && <span className="text-white text-xs font-semibold">{item.sale_count}</span>}
                </div>

                {/* Sale count outside the bar if not enough space */}
                {barWidth <= 15 && (
                  <span
                    className="absolute top-0 text-xs font-semibold text-gray-700 flex items-center h-[20px]"
                    style={{ left: `${Math.max(barWidth, 10)}%`, marginLeft: "8px" }}
                  >
                    {item.sale_count}
                  </span>
                )}

                {/* Tooltip */}
                {tooltip && tooltip.product.product_id === item.product_id && (
                  <div
                    className="absolute z-10 bg-white-bg text-dark p-3 rounded-lg shadow-lg border border-black/10 pointer-events-none min-w-[200px]"
                    style={{
                      left: tooltip.x + 10,
                      top: tooltip.y - 80,
                      transform: tooltip.x > 200 ? "translateX(-100%) translateX(-20px)" : "none",
                    }}
                  >
                    <div className="space-y-1">
                      <p className="text-normal text-sm">{tooltip.product.product_name}</p>
                      <p className="text-xs text-dark">
                        Sales: <span className="font-medium">{tooltip.product.sale_count}</span>
                      </p>
                      <p className="text-xs text-dark">
                        Price:{" "}
                        <span className="font-medium">{convertToYen(tooltip.product.sale_price)}</span>
                      </p>
                    </div>
                    {/* Tooltip arrow */}
                    <div
                      className="absolute w-2 h-2 bg-white-bg rotate-45"
                      style={{
                        bottom: "-4px",
                        left: tooltip.x > 200 ? "calc(100% - 20px)" : "20px",
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Y-axis scale markers - only show unique values */}
              <div className="flex justify-between mt-1 text-xs text-gray-500 relative">
                {(() => {
                  // Generate scale values and remove duplicates
                  const scaleValues = [
                    0,
                    Math.round(maxSaleCount * 0.25),
                    Math.round(maxSaleCount * 0.5),
                    Math.round(maxSaleCount * 0.75),
                    maxSaleCount,
                  ]

                  // Remove duplicates and sort
                  const uniqueValues = [...new Set(scaleValues)].sort((a, b) => a - b)

                  // If we have too few unique values, create a simpler scale
                  if (uniqueValues.length <= 2) {
                    const simpleScale =
                      maxSaleCount <= 5
                        ? Array.from({ length: maxSaleCount + 1 }, (_, i) => i)
                        : [0, Math.ceil(maxSaleCount / 2), maxSaleCount]

                    return simpleScale.map((value, index) => (
                      <span
                        key={value}
                        className="absolute"
                        style={{
                          left: `${(value / maxSaleCount) * 100}%`,
                          transform:
                            index === 0
                              ? "none"
                              : index === simpleScale.length - 1
                                ? "translateX(-100%)"
                                : "translateX(-50%)",
                        }}
                      >
                        {value}
                      </span>
                    ))
                  }

                  // For normal cases with enough unique values
                  return uniqueValues.map((value, index) => (
                    <span
                      key={value}
                      className="absolute"
                      style={{
                        left: `${(value / maxSaleCount) * 100}%`,
                        transform:
                          index === 0
                            ? "none"
                            : index === uniqueValues.length - 1
                              ? "translateX(-100%)"
                              : "translateX(-50%)",
                      }}
                    >
                      {value}
                    </span>
                  ))
                })()}
              </div>
            </div>

            {/* Price */}
            <div className="text-normal w-[120px] text-right">
              <p className="font-semibold text-sm">{convertToYen(item.sale_price)}</p>
            </div>
          </div>
        )
      })}

      {/* Chart Title and Legend */}
      <div className="mt-8 pt-4 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Product</span>
          <span>Price</span>
        </div>
      </div>
    </div>
  )
}

export default BarComparisonChartComponent
