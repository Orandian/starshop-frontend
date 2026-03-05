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
];

interface ImageCardComponentProps {
  imgURL: string;
  imgName: string;
}

const ImageCardComponent = ({ imgURL, imgName }: ImageCardComponentProps) => {
  return (
    <div className="relative w-[80px] h-[80px] bg-white-bg flex items-center justify-center overflow-hidden">
      <Image
        src={imgURL}
        alt={imgName}
        width={100}
        height={100}
        className="object-contain"
        priority={true}
      />
    </div>
  );
};

ImageCardComponent.Params = Params;

export default ImageCardComponent;
