import { cn } from "@/lib/utils"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface DateRangePickerComponentParams {
  defaultFrom: Date;
  defaultTo: Date;
  onChange: (from: Date, to: Date) => void;
}

const Params = [
  {
    name: "defaultFrom",
    type: "Date",
  },
  {
    name: "defaultTo",
    type: "Date",
  },
  {
    name: "onChange",
    type: "function",
  },
];

export function DateRangePickerComponent({
  defaultFrom,
  defaultTo,
  onChange,
}: DateRangePickerComponentParams) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  })

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[205px] justify-start text-left font-normal border border-white-bg shadow-[0_0_0_0_rgba(0,0,0,0.1)]",
              !date && "text-muted-foreground"
            )}
          >
            {/* <CalendarIcon /> */}
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy/MM/dd", { locale: ja })} -{" "}
                  {format(date.to, "yyyy/MM/dd", { locale: ja })}
                </>
              ) : (
                format(date.from, "yyyy/MM/dd", { locale: ja })
              )
            ) : (
              <span>日付を選択</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white w-auto p-0 border border-white-bg shadow-[0_0_0_0_rgba(0,0,0,0.1)]" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(dateRange) => {
              setDate(dateRange ?? { from: defaultFrom, to: defaultTo });
          
              onChange(
                dateRange?.from ?? defaultFrom,
                dateRange?.to ?? defaultTo
              );
            }}
            numberOfMonths={typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 2}
            className=""
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

DateRangePickerComponent.Params = Params;

export default DateRangePickerComponent;
