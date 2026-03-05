import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use get subscription summaries
 * @param page - Page number (default: 1)
 * @param pageSize - Number of records per page (default: 10)
 * @param purchaseDate - Purchase date
 * @param customerName - Customer name
 * @param status - Subscription status
 * @returns Paginated subscription summaries and total count
 * @author ヤン
 */
export const useGetSubscriptionSummaries = (
  page: number = 1,
  pageSize: number = 10,
  purchaseDate: string = "",
  customerName: string = "",
  status: string = "all"
) => {
  return useQuery({
    queryKey: [
      "subscription-summaries",
      page,
      pageSize,
      purchaseDate,
      customerName,
      status,
    ],
    queryFn: () =>
      axios.get(`/api/admin/subscriptions/summaries`, {
        params: {
          page,
          pageSize,
          purchaseDate,
          customerName,
          status,
        },
      }),
    select: (response) => response.data,
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
      axios.get("/api/admin/subscriptions/summary-details/" + subscriptionId),
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
        axios.delete("/api/admin/subscriptions/cancel", {
          data: {
            subscriptionId: params.subscriptionId,
            stripeSubscriptionId: params.stripeSubscriptionId,
            stripeCustomerId: params.stripeCustomerId,
          },
        }),
    });
  };
