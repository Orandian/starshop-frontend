import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import Image from "next/image";

const Params = [
  {
    name: "imgURL",
    type: "string",
  },
  {
    name: "imgName",
    type: "string",
  },
  {
    name: "onClick",
    type: "() => void",
  },
  {
    name: "onRemove",
    type: "() => void",
  },
];

interface RecommendProductCardComponentProps {
  imgURL: string;
  imgName: string;
  active: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

const RecommendProductCardComponent = ({
  imgURL,
  imgName,
  onClick,
  active,
  onRemove,
}: RecommendProductCardComponentProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full h-[150px] bg-white-bg flex items-center justify-center relative overflow-hidden border border-black/10 rounded-[10px] cursor-pointer",
        active && "border-primary border-4"
      )}
    >
      <Image
        src={imgURL}
        alt={imgName}
        width={150}
        height={150}
        className="object-contain"
      />
      <CircleX
        size={20}
        className="absolute top-1 right-1 text-red-400 rounded-full cursor-pointer"
        onClick={onRemove}
      />
    </div>
  );
};

RecommendProductCardComponent.Params = Params;

export default RecommendProductCardComponent;
