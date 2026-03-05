import { apiRoutes } from "@/lib/api/api.route";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Get subscription summaries
 * @param page - Page number (default: 1)
 * @param pageSize - Number of records per page (default: 10)
 * @param purchaseDate - Purchase date
 * @param status - Subscription status
 * @returns Paginated subscription summaries and total count
 * @author ヤン
 */
export const useGetSubscriptionSummaries = (
  page: number = 1,
  pageSize: number = 10,
  purchaseDate: string = "",
  status: string = "all"
) => {
  return useQuery({
    queryKey: ["subscription-summaries", page, pageSize, purchaseDate, status],
    queryFn: () =>
      axios.get("/api/user/subscriptions/summary", {
        params: { page, pageSize, purchaseDate, status },
      }),
    select: (response) => response.data,
  });
};

export const useGetUserSubscriptionSummary = (brandId?: string) => {
  return useQuery({
    queryKey: ["products-public", brandId],
    queryFn: async () =>
    await apiRoutes.user.userSubscriptionSummary(1, 100),
  });
};

/**
 * Get customer subscription details by id
 * @param subscriptionId - Subscription id
 * @returns Customer subscription details
 * @author ヤン
 */
export const useGetSubscriptionSummaryDetailsBySubscriptionId = (
  subscriptionId: number
) => {
  return useQuery({
    queryKey: ["subscription-summary-details", subscriptionId],
    queryFn: () =>
      axios.get("/api/user/subscriptions/" + subscriptionId + "/details"),
    enabled: !!subscriptionId,
    select: (response) => response.data,
  });
};

interface CancelSubscriptionParams {
  subscriptionId: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}

/**
 * Cancel subscription
 * @param subscriptionId - Subscription id
 * @param stripeSubscriptionId - Stripe subscription id
 * @param stripeCustomerId - Stripe customer id
 * @returns
 * @author ヤン
 */
export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: (params: CancelSubscriptionParams) =>
      axios.delete("/api/user/subscriptions/cancel", {
        data: {
          subscriptionId: params.subscriptionId,
          stripeSubscriptionId: params.stripeSubscriptionId,
          stripeCustomerId: params.stripeCustomerId,
        },
      }),
  });
};
