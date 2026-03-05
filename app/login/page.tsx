"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import NavigationTextComponent from "@/components/app/public/NavigationTextComponent";
import AuthTitle from "@/components/auth/AuthTitle";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLogin } from "@/hooks/fc";
import { ApiError } from "@/lib/api/api.gateway";
import { setToken, setUser } from "@/lib/api/auth";
import { useUserStore } from "@/store/useAuthStore";
import { User } from "@/types/auth";
import { LoginUser } from "@/types/fc";
import { MESSAGES } from "@/types/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define form schema
const FormSchema = z.object({
    // email: z.string().email("メールアドレスは正しく入力してください"),
    // password: z.string().min(6, "パスワードは6文字以上で入力してください"),]
    email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("メールアドレスは正しく入力してください"),

  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(6, "パスワードは6文字以上で入力してください"),
});

export default function LoginPage() {
  const { mutate: loginMutate, isPending: isLoginPending } = useLogin(); // Use login hook
  const router = useRouter(); // Use router

  // Create form instance
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    loginMutate(
      { email: data.email, password: data.password },
      {
        onSuccess: async (res) => {
          toast.success(res.message);
          const { userType } = res.data.user;
          if (res?.data?.user && res?.data?.token) {
            await handleToSaveCookie(res.data.token, res.data.user);
            useUserStore.setState({
              user: res.data.user,
              token: res.data.token,
            });

            switch (userType) {
              case 1:
                router.push("/admin/dashboard");
                router.refresh();
                break;
              case 2:
                router.push("/fc/mypage");
                router.refresh();
                break;
              case 3:
                router.push("/");
                router.refresh();
                break;
              default:
                toast.error("ユーザータイプが正しくありません");
                break;
            }
          }
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
  };

  const handleToSaveCookie = async (token: string, user: User | LoginUser) => {
    await setToken(token);
    await setUser(user);
  };

  return (
    <Suspense fallback={<div>読み込み中。。。</div>}>
      <AuthLayout>
        <div className="px-4">
          <AuthTitle title="Login" />

          <div className="my-5 md:my-8 w-full">
            <p className="text-sm">
              メールアドレスとパスワードを入力してください！
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full lg:w-[400px]"
            >
              <FormInputComponent
                id="email"
                control={form.control}
                name="email"
                label="メールアドレス"
                placeholder="test@example.com"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                id="password"
                control={form.control}
                name="password"
                label="パスワード"
                type="password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />

              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isLoginPending}
              >
                {isLoginPending ? "送信中..." : "Login"}
              </Button>

              <div className="flex justify-between">
                <NavigationTextComponent
                  text="パスワード忘れた方はこちら"
                  handleNavigation={() => router.push("/reset-password")}
                />
                <NavigationTextComponent
                  text="アカウント作成"
                  handleNavigation={() => router.push("/signup")}
                />
              </div>
            </form>
          </Form>
        </div>
      </AuthLayout>
    </Suspense>
  );
}
