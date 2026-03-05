import * as React from "react"
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  LabelList,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const Params = [
  {
    name: "data",
    type: "array",
  }
]

interface BarChartComponentParams {
  data: {
    productName: string
    imgURL: string
    saleCount: number
    salePrice: number
  }[]
}

const chartConfig = {
  saleCount: {
    label: "販売数",
    color: "hsl(var(--chart-1))",
  },
  salePrice: {
    label: "販売金額",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const BarChartComponent = ({ data }: BarChartComponentParams) => {
  return (
    <ChartContainer className="h-[800px] min-w-[1000px]" config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        barCategoryGap={60}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="productName"
          type="category"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tick={({ x, y, payload }) => {
            const product = data.find(
              (item) => item.productName === payload.value
            )
            return (
              <g transform={`translate(${x - 50}, ${y - 25})`}>
                {product && (
                  <>
                    <image
                      href={product.imgURL}
                      width={50}
                      height={50}
                      x={0}
                      y={0}
                    />
                  </>
                )}
              </g>
            )
          }}
        />
        <XAxis type="number" hide />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              className="bg-white border border-white-bg"
            />
          }
        />
        <Bar
          dataKey="saleCount"
          fill="var(--color-primary)"
          radius={[4, 4, 4, 4]}
        >
          <LabelList
            dataKey="saleCount"
            position="insideLeft"
            offset={8}
            className="fill-white"
            fontSize={12}
          />
          <LabelList
            dataKey="salePrice"
            position="right"
            offset={8}
            className="fill-black"
            fontSize={12}
            formatter={(value: number) => `¥${Math.round(value).toLocaleString()}`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

BarChartComponent.Params = Params

export default BarChartComponent
