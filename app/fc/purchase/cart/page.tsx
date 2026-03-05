"use client";

import CartTable from "@/components/fc/purchase/CartTable";
import StepIndicator from "@/components/fc/purchase/StepIndicator";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useAddToCart, useGetCart, useUserDetail } from "@/hooks/fc";
import {
  useGetCalculationShippingCost,
  useGetFcSettng,
} from "@/hooks/fc/useSetting";
import { CartItem } from "@/types/fc";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const FCCartPage = () => {
  const { data: cart, isLoading } = useGetCart();
  const { mutate: updateCart, isPending: isUpdatingCart } = useAddToCart();
  const { data: userDetail, isLoading: isUserDetailLoading } = useUserDetail();
  const { data: fcSetting, isLoading: isGetFcSetting } = useGetFcSettng();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [findCostbyPrefecture, setFindCostbyPrefecture] = useState({
    prefecture: "",
    quantity: "",
  });

  const {
    data: calculationShippingCost,
    isLoading: isCalculationShippingCost,
  } = useGetCalculationShippingCost({
    prefecture: findCostbyPrefecture.prefecture,
    quantity: Number(findCostbyPrefecture.quantity),
  });

  useEffect(() => {
    if (cart?.data?.length === 0) {
      router.push("/fc/purchase");
    }
    if (cart?.data) {
      setFindCostbyPrefecture({
        prefecture: "",
        quantity: cart.data.length.toString(),
      });
      setCartItems(cart.data);
    }

    if (userDetail?.data && cart?.data) {
      const billing_address = userDetail.data.user.userAddresses?.filter(
        (address) => address.addressType === 2,
      )[0];
      setFindCostbyPrefecture({
        prefecture: billing_address.city,
        quantity: cart?.data?.length?.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.data, userDetail?.data]);

  // Debounced function to update cart via API
  const debouncedUpdateCart = useCallback(
    (cartItemId: number, newQty: number, productId: number) => {
      const foundItem = cartItems.find(
        (item) => item.product.productId === productId,
      );

      if (!foundItem) return;

      updateCart({
        products: [
          {
            productId: Number(productId),
            quantity: newQty,
          },
        ],
      });
    },
    [cartItems, updateCart],
  );

  // Create debounced version
  const debouncedUpdateCartRef = useMemo(
    () => debounce(debouncedUpdateCart, 500), // 500ms delay
    [debouncedUpdateCart],
  );

  const validateQuantity = useCallback(
    (qty: number, foundItem: CartItem, isNext: boolean) => {
      if (!cartItems) return;

      if (!foundItem) return;

      if (qty > foundItem.product.stockQuantity && isNext) {
        toast.error("在庫が少なくなっております。");
        return false;
      }
      return true;
    },
    [cartItems],
  );

  const handleQuantityChange = useCallback(
    (
      cartItemId: number,
      newQty: number,
      productId: number,
      isNext: boolean,
    ) => {
      if (newQty < 1) return;

      const foundItem = cartItems.find(
        (item) => item.product.productId === productId,
      );
      if (!foundItem) {
        return;
      }

      const isValid = validateQuantity(newQty, foundItem, isNext);

      if (!isValid) return;

      // Update local state immediately for UI responsiveness
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, productQty: newQty }
            : item,
        ),
      );

      // Call debounced API update
      debouncedUpdateCartRef(cartItemId, newQty, productId);
    },
    [cartItems, validateQuantity, debouncedUpdateCartRef],
  );

  const handleSaveCart = useCallback(() => {
    const products = cartItems.map((item) => ({
      productId: item.product.productId,
      quantity: item.productQty,
    }));

    updateCart(
      { products },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-cart"] });
          router.push("/fc/purchase/delivery");
        },
        onError: (error) => {
          toast.error("カートの更新に失敗しました");
          console.error("Update cart error:", error);
        },
      },
    );
  }, [cartItems, updateCart, queryClient, router]);

  // Calculate totals
  const { subtotal, tax, total, totalShippingFee } = useMemo(() => {
    if (!cartItems?.length) {
      return { subtotal: 0, tax: 0, total: 0, items: 0 };
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.discountSalePrice * item.productQty,
      0,
    );
    const tax = cartItems.reduce((totalTax, item) => {
      const itemTaxRate = item.product.tax / 100; // Convert percentage to decimal
      const itemSubtotal = item.product.discountSalePrice * item.productQty;
      return totalTax + Math.round(itemSubtotal * itemTaxRate);
    }, 0);

    let totalShippingFee = 0;
    const settingData =
      fcSetting?.data && fcSetting.data.length > 0
        ? fcSetting.data[0]
        : undefined;
    if (settingData?.shippingFreeLimitFc) {
      if (subtotal >= settingData.shippingFreeLimitFc) {
        totalShippingFee = 0;
      } else {
        totalShippingFee = calculationShippingCost?.data?.totalFee || 0;
      }
    }

    const total = subtotal + tax + totalShippingFee;
    const items = cartItems.reduce((count, item) => count + item.productQty, 0);

    return { subtotal, tax, total, items, totalShippingFee };
  }, [cartItems, calculationShippingCost, fcSetting]);

  return (
    <section className="w-full">
      <div className="w-full px-8 py-6 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto ">
        {/* Step indicator */}
        <StepIndicator step={1} />
        {isLoading ||
        isUserDetailLoading ||
        isGetFcSetting ||
        isCalculationShippingCost ? (
          <LoadingIndicator size="lg" />
        ) : (
          <>
            {/* Cart table */}
            <CartTable
              items={cartItems}
              onQuantityChange={handleQuantityChange}
            />

            {/* Summary box */}
            <div className=" bg-white card-border border-0 rounded-[10px]  h-auto p-3 md:p-6 my-8 w-full ml-auto">
              <div className="flex justify-between md:justify-end gap-10">
                <div className="text-right md:text-left space-y-5">
                  <div className="text-sm text-dark">小計</div>
                  <div className="text-sm text-dark mt-2">税金(10%)</div>
                  <div className="text-sm text-dark mt-2">送料</div>
                  <div className="text-lg font-bold mt-4">合計</div>
                </div>

                <div className="w-1/2 md:w-1/9 text-right space-y-5">
                  <div className="text-dark">
                    ¥{subtotal.toLocaleString("ja-JP")}
                  </div>
                  <div className="text-dark mt-2">
                    ¥{tax.toLocaleString("ja-JP")}
                  </div>
                  <div className="text-dark mt-2">
                    ¥{totalShippingFee?.toLocaleString("ja-JP")}
                  </div>
                  <div className="text-xl font-bold mt-4">
                    ¥{total.toLocaleString("ja-JP")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveCart}
                className="h-12 flex cursor-pointer justify-center items-center gap-3 w-30 bg-primary text-white rounded-md"
                disabled={isUpdatingCart}
              >
                {isUpdatingCart ? (
                  <LoadingIndicator size="sm" />
                ) : (
                  <>
                    次へ
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FCCartPage;
