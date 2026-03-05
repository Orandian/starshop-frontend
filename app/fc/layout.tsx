// app/fc/layout.tsx
"use client";

import BankInfoModal from "@/components/fc/BankInfoAlertModal";
import WaitingApprovalScreen from "@/components/fc/WaitingApprovalScreen";
import FCLayout from "@/components/layouts/FCLayout";
import FCRegisterLayout from "@/components/layouts/FCRegisterLayout";
import { useBankValidation } from "@/hooks/fc/useBankValidation";
import { useGuard } from "@/hooks/fc/useGurad";
import { useUserStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isUserLoading, user } = useGuard();
  const { needsBankInfo } = useBankValidation(user || null);


  const initialize = useUserStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle loading state
  if (isLoading || (isAuthenticated && isUserLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handle unauthenticated access
  if (
    !isAuthenticated &&
    !pathname.includes("/register") &&
    !pathname.startsWith("/fc/jp/partner/") &&
    !pathname.includes("/fc/jp/partner/[id]")
  ) {
    return null; // The hook will handle the redirect
  }

  // Handle registration flow
  if (pathname.includes("/register")) {
    return <FCRegisterLayout>{children}</FCRegisterLayout>;
  }

  if (pathname.startsWith("/fc/jp/partner/")) {
    // Let the partner page handle its own logic
    return <>{children}</>;
  }


  if (
    isAuthenticated &&
    user &&
    user.admin_confirm !== 1 &&
    !pathname.includes("/waiting-approval")
  ) {
    return <WaitingApprovalScreen />;
  }

  // Handle authenticated access
  return (
    <>
      <FCLayout>
        {children}
        <BankInfoModal
          isOpen={needsBankInfo}
          onClose={() => {}}
          onSuccess={() => {}}
          userBankInfo={user}
        />
      </FCLayout>
    </>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
