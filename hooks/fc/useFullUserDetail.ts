import { useCallback } from "react";
import { useUserDetail, useUserDetailById } from "@/hooks/fc/useRegister";

export const useFullUserDetail = () => {

  /**
   * Fetch main user detail
   * @returns UserDetail
   * @author Phway
   * @created 2025-11-25
   * @updated 2025-11-25
   */
  const { data: userDetail, isLoading: isUserLoading } = useUserDetail();
  const userId = userDetail?.data?.user?.userId;
  const referrerId = userDetail?.data?.referrerId;

  /**
   * Fetch referrer detail
   * @returns UserDetail
   * @author Phway
   * @created 2025-11-25
   * @updated 2025-11-25
   */
  const { data: referralUserDetail, isLoading: isReferralUserLoading } =
    useUserDetailById(referrerId ? referrerId.toString() : "");

  /**
   * Get user date
   * @returns string
   * @author Phway
   * @created 2025-11-25
   * @updated 2025-11-25
   */
  const getDate = useCallback(() => {
    const created = userDetail?.data?.createdAt;
    if (!created) return "";
    return `${created[0]}-${created[1]}-${created[2]}`;
  }, [userDetail]);

  /**
   * Get user address
   * @returns string
   * @author Phway
   * @created 2025-11-25
   * @updated 2025-11-25
   */
  const getAddress = useCallback(() => {
    const address1 = userDetail?.data?.user?.userAddresses?.[0]?.address1 || "";
    const address2 = userDetail?.data?.user?.userAddresses?.[0]?.address2 || "";
    const city = userDetail?.data?.user?.userAddresses?.[0]?.city || "";
    const state = userDetail?.data?.user?.userAddresses?.[0]?.prefecture || "";
    const zipCode =
      userDetail?.data?.user?.userAddresses?.[0]?.postalCode || "";
    return zipCode + " " + city + " " + state + " " + address1 + " " + address2;
  }, [userDetail]);


  return {
    userDetail,
    isUserLoading,
    referralUserDetail,
    isReferralUserLoading,
    getDate,
    getAddress,
    userId,
  };
};
