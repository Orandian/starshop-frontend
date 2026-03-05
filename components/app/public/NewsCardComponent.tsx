import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Params = [
  {
    name: "date",
    type: "string",
  },
  {
    name: "title",
    type: "string",
  },
  {
    name: "handleClick",
    type: "() => void",
  },
  {
    name: "className",
    type: "string",
  },
];

interface NewsCardComponentParams {
  date: string;
  title: string;
  handleClick: () => void;
  className?: string;
}

const NewsCardComponent = ({ date, title, handleClick, className }: NewsCardComponentParams) => {
  return (
    <div className={cn("w-[400px] card-border px-6 py-10 space-y-6 bg-white/50", className)}>
      <div className="flex flex-col gap-4">
        <p className="text-normal text-dark">{date}</p>
        <p className="text-normal text-dark">{title}</p>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="w-full h-[2px] bg-white-bg" />
        <div className="flex flex-row items-center gap-1 cursor-pointer" onClick={handleClick}>
          <p className="text-normal text-dark whitespace-nowrap">view details</p>
          <ChevronRight size={15} />
        </div>
      </div>
    </div>
  );
};

NewsCardComponent.Params = Params;

export default NewsCardComponent;
