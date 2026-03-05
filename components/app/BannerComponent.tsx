import Image, { StaticImageData } from "next/image";

interface BannerComponentProps {
  image: StaticImageData;
}

const BannerComponent = ({ image }: BannerComponentProps) => {
  return (
    <div className="w-screen h-[60vh]">
      <Image src={image} alt="Banner" className="w-full h-full object-cover" />
    </div>
  );
};

export default BannerComponent;
