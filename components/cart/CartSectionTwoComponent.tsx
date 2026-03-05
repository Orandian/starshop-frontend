"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { ProductCell } from "./CartSectionOneComponent";
import { convertToYen, getPublicUrl, parseJapaneseAddress } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetCartItems } from "@/hooks/user/useCart";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddressSearchPostcode,
  useCreateBillingAddress,
  useCreateShippingAddress,
  useGetBillingAddress,
  useGetShippingAddress,
  useUpdateBillingAddress,
  useUpdateShippingAddress,
} from "@/hooks/user/useAddress";
import { MESSAGES } from "@/types/messages";
import { ShippingAddressResponse } from "@/types/profile/address.type";
import { CartData } from "@/types/cart/cardtype";
import { ApiError } from "@/lib/api/api.gateway";
import Line from "@/public/fc/line.jpg";
import ImageComponent from "../fc/ImageComponent";
import Link from "next/link";

export const FormSchema = z
  .object({
    // firstName: z.string().min(1, "氏名を入力してください").min(2, "氏名は2文字以上で入力してください").max(50, "氏名は50文字以下で入力してください"),
    // lastName: z.string().min(1, "名を入力してください").min(2, "名は2文字以上で入力してください").max(50, "名は50文字以下で入力してください"),
    userName: z.string().min(1, "氏名を入力してください").min(2, "氏名は2文字以上で入力してください").max(50, "氏名は50文字以下で入力してください"),
    phone: z
      .string()
      .min(2, "電話番号は2文字以上で入力してください")
      .regex(/^[0-9]{10,11}$/, "電話番号は10桁または11桁で入力してください"),
    zip: z.string().regex(/^[0-9]{7}$/, "郵便番号は7桁で入力してください"),
    city: z.string().min(2, "郵便番号で検索してください"),
    address: z.string().min(2, "番地は2文字以上で入力してください"),
    building: z.string().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
    room: z.string().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
    isDifferentAddress: z.boolean().default(false).optional(),
    point: z.string().default("0").optional(),
    // sFirstName: z.string().optional(),
    // sLastName: z.string().optional(),
    sUserName: z.string().optional(),
    sPhone: z.string().optional(),
    sZip: z.string().optional(),
    sCity: z.string().optional(),
    sAddress: z.string().optional(),
    sBuilding: z.string().optional().or(z.literal("")),
    sRoom: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.isDifferentAddress) {
      // if (!data.sFirstName || data.sFirstName.length < 2) {
      //   ctx.addIssue({
      //     path: ["sFirstName"],
      //     code: z.ZodIssueCode.custom,
      //     message: "配送先の名前は2文字以上で入力してください",
      //   });
      // }
      // if (!data.sLastName || data.sLastName.length < 2) {
      //   ctx.addIssue({
      //     path: ["sLastName"],
      //     code: z.ZodIssueCode.custom,
      //     message: "配送先の名前は2文字以上で入力してください",
      //   });
      // }
      if (!data.sUserName || data.sUserName.length < 2) {
        ctx.addIssue({
          path: ["sUserName"],
          code: z.ZodIssueCode.custom,
          message: "配送先の名前は2文字以上で入力してください",
        });
      }
      if (!data.sPhone || !/^[0-9]{10,11}$/.test(data.sPhone)) {
        ctx.addIssue({
          path: ["sPhone"],
          code: z.ZodIssueCode.custom,
          message: "配送先の電話番号は10桁または11桁で入力してください",
        });
      }
      if (!data.sZip || !/^[0-9]{7}$/.test(data.sZip)) {
        ctx.addIssue({
          path: ["sZip"],
          code: z.ZodIssueCode.custom,
          message: "配送先の郵便番号は7桁で入力してください",
        });
      }
      if (!data.sCity || data.sCity.length < 2) {
        ctx.addIssue({
          path: ["sCity"],
          code: z.ZodIssueCode.custom,
          message: "配送先の市区町村は2文字以上で入力してください",
        });
      }
      // if (!data.sAddress || data.sAddress?.length < 2) {
      //   ctx.addIssue({
      //     path: ["sAddress"],
      //     code: z.ZodIssueCode.custom,
      //     message: "配送先の番地は2文字以上で入力してください",
      //   });
      // }
    }
  });
const handleApiError = (err: unknown) => {
  if (err instanceof ApiError) {
    toast.error(err.data.message);
    return;
  }
  toast.error(MESSAGES.COMMON.UNEXPECTED_ERROR);
};

const CartSectionTwoComponent = ({
  handleToPreviousStep,
  handleToNextStep,
  setBillingAddressId,
  setShippingAddressId,
  setShippingAddressCity
}: {
  handleToPreviousStep: () => void;
  handleToNextStep: () => void;
  setBillingAddressId: (id: number) => void;
  setShippingAddressId: (id: number) => void;
  setShippingAddressCity: (city: string) => void;
}) => {
  const { data: shippingAddress } = useGetShippingAddress(); // 配送先住所を取得
  const { data: billingAddress } = useGetBillingAddress(); // 請求先住所を取得

  const [postname, setPostname] = useState<string>(shippingAddress?.data?.[0]?.city || "");

  const { data: cartItems, isLoading, error, isError } = useGetCartItems(postname); // カートアイテムを取得

  const { mutate: updateShippingAddress } = useUpdateShippingAddress(); // 配送先住所を更新
  const { mutate: updateBillingAddress } = useUpdateBillingAddress(); // 請求先住所を更新
  const { mutate: createShippingAddress } =
    useCreateShippingAddress(); // 配送先住所を登録
  const { mutate: createBillingAddress } =
    useCreateBillingAddress(); // 請求先住所を登録

  // const { mutate: getAddressByPostcode } = useAddressByPostcode(); // 郵便番号を取得
  const { mutate: getAddressByPostcode } = useAddressSearchPostcode();
  const [cart, setCart] = useState<CartData>({} as CartData); // カートアイテムを保持

  // 配送先住所を郵便番号で検索
  const handleGetShippingAddressByPostcode = (postcode: string) => {

    getAddressByPostcode(
      { postcode },
      {
        onSuccess: (data) => {
          const dataResponse = data?.data;
          form.setValue(
            "city",
             dataResponse?.city_ward_town || " " // + " " + dataResponse?.address,
              , { shouldValidate: true, shouldDirty: true }

          );
          // form.setValue("perfecture", dataResponse?.prefecture || "");
          form.setValue("address",dataResponse?.prefecture + " " + dataResponse?.address || "" , { shouldValidate: true, shouldDirty: true });
          setPostname(dataResponse?.city_ward_town || "");
          setShippingAddressCity(dataResponse?.city_ward_town || "");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.data.message);
            return;
          }
          toast.error(MESSAGES.ADDRESS.GET_BY_POSTCODE_FAILED);
        },
      }
    );
  };

  // 請求先住所を郵便番号で検索
  const handleGetBillingAddressByPostcode = (postcode: string) => {
    getAddressByPostcode(
      { postcode },
      {
        onSuccess: (data) => {
          const dataResponse = data?.data;
          form.setValue(
            "sCity",
            dataResponse?.city_ward_town , { shouldValidate: true, shouldDirty: true } // + " " + dataResponse?.prefecture  // + " " + dataResponse?.address
          );
          form.setValue("sAddress",  dataResponse?.prefecture + " " + dataResponse?.address || "" , { shouldValidate: true, shouldDirty: true });
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.data.message);
            return;
          }
          toast.error(MESSAGES.ADDRESS.GET_BY_POSTCODE_FAILED);
        },
      }
    );
  };

  // 配送先住所を更新
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // firstName: "",
      // lastName: "",
      userName: "",
      phone: "",
      zip: "",
      city: "",
      address: "",
      building: "",
      room: "",
      isDifferentAddress: false,
      point: "0",
      // sFirstName: "",
      // sLastName: "",
      sUserName : "",
      sPhone: "",
      sZip: "",
      sCity: "",
      sAddress: "",
      sBuilding: "",
      sRoom: "",
    },
  });

  // 配送先住所を登録
  const creatingAddress = (data: z.infer<typeof FormSchema>) => {
    const { city, street_address } = parseJapaneseAddress(data.address);
    createShippingAddress(
      {
        addressData: {
          // recipient_first_name: data.firstName || "",
          // recipient_last_name: data.lastName || "",
          recipient_name : data.userName || "",
          recipient_phone_number: data.phone || "",
          postal_code: data.zip || "",
          prefecture: data.city || "",
          // city: data.city || "",
          city: city || "",
          street_address: street_address || "",
          building_name: data.building || "",
          room_number: data.room || "",
          country: "Japan",
        },
      },
      {
        onSuccess: (resp: ShippingAddressResponse) => {
          setShippingAddressId(resp?.addressId);
          const { city: ssCity, street_address: ssStreetAddress } = parseJapaneseAddress(
            data.isDifferentAddress ? data.sAddress : data.address
          );
          createBillingAddress(
            {
              addressData: {
                // recipient_first_name: data.isDifferentAddress
                //   ? data.sFirstName || ""
                //   : data.firstName || "",
                // recipient_last_name: data.isDifferentAddress
                //   ? data.sLastName || ""
                //   : data.lastName || "",
                recipient_name : data.isDifferentAddress
                  ? data.sUserName || "" : data.userName || "",
                recipient_phone_number: data.isDifferentAddress
                  ? data.sPhone || ""
                  : data.phone || "",
                postal_code: data.isDifferentAddress
                  ? data.sZip || ""
                  : data.zip || "",
                prefecture: data.isDifferentAddress
                  ? data.sCity || ""
                  : data.city || "",
                city: ssCity || "",
                street_address: ssStreetAddress || "",
                building_name: data.isDifferentAddress
                  ? data.sBuilding || ""
                  : data.building || "",
                room_number: data.isDifferentAddress
                  ? data.sRoom || ""
                  : data.room || "",
                country: "Japan",
              },
            },
            {
              onSuccess: (resp: ShippingAddressResponse) => {
                setBillingAddressId(resp?.addressId);
                handleToNextStep();
              },
              onError: handleApiError,
            }
          );
        },
        onError: handleApiError,
      }
    );
  };

  // 配送先住所を更新
  const updatingAddresses = (data: z.infer<typeof FormSchema>) => {
    const shippingId = shippingAddress?.data?.[0]?.addressId;
    const { city, street_address } = parseJapaneseAddress(data.address);
    updateShippingAddress(
      {
        addressId: shippingId || 0,
        addressData: {
          // recipient_first_name: data.firstName || "",
          // recipient_last_name: data.lastName || "",
          recipient_name : data.userName || "",
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
        onSuccess: (resp: ShippingAddressResponse) => {
          setShippingAddressId(resp?.addressId);
          const billingId = billingAddress?.data?.[0]?.addressId || 0;
          const { city: ssCity, street_address: ssStreetAddress } = parseJapaneseAddress(
            data.isDifferentAddress ? data.sAddress : data.address
          );
          if (billingId === 0) {
            createBillingAddress(
              {
                addressData: {
                  // recipient_first_name: data.isDifferentAddress
                  //   ? data.sFirstName || ""
                  //   : data.firstName || "",
                  // recipient_last_name: data.isDifferentAddress
                  //   ? data.sLastName || ""
                  //   : data.lastName || "",
                  recipient_name : data.isDifferentAddress 
                    ? data.sUserName || ""
                    : data.userName || "",
                  recipient_phone_number: data.isDifferentAddress
                    ? data.sPhone || ""
                    : data.phone || "",
                  postal_code: data.isDifferentAddress
                    ? data.sZip || ""
                    : data.zip || "",
                  prefecture: data.isDifferentAddress
                    ? data.sCity || ""
                    : data.city || "",
                  city: ssCity || "",
                  street_address: ssStreetAddress || "",
                  building_name: data.isDifferentAddress
                    ? data.sBuilding || ""
                    : data.building || "",
                  room_number: data.isDifferentAddress
                    ? data.sRoom || ""
                    : data.room || "",
                  country: "Japan",
                },
              },
              {
                onSuccess: (resp: ShippingAddressResponse) => {
                  setBillingAddressId(resp?.addressId);
                  handleToNextStep();
                },
                onError: handleApiError,
              }
            );
          } else {
            updateBillingAddress(
              {
                addressId: billingId || 0,
                addressData: {
                  // recipient_first_name: data.isDifferentAddress
                  //   ? data.sFirstName || ""
                  //   : data.firstName || "",
                  // recipient_last_name: data.isDifferentAddress
                  //   ? data.sLastName || ""
                  //   : data.lastName || "",
                  recipient_name: data.isDifferentAddress
                    ? data.sUserName || ""
                    : data.userName || "",
                  recipient_phone_number: data.isDifferentAddress
                    ? data.sPhone || ""
                    : data.phone || "",
                  postal_code: data.isDifferentAddress
                    ? data.sZip || ""
                    : data.zip || "",
                  prefecture: data.isDifferentAddress
                    ? data.sCity || ""
                    : data.city || "",
                  city: ssCity,
                  street_address: ssStreetAddress,
                  building_name: data.isDifferentAddress
                    ? data.sBuilding || ""
                    : data.building || "",
                  room_number: data.isDifferentAddress
                    ? data.sRoom || ""
                    : data.room || "",
                  country: "Japan",
                },
              },
              {
                onSuccess: (resp: ShippingAddressResponse) => {
                  setBillingAddressId(resp?.addressId);
                  handleToNextStep();
                },
                onError: handleApiError,
              }
            );
          }
        },
        onError: handleApiError,
      }
    );
  };

  // 配送先住所を更新または登録
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (shippingAddress?.data && shippingAddress.data.length > 0) {
      updatingAddresses(data);
    } else {
      creatingAddress(data);
    }
  };

  useEffect(() => {
    if (!shippingAddress?.data || shippingAddress.data.length === 0) return;
    const addr = shippingAddress.data[0];
    // const [firstName = "", lastName = ""] = addr?.name?.split(" ") || [];
    // form.setValue("firstName", firstName);
    // form.setValue("lastName", lastName);
    form.setValue("userName", addr?.name || "");
    form.setValue("phone", addr?.phoneNumber);
    form.setValue("zip", addr?.postalCode);
    form.setValue("city", addr?.city);
    form.setValue("address", addr?.prefecture + " " + addr?.address1);
    form.setValue("building", addr?.address2?.split(" ")?.[0] || "");
    form.setValue("room", addr?.address2?.split(" ")?.[1] || "");
    setShippingAddressCity(addr?.city || "");
    setPostname(addr?.city || "");
  }, [shippingAddress, form, setShippingAddressCity]);

  useEffect(() => {
    if (!billingAddress?.data || billingAddress.data.length === 0) return;
    const addr = billingAddress.data[0];
    form.setValue("isDifferentAddress", true);
    // const [firstName = "", lastName = ""] = addr?.name?.split(" ") || [];
    // form.setValue("sFirstName", firstName);
    // form.setValue("sLastName", lastName);
    form.setValue("sUserName", addr?.name);
    form.setValue("sPhone", addr?.phoneNumber);
    form.setValue("sZip", addr?.postalCode);
    form.setValue("sCity", addr?.city);
    form.setValue("sAddress", addr?.prefecture + " " + addr?.address1);
    form.setValue("sBuilding", addr?.address2?.split(" ")?.[0] || "");
    form.setValue("sRoom", addr?.address2?.split(" ")?.[1] || "");
  }, [billingAddress, form]);

  useEffect(() => {
    if (!cartItems?.data) return;
    const cartItemsData = cartItems?.data as unknown as CartData;
    setCart(cartItemsData);
  }, [cartItems]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [error, isError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 mt-10 md:flex-row flex-col">
        <div className="md:w-1/2 w-full space-y-4">

          {/* Shipping Address */}
          <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white/50">
            <h2 className="font-bold">配送先</h2>

            <div className="space-y-8 w-full">
              {/* <div className="w-full flex space-x-3">
                <div className="w-1/2">
                  <FormInputComponent
                    control={form.control}
                    name="lastName"
                    label="名 (必須)"
                    placeholder=""
                    className="h-11 placeholder:text-sm text-xs"
                  />
                </div> */}
              <FormInputComponent
                control={form.control}
                name="userName"
                label="氏名 (必須)"
                placeholder=""
                className="h-11 placeholder:text-sm text-xs"
              />
              <FormInputComponent
                control={form.control}
                name="phone"
                label="電話番号 (必須)"
                type="tel"
                placeholder=""
                className="h-11 placeholder:text-sm text-xs"
              />

              <div className="w-full flex space-x-3 md:flex-row flex-col md:space-y-0 space-y-6">
                <div className="md: w-full">
                  <FormInputComponent
                    control={form.control}
                    name="zip"
                    label="郵便番号 (必須)"
                    placeholder=""
                    className="h-11 placeholder:text-sm text-xs"
                    onBlur={() =>
                      handleGetShippingAddressByPostcode(form.getValues("zip"))
                    }
                  />
                </div>
                <div className="md:w-2/3 w-full">
                  <FormInputComponent
                    control={form.control}
                    name="city"
                    label="市区町村 (必須)"
                    disabled={true}
                    placeholder=""
                    className="h-11 placeholder:text-sm text-xs"
                  />
                </div>
              </div>

              <FormInputComponent
                control={form.control}
                name="address"
                label="番地 (必須)"
                placeholder=""
                className="h-11 placeholder:text-sm text-xs"
              />

              <FormInputComponent
                control={form.control}
                name="building"
                label="建物名（任意）"
                required ={false}
                placeholder=""
                className="h-11 placeholder:text-sm text-xs"
              />

              <FormInputComponent
                control={form.control}
                name="room"
                label="部屋番号（任意）"
                placeholder=""
                className="h-11 placeholder:text-sm text-xs"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white/50">
            <div className="flex items-center justify-between">
              <h1>請求先</h1>
              <div className="flex items-center space-x-2">
                <FormInputComponent
                  control={form.control}
                  name="isDifferentAddress"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  id="isDifferentAddress"
                  checked={form.watch("isDifferentAddress")}
                />
                <label
                  htmlFor="isDifferentAddress"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  配送先と違う住所を設定
                </label>
              </div>
            </div>
            {form.watch("isDifferentAddress") && (
              <div className="space-y-8 w-full">
                <FormInputComponent
                  control={form.control}
                  name="sUserName"
                  label="氏名 (必須)"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs"
                />
                <FormInputComponent
                  control={form.control}
                  name="sPhone"
                  label="電話番号 (必須)"
                  type="tel"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs"
                />

                <div className="w-full flex space-x-3 md:flex-row flex-col md:space-y-0 space-y-6">
                  <div className="md:w-1/3 w-full">
                    <FormInputComponent
                      control={form.control}
                      name="sZip"
                      label="郵便番号 (必須)"
                      placeholder=""
                      className="h-11 placeholder:text-sm text-xs"
                      onBlur={() =>
                        handleGetBillingAddressByPostcode(
                          form.getValues("sZip") || ""
                        )
                      }
                    />
                  </div>
                  <div className="md:w-2/3 w-full">
                    <FormInputComponent
                      control={form.control}
                      name="sCity"
                      label="市区町村"
                      placeholder=""
                      disabled={true}
                      className="h-11 placeholder:text-sm text-xs"
                    />
                  </div>
                </div>

                <FormInputComponent
                  control={form.control}
                  name="sAddress"
                  label="番地 (必須)"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs"
                />

                <FormInputComponent
                  control={form.control}
                  name="sBuilding"
                  label="建物名（任意）"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs"
                />

                <FormInputComponent
                  control={form.control}
                  name="sRoom"
                  label="部屋番号（任意）"
                  placeholder=""
                  className="h-11 placeholder:text-sm text-xs"
                />
              </div>
            )}
          </div>

          {/* <div className="px-6 py-10 border border-white-bg rounded-md space-y-2">
            <FormInputComponent
              control={form.control}
              name="point"
              className="w-full"
              type="number"
              label="ご利用可能なポイント 150P"
              addon={
                <Button
                  type="button"
                  className="rounded-l-none rounded-r-sm bg-black/70 text-white cursor-pointer hover:bg-black/80"
                >
                  適用
                </Button>
              }
            />
          </div> */}
        </div>

        <div className="md:w-1/2 w-full space-y-6">
          <div className="md:px-6 md:py-10 px-4 py-5 border border-white-bg rounded-md space-y-6 bg-white">
            <div className="space-y-4">
              {!isLoading &&
                cart?.products?.map((product) => (
                  <ProductCell
                    key={product.productId}
                    name={product?.productName}
                    price={product?.salePrice || 0}
                    image={
                      product?.productImages[0]
                        ? getPublicUrl(product?.productImages[0])
                        : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    count={product?.quantity}
                  />
                ))}
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="w-full h-11 bg-white-bg" />
                  <Skeleton className="w-full h-11 bg-white-bg" />
                  <Skeleton className="w-full h-11 bg-white-bg" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm">小計</p>
                <p className="text-normal">
                  {convertToYen(cart?.subTotal || 0)}
                </p>
              </div>
              {cart?.taxEight !== undefined && cart?.taxEight !== 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm">税金 (8%)</p>
                  <p className="text-normal">
                    {convertToYen(cart?.taxEight || 0)}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <p className="text-sm">税金 (10%)</p>
                <p className="text-normal">
                  {convertToYen(cart?.taxTen || 0)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">送料</p>
                <p className="text-normal">
                  {convertToYen(cart?.shippingFee || 0)}
                </p>
              </div>
              {/* <div className="flex justify-between items-center">
                <p className="text-sm">ポイント</p>
                <p className="text-normal">{convertToYen(cart.point)}</p>
              </div> */}
              <div className="flex justify-between items-center">
                <p className="font-semibold text-xl">合計</p>
                <p className="font-semibold text-xl">
                  {convertToYen(cart?.cartTotalPrice || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-left justify-between md:mt-10 mt-6 w-full">
            <div className=" flex justify-center px-4">
              <Link
                href={"https://lin.ee/tgFsxgK"}
                target="_blank"
                className="flex items-center gap-2"
              >
                <ImageComponent
                  imgURL={Line.src}
                  imgName="line"
                  width={80}
                  height={80}
                />
              </Link>
            </div>
            {/* <div className="flex md:justify-end justify-between space-x-4"> */}
            <Button
              type="button"
              onClick={handleToPreviousStep}
              className="bg-white w-[100px] text-black hover:bg-white-bg cursor-pointer gap-1 border border-white-bg"
            >
              <ChevronLeft size={26} />
              <p>戻る</p>
            </Button>
            <Button
              type="submit"
              className="bg-primary w-[100px] text-white hover:bg-primary/80 cursor-pointer gap-1"
            >
              <p>次へ</p>
              <ChevronRight size={26} />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CartSectionTwoComponent;
