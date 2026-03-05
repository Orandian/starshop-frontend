import { useCallback, useState } from "react";
import {
  UserAddressRequest,
  UserAddressApiResponse,
} from "@/types/fc/user.type";

export type FcGetAddress = (
  data: UserAddressRequest,
  callbacks: {
    onSuccess?: (res: UserAddressApiResponse) => void;
    onError?: (err: unknown) => void;
    onSettled?: () => void;
  },
) => Promise<void>;

export const usePostalAddress = (fcGetAddress: FcGetAddress) => {
  const [prefecture, setPrefecture] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAddress = useCallback(
    async (postalCode: string, address2?: string | null | undefined) => {
      if (!postalCode) {
        setPrefecture("");
        setFullAddress("");
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        await fcGetAddress(
          { postcode: postalCode },
          {
            onSuccess: (res: UserAddressApiResponse) => {
              const data = res?.data;

              if (!data) return;

              const { city_ward_town, address, prefecture } = data;
              const combinedPref = `${city_ward_town}${address}${prefecture}`;

              setPrefecture(combinedPref);

              setFullAddress(
                `${postalCode} ${combinedPref}${address2 ? " " + address2 : ""}`,
              );
            },
            onError: (err) => {
              const apiErr = err as { data?: { message?: string } };
              const message =
                apiErr?.data?.message || "Failed to fetch address";
              setError(message);
            },
            onSettled: () => {
              setLoading(false);
            },
          },
        );
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unexpected error";
        setError(message);
        setLoading(false);
      }
    },
    [fcGetAddress],
  );

  return {
    prefecture,
    fullAddress,
    fetchAddress,
    loading,
    error,
  };
};
