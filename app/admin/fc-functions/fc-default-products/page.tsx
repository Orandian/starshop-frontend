"use client";

import { useAdminPlanBox } from "@/components/admin/fc-funtion/useAdminPlanBox";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useUpdateFcPlanProducts } from "@/hooks/admin/useFc";
import { toast } from "sonner";

const FcDefaultProductsPage = () => {
  const { PlanBox, payload } = useAdminPlanBox();
  const { mutate: updateFcPlanProducts, isPending } = useUpdateFcPlanProducts();
  const handleSave = () => {
    updateFcPlanProducts(payload, {
      onSuccess: () => toast.success("設定を保存しました"),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h2>推奨セット設定</h2>
          </div>
        </div>

        {PlanBox}
   

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button
            className="bg-primary hover:bg-primary/80 text-white px-8 py-2 rounded-md"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? <LoadingIndicator size="sm" /> : "保存"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FcDefaultProductsPage;
