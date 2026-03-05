import { Product } from "@/types/fc";
import { encryptString, getPublicUrl } from "@/utils";
import Link from "next/link";
import ImageComponent from "../ImageComponent";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const mainImage =
    product.images.find((img) => img.imageOrder === 1)?.imageUrl ||
    "/placeholder-product.jpg";

    const handleCardClick = () => {
      router.push(`/fc/purchase/${encryptString(product.productId?.toString() || "")}`);
    }

  return (
    <div className="flex flex-col w-40 md:w-64 h-auto cursor-pointer" onClick={handleCardClick}>
      <div className="bg-foreground rounded-lg p-4 flex flex-col items-center text-center h-full">
        <div className="h-40 w-full mb-4 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          <ImageComponent
            imgURL={getPublicUrl(mainImage) || ""}
            imgName={product.name}
            width={200}
            height={160}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="text-xs text-gray-500 ">
          <span className="line-through mr-1">¥{((product.salePrice * 0.1 ) + product.salePrice).toLocaleString("ja-JP")}</span>
          <span className="text-xs font-normal text-gray-500">[税別]</span>
          
        </div>
        <div className="text-sm md:text-base font-semibold">
          {product.discountSalePrice
            ? `¥${product.discountSalePrice.toLocaleString("ja-JP")} `
            : ""}
          <span className="text-xs font-normal text-gray-500">[税別]</span>
        </div>
        <p className="mt-2 h-10 text-xs md:text-sm text-gray-700 line-clamp-2">
          {product.name}
        </p>
        <Link
          href={`/fc/purchase/${encryptString(product.productId?.toString())}`}
          className="cursor-pointer w-full mt-2 py-2 bg-product-card-btn hover:bg-product-card-btn/80 text-white rounded text-sm"
        >
          カートに追加
        </Link>
      </div>
    </div>
  );
};
