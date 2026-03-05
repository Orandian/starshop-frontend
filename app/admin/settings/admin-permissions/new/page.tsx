"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateUser } from "@/hooks/admin/useSetting";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";

const NewAdminPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    if (!username.trim()) {
      toast.error("ユーザー名を入力してください");
      return;
    }

    if (!email.trim()) {
      toast.error("メールアドレスを入力してください");
      return;
    }

    if (!password.trim()) {
      toast.error("パスワードを入力してください");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("パスワードが一致しません");
      return;
    }

    // TODO: Replace with actual API call
    const userPayload = {
      username,
      email,
      password,
      phoneNumber,
    };

    createUser(userPayload, {
      onSuccess: () => {
        toast.success("管理者を作成しました");
        router.push("/admin/settings/admin-permissions");
      },
    });
  };

  return (
    <section>
      <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="hover:bg-black/2 cursor-pointer p-2 rounded-[7px] hover:text-black/80"
              onClick={() => router.push("/admin/settings/admin-permissions")}
            >
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2>管理者作成</h2>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                ユーザー名 <span className="text-red-500">*</span>
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
                className="border border-black/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                className="border border-black/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">電話番号</label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="電話番号を入力"
                className="border border-black/10"
              />
            </div>
          </div>

          <div className="border-t border-black/10 pt-6">
            <h3 className="text-sm font-medium mb-4">パスワード設定</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力"
                    className="border border-black/10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3"
                  >
                    {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  パスワード確認 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="パスワードを再入力"
                    className="border border-black/10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full px-3"
                  >
                    {!showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center pt-4">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/80 text-white"
              disabled={isPending}
            >
              {isPending ? <LoadingIndicator size="sm" /> : "作成"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewAdminPage;
