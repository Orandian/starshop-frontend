import AdminPlanBox from "@/components/admin/fc-funtion/AdminPlanBox";
import {
  useGetAllFcPlanProducts,
  useGetFcPlanProducts,
} from "@/hooks/admin/useFc";
import {
  FCMasterPlanWithProducts,
  Product,
  UpdateFCPlanProduct,
} from "@/types/admin/fcplan.type";
import { useEffect, useMemo, useState } from "react";

export const useAdminPlanBox = () => {
  const { data: allFcPlanProducts, isLoading: isLoadingAllFcPlan } = useGetAllFcPlanProducts();
  const { data: fcPlanProducts, isLoading: isLoadingFcPlan } = useGetFcPlanProducts();
  const [planQuantities, setPlanQuantities] = useState<{
    [key: string]: { [productId: string]: number };
  }>({});

  const [planProducts, setPlanProducts] = useState<FCMasterPlanWithProducts[]>(
    []
  );


  useEffect(() => {
    if (fcPlanProducts?.data) {
      setPlanProducts(fcPlanProducts.data);

      // Initialize planQuantities with actual product quantities
      const initialQuantities: {
        [key: string]: { [productId: string]: number };
      } = {};
      fcPlanProducts.data.forEach((plan) => {
        initialQuantities[plan.fcPlanMasterId] = {};
        plan.planProducts.forEach((product) => {
          initialQuantities[plan.fcPlanMasterId][product.productId] =
            product.stockQuantity;
        });
      });
      setPlanQuantities(initialQuantities);
    }
  }, [fcPlanProducts]);

  // Transform the data to match the required payload structure

  const allProducts = useMemo(() => {
    return (
      allFcPlanProducts?.data?.map((product) => ({
        value: product.productId,
        label: product.name,
        ...product, // Include all product data for price calculations
      })) || []
    );
  }, [allFcPlanProducts]);

  const updateQuantity = (planId: number, productId: number, delta: number) => {
    setPlanQuantities((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [productId]: Math.max(0, (prev[planId]?.[productId] || 0) + delta),
      },
    }));
  };

  const payload: UpdateFCPlanProduct = useMemo(
    () => ({
      fcPlanMasters: planProducts.map((plan) => ({
        fcPlanMasterId: plan.fcPlanMasterId,
        products: allProducts
          .map((product: Product) => ({
            productId: product.productId,
            quantity:
              planQuantities[plan.fcPlanMasterId]?.[product.productId] || 0,
          })),
      })) .filter((plan) => plan.products.length > 0),
    }),
    [planProducts, planQuantities, allProducts] // allProducts is now available
  );


  return {
    PlanBox: (
      <AdminPlanBox
        allProducts={
          allProducts as (Product & { value: number; label: string })[]
        }
        fcPlanProducts={planProducts}
        planQuantities={planQuantities}
        updateQuantity={updateQuantity}
        isLoading={isLoadingAllFcPlan || isLoadingFcPlan}
      />
    ),
    payload,
  };
};
