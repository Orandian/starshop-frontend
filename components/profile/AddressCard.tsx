import Image from "next/image";
import wave from "@/public/svgs/wave.svg";

interface AddressCardProps {
  icon: React.ReactNode;
  title: string;
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  downLoadButton?: React.ReactNode;
}

const AddressCard = ({
  icon,
  title,
  name,
  phone,
  zipCode,
  address,
  downLoadButton,
}: AddressCardProps) => {
  return (
    <div className="px-6 py-6 rounded-md shadow-md drop-shadow-md border border-white-bg space-y-4 bg-gradient-to-br from-black/10 from-5% to-white to-70% relative overflow-hidden">
      <div className="flex items-center gap-2 md:text-sm text-xs">
        {icon}
        <h1 className="font-bold text-dark md:text-xl text-lg">{title}</h1>
      </div>

      <div className="flex flex-col gap-2 md:text-sm text-xs text-dark">
        <p>{name}</p>
        <p>{phone}</p>
        <p>〒{zipCode}</p>
        <p>{address}</p>

        {downLoadButton && <div className="flex z-10">{downLoadButton}</div>}
      </div>

      <Image
        src={wave}
        alt="wave"
        className="absolute bottom-0 -right-6 md:w-[250px] w-[200px]"
      />
    </div>
  );
};

export default AddressCard;
