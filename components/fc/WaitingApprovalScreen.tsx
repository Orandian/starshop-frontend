// app/fc/components/WaitingApprovalScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import { useUserStore } from "@/store/useAuthStore";
import { ClockAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WaitingApprovalScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    useUserStore.setState({ user: null, token: null });
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <ClockAlert className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">管理者確認中</h2>
            <p className="mt-2 text-gray-600">
              現在、アカウントの確認を行っております。 承認完了後、サービスをご利用いただけます。
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4 w-full"
          >
            ログアウト
          </Button>
        </div>
      </div>
    </div>
  );
}
