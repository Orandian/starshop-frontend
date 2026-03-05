"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/app/TipTapEditor";
import { toast } from "sonner";
import { useCreateMail } from "@/hooks/admin/useSetting";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";

const NewEmailTemplatePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const {mutateAsync:createMail,isPending} = useCreateMail()

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }

    if (!content.trim()) {
      toast.error("本文を入力してください");
      return;
    }

    // TODO: Replace with actual API call
   
    const mailPayload = {
      templateName:title,
      templateDescription:content,
      isActive:true,
    }
createMail(mailPayload,{
  onSuccess:() => {
 toast.success("メールテンプレートを作成しました");
    router.push("/admin/settings/email");

  }
})

  };

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
              <h2>メールテンプレート作成</h2>
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
              ※ 使用可能な変数: {"{order_id}"}, {"{tracking_number}"}, {"{customer_name}"}, {"{product_name}"}
            </p>
          </div>

          <div className="flex justify-end items-center pt-4">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/80 text-white"
              disabled={isPending}
            >
              {isPending ? <LoadingIndicator size="sm" /> : '作成'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewEmailTemplatePage;
