"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import ImageComponent from "@/components/fc/ImageComponent";
import StepIndicator from "@/components/fc/purchase/StepIndicator";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useFCGetAddress,
  useFCPostOrder,
  //useGetAllBrands,
  useGetCart,
  useGetPreInvoiceId,
  useUserDetail,
} from "@/hooks/fc";
import {
  useGetCalculationShippingCost,
  useGetFcSettng,
} from "@/hooks/fc/useSetting";
//import { useUserStore } from "@/store/useAuthStore";
import { useGenerateAndUploadInvoicePdf } from "@/hooks/fc/useGenerateAndUploadInvoicePdf";
import { OrderRequest } from "@/types/fc";
import { encryptString, getPublicUrl } from "@/utils";
import { fetchOrderItemsById } from "@/utils/fc/getOrderItemById";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Address = {
  name: string;
  phoneNumber: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2?: string;
  prefecture_city?: string;
};

type FormValues = {
  useDifferentShipping: boolean;
  billing: Address;
  shipping: Address;
};

// const initialItems = [
//   {
//     id: 1,
//     name: "リフティングショットスージングジェル 100g",
//     price: 6300,
//     qty: 2,
//     image: ProductImage4,
//   },
// ];

const addressSchema = z.object({
  name: z.string().min(1, "氏名は必須項目です"),
  phoneNumber: z.string().min(1, "電話番号は必須項目です"),
  postalCode: z
    .string()
    .min(7, "郵便番号は7文字で入力してください")
    .max(7, "郵便番号は7文字で入力してください"),
  prefecture: z.string().min(1, "都道府県は必須項目です"),
  city: z.string().min(1, "市区町村は必須項目です"),
  address1: z.string().min(1, "住所は必須項目です"),
  address2: z.string().min(1, "建物名・部屋番号は必須項目です"),
  prefecture_city: z.string().optional(),
});

const billingSchema = z
  .object({
    useDifferentShipping: z.boolean().default(true),
    shipping: addressSchema,
    billing: z.any().optional(), // Make billing optional by default
  })
  .superRefine((data, ctx) => {
    // If useDifferentShipping is false, validate the billing field using addressSchema
    if (!data.useDifferentShipping) {
      const result = addressSchema.safeParse(data.billing);

      if (!result.success) {
        // Map the errors from addressSchema to the "billing" path
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ["billing", ...issue.path], // Links the error to the billing field
          });
        });
      }
    }
  });

const FCbillingPage = () => {
  //const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const { data: fcSetting } = useGetFcSettng();
  const { data: userDetail, isLoading: isUserDetailLoading } = useUserDetail();
  const { mutate: fcGetAddress } = useFCGetAddress();
  const { mutate: fcPostOrder, isPending: isFCPostOrder } = useFCPostOrder();
  const { data: cartData } = useGetCart();
  const [findCostbyPrefecture, setFindCostbyPrefecture] = useState({
    prefecture: "",
    quantity: "",
  });
  const { data: calculationShippingCost, refetch: refetchCalculateCost } =
    useGetCalculationShippingCost({
      prefecture: findCostbyPrefecture.prefecture,
      quantity: Number(findCostbyPrefecture.quantity),
    });

  // const { mutate: fcSaveSubscription, isPending: isFcSaveSubscriptionPending } =
  //   useFcSaveSubscription();

  const [orderPriceInfo, setOrderPriceInfo] = useState({
    totalAmount: "",
    taxAmount: "",
    shippingAmount: "",
    pointAmount: 0,
    totalAmountWithTax: "",
  });

  //for invoice generate and pdf download
  const generateAndUploadPdf = useGenerateAndUploadInvoicePdf();
  const { data: preInvoiceId } = useGetPreInvoiceId();

  const form = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      useDifferentShipping: false,
      billing: {
        name: "",
        phoneNumber: "",
        postalCode: "",
        prefecture: "",
        city: "",
        address1: "",
        address2: "",
        prefecture_city: "",
      },
      shipping: {
        name: "",
        phoneNumber: "",
        postalCode: "",
        prefecture: "",
        city: "",
        address1: "",
        address2: "",
        prefecture_city: "",
      },
    },
  });

  const useDifferentShipping = form.watch("useDifferentShipping");

  // const changeQty = (id: number, delta: number) => {
  //   setItems((prev) =>
  //     prev.map((it) =>
  //       it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
  //     )
  //   );
  // };

  // const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  // const tax = Math.round(subtotal * 0.1);
  // const total = subtotal + tax;

  const onSubmit = (data: z.infer<typeof billingSchema>) => {
    if (!userDetail?.data?.user?.userId) {
      toast.error("User information is not available");
      return;
    }

    const billing = !data.useDifferentShipping ? data.billing : data.shipping;
    const shipping = data.shipping;

    const payload: OrderRequest = {
      // userId: userDetail.data.user.userId,
      // subscriptType: null,
      // trackingNumber: null,
      // orderType: 1,
      // orderStatus: -1,
      // paymentType: 1,
      // subscript: false,

      // Billing address (always from billing)
      billName: billing.name,
      billPostalCode: billing.postalCode,
      billPrefecture: billing.prefecture,
      billCity: billing.city,
      billAddress1: billing.address1,
      billAddress2: billing.address2,
      billPhone: billing.phoneNumber,

      // Shipping address (from shipping if different, otherwise same as billing)
      receiveName: shipping.name,
      receivePostalCode: shipping.postalCode,
      receivePrefecture: shipping.prefecture,
      receiveCity: shipping.city,
      receiveAddress1: shipping.address1,
      receiveAddress2: shipping.address2,
      receivePhone: shipping.phoneNumber,

      // totalPrice: +(
      //   (cartData?.data &&
      //     Array.isArray(cartDat  a?.data) &&
      //     cartData?.data?.reduce(
      //       (sum, item) =>
      //         sum +
      //         item.product.salePrice * item.productQty * 1.1 +
      //         item.product.shippingFee * item.productQty,
      //       0
      //     )) ||
      //   0
      // )?.toFixed(2),
      // shippingCost: +(
      //   (cartData?.data &&
      //     Array.isArray(cartData?.data) &&
      //     cartData?.data?.reduce(
      //       (sum, item) => sum + item.product.shippingFee,
      //       0
      //     )) ||
      //   0
      // ),
    };

    fcPostOrder(payload, {
      onSuccess: async (data) => {
        // toast.success("注文が正常に作成されました")

        //fetch orderItems
        const orderId = data?.data?.orderId;
        const orderItems = await fetchOrderItemsById(orderId);

        if (orderItems.length === 0) {
          console.error("No order items found");
          router.push(
            `/fc/purchase/payment?orderId=${encryptString(orderId.toString())}`,
          );
          return;
        }

        //format invoiceId =>
        const invoiceId =
          formatDate(new Date(), "yyyyMMdd") + "-" + preInvoiceId?.data;

        //generate pdf and upload to s3
        // 3. Generate and upload PDF
        if (userDetail?.data) {
          const pdfUrl = await generateAndUploadPdf.mutateAsync({
            userDetail: userDetail.data,
            orderItems,
            invoiceNumber: invoiceId,
          });

          // 4. Redirect to payment with PDF URL
          router.push(
            `/fc/purchase/payment?orderId=${encryptString(orderId.toString())}&pdfUrl=${encodeURIComponent(pdfUrl)}`,
          );
        } else {
          console.error("User details not available");
          router.push(
            `/fc/purchase/payment?orderId=${encryptString(orderId.toString())}`,
          );
        }
      },
      onError: (error) => {
        // Handle error if needed
        const errorMessages = error?.message.split(",");
        errorMessages.forEach((message) => {
          toast.error(`商品"${message}" は在庫が不足しています。`);
        });
        console.error("Failed to update address:", error);
      },
    });
  };

  const { handleSubmit } = form;

  const handlePostalCodeBlur = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: "billing" | "shipping",
  ) => {
    const target = e.target as HTMLInputElement;
    const postalCode = target.value.replace(/-/g, "");
    if (postalCode.length === 7) {
      fcGetAddress(
        { postcode: postalCode },
        {
          onSuccess: (data) => {
            if (data?.data) {
              const { city_ward_town, address, prefecture } = data.data;
              setFindCostbyPrefecture((prev) => ({
                ...prev,
                prefecture: city_ward_town,
              }));
              const basePath = type === "billing" ? "billing" : "shipping";
              form.setValue(
                `${basePath}.prefecture_city`,
                `${city_ward_town} ${address} ${prefecture}`,
              );
              form.setValue(`${basePath}.prefecture`, prefecture);
              form.setValue(`${basePath}.city`, city_ward_town); // Add this line
              form.setValue(`${basePath}.address1`, address);
              form.trigger(`${basePath}.postalCode`)
              refetchCalculateCost();
              // form.resetError()
            }
          },
          onError: (err) => {
            const apiErr = err as { data?: { message?: string } };
            form.setError(`${type}.postalCode`, {
              type: "manual",
              message: apiErr.data?.message || "Failed to fetch address",
            });
          },
        },
      );
    }
  };

  //common fetch address function
  const fetchAddress = useCallback(
    async (type: "billing" | "shipping", postalCode: string): Promise<void> => {
      if (!postalCode) return Promise.resolve();

      return new Promise((resolve, reject) => {
        fcGetAddress(
          { postcode: postalCode },
          {
            onSuccess: (data) => {
              if (data?.data) {
                const { city_ward_town, address, prefecture } = data.data;
                form.setValue(
                  `${type}.prefecture_city` as const,
                  `${city_ward_town} ${address} ${prefecture}`,
                );
                form.setValue(`${type}.prefecture` as const, prefecture);
                form.setValue(
                  `${type}.address1` as const,
                  `${city_ward_town}${address}`,
                );

                setFindCostbyPrefecture((prev) => ({
                  ...prev,
                  prefecture: city_ward_town,
                }));
              }

              resolve();
            },
            onError: (err) => {
              const apiErr = err as { data?: { message?: string } };
              form.setError(`${type}.postalCode` as const, {
                type: "manual",
                message: apiErr.data?.message || "Failed to fetch address",
              });
              reject(err);
            },
          },
        );
      });
    },
    [form, fcGetAddress],
  );

  useEffect(() => {
    const details = userDetail?.data;
    if (details) {
      const shipping_address = details.user.userAddresses?.filter(
        (address) => address.addressType === 1,
      )[0];
      const billing_address = details.user.userAddresses?.filter(
        (address) => address.addressType === 2,
      )[0];
      const values = {
        billing: {
          name: billing_address.name || details.user.username || "",
          phoneNumber: billing_address.phoneNumber || "",
          postalCode: billing_address.postalCode || "",
          prefecture: billing_address.prefecture || "",
          city: billing_address.city || "",
          address1: billing_address.address1 || "",
          address2: billing_address.address2 || "",
        },
        shipping: {
          name: shipping_address.name || details.user.username || "",
          phoneNumber: shipping_address.phoneNumber || "",
          postalCode: shipping_address.postalCode || "",
          prefecture: shipping_address.prefecture || "",
          city: shipping_address.city || "",
          address1: shipping_address.address1 || "",
          address2: shipping_address.address2 || "",
        },
      };

      if (cartData?.data) {
        setFindCostbyPrefecture({
          prefecture: values.shipping.city,
          quantity: cartData.data.length.toString(),
        });
      }

      // Process billing address first, then shipping address
      fetchAddress("billing", values.billing.postalCode)
        .then(() => fetchAddress("shipping", values.shipping.postalCode))
        .then(() => {
          // Set all form values after both addresses are fetched
          Object.entries(values.billing).forEach(([key, value]) => {
            form.setValue(`billing.${key}` as keyof FormValues, value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          });

          Object.entries(values.shipping).forEach(([key, value]) => {
            form.setValue(`shipping.${key}` as keyof FormValues, value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          });
        })
        .catch((error) => {
          console.error("Error processing addresses:", error);
        });
    }
  }, [userDetail, form, fcGetAddress, fetchAddress, cartData]);

  useEffect(() => {
    if (cartData?.data?.length === 0) {
      router.push("/fc/purchase");
    }
    if (cartData?.data && Array.isArray(cartData?.data)) {
      const subTotal = cartData?.data?.reduce(
        (sum, item) => sum + item.product.discountSalePrice * item.productQty,
        0,
      );

      // Calculate shipping fee based on settings
      let totalShippingFee = 0;
      const settingData =
        fcSetting?.data && fcSetting.data.length > 0
          ? fcSetting.data[0]
          : undefined;

      if (settingData?.shippingFreeLimitFc) {
        if (subTotal >= settingData.shippingFreeLimitFc) {
          totalShippingFee = 0; // Free shipping
        } else {
          totalShippingFee = calculationShippingCost?.data?.totalFee || 0; // Standard shipping fee
        }
      }

      const totalTax = cartData?.data?.reduce((sum, item) => {
        const itemSubtotal = item.product.discountSalePrice * item.productQty;
        const itemTaxAmount = Math.round(
          itemSubtotal * (item.product.tax / 100),
        );
        return sum + itemTaxAmount;
      }, 0);

      const totalSummar = subTotal + totalTax + totalShippingFee;

      setOrderPriceInfo({
        totalAmount: subTotal.toLocaleString("ja-JP", {
          style: "currency",
          currency: "JPY",
        }),
        taxAmount: totalTax.toLocaleString("ja-JP", {
          style: "currency",
          currency: "JPY",
        }),
        shippingAmount: totalShippingFee.toLocaleString("ja-JP", {
          style: "currency",
          currency: "JPY",
        }),
        pointAmount: 0,
        totalAmountWithTax: totalSummar.toLocaleString("ja-JP", {
          style: "currency",
          currency: "JPY",
        }),
      });
    }
  }, [cartData, fcSetting, router, calculationShippingCost]);

  // const handleSaveSubscription = () => {
  //   if (!cartData?.data) return;
  //   const transformPayload: FcSaveSubscriptionRequest = {
  //     purchaseTypeId: 1,
  //     items: cartData.data.map((item) => ({
  //       productId: item.product.productId,
  //       quantity: item.productQty,
  //     })),
  //   };

  //   fcSaveSubscription(transformPayload, {
  //     onSuccess: (data) => {
  //       if (data && data.data) {
  //         const cartSubscriptId = data.data.cartSubscriptId;
  //         router.push(
  //           `/fc/purchase/payment?cartSubscriptId=${encryptString(
  //             String(cartSubscriptId),
  //           )}`,
  //         );
  //       }
  //     },
  //   });
  // };

  // useEffect(() => {
  //   if (!useDifferentShipping) {
  //     // Only set shipping fields when useDifferentShipping is true
  //     form.setValue("shipping", {
  //       name: "",
  //       phoneNumber: "",
  //       postalCode: "",
  //       prefecture: "",
  //       city: "",
  //       address1: "",
  //       address2: "",
  //       prefecture_city: "",
  //     });
  //   } else {
  //     // Clear shipping fields when unchecked
  //     form.setValue("shipping", undefined);
  //   }
  // }, [useDifferentShipping, form]);

  return (
    <section className="w-full">
      <div className="w-full px-8 py-6 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto ">
        {/* Step indicator */}
        <StepIndicator step={2} />

        {/* Cart table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-20">
          {/* Left: billing form */}
          <div className="lg:col-span-2">
            <FormProvider {...form}>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6 border border-disabled/30 p-6 rounded-md mb-4">
                  <h2 className="font-bold">配送先</h2>

                  {/* 配送先名 */}
                  <FormInputComponent
                    id="shipping.name"
                    control={form.control}
                    name="shipping.name"
                    label="配送先名"
                    required
                    className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                    placeholder="テスト山田"
                  />

                  {/* 電話番号 */}
                  <FormInputComponent
                    id="shipping.phoneNumber"
                    control={form.control}
                    name="shipping.phoneNumber"
                    label="電話番号"
                    required
                    className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                    placeholder="080-1234-5678"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    {/* 郵便番号 */}
                    <FormInputComponent
                      id="shipping.postalCode"
                      name="shipping.postalCode"
                      type="text"
                      control={form.control}
                      label="郵便番号"
                      inputMode="numeric"
                      minLength={7}
                      maxLength={7}
                      required
                      className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                      onBlur={(e) => handlePostalCodeBlur(e, "shipping")}
                    />

                    {/* 都道府県 */}
                    <div className="col-span-2">
                      <FormInputComponent
                        id="shipping.prefecture_city"
                        control={form.control}
                        name="shipping.prefecture_city"
                        label="都道府県"
                        required
                        disabled
                        className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                        placeholder="東京都"
                      />
                    </div>
                  </div>

                  {/* 番地・建物名・部屋番号 */}
                  <FormInputComponent
                    id="shipping.address1"
                    control={form.control}
                    name="shipping.address2"
                    label="番地・建物名・部屋番号"
                    required
                    className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                    placeholder="1-1-1 900"
                  />
                </div>

                {/* 配送先と違う住所を設定 */}
                <div className="flex justify-between items-center gap-3 text-sm text-dark border border-disabled/30 p-6 rounded-md">
                  <h2 className="px-2 font-bold text-2xl">請求先</h2>
                  <div className="flex items-center">
                    <Controller
                      name="useDifferentShipping"
                      control={form.control}
                      render={({ field }) => (
                        <Checkbox
                          id="otherAddress"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mr-3"
                        />
                      )}
                    />
                    <label htmlFor="otherAddress">配送先と違う住所を設定</label>
                  </div>
                </div>

                {/* 異なる配送先フォーム (条件付き表示) */}
                {useDifferentShipping && (
                  <div className="space-y-6 border border-disabled/30 p-6 rounded-md mb-4">
                    <h2 className="font-bold">請求先</h2>

                    {/* 請求先名 */}
                    <FormInputComponent
                      id="billing.name"
                      control={form.control}
                      name="billing.name"
                      label="請求先名"
                      required
                      className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                      placeholder="請求先名を入力"
                    />

                    {/* 電話番号 */}
                    <FormInputComponent
                      id="billing.phoneNumber"
                      control={form.control}
                      name="billing.phoneNumber"
                      label="電話番号"
                      required
                      className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                      placeholder="080-1234-5678"
                    />

                    <div className="grid grid-cols-3 gap-4">
                      {/* 郵便番号 */}
                      <FormInputComponent
                        id="billing.postalCode"
                        name="billing.postalCode"
                        type="text"
                        control={form.control}
                        label="郵便番号"
                        inputMode="numeric"
                        minLength={7}
                        maxLength={7}
                        required
                        className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                      />

                      {/* 都道府県 */}
                      <div className="col-span-2">
                        <FormInputComponent
                          id="billing.prefecture_city"
                          control={form.control}
                          name="billing.prefecture_city"
                          label="都道府県"
                          required
                          className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                          placeholder="東京都"
                          disabled
                        />
                      </div>
                    </div>

                    {/* 番地・建物名・部屋番号 */}
                    <FormInputComponent
                      id="billing.address1"
                      control={form.control}
                      name="billing.address2"
                      label="番地・建物名・部屋番号"
                      required
                      className="w-full bg-white h-12 rounded-md border border-disabled/30 px-4 py-3"
                      placeholder="1-1-1 900"
                    />
                  </div>
                )}
              </form>
            </FormProvider>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="border border-disabled/30 rounded-lg p-6 h-full">
              {/* Cart items */}
              {cartData?.data &&
                Array.isArray(cartData?.data) &&
                cartData?.data?.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-4 mb-4"
                  >
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-50">
                      {item.product.images?.[0]?.imageUrl && (
                        <ImageComponent
                          imgURL={getPublicUrl(item.product.images[0].imageUrl)}
                          imgName={`product-${item.product.productId}`} // Add a meaningful name
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-base text-dark line-clamp-2">
                        {item.product.name}
                      </div>
                      <div className="mt-1">
                        <span className="text-sm font-normal">
                          ¥
                          {item.product.discountSalePrice.toLocaleString(
                            "ja-JP",
                          )}
                          （税別）*
                          {item.productQty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Order summary totals */}
              <div className=" pt-4 mt-4 space-y-10">
                {/* sub total */}
                <div className="flex justify-between text-sm text-gray-600 mb-5">
                  <div>小計</div>
                  <div>{orderPriceInfo.totalAmount}</div>
                </div>

                {/* Tax  */}
                <div className="flex justify-between text-sm text-gray-600 mb-5">
                  <div>税金(10%)</div>
                  <div>{orderPriceInfo.taxAmount}</div>
                </div>

                {/* shipping fee */}
                <div className="flex justify-between text-sm text-gray-600 mb-5">
                  <div>送料</div>
                  <div>{orderPriceInfo.shippingAmount}</div>
                </div>

                {/* Point */}
                {/* <div className="flex justify-between text-sm text-gray-600 mb-5">
                  <div>ポイント</div>
                  <div></div>
                </div> */}

                <div className=" mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <div className="">合計</div>
                    <div>{orderPriceInfo.totalAmountWithTax}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between  md:justify-end items-center gap-4">
          {/* <div className="flex justify-center items-center gap-4">
            <Button
              onClick={handleSaveSubscription}
              className="h-12 flex justify-center items-center gap-3 border border-primary bg-transparent text-primary rounded-md cursor-pointer hover:text-white"
              disabled={isFcSaveSubscriptionPending}
            >
              {isFcSaveSubscriptionPending ? (
                <LoadingIndicator />
              ) : (
                <>
                  サブスクリプションのデモ
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </Button>

            <div className="w-5 h-0.5 rounded-full bg-black hidden md:block" />
          </div> */}

          <Link
            href="/fc/purchase/cart"
            className="h-12 hover:bg-disabled/10  gap-3 flex justify-center items-center w-30 text-black border border-disabled/30 rounded-md"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            戻る
          </Link>

          <Button
            onClick={() => handleSubmit(onSubmit)()}
            className="h-12 flex justify-center items-center gap-3 w-30 bg-primary text-white rounded-md cursor-pointer"
            disabled={isFCPostOrder || isUserDetailLoading}
          >
            {isFCPostOrder || isUserDetailLoading ? (
              <LoadingIndicator />
            ) : (
              <>
                次へ
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FCbillingPage;
