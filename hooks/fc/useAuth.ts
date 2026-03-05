import { apiRoutes } from "@/lib/api/api.route";
import { Login } from "@/types/fc";
import { useMutation } from "@tanstack/react-query";

  /**
   * Use Login
   * @author Paing Sett Kyaw
   * @created 2025-11-12
   * @updated ****-**-**
   * @returns Mutation
   */
export const useLogin = () =>
  useMutation({
    mutationKey: ["login-fc"],
    mutationFn: (data: Login) => apiRoutes.fc.auth.login(data),
  });

  