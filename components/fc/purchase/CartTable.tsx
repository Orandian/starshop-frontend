// components/fc/purchase/CartTable.tsx
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/fc";
import ImageComponent from "../ImageComponent";
import { Trash2 } from "lucide-react";
import { useRemoveOrderItem } from "@/hooks/fc";
import LoadingIndicator from "../ui/LoadingIndicator";
import { useQueryClient } from "@tanstack/react-query";
import { getPublicUrl } from "@/utils";
import { toast } from "sonner";
import MobileProductCart from "../MobileProductCart";

const CartRow = ({
  item,
  onQuantityChange,
}: {
  item: CartItem;
  onQuantityChange: (
    cartItemId: number,
    newQty: number,
    productId: number,
    isNext: boolean,
  ) => void;
}) => {
  const { mutate: removeOrderItem, isPending } = useRemoveOrderItem();
  const queryClient = useQueryClient();

  const mainImage =
    item.product.images.sort((a, b) => a.imageOrder - b.imageOrder)[0]
      ?.imageUrl || "";

  const taxIncludePrice = item.product?.discountSalePrice
    ? Math.round(item.product?.discountSalePrice * (item.product?.tax / 100))
    : 0;

  const handDelete = (id: number) => {
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

  return (
    <tr className="border-b border-disabled/20 last:border-b-0">
      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-50">
            <ImageComponent
              imgURL={getPublicUrl(mainImage)}
              imgName={`cart-${item.product.productId}`}
            />
          </div>
          <div>
            <div className="text-dark">{item.product.name}</div>
            <div className="text-sm text-dark mt-2">
              ¥
              {(
                item.product.discountSalePrice + taxIncludePrice
              ).toLocaleString("ja-JP")}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-dark">
        ¥{item.product.discountSalePrice.toLocaleString("ja-JP")}
      </td>
      <td className="py-4 px-4">
        <div className="inline-flex items-center">
          <Button
            className="cursor-pointer border-disabled/30"
            variant={"outline"}
            onClick={() =>
              onQuantityChange(
                item.cartItemId,
                item.productQty + 1,
                item.product.productId,
                true,
              )
            }
            aria-label="増やす"
          >
            +
          </Button>
          <div className="px-4 py-1">{item.productQty}</div>
          <Button
            className="cursor-pointer border-disabled/30"
            variant={"outline"}
            onClick={() =>
              item.productQty > 1 &&
              onQuantityChange(
                item.cartItemId,
                item.productQty - 1,
                item.product.productId,
                false,
              )
            }
            aria-label="減らす"
          >
            -
          </Button>
        </div>
      </td>
      <td className="py-4 px-4 text-dark">
        ¥
        {(item.product.discountSalePrice * item.productQty).toLocaleString(
          "ja-JP",
        )}
      </td>
      <td className="py-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handDelete(item.cartItemId)}
          aria-label="Delete item"
          className="text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer "
          disabled={isPending}
        >
          {isPending ? (
            <LoadingIndicator size="sm" />
          ) : (
            <Trash2 className="h-5 w-5" />
          )}
        </Button>
      </td>
    </tr>
  );
};

const CartTable = ({
  items,
  onQuantityChange,
}: {
  items: CartItem[];
  onQuantityChange: (
    cartItemId: number,
    newQty: number,
    productId: number,
    isNext: boolean,
  ) => void;
}) => {
  if (!items || items.length === 0) {
    return <div className="mt-20 text-center">カートに商品がありません</div>;
  }

  return (
    <>
      <div className="overflow-x-auto border border-disabled/20 mt-20 rounded-lg hidden md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-foreground text-dark">
              <th className="py-3 px-4 font-medium text-left">商品</th>
              <th className="py-3 px-4 font-medium text-left">金額（税別）</th>
              <th className="py-3 px-4 font-medium text-left">個数</th>
              <th className="py-3 px-4 font-medium text-left">合計金額</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              return (
                <CartRow
                  key={item.cartItemId}
                  item={item}
                  onQuantityChange={onQuantityChange}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="block sm:hidden mt-20">
        {items.map((item) => (
          <MobileProductCart
            key={item.cartItemId}
            item={item}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </>
  );
};

export default CartTable;
