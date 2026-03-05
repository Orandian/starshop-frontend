"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import {
  useAddressSearchPostcode,
  useCreateShippingAddress,
  useGetShippingAddress,
  useUserUpdateShippingAddress,
} from "@/hooks/user/useAddress";
import { Skeleton } from "../ui/skeleton";
import { MESSAGES } from "@/types/messages";
import { ApiError } from "@/lib/api/api.gateway";
import { parseJapaneseAddress } from "@/utils";

const FormSchema = z.object({
  // firstName: z.string().min(1, "氏名を入力してください").min(2, "氏名は2文字以上で入力してください").max(50, "氏名は50文字以下で入力してください"),
  // lastName: z.string().min(1, "名を入力してください").min(2, "名は2文字以上で入力してください").max(50, "名は50文字以下で入力してください"),
  userName : z.string().min(1, "氏名を入力してください").min(2, "氏名は2文字以上で入力してください").max(50, "氏名は50文字以下で入力してください"),
  phone: z
    .string()
    .min(2, "電話番号は2文字以上で入力してください")
    .regex(/^[0-9]{10,11}$/, "電話番号は10桁または11桁で入力してください"),
  zip: z.string().regex(/^[0-9]{7}$/, "郵便番号は7桁で入力してください"),
  city: z.string().min(2, "郵便番号で検索してください"),
  address: z.string().min(2, "番地は2文字以上で入力してください"),
  building: z.string().optional(),
  room: z.string().optional(),
});

const AddressForm = () => {
  const { data: shippingAddress, isLoading: isShippingAddressLoading } = useGetShippingAddress(); // 配送先住所を取得
  const {
    mutate: updateShippingAddress,
    isPending: isUpdatingShippingAddress,
  } = useUserUpdateShippingAddress(); // 配送先住所を更新する
  const {
    mutate: createShippingAddress,
  } = useCreateShippingAddress(); // 配送先住所を更新する

  const { mutate: getAddressByPostcode } = useAddressSearchPostcode();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userName: "",
      // lastName: "",
      phone: "",
      zip: "",
      city: "",
      address: "",
      building: "",
      room: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    handleUpdateShippingAddress(data);
  };

  const handleGetAddressByPostcode = (postcode: string) => {
    getAddressByPostcode(
      { postcode },
      {
        onSuccess: (data) => {
          const dataResponse = data?.data;
          form.setValue(
            "city",
            `${dataResponse?.city_ward_town || " "}`,
              { shouldValidate: true, shouldDirty: true }
          );
          form.setValue("address", dataResponse?.prefecture + " " + dataResponse?.address , { shouldValidate: true, shouldDirty: true });
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.data.message);
            return;
          }
          toast.error(MESSAGES.COMMON.UNEXPECTED_ERROR);
        },
      }
    );
  };

  const handleUpdateShippingAddress = (data: z.infer<typeof FormSchema>) => {
    const shipping = shippingAddress?.data?.[0];
    const { city, street_address } = parseJapaneseAddress(data.address);
    if (!shipping) {
      return createShippingAddress(
        {
          addressData: {
            // recipient_first_name: data.firstName || "",
            // recipient_last_name: data.lastName || "",
            recipient_phone_number: data.phone || "",
            recipient_name: data.userName || "",
            postal_code: data.zip || "",
            prefecture: data.city || "",
            city: city || "",
            street_address: street_address || "",
            building_name: data.building || "",
            room_number: data.room || "",
            country: "Japan",
          },
        },
        {
          onSuccess: () => {
            toast.success(MESSAGES.ADDRESS.UPDATE_SUCCESS);
          },
          onError: (err) => {
            if (err instanceof ApiError) {
              toast.error(err.data.message);
              return;
            }
            toast.error(MESSAGES.AUTH.SIGNUP_FAILED);
          },
        }
      );
    } // 配送先住所が存在する場合は更新
    else {
      updateShippingAddress(
        {
          addressId: shipping?.addressId || 0,
          addressData: {
            // recipient_first_name: data.firstName || "",
            // recipient_last_name: data.lastName || "",
            recipient_name: data.userName || "",
            recipient_phone_number: data.phone || "",
            postal_code: data.zip || "",
            prefecture: data.city || "",
            city: city || "",
            street_address: street_address || "",
            building_name: data.building || "",
            room_number: data.room || "",
            country: "Japan",
          },
        },
        {
          onSuccess: () => {
            toast.success(MESSAGES.ADDRESS.UPDATE_SUCCESS);
          },
          onError: (err) => {
            if (err instanceof ApiError) {
              toast.error(err.data.message);
              return;
            }
            toast.error(MESSAGES.COMMON.UNEXPECTED_ERROR);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (shippingAddress) {
      const shipping = shippingAddress?.data?.[0];
      form.reset({
        // firstName: shipping?.name?.split(" ")[0] || "",
        // lastName: shipping?.name?.split(" ")[1] || "",
        userName: shipping?.name || "",
        phone: shipping?.phoneNumber || "",
        zip: shipping?.postalCode || "",
        city: shipping?.city || "",
        address: (shipping?.prefecture || "") + " " + (shipping?.address1 || ""),
        building: shipping?.address2?.split(" ")?.[0] || "",
        room: shipping?.address2?.split(" ")?.[1] || "",
      });
    }
  }, [shippingAddress, form]);

  return (
    <div className="space-y-6 py-4">
      {!isShippingAddressLoading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 md:w-[400px] w-full"
          >
                    <FormInputComponent
                  control={form.control}
                  name="userName"
                  // label="性"
                  label="氏名"
                  placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />
            {/* <div className="w-full flex space-x-3">
      <div className="w-1/2">
                <FormInputComponent
                  control={form.control}
                  name="userName"
                  // label="性"
                  label="氏名"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                />
              </div> */}
            {/* <div className="w-1/2">
                <FormInputComponent
                  control={form.control}
                  name="lastName"
                  label="カナ"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                />
              </div> */}
            <FormInputComponent
              control={form.control}
              name="phone"
              label="電話番号"
              type="tel"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />

            <div className="w-full flex space-x-3">
              <div className="w-1/3">
                <FormInputComponent
                  control={form.control}
                  name="zip"
                  label="郵便番号"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                  onBlur={() =>
                    handleGetAddressByPostcode(form.getValues("zip"))
                  }
                />
              </div>
              <div className="w-2/3">
                <FormInputComponent
                  control={form.control}
                  name="city"
                  label="市区町村"
                  placeholder=""
                  disabled={true}
                  className="h-11 placeholder:text-sm text-xs bg-white/50"
                />
              </div>
            </div>

            <FormInputComponent
              control={form.control}
              name="address"
              label="番地"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />
            <FormInputComponent
              control={form.control}
              name="building"
              label="建物名"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />
            <FormInputComponent
              control={form.control}
              name="room"
              label="部屋番号"
              placeholder=""
              className="h-11 placeholder:text-sm text-xs bg-white/50"
            />
            <Button
              type="submit"
              className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
              disabled={isUpdatingShippingAddress}
            >
              {isUpdatingShippingAddress ? "更新中..." : "更新"}
            </Button>
          </form>
        </Form>
      )}
      {isShippingAddressLoading && (
        <Skeleton className="w-[400px] h-[600px] bg-white-bg" />
      )}
    </div>
  );
};

export default AddressForm;
