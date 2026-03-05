import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string | number;
  label: string;
}

interface MobileSelectDropdownProps {
  options: Option[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  className?: string;
  placeholder?: string;
}

const MobileSelectDropdown = ({
  options,
  selectedValue,
  onSelect,
  className = "",
  placeholder = "選択してください",
}: MobileSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} >
      <DropdownMenuTrigger asChild className="rounded-full">
        <Button
          variant="outline"
          className={`w-full justify-between ${className}`}
        >
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full min-w-[27.6rem] max-w-none h-auto overflow-y-auto bg-white"
        align="start"
        sideOffset={4}
        avoidCollisions={false}
      >
        {placeholder && (
          <DropdownMenuItem
            onClick={() => {
              onSelect("");
              setIsOpen(false);
            }}
            className="text-gray-500"
          >
            {placeholder}
          </DropdownMenuItem>
        )}
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              setIsOpen(false);
            }}
            className={selectedValue === option.value ? "bg-accent" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileSelectDropdown;
