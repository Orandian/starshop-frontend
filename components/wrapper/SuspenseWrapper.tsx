import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuspenseWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton className="w-full h-[500px] bg-white-bg border border-black/10" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
