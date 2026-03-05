"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AdminDatePicker = ({
  value,
  onChange,
  styleName,
  minDate,
  maxDate,
}: {
  value: string;
  onChange: (value: string) => void;
  styleName?: string;
  minDate?: Date;
  maxDate?: Date;
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Popover>
      <PopoverTrigger asChild className="relative">
        <Button
          ref={buttonRef}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal pr-10",
            !value && "text-muted-foreground",
            styleName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "yyyy/MM/dd") : <span>日付を選択</span>}
          {value && (
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange("");
              }}
            >
              <XIcon className="w-4 h-4" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 bg-white border border-white-bg rounded-md"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(value) => {
            const localDate = value ? value.toLocaleDateString("sv-SE") : "";
            onChange(localDate);
          }}
          initialFocus
          disabled={
            minDate || maxDate
              ? (date) => {
                  const isValid = date instanceof Date && !isNaN(date.getTime());
                  if (!isValid) return true;
                  
                  const isAfterMin = minDate ? date >= minDate : true;
                  const isBeforeMax = maxDate ? date <= maxDate : true;
                  
                  return !(isAfterMin && isBeforeMax);
                }
              : undefined
          }
          {...(minDate && { fromDate: minDate })}
          {...(maxDate && { toDate: maxDate })}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AdminDatePicker;
