"use client";

// import { createClient } from "@/utils/supabase/client";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthTitle from "@/components/auth/AuthTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Form } from "@/components/ui/form";
import { Suspense, useState } from "react";
import { useSignup } from "@/hooks/useAuth";
import { MESSAGES } from "@/types/messages";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useAuthStore";
import { ApiError } from "@/lib/api/api.gateway";

const FormSchema = z
  .object({
    name: z
      .string()
      .min(1, "名前を入力してください")
      .min(2, "名前は2文字以上で入力してください")
      .max(50, "名前は50文字以下で入力してください"),
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("メールアドレスは正しく入力してください"),
    password: z
      .string()
      .min(1, "パスワードを入力してください")
      .min(6, "パスワードは6文字以上で入力してください"),
    confirmPassword: z
      .string()
      .min(1, "パスワード確認を入力してください")
      .min(6, "パスワードは6文字以上で入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードと確認用パスワードが一致しません。",
    path: ["confirmPassword"], // ← show error under confirmPassword
  });

export default function SignUpPage() {
  const router = useRouter(); // Router
  // const supabase = createClient(); // Create supabase client
  const { mutate: signupMutate, isPending: isSignupPending } = useSignup(); // Use signup hook

  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  /**
   * フォーム
   */
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * サインアップ
   */
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    signupMutate(
      { email: data.email, password: data.password, name: data.name },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          // Store signup info for verification page
          const { setSignUpInfo } = useUserStore.getState();
          setSignUpInfo({ email: data.email, password: data.password, name: data.name });
          setIsSignupSuccess(true);
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

  /**
   * Googleサインアップ
   */
  // const handleGoogleSignUp = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: {
  //       redirectTo: `${window.location.origin}/auth/callback`,
  //     },
  //   });

  //   if (error) {
  //     toast(error.message);
  //   }
  // };

  const handleToLogin = () => {
    router.push("/verify");
  };

  return (
    <Suspense fallback={<div>読み込み中。。。</div>}>
      <AuthLayout>
        <div className="px-4">
          <AuthTitle title="Sign Up" />

          <div className="my-5 md:my-8 w-full">
            <p className="text-sm">メールでアカウントを作成してください！</p>
          </div>

          {/* Google Sign Up Button */}
          {/* <div className="w-full lg:w-[400px]">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignUp}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="flex items-center justify-center py-10 w-full lg:w-[400px] -mb-6">
            <div className="flex items-center flex-1 max-w-xs">
              <div className="flex-1 h-[1px] bg-black"></div>
            </div>
            <h2 className="text-sm font-bold whitespace-nowrap px-8">
              OR
            </h2>
            <div className="flex items-center flex-1 max-w-xs">
              <div className="flex-1 h-[1px] bg-black"></div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] mb-6">
            <Separator />
          </div> */}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full lg:w-[400px]"
            >
              <FormInputComponent
                control={form.control}
                name="name"
                label="氏名"
                placeholder="名前を入力してください"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="email"
                label="メールアドレス"
                placeholder="test@example.com"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="password"
                label="パスワード"
                type="password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="confirmPassword"
                label="パスワード確認"
                type="password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isSignupPending}
              >
                {isSignupPending ? "送信中..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </div>

        <Dialog open={isSignupSuccess} onOpenChange={setIsSignupSuccess}>
          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
            <DialogHeader>
              <DialogTitle>アカウント認証</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              アカウントの認証のため、メールをご確認ください。
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleToLogin} className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer">OK</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AuthLayout>
    </Suspense>
  );
}
