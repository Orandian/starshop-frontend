"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import AuthTitle from "@/components/auth/AuthTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/useAuth";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/types/messages";
import { ApiError } from "@/lib/api/api.gateway";

// Form schema validation
const FormSchema = z.object({
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  confirmPassword: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

const ChangePasswordPage = () => {
  const router = useRouter(); // Router
  const { mutate: changePasswordMutate, isPending: isChangePasswordPending } = useChangePassword(); // Change password mutation

  // Form validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    changePasswordMutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.push("/login");
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.data.message);
          return;
        }
        toast.error(MESSAGES.AUTH.LOGIN_FAILED);
      },
    });
  };

  return (
    <Suspense fallback={<div>読み込み中。。。</div>}>
      <AuthLayout>
        <div className="px-4">
          <AuthTitle title="Change Password" />

          <div className="my-8 w-full">
            <p className="text-sm">
              パスワードを変更するために、新しいパスワードを入力してください！
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-[400px]"
            >
              <FormInputComponent
                control={form.control}
                name="password"
                label="パスワード"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="confirmPassword"
                label="パスワード(確認)"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isChangePasswordPending}
              >
                {isChangePasswordPending ? "送信中..." : "OK"}
              </Button>
            </form>
          </Form>
        </div>
      </AuthLayout>
    </Suspense>
  );
};

export default ChangePasswordPage;
