import { apiRoutes } from "@/lib/api/api.route";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use profile
 * @returns
 * @author ヤン
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get("/api/user/profile");
      return res.data;
    },
    select: (data) => data,
  });
};


/**
 * Use update password
 * @returns
 * @author ヤン
 */
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const res = await axios.patch("/api/user/password", {
        newPassword,
      });
      return res.data;
    },
  });
};

/**
 * Use update profile
 * @returns
 * @author ヤン
 */
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (profile: {
      name: string;
    }) => {
      const res = await axios.patch("/api/user/profile", profile);
      return res.data;
    },
  });
};

/**
 * Use Password Update 
 * @returns
 * @author トー
 */

export const useUserNameUpdate = () => {
  return useMutation({
    mutationFn: ({
      name,
    }: {
      name: string;
    }) => apiRoutes.user.userProfileUpdate({
      name,
    }),
  });
};

export const useUserUpdatePassword = () => {
  return useMutation({
    mutationFn: ({
      password,
    }: {
      password: string;
    }) => apiRoutes.user.userProfilePasswordChange({
      newPassword: password,
      confirmPassword: password,
    }),
  });
};
//For forgot password update
export const useUpdatePasswordForgotMail = () => {
  return useMutation({
    mutationFn: ({
      password,
      email,
      token
    }: {
      password: string;
      email: string;
      token: string;
    }) => apiRoutes.public.forgotPasswordChange({
      newPassword: password,
      email: email,
      token: token,
    }),
  });
};
/**
 * Use profile
 * @returns
 * @author トー
 */

export const useProfileAPI = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await apiRoutes.user.userProfile();
    },
  });
};


/**
 * Use update password
 * @returns
 * @author トー
 */
export const useUpdatePasswordAPI = () => {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const res = await axios.patch("/api/user/password", {
        newPassword,
      });
      return res.data;
    },
  });
};

/**
 * Use update profile
 * @returns
 * @author ヤン
 */
export const useUpdateProfileAPI = () => {
  return useMutation({
    mutationFn: async (profile: {
      name: string;
    }) => {
      const res = await axios.patch("/api/user/profile", profile);
      return res.data;
    },
  });
};

/*
  * Get user order summaries
*/
export const useGetUserOrderSummariesAPI = (
  page: number = 1,
  pageSize: number = 10,
  orderDate: string = "",
  status: string = "all"
) => {
  return useQuery({
    queryKey: ["profile-order-summaries", page, pageSize, orderDate, status],
    queryFn:
      async () => {
        return await apiRoutes.user.userOrderSummary(page, pageSize, orderDate, status);
      },
    select: (response) => response.data,
  });
};

export const useGetUserOrderSubscriptionAPI = (
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ["profile-order-subscription", page, pageSize],
    queryFn:
      async () => {
        return await apiRoutes.user.userSubscriptionSummary(page, pageSize);
      },
    select: (response) => response.data,
  });
};