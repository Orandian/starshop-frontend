import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFCGetAddress, useUserAddressUpdate } from "@/hooks/fc";
import { usePostalAddress } from "@/hooks/fc/usePostalAddress";
import { billingInfoFormSchema, BillingInfoFormValues } from "@/lib/schema";
import { UserAddressUpdate, UserDetail } from "@/types/fc/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoadingIndicator from "../ui/LoadingIndicator";
import PopupBox from "../ui/PopupBox";
import { InformationSection } from "./InformationSection";
import { toast } from "sonner";

export const BillingInfoSection = ({
  userDetail,
}: {
  userDetail: UserDetail;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const userShippingData = userDetail?.user?.userAddresses.filter(
    (address) => address.addressType === 2
  )[0];
  const { mutate: userAddressUpdate, isPending: isUserAddressUpdatePending } =
    useUserAddressUpdate();
  const { mutate: fcGetAddress, isPending: isFCGetAddressPending } =
    useFCGetAddress();

  const { fullAddress, prefecture, error, fetchAddress } = usePostalAddress(
    useCallback(
      (data, callbacks) => {
        return new Promise<void>((resolve) => {
          fcGetAddress(data, {
            onSuccess: (res) => {
              callbacks.onSuccess?.(res);
              resolve();
            },
            onError: callbacks.onError,
            onSettled: callbacks.onSettled,
          });
        });
      },
      [fcGetAddress]
    )
  );

  const form = useForm<BillingInfoFormValues>({
    resolver: zodResolver(billingInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      name: userShippingData?.name || "",
      phoneNumber: userShippingData?.phoneNumber || "",
      address2: userShippingData?.address2 || "",
      postalCode: userShippingData?.postalCode || "",
      //prefecture: userShippingData?.prefecture || "",
    },
  });

  // Watch for postal code changes and fetch address
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "postalCode" &&
        value.postalCode &&
        value.postalCode.length >= 7
      ) {
        fetchAddress(value.postalCode, form.getValues("address2"));
      } else if (!value.postalCode || value.postalCode.length === 0) {
        // Empty postal code - clear prefecture (but only if it's not already empty)
        const currentPrefecture = form.getValues("prefecture");
        if (currentPrefecture) {
          form.setValue("prefecture", "", { shouldValidate: false });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, fetchAddress]);

  // Update form values when prefecture changes
  useEffect(() => {
    if (prefecture) {
      form.setValue("prefecture", prefecture, { shouldValidate: true });
    }
  }, [prefecture, form]);

  // Initial load
  useEffect(() => {
    if (userShippingData?.postalCode) {
      fetchAddress(userShippingData.postalCode, userShippingData.address2);
    }
  }, [userShippingData?.postalCode, fetchAddress, userShippingData?.address2]);

  const handleEdit = () => setIsEditing(true);

  const onSubmit = (values: BillingInfoFormValues) => {
    const updateData: UserAddressUpdate = {
      addressType: 2,
      postalCode: values.postalCode,
      name: values.name,
      phoneNumber: values.phoneNumber,
      address2: values.address2,
    };

    userAddressUpdate(updateData, {
      onSuccess: () => {
        toast.success("請求先情報が正常に更新されました");
        queryClient.invalidateQueries({
          queryKey: ["user-detail"],
        });
        setIsEditing(false);
      },
      onError: () => {
        toast.error("請求先情報の更新に失敗しました");
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    //reset form when cancel
    form.reset();
    // If there's a postal code, refetch the address
    if (userShippingData?.postalCode) {
      fetchAddress(userShippingData.postalCode, userShippingData.address2);
      form.setValue("prefecture", userShippingData.prefecture || "", { shouldValidate: true });
    } else {
      fetchAddress("", "");
    }
  };

  return (
    <>
      <InformationSection
        handleEdit={handleEdit}
        title="請求先情報"
        items={[
          { label: "請求先名", value: userShippingData?.name || "-" },
          { label: "電話番号", value: userShippingData?.phoneNumber || "-" },
          { label: "住所", value: fullAddress || "-" },
        ]}
      />

      <PopupBox
        isOpen={isEditing}
        onClose={handleCancel}
        showConfirmButton={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* User Name for shipping */}
            <FormInputComponent
              id="name"
              control={form.control}
              name="name"
              label="請求先名"
              required
              maxLength={50}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* Phone Number */}
            <FormInputComponent
              id="phoneNumber"
              control={form.control}
              name="phoneNumber"
              label="電話番号"
              required
              maxLength={15}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            <div className="grid grid-cols-3 gap-1">
              {/* postalCode */}
              <div className="flex-1 col-span-1">
                <FormInputComponent
                  id="postalCode"
                  control={form.control}
                  name="postalCode"
                  type="text"
                  inputMode="numeric"
                  label="郵便番号"
                  minLength={7}
                  maxLength={7}
                  required
                  className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                />
                {/* Add error message display */}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              {/* prefecture */}
              <div className="flex-1 col-span-2">
                <FormInputComponent
                  id="prefecture"
                  control={form.control}
                  name="prefecture"
                  label="都道府県"
                  required
                  disabled
                  className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                />
              </div>

              <div className="w-full col-span-3">
                <FormInputComponent
                  id="address2"
                  control={form.control}
                  name="address2"
                  label="番地・建物名・部屋番号"
                  required
                  maxLength={100}
                  className="w-full bg-white h-10 rounded-md border border-disposed/30 px-4 py-3"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              className={`w-full font-bold hover:bg-primary/90 text-white`}
              disabled={
                !form.formState.isValid ||
                isUserAddressUpdatePending ||
                isFCGetAddressPending
              }
            >
              {isUserAddressUpdatePending || isFCGetAddressPending ? (
                <LoadingIndicator size="sm" />
              ) : (
                "更新"
              )}
            </Button>
          </form>
        </Form>
      </PopupBox>
    </>
  );
};
