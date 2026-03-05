"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useEffect, useCallback, useState } from "react";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
//import { NewCustomer } from "@/types/customers";
import { useCreateCustomer } from "@/hooks/admin/useCustomer";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFCGetAddress } from "@/hooks/fc";
import { usePostalAddress } from "@/hooks/fc/usePostalAddress";
import { useFcPlanMaster, useFcUsers } from "@/hooks/admin/useFc";
import { encryptString } from "@/utils";
import { ApiError } from "@/lib/api/api.gateway";

// Form schema validation
const FormSchema = z.object({
  username: z.string().min(2, "名前は2文字以上で入力してください"),
  usernameKana: z.string().min(2, "名前(カナ)は必須です"),
  email: z.string().email("メールアドレスは正しく入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  tantoName: z.string().min(2, "担当者名は必須です"),
  tantoPosition: z.string().min(2, "担当者名は必須です"),
  postalCode: z
    .string()
    .min(7, "郵便番号は7文字で入力してください")
    .max(7, "郵便番号は7文字で入力してください"),
  prefecture: z.string().min(1, "都道府県を入力してください"), // city_ward_town + address + prefecture
  address1: z.string().optional(),
  address2: z.string().min(1, "市区町村は必須です"),
  phoneNumber: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(
      /^0\d{1,4}-\d{1,4}-\d{4}$/,
      "有効な日本の電話番号を入力してください (例: 070-1234-1234)",
    ), //070-1234-1234
  representativeName: z.string().min(1, "代表者名は必須です"),
  contractStartDate: z.string().min(1, "契約開始日は必須です"),
  contractEndDate: z.string().min(1, "契約終了日は必須です"),
  contractUpdateFlg: z.string().min(1, "契約自動更新は必須です"),
  currentFcPlanMasterId: z.coerce.number().min(1, "契約プランは必須です"),
  referrerId: z.coerce.number().nullable().optional(), // Allow null
  name: z.string(),
  privacyAggree: z.number().min(1, "プライバシーアグリエートは必須です"),
  role: z
    .number()
    .min(1, "役割は必須です")
    .refine((val) => val !== 0, { message: "役割は必須です" }),
});

const NewCustomerPage = () => {
  const router = useRouter(); // Get the router

  // Create news mutation
  const {
    mutate: createCustomer,
    error: createCustomerError,
    isSuccess: createCustomerSuccess,
    isPending: isCreatingCustomer,
  } = useCreateCustomer();

  //get plans and users
  const { data: plans, isLoading: loadingPlans } = useFcPlanMaster();
  const { data: users, isLoading: loadingUsers } = useFcUsers("all");

  // Calculate dates
  const today = new Date();
  const contractStartDate = today.toISOString().split("T")[0];
  const contractEndDate = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];
  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      usernameKana: "",
      email: "",
      password: "",
      tantoName: "",
      tantoPosition: "",
      postalCode: "",
      prefecture: "",
      address1: "",
      address2: "",
      phoneNumber: "",
      representativeName: "",
      contractStartDate,
      contractEndDate,
      contractUpdateFlg: "有",
      currentFcPlanMasterId: 0,
      referrerId: null,
      name: "",
      privacyAggree: 1,
      role: 0,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { mutate: fcGetAddress } = useFCGetAddress();
  const { prefecture, error, fetchAddress } = usePostalAddress(
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

  // Popover state for referrer dropdown
  const [referrerPopoverOpen, setReferrerPopoverOpen] = useState(false);
  const [referrerSearch, setReferrerSearch] = useState("");

  // Filter users based on search
  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(referrerSearch.toLowerCase()),
  );

  // Update form values when prefecture changes
  useEffect(() => {
    if (prefecture) {
      form.setValue("prefecture", prefecture, { shouldValidate: true });
    }
  }, [prefecture, form]);

  // Watch for postal code changes and fetch address
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "postalCode" &&
        value.postalCode &&
        value.postalCode.length >= 7
      ) {
        fetchAddress(value.postalCode);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, fetchAddress]);

  // Form submit handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    data.name = data.username;
    data.privacyAggree = 1;
    data.address1 = data.address2;
    createCustomer(data, {
      onSuccess: (response) => {
        toast.success("会社を登録しました");
        //redirect back to profile page
        router.push(
          `/admin/customers/${encryptString(response?.data?.userId || "")}`,
        );
      },
      onError: (error) => {
        if (error instanceof Error) {
          const apiError = error as ApiError;
          toast.error(apiError.data?.message || error.message);
        } else {
          toast.error("会社の登録に失敗しました");
        }
      },
    });
  };

  // Create customer success handler
  useEffect(() => {
    if (createCustomerSuccess) {
      toast.success("会社を登録しました");
      //router.back();
    }

    if (createCustomerError) {
      toast.error(createCustomerError.message);
    }
  }, [createCustomerSuccess, createCustomerError, router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Upper section */}
        <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
          {/* back */}
          <div className="flex gap-2 text-left items-center">
            <h2>代理店作成</h2>
          </div>
          {/* Header */}
          <div className="flex text-left items-center">
            <h4>基本情報</h4>
          </div>
          {/* Form Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* left Section */}
            <div>
              {/* Company Name */}
              <FormInputComponent
                id="username"
                control={form.control}
                name="username"
                label="会社名／サロン名"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
              {/* Tanto Name */}
              <FormInputComponent
                id="tantoName"
                control={form.control}
                name="tantoName"
                label="担当者氏名"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
              {/* Representative Name */}
              <FormInputComponent
                id="representativeName"
                control={form.control}
                name="representativeName"
                label="代表者名"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
              {/* address 2    */}
              <FormInputComponent
                id="address2"
                control={form.control}
                name="address2"
                label="番地・建物名・部屋番号"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
              {/* mail */}
              <FormInputComponent
                id="email"
                control={form.control}
                name="email"
                label="メールアドレス"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
            </div>
            {/* Right Section */}
            <div>
              {/* kana name */}
              <FormInputComponent
                id="usernameKana"
                control={form.control}
                name="usernameKana"
                label="会社名／サロン名(フリガナ)"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />

              {/*  tanto positon*/}
              <FormInputComponent
                id="tantoPosition"
                control={form.control}
                name="tantoPosition"
                label="役職／部署名"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
              {/* postal code & prefecture */}
              <div className="grid grid-cols-3 gap-1">
                <div>
                  {/* postal code */}
                  <FormInputComponent
                    id="postalCode"
                    type="text"
                    inputMode="numeric"
                    control={form.control}
                    name="postalCode"
                    label="郵便番号 "
                    minLength={7}
                    maxLength={7}
                    required
                    className="mb-4 col-span-1 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                  />
                  {/* Add error message display */}
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                {/* prefecture */}
                <div className="col-span-2">
                  <FormInputComponent
                    id="prefecture"
                    control={form.control}
                    name="prefecture"
                    label="都道府県"
                    required
                    disabled
                    className="mb-4 col-span-2 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                  />
                </div>
              </div>
              {/* phone Number */}
              <FormInputComponent
                id="phoneNumber"
                control={form.control}
                name="phoneNumber"
                label="電話番号"
                required
                className="mb-4 w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
              {/* password */}
              <FormInputComponent
                id="password"
                control={form.control}
                name="password"
                label="パスワード"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                type="password"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>
        {/* Lower section */}
        <div className="mt-4 px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
          {/* Header */}
          <div className="flex text-left items-center">
            <h4>契約情報</h4>
          </div>
          {/* Form Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* left Section */}
            <div>
              {/* Contract Start Date */}
              <div>
                <FormLabel htmlFor="contractStartDate">
                  契約開始日 <span className="text-required text-xl">*</span>
                </FormLabel>
                <AdminDatePicker
                  value={form.watch("contractStartDate")}
                  onChange={(date) => {
                    form.setValue("contractStartDate", date, {
                      shouldValidate: true,
                    });

                    // Calculate and set contractEndDate to one year after contractStartDate
                    if (date) {
                      const startDate = new Date(date);
                      const endDate = new Date(
                        startDate.getFullYear() + 1,
                        startDate.getMonth(),
                        startDate.getDate(),
                      );
                      const endDateString = endDate.toISOString().split("T")[0];
                      form.setValue("contractEndDate", endDateString, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  styleName="w-full border border-white-bg rounded-md mt-2 mb-4"
                />
                <FormMessage className="text-red-500">
                  {form.formState.errors.contractStartDate?.message}
                </FormMessage>
              </div>
              {/* update flag */}
              <div className="mt-2">
                <FormLabel htmlFor="contractUpdateFlg">
                  契約更新フラグ{" "}
                  <span className="text-required text-xl">*</span>
                </FormLabel>
                <div className="flex gap-6 mt-2">
                  <FormField
                    control={form.control}
                    name="contractUpdateFlg"
                    render={({ field }) => (
                      <div className="flex gap-6">
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "有"}
                              onCheckedChange={(checked) =>
                                checked && field.onChange("有")
                              }
                            />
                          </FormControl>
                          <FormLabel className="mt-0! cursor-pointer">
                            有（1年間）
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "無"}
                              onCheckedChange={(checked) =>
                                checked && field.onChange("無")
                              }
                            />
                          </FormControl>
                          <FormLabel className="mt-0! cursor-pointer">
                            無
                          </FormLabel>
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
                <FormMessage className="text-red-500">
                  {form.formState.errors?.contractUpdateFlg?.message}
                </FormMessage>
              </div>
              {/* fc user role */}
              <div className="mt-7">
                <FormLabel htmlFor="role">
                  アカウントの種類{" "}
                  <span className="text-required text-xl">*</span>
                </FormLabel>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      value={field.value ? field.value.toString() : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="w-full border border-white-bg rounded-md mt-2 mb-4">
                        <SelectValue placeholder="アカウントの種類を選択してください" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="2">代理店コンサルタント</SelectItem>
                        <SelectItem value="3">代理店リーダー</SelectItem>
                        <SelectItem value="4">代理店スペシャリスト</SelectItem>
                        <SelectItem value="5">代理店メンバー</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage className="text-red-500">
                  {form.formState.errors?.role?.message}
                </FormMessage>
              </div>
            </div>
            {/* right Section */}
            <div>
              {/* contract end date */}
              <div>
                <FormLabel htmlFor="contractEndDate">
                  契約終了日 <span className="text-required text-xl">*</span>
                </FormLabel>
                <AdminDatePicker
                  value={form.watch("contractEndDate")}
                  onChange={(date) =>
                    form.setValue("contractEndDate", date, {
                      shouldValidate: true,
                    })
                  }
                  styleName="w-full border border-white-bg rounded-md mt-2 mb-4"
                />
                <FormMessage className="text-red-500">
                  {form.formState.errors?.contractEndDate?.message}
                </FormMessage>
              </div>
              {/* plan drop down */}
              <div>
                <FormLabel htmlFor="planId">
                  契約時の初期購入{" "}
                  <span className="text-required text-xl">*</span>
                </FormLabel>
                <FormField
                  control={form.control}
                  name="currentFcPlanMasterId"
                  render={({ field }) => (
                    <Select
                      value={field.value ? field.value.toString() : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="w-full border border-white-bg rounded-md mt-2 mb-4">
                        <SelectValue placeholder="プランを選択してください" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {plans?.map((plan) => (
                          <SelectItem
                            key={plan.planId}
                            value={plan.planId.toString()}
                          >
                            {plan.planName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage className="text-red-500">
                  {form.formState.errors?.currentFcPlanMasterId?.message}
                </FormMessage>
              </div>
              {/* referrer drop down - show only if role is 5 */}
              {form.watch("role") === 5 && (
                <div>
                  <FormLabel htmlFor="referrerId">
                    紹介者 <span className="text-required text-xl">*</span>
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="referrerId"
                    render={({ field }) => {
                      const selectedUser = users?.find(
                        (user) => user.fcId === field.value,
                      );

                      return (
                        <Popover
                          open={referrerPopoverOpen}
                          onOpenChange={setReferrerPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={referrerPopoverOpen}
                              className="w-full justify-between border border-white-bg rounded-md mt-2 mb-4 h-11 font-normal text-black"
                            >
                              {selectedUser
                                ? selectedUser.username
                                : "紹介者を選択してください"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] text-black p-0 bg-white border border-gray-200 shadow-md">
                            <div className="flex flex-col">
                              <div className="flex items-center border-b px-3">
                                <input
                                  type="text"
                                  placeholder="紹介者を検索..."
                                  value={referrerSearch}
                                  onChange={(e) =>
                                    setReferrerSearch(e.target.value)
                                  }
                                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 text-black"
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
                                {filteredUsers && filteredUsers.length > 0 ? (
                                  filteredUsers.map((user) => (
                                    <div
                                      key={user.fcId}
                                      onClick={() => {
                                        field.onChange(user.fcId);
                                        setReferrerPopoverOpen(false);
                                        setReferrerSearch("");
                                      }}
                                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-black hover:bg-gray-100"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 text-black",
                                          field.value === user.fcId
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {user.username}
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-6 text-center text-sm text-black">
                                    該当する紹介者が見つかりません
                                  </div>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    }}
                  />
                  <FormMessage className="text-red-500">
                    {form.formState.errors?.referrerId?.message}
                  </FormMessage>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* button */}
        <div className="flex items-center justify-end mt-6">
          <Button
            type="submit"
            disabled={
              // !form.formState.isValid ||
              isCreatingCustomer || loadingPlans || loadingUsers
            }
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            {isCreatingCustomer || loadingPlans || loadingUsers
              ? "登録中..."
              : "代理店作成"}
          </Button>
        </div>
      </form>

      <ServerActionLoadingComponent
        loading={isCreatingCustomer}
        message="会社を登録しています"
      />
    </Form>
  );
};

export default NewCustomerPage;
