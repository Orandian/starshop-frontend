import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { supplySaleFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import Poduct1 from "@/public/fc/ec-7.png";
import { FCProduct } from "@/types/fc";
import { FCPlan, FCPlanProduct } from "@/types/fc/plan.type";
import { getPublicUrl } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ImageComponent from "../ImageComponent";
type FormValues = z.infer<typeof supplySaleFormSchema>;
type Props = {
  plan: FCPlan;
  handleProductClick: (product: FCPlanProduct) => void;
  form: UseFormReturn<FormValues>;
  setPlanProducts: React.Dispatch<React.SetStateAction<FCProduct[]>>;
  initialQuantities?: Record<number, number>;
  currentPlan?: number | null;
  allPlans: FCPlan[];
};

const PlanBox = ({
  plan,
  handleProductClick,
  form,
  setPlanProducts,
  initialQuantities,
  currentPlan,
  allPlans,
}: Props) => {
  const selectedPlan = form.watch("selectedPlan");
  const isSelected = selectedPlan === plan.fcPlanMasterId;
  const hasOldQuantities =
    initialQuantities && Object.keys(initialQuantities).length > 0;

  const [products, setProducts] = useState<FCPlanProduct[]>([]);

  const [isCustom, setIsCustom] = useState<boolean>(false);

  const updateQuantity = (
    productId: number,
    newQuantity: number,
    currentPlanValue: number,
  ) => {
    const currentProduct = products.find(
      (p) => p.fcPlanDefaultProductId === productId,
    );
    if (!currentProduct) return;

    const additionalAmount =
      (newQuantity - currentProduct.quantity) *
      currentProduct.product.discountSalePrice;

    if (newQuantity > currentProduct.quantity) {
      if (currentPlanValue === 1) {
        const plan2Amount = allPlans?.find(
          (p) => p.fcPlanMasterId === 2,
        )?.contractPurchaseAmount;
        if (
          plan2Amount &&
          Number(totalAmount.replace(/,/g, "")) + additionalAmount >=
            plan2Amount
        ) {
          toast.warning(
            `プラン1の上限額を超えました。プラン2（${plan2Amount.toLocaleString("ja-JP")}円）へのアップグレードをご検討ください。`,
          );
          return;
        }
      }
    } else {
      if (currentPlanValue === 2) {
        const plan1Amount = allPlans?.find(
          (p) => p.fcPlanMasterId === 1,
        )?.contractPurchaseAmount;

        const newTotal =
          Number(totalAmount.replace(/,/g, "")) + additionalAmount;
        if (plan1Amount && newTotal <= plan1Amount) {
          toast.warning(
            `${plan1Amount.toLocaleString("ja-JP")}円以下のご注文の場合は、プラン1（${plan1Amount.toLocaleString("ja-JP")}円）をお選びください。`,
          );
          return;
        }
      }
    }

    const updatedProducts = products.map((product) =>
      product.fcPlanDefaultProductId === productId
        ? { ...product, quantity: Math.max(0, newQuantity) }
        : product,
    );

    setProducts(updatedProducts);

    const payload = updatedProducts
      .filter((product) => product.quantity > 0)
      .map(({ product, quantity }) => ({
        productId: product.productId,
        quantity,
      }));

    setPlanProducts(payload);
  };

  const calculateTotalAmount = useCallback(() => {
    const totalPrice = products.reduce((total, item) => {
      return total + item.product.discountSalePrice * item.quantity;
    }, 0);
    if (isSelected) form.setValue("totalAmount", totalPrice);
    return totalPrice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, isSelected]);

  const totalAmount = calculateTotalAmount().toLocaleString("ja-JP");

  const handleSystemChoice = () => {
    setIsCustom(false);
    // Reset quantities to default
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        quantity:
          plan.planProducts.find(
            (p) => p.product.productId === product.product.productId,
          )?.quantity || 0, // Default quantity for system choice
      })),
    );
  };

  useEffect(() => {
    if (!plan.planProducts) return;

    const shouldBeCustom =
      currentPlan === plan.fcPlanMasterId && hasOldQuantities;
    setIsCustom(shouldBeCustom ?? false);

    const updateProducts = () => {
      // If currentPlan matches this plan's ID or no plan is selected yet
      const isCurrentPlan = currentPlan === plan.fcPlanMasterId;
      const isPlanSelected = selectedPlan === plan.fcPlanMasterId;

      // const isInitialState = currentPlan === null;

      const newProducts = plan.planProducts.map((product) => {
        const productId = product.product.productId;
        const hasInitialQty = initialQuantities?.[productId] !== undefined;

        if (isCurrentPlan) {
          return hasInitialQty
            ? {
                ...product,
                quantity: initialQuantities[productId],
              }
            : {
                ...product,
                quantity: 0,
              };
        }

        if (isPlanSelected) {
          return {
            ...product,
            quantity: product.quantity,
          };
        }

        return {
          ...product,
          quantity: product.quantity,
        };
      });

      setProducts((prevProducts) => {
        const prevString = JSON.stringify(prevProducts);
        const newString = JSON.stringify(newProducts);
        return prevString === newString ? prevProducts : newProducts;
      });

      return newProducts;
    };

    const updatedProducts = updateProducts();

    // Only update plan products if this is the selected plan and we're not in custom mode
    if (isSelected) {
      const payload = updatedProducts
        .filter((product) => product.quantity > 0)
        .map(({ product, quantity }) => ({
          productId: product.productId,
          quantity,
        }));

      setPlanProducts(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlan, selectedPlan, plan.planProducts]);

  const renderProduct = (product: FCPlanProduct) => (
    <div
      key={product.fcPlanDefaultProductId}
      className={cn(
        "flex flex-col md:flex-row items-start md:items-center w-full justify-between py-2 bg-foreground px-2 rounded-md",
        !isSelected && "bg-disabled/10",
      )}
    >
      {/* Product Info */}
      <div className="flex justify-between items-center gap-3 ">
        <ImageComponent
          imgURL={
            product.product.images?.length > 0 &&
            product.product.images[0]?.imageUrl &&
            (product.product.images[0].imageUrl.startsWith("http") ||
              product.product.images[0].imageUrl.startsWith("/"))
              ? getPublicUrl(product.product.images[0].imageUrl)
              : Poduct1.src
          }
          imgName="P1"
          className="w-16 h-16 rounded object-contain bg-disabled/20 border"
        />
        <div className="flex flex-col">
          <div
            className="cursor-pointer text-alink text-base font-medium hover:underline"
            onClick={() => isSelected && handleProductClick(product)}
          >
            {product.product.name}
          </div>
          <div className="text-xs text-gray-400 line-through">
            {`¥${product.product.salePrice}`}
          </div>
          <div className="text-sm text-dark">
            {product.product.discountSalePrice
              ? `¥${product.product.discountSalePrice.toLocaleString("ja-JP")}`
              : "¥0"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end md:justify-between mt-4 md:mt-0 w-full md:w-auto">
        {/* QTY*/}
        <div className="flex items-center border border-disabled/30 rounded px-2 py-1 bg-white">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-0 text-dark cursor-pointer"
            onClick={() =>
              isSelected &&
              updateQuantity(
                product.fcPlanDefaultProductId,
                product.quantity - 1,
                plan.fcPlanMasterId,
              )
            }
            disabled={!isSelected || !isCustom || product.quantity <= 0}
          >
            -
          </Button>
          <span className="w-6 text-center">{product.quantity}</span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-0 text-dark cursor-pointer"
            onClick={() =>
              isSelected &&
              updateQuantity(
                product.fcPlanDefaultProductId,
                product.quantity + 1,
                plan.fcPlanMasterId,
              )
            }
            disabled={!isSelected || !isCustom}
          >
            +
          </Button>
        </div>
        {/* Price */}
        
        <div className="w-[30%] md:w-24 text-right text-dark flex flex-col">
              <span className="text-xs line-through">¥
          {(
            product.product.salePrice * product.quantity
          ).toLocaleString("ja-JP")}</span>
          <span>¥
          {(
            product.product.discountSalePrice * product.quantity
          ).toLocaleString("ja-JP")}</span>
        </div>
      </div>
    </div>
  );



  return (
    <div
      className={`mt-4 bg-white border rounded-md ${isSelected ? "border-primary" : "border-disabled/30 bg-disabled/30"}`}
    >
      <div
        className={`  p-2 flex flex-row  md:hidden items-center space-x-2 border-b ${isSelected ? "border-primary" : "border-disabled/30 bg-disabled/20"}`}
      >
        <FormField
          control={form.control}
          name="selectedPlan"
          render={({ field }) => ( 
            <FormItem className="w-full">
              <FormControl>
                <CustomCheckbox
                  checked={selectedPlan?.toString() === allPlans[0].fcPlanMasterId?.toString()}
                  onChange={(checked) => {
                    if (checked) {
                      field.onChange(allPlans[0].fcPlanMasterId);
                    }
                  }}
                  className={cn(
                    "w-full p-3 rounded-lg",
                    selectedPlan?.toString() === allPlans[0].fcPlanMasterId?.toString() 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-black"
                  )}
                >
                  <div className="flex flex-col md:flex-row w-full">
                    <span className="text-sm font-medium">
                      ¥
                      {allPlans[0]?.contractPurchaseAmount?.toLocaleString(
                        "ja-JP",
                      ) || ""}
                    </span>
                    <span className="text-sm">
                      （仕入 {allPlans[0]?.wholesaleRate}%）
                    </span>
                  </div>
                </CustomCheckbox>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selectedPlan"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <CustomCheckbox
                  checked={selectedPlan?.toString() === allPlans[1].fcPlanMasterId?.toString()}
                  onChange={(checked) => {
                    if (checked) {
                      field.onChange(allPlans[1].fcPlanMasterId);
                    }
                  }}
                  className={cn(
                    "w-full p-3 rounded-lg",
                    selectedPlan?.toString() === allPlans[1].fcPlanMasterId?.toString() 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-black"
                  )}
                >
                  <div className="flex flex-col md:flex-row w-full">
                    <span className="text-sm font-medium">
                      ¥
                      {allPlans[1].contractPurchaseAmount?.toLocaleString(
                        "ja-JP",
                      ) || ""}
                    </span>
                    <span className="text-sm">
                      （仕入 {allPlans[1]?.wholesaleRate}%）
                    </span>
                  </div>
                </CustomCheckbox>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div
        className={` p-3 md:flex hidden items-center space-x-4 border-b ${isSelected ? "border-primary" : "border-disabled/30 bg-disabled/30"}`}
      >
        <FormField
          control={form.control}
          name="selectedPlan"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  id={`plan-${plan.fcPlanMasterId}`}
                  checked={field.value?.toString() === plan.fcPlanMasterId?.toString()}
                  onCheckedChange={(checked) =>
                    checked && field.onChange(parseInt(plan.fcPlanMasterId?.toString() || "0"))
                  }
                />
              </FormControl>
              <FormLabel htmlFor={`plan-${plan.fcPlanMasterId}`} className="mt-0! cursor-pointer">
                <span className="text-lg font-medium">
                  ¥{plan?.contractPurchaseAmount?.toLocaleString("ja-JP") || ""}
                </span>
                <span className="text-dark">
                  （商品の仕入は {plan?.wholesaleRate}%になります）
                </span>
              </FormLabel>
            </div>
          )}
        />
      </div>
      {/* Select Type */}
      <div className={`p-2 md:p-5 flex items-center space-x-2  ${isSelected ? "border-primary" : "border-disabled/30 bg-disabled/30"}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          <div className="space-x-4 hidden md:block">
            <Button
              type="button"
              className={cn(
                " text-white hover:bg-dark cursor-pointer",
                !isCustom ? "bg-black" : "bg-disabled/50",
              )}
              onClick={handleSystemChoice}
              disabled={!isSelected}
            >
              推奨セット
            </Button>
            <Button
              type="button"
              className={cn(
                " text-white hover:bg-dark cursor-pointer",
                isCustom ? "bg-black" : "bg-disabled/50",
              )}
              onClick={() => setIsCustom(true)}
              disabled={!isSelected}
            >
              自分で選択
            </Button>
          </div>

          <div className="space-x-4 my-4 sm:hidden">
            <div className="flex items-center space-x-2">
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={!isCustom}
                    onCheckedChange={(checked) =>
                      checked && handleSystemChoice()
                    }
                  />
                </FormControl>
                <FormLabel className="mt-0! cursor-pointer">
                  推奨セット
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={isCustom}
                    onCheckedChange={(checked) =>
                    checked && setIsCustom(true)
                  }
                  />
                </FormControl>
                <FormLabel className="mt-0! cursor-pointer">
                  自分で選択
                </FormLabel>
              </FormItem>
            </div>

            {/* <RadioGroup
              value={isCustom ? "custom" : "system"}
              onValueChange={(value) => setIsCustom(value === "custom")}
              disabled={!isSelected}
            >
              <RadioGroupItem value="system" className="text-black hover:bg-dark cursor-pointer">
                <p className="text-black">推奨セット</p>
              </RadioGroupItem>
              <RadioGroupItem value="custom" className="text-black hover:bg-dark cursor-pointer">
                <p className="text-black">自分で選択</p>
              </RadioGroupItem>
            </RadioGroup> */}
          </div>

          <div className="bg-disabled/20 rounded-md p-3  w-full sm:hidden">
            合計：¥{totalAmount}
            (税別)
          </div>

          <div className="text-right hidden md:block">
            ¥{totalAmount}
            (税別)
          </div>
        </div>
      </div>
      {/* Default Product List */}
      <div className={`p-5 flex flex-col items-center space-x-2 space-y-4 ${isSelected ? "border-primary" : "border-disabled/30 bg-disabled/30"}`}>
        {/* Simple Product */}
        {products.map((product) => renderProduct(product))}
      </div>
    </div>
  );
};

export default PlanBox;
