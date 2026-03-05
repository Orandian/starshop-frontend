"use client";

import TiptapEditor from "@/components/app/TipTapEditor";
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
import { useGetMailDetails, useUpdateMail } from "@/hooks/admin/useSetting";
import { AdminMailUpdateRequest } from "@/types/admin/setting.type";
import { decryptString } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

const EmailDetailPage = (props: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const params = use(props.params);
  const { slug } = params;
  const id = decryptString(slug);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: mailDetail, isLoading } = useGetMailDetails(id);
  const { mutateAsync: updateMail, isPending } = useUpdateMail();
  useEffect(() => {
    if (mailDetail) {
      setTitle(mailDetail?.data?.templateName || "");
      setContent(mailDetail.data?.templateDescription || "");
    }
  }, [mailDetail]);

  const handleSave = () => {
    if (!mailDetail?.data?.templateId) {
      toast.error("メールテンプレートが見つかりません");
      return;
    }

    const updateMailPayload: AdminMailUpdateRequest = {
      templateName: title,
      templateDescription: content,
    };
    updateMail(
      {
        id: mailDetail?.data?.templateId.toLocaleString(),
        data: updateMailPayload,
      },
      {
        onSuccess: () => {
          toast.success("メールテンプレートを更新しました");
          router.push("/admin/settings/email");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!mailDetail?.data?.templateId) {
      toast.error("メールテンプレートが見つかりません");
      return;
    }

    updateMail(
      {
        id: mailDetail?.data?.templateId.toLocaleString(),
        data: {
          isActive: false,
        },
      },
      {
        onSuccess: () => {
          toast.success("メールテンプレートを削除しました");
          router.push("/admin/settings/email");
        },
      }
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
              onClick={() => router.push("/admin/settings/email")}
            >
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2>メールテンプレート編集</h2>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">タイトル</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="テンプレート名を入力"
              className="border border-black/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">本文</label>
            <div className="border border-black/10 rounded-md">
              <TiptapEditor value={content} onChange={setContent} />
            </div>
            <p className="text-xs text-gray-500">
              ※ 使用可能な変数: {"{order_id}"}, {"{tracking_number}"},{" "}
              {"{customer_name}"}, {"{product_name}"}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
              disabled={isPending}
            >
              削除
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/80 text-white"
              disabled={isPending}
            >
              {isPending ? <LoadingIndicator size="sm" /> : "保存"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>メールテンプレートを削除</DialogTitle>
            <DialogDescription>
              このメールテンプレートを削除してもよろしいですか？
              <br />
              この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isPending}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isPending}
            >
              {isPending ? <LoadingIndicator size="sm" /> : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EmailDetailPage;
