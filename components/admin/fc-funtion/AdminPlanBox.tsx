import { Skeleton } from "@/components/ui/skeleton";
import { FCMasterPlanWithProducts, Product } from "@/types/admin/fcplan.type";
import { Minus, Plus } from "lucide-react";

interface AdminPlanBoxProps {
  allProducts: (Product & { value: number; label: string })[];
  fcPlanProducts: FCMasterPlanWithProducts[];
  planQuantities: { [key: string]: { [productId: string]: number } };
  updateQuantity: (planId: number, productId: number, delta: number) => void;
  isLoading: boolean;
}
const AdminPlanBox = ({
  allProducts,
  fcPlanProducts,
  planQuantities,
  updateQuantity,
  isLoading,
}: AdminPlanBoxProps) => {
  const getProductPrice = (
    product: Product,
    plan: FCMasterPlanWithProducts
  ) => {
    const planProduct = plan.planProducts.find(
      (p) => p.productId === product.productId
    );

    if (planProduct && planProduct.discountSalePrice !== null) {
      return planProduct.discountSalePrice;
    } else {
      return (
        product.salePrice -
        product.salePrice * ((100 - plan.wholesaleRate) / 100)
      );
    }
  };

  const isProductInPlan = (
    plan: FCMasterPlanWithProducts,
    productId: number
  ) => {
    return plan.planProducts.some((p) => p.productId === productId);
  };

  const getTotalPrice = (plan: FCMasterPlanWithProducts) => {
    return allProducts.reduce((total, product) => {
      const quantity =
        planQuantities[plan.fcPlanMasterId]?.[product.productId] || 0;
      if (quantity > 0) {
        const price = getProductPrice(product, plan);
        return total + price * quantity;
      }
      return total;
    }, 0);
  };

  const getSalePrice = (plan: FCMasterPlanWithProducts) => {
    return allProducts.reduce((total, product) => {
      const quantity =
        planQuantities[plan.fcPlanMasterId]?.[product.productId] || 0;
      if (quantity > 0) {
        return total + product.salePrice * quantity;
      }
      return total;
    }, 0);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {isLoading
        ? Array.from({ length: 2 }).map((_, i) =>
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index + i} className="h-10 text-center">
                <Skeleton className="w-full h-full bg-white-bg" />
              </div>
            )),
          )
        : fcPlanProducts.map((plan) => (
            <div
              key={plan.fcPlanMasterId}
              className="bg-gray-50 rounded-[10px] p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">{plan.planName}</h3>
                <div className="text-right flex items-center gap-4">
                  <p className=" line-through">
                    ¥{getSalePrice(plan).toLocaleString("ja-JP")}
                  </p>
                  <p className="text-xl font-bold">
                    ¥{getTotalPrice(plan).toLocaleString("ja-JP")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {allProducts.map((product) => {
                  const isInPlan = isProductInPlan(plan, product.productId);
                  const quantity =
                    planQuantities[plan.fcPlanMasterId]?.[product.productId] ||
                    0;
                  const discountedPrice = getProductPrice(product, plan);

                  return (
                    <div
                      key={product.productId}
                      className={`flex items-center gap-4  p-4 rounded-lg ${
                        quantity === 0 ? "bg-gray-200 " : "bg-white shadow-sm"
                      }`}
                    >
                      <div
                        className={`flex-1 min-w-[150px] flex items-center gap-4 ${quantity === 0 ? "text-gray-500 " : ""}`}
                      >
                        <span className="w-44 text-sm font-medium">
                          {product.label}
                        </span>
                        <div className="flex flex-col justify-center item-center">
                          <p className="text-sm text-gray-500 line-through mt-1">
                            ¥{product.salePrice.toLocaleString("ja-JP")}
                          </p>
                          <p className="text-sm font-medium">
                            ¥{discountedPrice.toLocaleString("ja-JP")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            quantity > 0 &&
                            updateQuantity(
                              plan.fcPlanMasterId,
                              product.productId,
                              -1,
                            )
                          }
                          disabled={quantity === 0}
                          className={`w-8 h-8 border rounded flex items-center justify-center ${
                            quantity > 0
                              ? "border-black/20 hover:bg-gray-100"
                              : "border-gray-200 bg-gray-100 cursor-not-allowed"
                          }`}
                        >
                          <Minus size={16} />
                        </button>

                        <input
                          type="number"
                          value={quantity}
                          readOnly
                          className={`w-12 text-center border rounded py-1 ${
                            quantity > 0
                              ? "border-black/20"
                              : "border-blue-200 bg-blue-50"
                          }`}
                        />
                        <button
                          onClick={() =>
                            updateQuantity(
                              plan.fcPlanMasterId,
                              product.productId,
                              1,
                            )
                          }
                          className={`w-8 h-8 border rounded flex items-center justify-center ${
                            isInPlan
                              ? "border-black/20 hover:bg-gray-100"
                              : " hover:bg-blue-50 bg-white"
                          }`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div
                        className={`w-24 text-right font-medium ${quantity === 0 ? "text-gray-500 " : ""}`}
                      >
                        ¥{(discountedPrice * quantity).toLocaleString("ja-JP")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
    </div>
  );
};

export default AdminPlanBox;
