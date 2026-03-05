import { apiRoutes } from "@/lib/api/api.route";
import { ApiResponse } from "@/types/api/api-response";
import {
  FCCheckoutIntentRequest,
  FCSubscriptionPaymentSuccessRequest,
  FcSaveSubscriptionRequest,
  FcSaveSubscriptionResponse,
  FcSubscriptionIntent,
} from "@/types/fc";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFcCheckoutIntent = () =>
  useMutation({
    mutationKey: ["fc-checkout-intent"],
    mutationFn: (payload: FCCheckoutIntentRequest) =>
      apiRoutes.fc.fcPayment.fcCheckIntent(payload),
  });

export const useFcPaymentSuccess = () =>
  useMutation({
    mutationKey: ["fc-payment-success"],
    mutationFn: (payload: FCSubscriptionPaymentSuccessRequest) =>
      apiRoutes.fc.fcPayment.fcPaymentSuccess(payload),
  });

  export const useFcSubscriptionPaymentSuccess = () =>
  useMutation({
    mutationKey: ["fc-subscription-payment-success"],
    mutationFn: (payload: FCSubscriptionPaymentSuccessRequest) =>
      apiRoutes.fc.fcPayment.fcPaymentSubScriptiongSuccess(payload),
  });

export const useFcPaymentWithCash = (isEnabled: boolean) =>
  useQuery({
    queryKey: ["fc-payment-with-cash"],
    queryFn: () => apiRoutes.fc.fcPayment.fcPaymentWithCash(),
    enabled: isEnabled,
  });

export const useFcPaymentWithCard = (isEnabled: boolean) =>
  useQuery({
    queryKey: ["fc-payment-with-card"],
    queryFn: () => apiRoutes.fc.fcPayment.fcPaymentWithCard(),
    enabled: isEnabled,
  });

export const useFcSubscriptionIntent = () =>
  useMutation({
    mutationKey: ["fc-subscription-intent"],
    mutationFn: (payload: FcSubscriptionIntent) =>
      apiRoutes.fc.fcPayment.fcSubscriptionIntent(payload),
  });

export const useFcSaveSubscription = () =>
  useMutation({
    mutationKey: ["fc-save-subscription"],
    mutationFn: (payload: FcSaveSubscriptionRequest) =>
      apiRoutes.fc.fcPayment.fcSaveSubscription(payload),
  });
