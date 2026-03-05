"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import RegisterIndicator from "@/components/fc/RegisterIndicator";
import AlertBox from "@/components/fc/ui/AlertBox";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import PopupBox from "@/components/fc/ui/PopupBox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useAccountRegister,
  useAccountVerify,
  useFCCheckUserExists,
  useFCGetAddress,
  useLogin,
  useUserDetail,
  useUserDetailUpdate,
} from "@/hooks/fc";
import { ApiError } from "@/lib/api/api.gateway";
import { getUser, logout, setToken, setUser } from "@/lib/api/auth";
import { useUserStore } from "@/store/useAuthStore";
import { User } from "@/types/auth";
import { AccountVerify, LoginUser } from "@/types/fc";
import { UserDetailUpdate } from "@/types/fc/user.type";
import { MESSAGES } from "@/types/messages";
import { decodeShortString, encryptString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

/**
 * Form Schema
 * @author Paing Sett Kyaw
 * @created 2025-11-11
 * @updated ****-**-**
 */

const baseSchema = {
  username: z.string().min(1, "氏名を入力してください"),
  usernameKana: z.string().min(1, "フリガナを入力してください"),
  name: z.string().min(1, "担当者名を入力してください"),
  tantoPosition: z.string().min(1, "役職名を入力してください"),
  representativeName: z.string().min(1, "代表者名を入力してください"),
  postalCode: z
    .string()
    .min(7, "郵便番号は7文字で入力してください")
    .max(7, "郵便番号は7文字で入力してください"),
  prefecture: z.string().optional(),
  address2: z.string().min(1, "住所を入力してください"),
  address1: z.string().optional(),
  prefecture_city: z.string().optional(),
  phoneNumber: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(
      /^0\d{1,4}-\d{1,4}-\d{4}$/,
      "有効な日本の電話番号を入力してください (例: 070-1234-1234)",
    ),
  privacyAggree: z.boolean().refine((v) => v === true, {
    message: "個人情報の取り扱いに同意してください",
  }),
};

const registrationSchema = z.object({
  ...baseSchema,
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(20, "パスワードは20文字以下で入力してください"),
});

const updateSchema = z.object({
  ...baseSchema,
  email: z.string().email("有効なメールアドレスを入力してください").optional(),
  password: z.string().optional(),
});
type RegisterForm = z.infer<typeof registrationSchema>;
type UpdateForm = z.infer<typeof updateSchema>;
type FormValues<T extends boolean> = T extends true ? UpdateForm : RegisterForm;

const AccountCreatePage = () => {
  /**
   * States
   * @author Paing Sett Kyaw
   * @created 2025-11-11
   * @updated ****-**-**
   */
  const [showPolicy, setShowPolicy] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [uid, setUserId] = useState<string>();
  const [code, setCode] = useState<string>("");
  const [errors, setErrors] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  /**
   * Hooks
   * @author Paing Sett Kyaw
   * @created 2025-11-11
   * @updated ****-**-**
   */
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const referID = idParam ? decodeShortString(idParam) : null;
  /**
   * Form
   * @author Paing Sett Kyaw
   * @created 2025-11-11
   * @updated ****-**-**
   */
  const form = useForm<FormValues<typeof isUpdate>>({
    resolver: zodResolver(isUpdate ? updateSchema : registrationSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      usernameKana: "",
      name: "",
      tantoPosition: "",
      representativeName: "",
      postalCode: "",
      prefecture: undefined,
      address2: "",
      address1: "",
      phoneNumber: "",
      email: "",
      password: "",
      privacyAggree: false,
      prefecture_city: "",
    },
  });

  /**
   * Mutations
   * @author Paing Sett Kyaw
   * @created 2025-11-11
   * @updated ****-**-**
   */

  const { mutate: registerAccount, isPending: isRegisterPending } =
    useAccountRegister();
  const { mutate: verifyAccount, isPending: isVerifyPending } =
    useAccountVerify();
  const { mutate: loginMutate, isPending: isLoginPending } = useLogin();
  const { mutate: userDetailUpdate, isPending: isUserDetailUpdatePending } =
    useUserDetailUpdate();
  const { mutate: fcGetAddress, isPending: isFCGetAddressPending } =
    useFCGetAddress();
  const { data: isUserExistsData, isPending: isFCCheckUserExistsPending } =
    useFCCheckUserExists(Number(referID));

  /**
   * Queries
   * @author Paing Sett Kyaw
   * @created 2025-11-13
   * @updated ****-**-**
   */

  const { data: userDetail, isLoading: isLoadingUserDetail } = useUserDetail();

  useEffect(() => {
    const details = userDetail?.data;
    if (details) {
      setIsUpdate(true);

      const address = details.user.userAddresses?.[0] || {};
      const values = {
        username: details.user.username || "",
        usernameKana: details.user.usernameKana || "",
        name: details.tantoName || "",
        tantoPosition: details.tantoPosition || "",
        representativeName: details.representativeName || "",
        postalCode: address.postalCode || "",
        prefecture: address.prefecture || "",
        address2: address.address2 || "",
        phoneNumber: details.user.userAddresses?.[0].phoneNumber || "",
        email: details.user.email || "",
        password: details.user.password || "",
        privacyAggree: details.privacyAggree === 1,
      };

      fcGetAddress(
        { postcode: values.postalCode },
        {
          onSuccess: (data) => {
            if (data?.data) {
              const { city_ward_town, address, prefecture } = data.data;
              form.setValue(
                "prefecture_city",
                `${city_ward_town}${address}${prefecture}`,
              );
              form.setValue("prefecture", prefecture);
              form.setValue("address1", `${city_ward_town}${address}`);
            }
          },
          onError: () => {
            form.setError("postalCode", {
              type: "manual",
              // message: err.data.message,
              message: "郵便番号を正しく入力してください。",
            });
          },
        },
      );

      Object.entries(values).forEach(([key, value]) =>
        form.setValue(
          key as keyof FormValues<typeof isUpdate>,
          value as never,
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail]);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user?.userId) {
        setUserId(user.userId); // Convert to number
      }
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    if (isUserExistsData?.data === false) {
      toast.error("このIDはすでに存在しています");
      router.push("/login");
    }
  }, [isUserExistsData, router]);

  useEffect(() => {
    const user = useUserStore.getState().user;
    const token = useUserStore.getState().token;
    if (user && token && referID) {
      setShowLogoutConfirm(true);
    }
  }, [referID]);

  /**
   * Handles form submission
   * @param {FormValues} values - The form values
   * @returns {void}
   * @author Paing Sett Kyaw
   * @created 2025-11-11
   * @updated ****-**-**
   */
  const onSubmit = (values: FormValues<typeof isUpdate>) => {
    if (isUpdate) {
      // For update, remove empty password/email if they weren't changed
      const updateData: UserDetailUpdate = {
        ...values,
        privacyAggree: values.privacyAggree ? 1 : 0,
        tantoName: values.name,
        userId: Number(uid),
        // Ensure email and password are always strings, even if empty
        email: values.email || "", // provide default empty string
        password: values.password || "", // provide default empty string
        // Include all other required fields from UserDetailUpdate
        username: values.username,
        usernameKana: values.usernameKana,
        phoneNumber: values.phoneNumber,
        address1: values.address1,
        address2: values.address2,
        name: values.name,
        postalCode: values.postalCode,
        representativeName: values.representativeName,
        tantoPosition: values.tantoPosition,
        step: 2,
        prefecture: values.prefecture || "", // optional with default
      };

      // Send updateData to server
      userDetailUpdate(updateData, {
        onSuccess: () => {
          toast.success("アカウント情報が正常に更新されました");
          if (uid) {
            router.push("/fc/register/supply-sale?id=" + encryptString(uid));
          }
        },
        onError: () => {
          toast.error("アカウント情報の更新に失敗しました");
        },
      });
    } else {
      // For new registration, all fields including password/email are required
      registerAccount(
        {
          email: values.email || "",
          password: values.password || "",
          name: values.name,
        },
        {
          onSuccess: () => {
            toast.success("認証コードを送信しました");
            setIsPopupOpen(true);
          },
          onError: () => {
            toast.error("アカウント登録に失敗しました");
          },
        },
      );
    }
  };

  const confirm = () => {
    const formValues = form.getValues();

    // Create a new object with all required fields
    const verifyData: AccountVerify = {
      code,
      username: formValues.username,
      usernameKana: formValues.usernameKana,
      email: formValues.email || "",
      password: formValues.password || "",
      phoneNumber: formValues.phoneNumber,
      address2: formValues.address2,
      address1: formValues.address1 || "",
      name: formValues.name,
      postalCode: formValues.postalCode,
      prefecture: formValues.prefecture, // Optional
      representativeName: formValues.representativeName,
      tantoName: formValues.name, // Assuming this is correct mapping
      tantoPosition: formValues.tantoPosition,
      privacyAggree: formValues.privacyAggree ? 1 : 0,
      step: 2,
    };

    if (referID) {
      verifyData.referrerId = Number(referID);
    }

    verifyAccount(verifyData, {
      onSuccess: (data) => {
        const userId = encryptString(data.data.userId.toString());
        loginMutate(
          {
            email: form.getValues().email ?? "",
            password: form.getValues().password ?? "",
          },
          {
            onSuccess: async (data) => {
              await handleToSaveCookie(data.data.token, data.data.user);
              useUserStore.setState({
                user: data.data.user,
                token: data.data.token,
              });
              toast.success("ログインしました");
              resetState();
              router.push("/fc/register/supply-sale?id=" + userId);
            },
          },
        );
      },
      onError: (err) => {
        resetState();
        const apiError = err as ApiError;
        const errorData = apiError.data;

        const errorMessage =
          (errorData?.errors &&
            Array.isArray(errorData.errors) &&
            errorData.errors.join("\n")) ||
          errorData?.message ||
          MESSAGES.COMMON.UNEXPECTED_ERROR;

        toast.error(errorMessage);
      },
    });
  };

  const resetState = () => {
    setIsPopupOpen(false);
    setCode("");
  };

  const handleToSaveCookie = async (token: string, user: LoginUser | User) => {
    await setToken(token);
    await setUser(user);
  };

  const handleLogoutConfirm = async () => {
    useUserStore.getState().clearUser();
    await setToken("");
    await setUser({} as LoginUser);
    logout();
    form.reset();
    setShowLogoutConfirm(false);
    toast.success("ログアウトしました");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
    router.push("/"); // Redirect to home or continue normal flow
  };

  const handlePostalCodeBlur = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement; // Type assertion since we know it's an input
    const postalCode = target.value.replace(/-/g, "");
    if (postalCode.length === 7) {
      // Japanese postal codes are 7 digits
      fcGetAddress(
        { postcode: postalCode },
        {
          onSuccess: (data) => {
            if (data?.data) {
              const { city_ward_town, address, prefecture } = data.data;
              form.setValue(
                "prefecture_city",
                `${city_ward_town}${address}${prefecture}`,
              );
              form.setValue("prefecture", prefecture);
              form.setValue("address1", `${city_ward_town}${address}`);
            }
          },
          onError: () => {
            form.setError("postalCode", {
              type: "manual",
              // message: err.data.message,
              message: "郵便番号を正しく入力してください。",
            });
          },
        },
      );
    }
  };

  if (isFCCheckUserExistsPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator size="md" />
      </div>
    );
  }
  if (isUserExistsData?.data === false) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator size="md" />
      </div>
    );
  }

  return (
    <section className="w-full px-1 md:px-6 py-10 flex justify-center">
      <div className="max-w-4xl w-full">
        <RegisterIndicator active={1} />
        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-foreground  rounded-lg  shadow-sm"
          >
            <div className="sm:hidden bg-product-card-btn w-full p-2 rounded-t-lg">
              <h2 className="text-lg text-white font-semibold text-center">
                アカウント作成
              </h2>
            </div>
            <div className="space-y-5 p-3 md:p-6">
              {/* username */}

              <FormInputComponent
                id="username"
                control={form.control}
                name="username"
                label="会社名／サロン名"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />

              {/* usernameKana */}
              <FormInputComponent
                id="usernameKana"
                control={form.control}
                name="usernameKana"
                label="会社名／サロン名(フリガナ)"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />

              {/* name */}
              <FormInputComponent
                id="name"
                control={form.control}
                name="name"
                label="担当者氏名"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />

              {/* position */}
              <FormInputComponent
                id="tantoPosition"
                control={form.control}
                name="tantoPosition"
                label="役職名"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />

              {/* representativeName */}
              <FormInputComponent
                id="representativeName"
                control={form.control}
                name="representativeName"
                label="代表者名"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />

              <div className="grid grid-cols-4 gap-5">
                {/* postalCode */}
                <div className="flex-1 col-span-1">
                  <FormInputComponent
                    id="postalCode"
                    name="postalCode"
                    type="number"
                    control={form.control}
                    label="郵便番号"
                    minLength={7}
                    maxLength={7}
                    required
                    className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                    onBlur={handlePostalCodeBlur}
                  />
                </div>

                {/* prefecture */}
                <div className="flex-1 col-span-3">
                  <FormInputComponent
                    id="prefecture"
                    control={form.control}
                    name="prefecture_city"
                    label="都道府県"
                    required
                    className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                    disabled
                  />
                </div>
              </div>

              {/* address2 */}
              <FormInputComponent
                id="address2"
                control={form.control}
                name="address2"
                label="住所"
                required
                className="w-full bg-white h-10 rounded-md border border-disposed/30 px-4 py-3"
              />

              {/* phoneNumber */}
              <FormInputComponent
                id="phoneNumber"
                control={form.control}
                name="phoneNumber"
                label="電話番号"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />

              {!isUpdate && (
                <>
                  {/* email */}
                  <FormInputComponent
                    id="email"
                    control={form.control}
                    name="email"
                    type="email"
                    label="メールアドレス"
                    required={!isUpdate}
                    disabled={isUpdate}
                    className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                  />

                  {/* password */}
                  <FormInputComponent
                    id="password"
                    control={form.control}
                    name="password"
                    type="password"
                    label="パスワード"
                    required={!isUpdate}
                    className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3 pr-10"
                    autoComplete="new-password"
                  />
                </>
              )}

              {/* agree */}
              <FormField
                control={form.control}
                name="privacyAggree"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 bg-disabled/30 px-4 py-1.5 rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(v) => field.onChange(!!v)}
                          id="privacyAggree"
                          className="bg-white rounded-sm"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        className="text-sm text-black  md:underline md:text-alink focus:outline-none bg-transparent hover:bg-transparent cursor-pointer"
                        onClick={() => setShowPolicy(true)}
                      >
                        個人情報取扱いに同意
                      </Button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* 個人情報 popup */}
              {showPolicy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 ">
                  <div className="bg-white rounded-xl max-w-2xl w-[90%] md:w-full p-8 shadow-lg overflow-y-auto max-h-[90vh]">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                      個人情報の取扱いについて
                    </h2>
                    <div className="text-sm space-y-4 text-dark">
                      <p>
                        ビューテック株式会社（以下、「当社」といいます）は、当社が運営する化粧品販売ECサイト（以下、「本サービス」）において、お客様の個人情報の取扱いに関し厳重に保護に努めます。
                      </p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          <b>取得する個人情報について</b>
                          <br />
                          当社は、本サービスの提供にあたり、以下の個人情報を取得いたします。
                          <ul className="list-disc pl-5">
                            <li>氏名</li>
                            <li>電話番号</li>
                            <li>メールアドレス</li>
                            <li>郵便番号・住所</li>
                            <li>アカウント情報（ユーザーID・パスワード等）</li>
                            <li>
                              ご注文履歴、お問い合わせ内容などのご利用履歴
                            </li>
                          </ul>
                        </li>
                        <li>
                          <b>利用目的</b>
                          <br />
                          取得した個人情報は、以下の目的のために利用します。
                          <ul className="list-disc pl-5">
                            <li>商品の発送、代金の請求・決済処理</li>
                            <li>ご注文内容やご配送に関する連絡・連絡</li>
                            <li>アカウントの作成、本人確認</li>
                            <li>
                              本サービスに関するご案内、キャンペーン情報の提供
                            </li>
                            <li>お問い合わせへの対応</li>
                            <li>
                              サービス改善および新サービス開発のための分析
                            </li>
                            <li>法令に基づく対応、不正・違反行為の防止</li>
                          </ul>
                        </li>
                        <li>
                          <b>第三者提供について</b>
                          <br />
                          法令に基づく場合を除き、事前にお客様の同意を得ることなく、個人情報を第三者に提供することはありません。
                        </li>
                        <li>
                          <b>委託について</b>
                          <br />
                          業務遂行上必要な範囲内で、個人情報の取扱いを外部業者に委託する場合があります。その場合、当社は委託先に対して適切な監督を行います。
                        </li>
                        <li>
                          <b>個人情報の管理</b>
                          <br />
                          取得した個人情報について、漏洩、滅失または毀損の防止その他の安全管理のために必要かつ適切な措置を講じます。
                        </li>
                        <li>
                          <b>開示・訂正・削除等の請求について</b>
                          <br />
                          お客様ご本人から、当社が保有する個人情報の開示、訂正、利用停止、削除等を希望される場合は、当社所定の手続きに従い、適切に対応いたします。
                        </li>
                        <li>
                          <b>お問い合わせ窓口</b>
                          <br />
                          個人情報の取扱いに関するお問い合わせは、下記窓口までご連絡ください。
                          <ul className="list-disc pl-5">
                            <li>BEAUTECH 株式会社</li>
                            <li>
                              〒104-0045 東京都中央区築地6丁目1-9 門跡木村ビル2F
                            </li>
                            <li>【コスメ事業】</li>
                            <li>専用窓口：03-5801-5968</li>
                            <li>メールアドレス：starshop@beau-tech.jp</li>
                            <li>受付時間：10:00-17:00</li>
                          </ul>
                        </li>
                        <li>
                          <b>改定について</b>
                          <br />
                          本ポリシーの内容は、法令等の改正や当社の方針により、予告なく変更されることがあります。最新の内容は当社サイト上で随時掲載いたします。
                        </li>
                      </ol>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <Button
                        type="button"
                        className="w-60 h-12 bg-primary text-white rounded-md cursor-pointer"
                        onClick={() => {
                          form.setValue("privacyAggree", true, {
                            shouldValidate: true,
                          });
                          setShowPolicy(false);
                        }}
                      >
                        同意します
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full h-12 bg-black md:bg-primary text-white rounded-md cursor-pointer"
                  disabled={
                    !form.formState.isValid ||
                    isRegisterPending ||
                    isUserDetailUpdatePending ||
                    isLoadingUserDetail ||
                    isFCGetAddressPending
                  }
                >
                  {isRegisterPending ||
                  isUserDetailUpdatePending ||
                  isLoadingUserDetail ||
                  isFCGetAddressPending ? (
                    <LoadingIndicator size="sm" />
                  ) : (
                    "アカウント作成"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Verify Popup */}
      <PopupBox
        isOpen={isPopupOpen}
        onConfirm={confirm}
        onClose={() => setIsPopupOpen(false)}
        confirmButtonText="OK"
        isLoading={isVerifyPending || isLoginPending}
      >
        {/* Start Here Children Component*/}

        <p className="mb-4 font-medium">
          <Link
            href={`mailto:${form.getValues().email}`}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {form.getValues().email}
          </Link>{" "}
          に確認メールを送信しました。
          メールに送付された６桁のコードを入力してください。
        </p>
        <Input
          type="number"
          placeholder="認証コード"
          className="flex-1 bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </PopupBox>

      {/* Error Alert */}
      <AlertBox
        isOpen={!!errors?.message}
        type={errors?.type}
        message={errors?.message || ""}
        onClose={() => setErrors(undefined)}
      />

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={() => {}}>
        <DialogContent className="bg-white border-none shadow-lg [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle className="text-red-500">確認</DialogTitle>
            <DialogDescription className="bg-red-300/20 border border-red-500 p-3 rounded-md text-red-500">
              紹介リンクを使用するには、現在のアカウントをログアウトする必要があります。
              ログアウトしてもよろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleLogoutCancel}
              className="bg-white border-red-500 text-red-500 cursor-pointer hover:opacity-30"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              variant={"destructive"}
              className="bg-red-500 text-white cursor-pointer hover:opacity-30"
            >
              ログアウト
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AccountCreatePage;
