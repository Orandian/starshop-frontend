import Image from "next/image";
import wave from "@/public/svgs/wave.svg";
import Link from "next/link";
import { navigateToDeliveryService } from "@/utils";

interface AddressCardProps {
  icon: React.ReactNode;
  title: string;
  company: string;
  trackingNumber: string;
  deliveryDate: string;
}

const DeliveryCard = ({
  icon,
  title,
  company,
  trackingNumber,
  deliveryDate,
}: AddressCardProps) => {
  return (
    <div className="px-6 py-6 rounded-md shadow-md drop-shadow-md border border-white-bg space-y-4 bg-linear-to-br from-black/10 from-5% to-white to-70% relative overflow-hidden">
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="font-bold text-dark md:text-xl text-lg">{title}</h1>
      </div>

      <div className="flex flex-col gap-2 md:text-sm text-xs text-dark">
        <p>
          運送会社 : {company || "-"}
        </p>
        <p>追跡番号 : {trackingNumber || "-"}</p>
        <p>配達日 : {deliveryDate || "-"}</p>
        {company !== "" && (
          <Link
            href={navigateToDeliveryService(company, Number(trackingNumber))}
            className="text-blue-600 underline"
            target="_blank"
          >
            状況を確認
          </Link>
        )}
      </div>

      <Image
        src={wave}
        alt="wave"
        className="absolute bottom-0 -right-6 md:w-[250px] w-[200px]"
      />
    </div>
  );
};

export default DeliveryCard;
