import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

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
    name: "className",
    type: "string",
  },
];

interface ImageRoundComponentProps {
  imgURL: string | StaticImageData;
  imgName: string;
  className?: string;
}

const ImageRoundComponent = ({ imgURL, imgName, className }: ImageRoundComponentProps) => {
  return (
    <div className={cn("w-[80px] h-[80px] bg-white-bg flex items-center justify-center border border-black/10 rounded-full overflow-hidden", className)}>
      <Image
        src={imgURL}
        alt={imgName}
        width={80}
        height={80}
        className="object-contain"
        priority={true}
      />
    </div>
  );
};

ImageRoundComponent.Params = Params;

export default ImageRoundComponent;
