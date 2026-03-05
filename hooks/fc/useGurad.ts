// hooks/fc/useGuard.ts
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/api/auth";
import { apiRoutes } from "@/lib/api/api.route";

const STEP_ROUTES = {
  1: "/fc/register/account-create",
  2: "/fc/register/supply-sale",
  3: "/fc/register/referral",
  4: "/fc/register/account-confirm",
  5: "/fc/mypage",
} as const;

export const useGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Memoize the path checks
  const isPublicPath = useMemo(() => {
    return (
      pathname.includes("/register") ||
      pathname.startsWith("/fc/jp/partner/") ||
      pathname.includes("/fc/jp/partner/[id]")
    );
  }, [pathname]);

  // Auth check function
  const checkAuth = useCallback(async () => {
    try {
      const [user, tk] = await Promise.all([getUser(), getToken()]);
      return { user, token: tk };
    } catch (error) {
      console.error("Auth error:", error);
      return { user: null, token: null };
    }
  }, []);

  // Handle auth state and redirection
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      const { user, token } = await checkAuth();

      if (!isMounted) return;

      if (user?.userId) {
        setUid(user.userId);
        setToken(token as string);
        setIsAuthenticated(true);
      } else {
        setUid(null);
        setToken(null);
        setIsAuthenticated(false);

        if (!isPublicPath) {
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, isPublicPath, router]);

  // User detail query
  const {
    data: userDetail,
    isLoading: isUserLoading,
    refetch: refetchUserDetail,
  } = useQuery({
    queryKey: ["user-detail"],
    queryFn: () => {
      return apiRoutes.fc.user.userDetail();
    },
    enabled: isAuthenticated && !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle step-based routing
  // Handle step-based routing
  useEffect(() => {
    if (isLoading || isUserLoading || !userDetail?.data) {
      return;
    }

    const step = userDetail.data.step;

    if (step === 5) {
      // If user has completed all steps but tries to access any registration page
      if (pathname.startsWith("/fc/register")) {
        router.push("/fc/mypage");
        return;
      }
      // Allow access to other pages
      return;
    }

    // Handle steps 1-4
    if (step >= 1 && step <= 4 && pathname.startsWith("/fc/register")) {
      return;
    } else if (step >= 1 && step <= 4 && !pathname.startsWith("/fc/register")) {
      const targetRoute = STEP_ROUTES[step as keyof typeof STEP_ROUTES];
      if (targetRoute && !pathname.endsWith(targetRoute)) {
        router.push(targetRoute);
      }
    } else {
      router.push(STEP_ROUTES[1]);
    }
  }, [userDetail, isLoading, isUserLoading, pathname, router]);

  return {
    isAuthenticated,
    isLoading,
    isUserLoading,
    user: userDetail?.data,
    token,
    uid,
    refetchUserDetail,
  };
};
