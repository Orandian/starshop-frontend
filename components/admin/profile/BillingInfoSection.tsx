import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFCGetAddress } from "@/hooks/fc";
import { UserAddressUpdate } from "@/types/fc/user.type";
import { useUserAddressInfoUpdate } from "@/hooks/admin/useCustomer";
import { CustomerDetail } from "@/types/customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import PopupBox from "@/components/fc/ui/PopupBox";
import { usePostalAddress } from "@/hooks/fc/usePostalAddress";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";

export const formSchema = z.object({
  name: z.string().min(1, "銀行名を入力してください"),
  phoneNumber: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(
      /^0\d{1,4}-\d{1,4}-\d{4}$/,
      "有効な日本の電話番号を入力してください (例: 070-1234-1234)",
    ), //070-1234-1234
  postalCode: z
    .string()
    .min(7, "郵便番号は7文字で入力してください")
    .max(7, "郵便番号は7文字で入力してください"),
  prefecture: z.string().min(1, "都道府県を入力してください"), // city_ward_town + address + prefecture
  address2: z.string().min(1, "住所を入力してください"), //user type address
});

type FormValues = z.infer<typeof formSchema>;

export const BillingInfoSection = ({
  userDetail,
  isUserLoading,
}: {
  userDetail: CustomerDetail;
  isUserLoading?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: userAddressUpdate, isPending: isUserAddressUpdatePending } =
    useUserAddressInfoUpdate(userDetail?.user_id ?? "");

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
      [fcGetAddress],
    ),
  );

  // Extract complex expressions into variables
  const billingAddressData = userDetail?.billing_address?.[0];
  const billingName = billingAddressData?.name;
  const billingPhoneNumber = billingAddressData?.phoneNumber;

  const billingAddress = useMemo(
    () => [
      {
        label: "請求先名",
        value: billingName,
      },
      {
        label: "電話番号",
        value: billingPhoneNumber,
      },
      {
        label: "住所",
        value: fullAddress,
      },
    ],
    [billingName, billingPhoneNumber, fullAddress],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: billingName || "",
      phoneNumber: billingPhoneNumber || "",
      address2: userDetail?.billing_address?.[0]?.address2 || "",
      postalCode: userDetail?.billing_address?.[0]?.postalCode || "",
      prefecture: userDetail?.billing_address?.[0]?.prefecture || "",
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
    if (userDetail?.billing_address) {
      fetchAddress(
        userDetail.billing_address?.[0]?.postalCode || "",
        userDetail.billing_address?.[0]?.address2 || "",
      );
    }
  }, [userDetail?.billing_address, fetchAddress]);

  /**
   * Handle edit
   * @returns void
   */
  const handleEdit = () => {
    // Reset form with current data
    form.reset({
      name: billingName || "",
      phoneNumber: billingPhoneNumber || "",
      address2: userDetail?.billing_address?.[0]?.address2 || "",
      postalCode: userDetail?.billing_address?.[0]?.postalCode || "",
      prefecture: userDetail?.billing_address?.[0]?.prefecture || "",
    });
    setIsEditing(true);
  };

  /**
   * Handle form submission
   * @param values Form values
   * @returns void
   */
  const onSubmit = (values: FormValues) => {
    const updateData: UserAddressUpdate = {
      addressType: 2,
      postalCode: values.postalCode,
      name: values.name,
      phoneNumber: values.phoneNumber,
      address2: values.address2,
    };

    userAddressUpdate(updateData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["customer"],
        });
        setIsEditing(false);
      },
    });
  };

  /**
   * Handle cancel
   * @returns void
   */
  const handleCancel = () => {
    setIsEditing(false);
    // Reset the address display by fetching original address
    if (userDetail?.billing_address?.[0]?.postalCode) {
      fetchAddress(
        userDetail.billing_address[0].postalCode,
        userDetail.billing_address[0].address2 || "",
      );
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="py-4 text-primary mr-2">請求先情報</h3>
          {!isUserLoading && (
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full p-0 cursor-pointer"
              onClick={handleEdit}
            >
              <Pencil className="w-5 h-5" fill="black" stroke="white" />
            </Button>
          )}
        </div>
        {isUserLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 py-1">
                <Skeleton className="h-6 w-full bg-gray-200" />
                <Skeleton className="h-6 w-full bg-gray-200" />
              </div>
            ))
          : billingAddress.map((address, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 py-1">
                <p className="font-bold text-sm">{address.label}:</p>
                <p className="text-sm">{address.value || "-"}</p>
              </div>
            ))}
      </div>

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
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* Phone Number */}
            <FormInputComponent
              id="phoneNumber"
              control={form.control}
              name="phoneNumber"
              label="電話番号"
              required
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
            </div>
            <div>
              <FormInputComponent
                id="address2"
                control={form.control}
                name="address2"
                label="番地・建物名・部屋番号"
                required
                className="w-full bg-white h-10 rounded-md border border-disposed/30 px-4 py-3"
              />
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
