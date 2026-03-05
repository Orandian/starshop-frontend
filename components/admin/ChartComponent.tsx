import * as React from "react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "@/types/dashboard";
import { convertToYen } from "@/utils";

const Params = [
  {
    name: "chartData",
    type: "array",
  },
];

interface ChartComponentParams {
  chartData: ChartData[];
}

const chartConfig = {
  thisMonth: {
    label: "今月",
    color: "hsla(234, 43%, 70%, 1)"
  },
  lastMonth: {
    label: "先月",
    color: "hsla(338, 88%, 68%, 1)"

  },
} satisfies ChartConfig;

const ChartComponent = ({ chartData }: ChartComponentParams) => {
  return (
    <ChartContainer className="h-[400px] w-full" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData.map((item) => ({
          date: item.date,
          thisMonth: item.current,
          lastMonth: item.last,
        }))}
        margin={{
          left: 20,
          right: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={true}
          axisLine={true}
          tickMargin={0}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <YAxis
          tickLine={true}
          axisLine={true}
          tickMargin={10}
          tickFormatter={(value) => `${convertToYen(value as number)}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="bg-white text-black" />}
          // formatter={(value) => `${convertToYen(value as number)}`}
        />
        <Area
          dataKey="thisMonth"
          type="monotone"
          fill="hsla(338, 88%, 68%, 1)"
          stroke="hsla(338, 88%, 68%, 1)"
        />
        <Area
          dataKey="lastMonth"
          type="monotone"
          fill="hsla(234, 43%, 70%, 1)"
          stroke="hsla(234, 43%, 70%, 1)"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};

ChartComponent.Params = Params;

export default ChartComponent;
