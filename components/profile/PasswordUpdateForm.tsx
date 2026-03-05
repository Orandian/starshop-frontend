"use client";

import FormInputComponent from "@/components/app/public/FormInputComponent";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useUpdatePasswordForgotMail, useUserUpdatePassword } from "@/hooks/user/useProfile";
import { ApiError } from "@/lib/api/api.gateway";
import { MESSAGES } from "@/types/messages";
type PasswordUpdateFormProps = {
  isSuccess?: ( isSuccess : boolean , message?: string) => void;
  isVerifyEmail?: boolean;
  forgotemail?: string;
  token?: string;
};


const FormSchema = z
  .object({
    password: z
      .string()
      .min(2, "新しいパスワードは2文字以上で入力してください"),
    confirmPassword: z
      .string()
      .min(2, "新しいパスワード(確認)は2文字以上で入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "新しいパスワードと新しいパスワード(確認)が一致しません",
    path: ["confirmPassword"],
  });

const PasswordUpdateForm = ({ isSuccess , forgotemail = "",isVerifyEmail = false , token = ""}: PasswordUpdateFormProps) => {
  const { mutate: updatePassword, isPending: isUpdatingPassword } =
    useUserUpdatePassword();
//For forgot password update
  const { mutate: updatePasswordForgotMail } =
    useUpdatePasswordForgotMail();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updatePassword({password : data.password} , {
      onSuccess: () => {
        toast.success("パスワードを更新しました");
        form.reset();
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.data.message);
          return;
        }
        toast.error(MESSAGES.AUTH.RESET_PASSWORD_FAILED);
      },
    });
  };

  const onVerifySubmit = (data: z.infer<typeof FormSchema>) => {
    updatePasswordForgotMail(
      { email: forgotemail, password: data.password, token: token },
      {
        onSuccess: (data) => {
          form.reset();
          isSuccess?.(true, data.message);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.data.message);
            return;
          }
          toast.error(MESSAGES.AUTH.RESET_PASSWORD_FAILED);
        },
      }
    );
  };

  return (
    <div className="space-y-6 py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(isVerifyEmail ? onVerifySubmit : onSubmit)}
          className="space-y-8 md:w-[400px] w-full"
        >
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={""}
            hidden
            readOnly
          />
          <FormInputComponent
            id="password"
            control={form.control}
            name="password"
            type="password"
            label="新しいパスワード"
            className="h-11 placeholder:text-sm bg-white/50"
            autoComplete="new-password"
          />
          <FormInputComponent
            id="confirmPassword"
            control={form.control}
            name="confirmPassword"
            label="新しいパスワード(確認)"
            type="password"
            className="h-11 placeholder:text-sm bg-white/50"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
          >
            {isUpdatingPassword ? "更新中..." : "更新"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordUpdateForm;
