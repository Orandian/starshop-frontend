import { useMutation, useQuery } from "@tanstack/react-query";
import { MESSAGES } from "@/types/messages";
import axios from "axios";
import { apiRoutes } from "@/lib/api/api.route";
import { ForgotEmailVerifyRequest, SignUpRequest, VerifyRequest } from "@/types/auth";

/**
 * ユーザーを取得する
 * @returns
 * @author ヤン
 */
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/user");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * ログイン
 * @returns
 * @author ヤン
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const result = await res.data;

      if (res.status !== 200) {
        throw new Error(result?.message || MESSAGES.AUTH.LOGIN_FAILED);
      }

      return result;
    },
  });
};

/**
 * サインアップ
 * @returns
 * @author ヤン
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: (body: SignUpRequest) => apiRoutes.public.signup(body),
  });
};

/**
 * メール認証
 * @returns 
 * @author ヤン
 */
export const useVerify = () => {
  return useMutation({
    mutationFn: (body: VerifyRequest) => apiRoutes.public.verify(body)
  })
}

export const useEmailForgotVerify = () => {
  return useMutation({
    mutationFn: (body: ForgotEmailVerifyRequest) => apiRoutes.public.forgotEmailVerify(body)
  })
}

/**
 * パスワードリセット
 * @returns
 * @author ヤン
 */
export const useResetPassword = () => {
    return useMutation({
    mutationFn: (body: ForgotEmailVerifyRequest) => apiRoutes.public.forgotEmailPassword(body)
  })
};

/**
 * パスワード変更
 * @returns
 * @author ヤン
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      password,
      confirmPassword,
    }: {
      password: string;
      confirmPassword: string;
    }) => {
      const res = await axios.post("/api/auth/change-password", {
        password,
        confirmPassword,
      });

      const result = await res.data;

      if (res.status !== 200) {
        throw new Error(
          result?.message || MESSAGES.AUTH.CHANGE_PASSWORD_FAILED
        );
      }

      return result;
    },
  });
};
