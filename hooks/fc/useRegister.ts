import { apiRoutes } from "@/lib/api/api.route";
import { useUserStore } from "@/store/useAuthStore";
import { AccountRegister, AccountVerify, FCRegister } from "@/types/fc";
import {
  UserAddressRequest,
  UserDetailUpdate,
  UserProfile1Update,
  UserProfile2Update,
  UserAddressUpdate,
  UserBankUpdate,
} from "@/types/fc/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Use Account Register with mail
 * @author Paing Sett Kyaw
 * @created 2025-11-12
 * @updated 2025-11-13
 * @returns Mutation
 */
export const useAccountRegister = () =>
  useMutation({
    mutationKey: ["account-register"],
    mutationFn: (data: AccountRegister) =>
      apiRoutes.fc.register.accountRegister(data),
  });

/**
 * Use Account Verify with otp and data
 * @author Paing Sett Kyaw
 * @created 2025-11-12
 * @updated 2025-11-13
 * @returns Mutation
 */
export const useAccountVerify = () =>
  useMutation({
    mutationKey: ["account-verify"],
    mutationFn: (data: AccountVerify) =>
      apiRoutes.fc.register.accountVerify(data),
  });

/**
 * Use FC Account Register with data
 * @author Paing Sett Kyaw
 * @created 2025-11-12
 * @updated 2025-11-13
 * @returns Mutation
 */
export const useFCRegister = () =>
  useMutation({
    mutationKey: ["fc-register"],
    mutationFn: (data: FCRegister) => apiRoutes.fc.register.fcRegister(data),
  });

/**
 * Use FC Plan Master
 * @author Paing Sett Kyaw
 * @created 2025-11-12
 * @updated 2025-11-13
 * @returns Data
 */

export const useFCPlan = () =>
  useQuery({
    queryKey: ["fc-plan"],
    queryFn: () => apiRoutes.fc.register.fcPlan(),
  });

/**
 * Use User Detail
 * @author Paing Sett Kyaw
 * @created 2025-11-13
 * @updated ****-**-**
 * @returns Data
 */

export const useUserDetail = () =>
  useQuery({
    queryKey: ["user-detail"],
    queryFn: () => apiRoutes.fc.user.userDetail(),
    enabled: !!useUserStore.getState().token,
  });

/**
 * Use User Detail By Id
 * @author Phway
 * @created 2025-11-25
 * @updated ****-**-**
 * @returns Data
 */

export const useUserDetailById = (id: string) =>
  useQuery({
    queryKey: ["user-detail-by-id", id],
    queryFn: async () => {
      const response = await apiRoutes.fc.user.userDetailById(id);
      return response;
    },
    enabled: !!id,
  });

/**
 * Use User Detail Update
 * @author Paing Sett Kyaw
 * @created 2025-11-13
 * @updated ****-**-**
 * @returns Mutation
 */

export const useUserDetailUpdate = () =>
  useMutation({
    mutationKey: ["user-detail-update"],
    mutationFn: (data: UserDetailUpdate) =>
      apiRoutes.fc.user.userDetailUpdate(data),
  });

/**
 * Use FC Step
 * @author Paing Sett Kyaw
 * @created 2025-11-13
 * @updated ****-**-**
 * @returns Mutation
 */
export const useFCStep = () =>
  useMutation({
    mutationKey: ["fc-step"],
    mutationFn: (step: number) => apiRoutes.fc.register.fcStep(step),
  });

export const useFCGetAddress = () =>
  useMutation({
    mutationKey: ["fc-get-address"],
    mutationFn: (data: UserAddressRequest) =>
      apiRoutes.fc.register.fcGetAddress(data),
  });

/**
 * Use User Detail Update for Name Section
 * @author Phway
 * @created 2025-11-26
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserProfile1Update = () =>
  useMutation({
    mutationKey: ["user-profile-1-update"],
    mutationFn: (data: UserProfile1Update) =>
      apiRoutes.fc.user.userProfile1Update(data),
  });

/**
 * Use User Detail Update for Basic Info Section
 * @author Phway
 * @created 2025-11-26
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserProfile2Update = () =>
  useMutation({
    mutationKey: ["user-profile-2-update"],
    mutationFn: (data: UserProfile2Update) =>
      apiRoutes.fc.user.userProfile2Update(data),
  });

/**
 * Use User Detail Update for Delivery and Address Section
 * @author Phway
 * @created 2025-11-26
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserAddressUpdate = () =>
  useMutation({
    mutationKey: ["user-address-update"],
    mutationFn: (data: UserAddressUpdate) =>
      apiRoutes.fc.user.userAddressUpdate(data),
  });

/**
 * Update for bank info
 * @author Phway
 * @created 2025-11-26
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserBankUpdate = () =>
  useMutation({
    mutationKey: ["user-bank-update"],
    mutationFn: (data: UserBankUpdate) =>
      apiRoutes.fc.user.userBankUpdate(data),
  });

export const useFCCheckUserExists = (id: number) =>
  useQuery(
    {
      queryKey: ["fc-check-user-exists", id],
      queryFn: () => apiRoutes.fc.register.fcCheckUserExists(id),
    enabled: !!id,
  });
