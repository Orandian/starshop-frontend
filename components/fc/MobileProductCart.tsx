import { useRemoveOrderItem } from "@/hooks/fc";
import { getPublicUrl } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import ImageComponent from "./ImageComponent";
import LoadingIndicator from "./ui/LoadingIndicator";

interface MobileProductCartProps {
  item: {
    cartItemId: number;
    product: {
      productId: number;
      name: string;
      images?: Array<{ imageUrl?: string; imageOrder?: number }>;
      discountSalePrice: number;
      tax?: number;
    };
    productQty: number;
  };
  onQuantityChange: (
    cartItemId: number,
    newQty: number,
    productId: number,
    isNext: boolean,
  ) => void;
}

const MobileProductCart = ({
  item,
  onQuantityChange,
}: MobileProductCartProps) => {
  const { mutate: removeOrderItem, isPending } = useRemoveOrderItem();
  const queryClient = useQueryClient();

  const mainImage =
    item.product.images?.sort(
      (a, b) => (a.imageOrder || 0) - (b.imageOrder || 0),
    )[0]?.imageUrl || "";

  const handleDelete = (id: number) => {
    removeOrderItem(id, {
      onSuccess: () => {
        toast.success("商品をカートから削除しました");
        queryClient.invalidateQueries({ queryKey: ["get-cart"] });
      },
      onError: () => {
        toast.error("商品の削除に失敗しました");
      },
    });
  };

  const handleIncrease = () => {
    onQuantityChange(
      item.cartItemId,
      item.productQty + 1,
      item.product.productId,
      true,
    );
  };

  const handleDecrease = () => {
    if (item.productQty > 1) {
      onQuantityChange(
        item.cartItemId,
        item.productQty - 1,
        item.product.productId,
        false,
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
      <div className="flex gap-4">
        {/* Product Image with Remove Button */}
        <div className="relative">
          <button
            onClick={() => handleDelete(item.cartItemId)}
            className="absolute -top-1 -left-1 z-10 bg-red-400 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <LoadingIndicator size="sm" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
          <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-50">
            <ImageComponent
              imgURL={getPublicUrl(mainImage)}
              imgName={`cart-${item.product.productId}`}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">
            {item.product.name}
          </h3>

          <div className="text-sm text-gray-600 mb-4">
            ¥{item.product.discountSalePrice.toLocaleString("ja-JP")} [税別]
          </div>

          {/* Quantity Selector */}
          <div className="inline-flex items-center">
            <Button
              className="cursor-pointer border-disabled/30"
              variant={"outline"}
              onClick={handleDecrease}
              aria-label="増やす"
            >
              +
            </Button>
            <div className="px-4 py-1">{item.productQty}</div>
            <Button
              className="cursor-pointer border-disabled/30"
              variant={"outline"}
              onClick={handleIncrease}
              aria-label="減らす"
            >
              -
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-left mt-3">
            <div className="font-medium text-gray-900">
              合計: ¥
              {(
                item.product.discountSalePrice * item.productQty
              ).toLocaleString("ja-JP")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProductCart;
