import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductPageWrapper from "@/app/products/ProductsPageWrapper";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton className="w-full h-[500px] bg-white-bg border border-black/10" />
        </div>
      }
    >
      <ProductPageWrapper />
    </Suspense>
  );
}
