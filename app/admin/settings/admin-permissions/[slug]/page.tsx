"use client";

import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetUserDetails, useUpdateUser } from "@/hooks/admin/useSetting";
import { AdminUpdateUserRequest } from "@/types/admin/setting.type";
import { decryptString } from "@/utils";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

const AdminDetailPage = (props: { params: Promise<{ slug: string }> }) => {
  const params = use(props.params);
  const { slug } = params;
  const router = useRouter();
  const id = parseInt(decryptString(slug));
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: userDetais } = useGetUserDetails(id);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  useEffect(() => {
    if (userDetais) {
      setUsername(userDetais.data?.username || "");
      setEmail(userDetais.data?.email || "");
      setPhoneNumber(userDetais.data?.phoneNumber || "");
      setIsLoading(false);
    }
  }, [userDetais]);

  const handleSave = () => {
    if (!username.trim()) {
      toast.error("ユーザー名を入力してください");
      return;
    }

    if (!email.trim()) {
      toast.error("メールアドレスを入力してください");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("パスワードが一致しません");
      return;
    }

    // TODO: Replace with actual API call

    const updateData: AdminUpdateUserRequest = {
      username,
      usernameKana: userDetais?.data?.usernameKana,
      email,
      password,
      phoneNumber,
      status: userDetais?.data?.status,
    };
    updateUser(
      { id: Number(userDetais?.data?.userId), data: updateData },
      {
        onSuccess: () => toast.success("管理者情報を更新しました"),
      },
    );
  };

  const handleDelete = () => {
    // TODO: Replace with actual API call

    updateUser(
      { id: Number(userDetais?.data?.userId), data: { status: 0 } },
      {
        onSuccess: () => {
          toast.success("管理者を削除しました");
          router.push("/admin/settings/admin-permissions");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <section>
        <div className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
          <p>読み込み中...</p>
        </div>
      </section>
    );
  }

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
              <h2>管理者編集</h2>
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
            <h3 className="text-sm font-medium mb-4">パスワード変更</h3>
            <p className="text-xs text-gray-500 mb-4">
              ※ パスワードを変更する場合のみ入力してください
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">新しいパスワード</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="新しいパスワードを入力"
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
                <label className="text-sm font-medium">パスワード確認</label>
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

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
              disabled={isUpdating}
            >
              削除
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/80 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? <LoadingIndicator size="sm" /> : "保存"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>管理者を削除</DialogTitle>
            <DialogDescription>
              この管理者を削除してもよろしいですか？
              <br />
              この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isUpdating}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? <LoadingIndicator size="sm" /> : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminDetailPage;
