"use client";

import { StaticImageData } from "next/image";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

const Params = [
  {
    name: "titleImage",
    type: "StaticImageData",
  },
  {
    name: "title?",
    type: "string",
  },
  {
    name: "handleToClick?",
    type: "() => void",
  },
  {
    name: "options?",
    type: `{
      label: string;
      value: string;
    }[]`,
  },
  {
    name: "selectedOption?",
    type: "string",
  },
  {
    name: "handleToSelect?",
    type: "(value: string) => void",
  },
  {
    name: "brands?",
    type: `{
      label: string;
      value: string;
    }[]`,
  },
  {
    name: "selectedBrand?",
    type: "string",
  },
  {
    name: "handleToSelectBrand?",
    type: "(value: string) => void",
  },
];

interface TitleWithNavigationComponentProps {
  titleImage: StaticImageData;
  title?: string;
  handleToClick?: () => void;
  options?: {
    label: string;
    value: string;
  }[];
  selectedOption?: string;
  handleToSelect?: (value: string) => void;
  brands?: {
    label: string;
    value: string;
  }[];
  selectedBrand?: string;
  handleToSelectBrand?: (value: string, name: string) => void;
}

const TitleWithNavigationComponent = ({
  title,
  handleToClick,
  brands,
  selectedBrand,
  handleToSelectBrand,
}: TitleWithNavigationComponentProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-5 md:gap-2 container mx-auto">
      <span
        className="text-5xl font-allura"
        style={{ fontFamily: "Allura, cursive" }}
      >
        {title}
      </span>
      {/* <Image src={titleImage} alt={title || ""} width={180} height={180} /> */}
      {brands && (
        <div className="flex gap-5">
          <p
            className={`text-sm cursor-pointer hover:underline ${selectedBrand === "All" ? "font-bold underline underline-offset-2" : ""}`}
            onClick={() => handleToSelectBrand?.("All", "All")}
          >
            ALL
          </p>
          {brands.map((brand) => (
            <p
              key={brand.value}
              className={`text-sm cursor-pointer hover:underline ${selectedBrand === brand.label ? "font-bold underline underline-offset-2" : ""
                }`}
              onClick={() => handleToSelectBrand?.(brand.value, brand.label)}
            >
              {brand.label}
            </p>
          ))}
        </div>
      )}
      <div
        onClick={handleToClick}
        className="flex-row-center gap-2 cursor-pointer"
      >
        {/* {options && (
          <Select value={selectedOption} onValueChange={handleToSelect}>
            <SelectTrigger className="drop-shadow-none shadow-none focus-visible:ring-0 bg-white border border-black/10 w-50 px-2">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="border-white-bg px-0 bg-white">
              <SelectItem value="all" className="px-2">
                すべて
              </SelectItem>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="px-2"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} */}
      </div>
    </div>
  );
};

TitleWithNavigationComponent.Params = Params;

export default TitleWithNavigationComponent;
