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
import { Separator } from "@/components/ui/separator";
import { Suspense, useState } from "react";
import { useEmailForgotVerify } from "@/hooks/useAuth";
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
import PasswordUpdateForm from "@/components/profile/PasswordUpdateForm";
import { ApiError } from "@/lib/api/api.gateway";

const FormSchema = z.object({
    code: z.string().min(1, "認証コードを入力してください").min(6, "コードは６文字で入力してください。"),
});

export default function VerifyPage() {
    const router = useRouter(); // Router
    const { forgotPasswordInfo } = useUserStore.getState();
    const { mutate: verifyMutate, isPending: isVerifying } = useEmailForgotVerify(); // Use signup hook

    const [isSignupSuccess, setIsSignupSuccess] = useState(false);
    const [isChangePasswordSuccess, setIsChangePasswordSuccess] = useState(false);
    const [token, setToken] = useState("");

    /**
     * フォーム
     */
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            code: "",
        },
    });

    /**
     * サインアップ
     */
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        verifyMutate(
            {
                email: forgotPasswordInfo?.email || '',
                code: data.code
            },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    setToken(res.data.token);
                    setIsChangePasswordSuccess(true);
                },
                onError: (err) => {
                    if (err instanceof ApiError) {
                        toast.error(err?.data?.message);
                        return;
                    }
                    toast.error(MESSAGES.AUTH.RESET_PASSWORD_FAILED);
                },
            }
        );
    };

    const handleToLogin = () => {
        router.push("/login");
    };

    return (
        <Suspense fallback={<div>読み込み中。。。</div>}>
            <AuthLayout>
                <div className="px-4">
                    {!isChangePasswordSuccess ? (
                        <>
                            <AuthTitle title="Verify" />

                            <div className="my-5 md:my-8 w-full">
                                <p className="text-sm"></p>
                            </div>

                            {/* Divider */}
                            <div className="w-full lg:w-[400px] mb-6">
                                <Separator />
                            </div>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4 w-full lg:w-[400px]"
                                >
                                    <FormInputComponent
                                        control={form.control}
                                        name="code"
                                        label="認証コード"
                                        placeholder="6桁のコードを入力してください"
                                        className="h-11 placeholder:text-sm"
                                    />

                                    <Button
                                        type="submit"
                                        className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                                        disabled={isVerifying}
                                    >
                                        {isVerifying ? "認証中..." : "認証"}
                                    </Button>
                                </form>
                            </Form>
                        </>
                    ) : (
                        <PasswordUpdateForm
                            isSuccess={(isSuccess, message) => {
                                if (isSuccess) {
                                    toast.success(
                                        message || "パスワードが正常に変更されました。"
                                    );
                                    setIsSignupSuccess(true);
                                } else {
                                    toast.error(
                                        message || "パスワードの変更に失敗しました。"
                                    );
                                }
                            }}
                            forgotemail={forgotPasswordInfo?.email || ""}
                            isVerifyEmail={true}
                            token={token}
                        />
                    )}

                    {/* Success Dialog (always mounted) */}
                    <Dialog open={isSignupSuccess} onOpenChange={setIsSignupSuccess}>
                        <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
                            <DialogHeader>
                                <DialogTitle>パスワード更新認証</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                パスワードの変更に失敗しました。ログインページにリダイレクトします。
                            </DialogDescription>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        onClick={handleToLogin}
                                        className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
                                    >
                                        ログインへ
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </AuthLayout>
        </Suspense>
    );

}
