"use client";
import { logout as serverLogout } from "@/lib/api/auth";
import { useUserStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export const useProfileLogout = () => {
    const logoutStore = useUserStore((state) => state.logout);
    const router = useRouter();

    const handleUserLogout = async () => {
        try {
            await serverLogout(); // 1. clear cookies
            logoutStore();          // 2. clear Zustand
            router.push("/login");  // 3. redirect
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return { handleUserLogout };
};
