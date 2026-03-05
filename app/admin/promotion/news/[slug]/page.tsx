"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import TiptapEditor from "@/components/app/TipTapEditor";
import { Form } from "@/components/ui/form";
import {
  useNewsById,
  useUpdateNews,
  useDeleteNews,
} from "@/hooks/admin/useNews";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { decryptString, formatDateForInput } from "@/utils";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";
import AdminDatePicker from "@/components/admin/AdminDatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema validation
const FormSchema = z.object({
  title: z.string().min(1, "ニュース名は必須です"),
  content: z.string().refine(
    (value) => {
      const cleaned = value
        .replace(/<[^>]*>/g, "") // remove tags
        .replace(/&nbsp;/g, "") // remove HTML spaces
        .trim();

      return cleaned.length > 0;
    },
    {
      message: "内容は必須です",
    },
  ),
  date: z.string().min(1, "日付は必須です"),
  targetId: z.string().min(1, "対象者は必須です"),
  expireLength: z.string().optional(),
  expireType: z.string().optional(),
});

const targetOptions = [
  { value: 0, label: "すべて" },
  { value: 1, label: "一般" },
  { value: 2, label: "代理店" },
];

const NewsUpdatePage = () => {
  const params = useParams(); // Get the slug from the URL
  const router = useRouter(); // Get the router

  const [newsId, setNewsId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal state

  // Get the news by id
  const { data: news } = useNewsById(newsId || 0);

  // Update news
  const { mutate: updateNews, isPending: isUpdatingNews } = useUpdateNews();

  // Delete news
  const { mutate: deleteNews } = useDeleteNews();

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      date: "",
      targetId: "",
      expireLength: "",
      expireType: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Form submit handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updateNews(
      {
        title: data.title,
        targetId: Number(data.targetId),
        content: data.content,
        news_id: newsId || 0,
        newsDate: data.date,
        expireLength: data.expireLength ? Number(data.expireLength) : undefined,
        expireType: data.expireType ? Number(data.expireType) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("ニュースを更新しました");
          router.back();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  // Delete news handler
  const handleDeleteNews = () => {
    deleteNews(newsId || 0, {
      onSuccess: () => {
        toast.success("ニュースを削除しました");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // Set news id
  useEffect(() => {
    if (params?.slug) {
      const decryptedId = decryptString(params?.slug as string);
      setNewsId(Number(decryptedId));
    }
  }, [params]);

  // Set form values
  useEffect(() => {
    if (news) {
      // form.reset({
      //   title: news.title,
      //   content: news.content,
      //   targetId: (news.target ?? 0).toString(),
      //   date: formatDateForInput(news.newsDate),
      //   expireLength: news.expireLength?.toString() || "",
      //   expireType: news.expireType?.toString() || "",
      // });

      const formattedDate = news.newsDate
        ? formatDateForInput(news.newsDate)
        : undefined;

      form.setValue("title", news.title);
      form.setValue("content", news.content);
      form.setValue("targetId", (news.target ?? 0).toString());
      form.setValue("date", formattedDate ?? "");
      form.setValue("expireLength", news.expireLength?.toString() || "");
      form.setValue("expireType", news.expireType?.toString() || "");
    }
  }, [news, form]);
  // Update news success handler
  // useEffect(() => {
  //   if (updateNewsSuccess) {
  //     toast.success("ニュースを更新しました");
  //     router.back();
  //   }

  //   if (updateNewsError) {
  //     toast.error(updateNewsError.message);
  //   }
  // }, [updateNewsSuccess, updateNewsError, router]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border"
      >
        {/* Header */}
        <div className="flex justify-between mb-5">
          <div className="flex gap-2 text-left items-center">
            <ArrowLeft size={20} onClick={() => router.back()} />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="bg-primary hover:bg-primary/60 text-white cursor-pointer"
            >
              更新
            </Button>
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              削除
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <FormInputComponent
            control={form.control}
            name="title"
            label="ニュース名"
            placeholder="ニュース名"
            className="placeholder:text-sm bg-white border border-black/10 rounded-md p-2 text-xs"
          />
          <div className="flex flex-col">
            <p className="text-sm mb-1.5">ニュース日付</p>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <AdminDatePicker
                  value={field.value || ""}
                  onChange={field.onChange}
                  styleName="w-full border border-white-bg rounded-md p-2"
                />
              )}
            />
            {form.formState.errors.date && (
              <p className="text-xs text-[#FF0000] mt-3">
                {form.formState.errors.date?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-sm mb-1.5">対象者</p>
            <Controller
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full border border-white-bg rounded-md p-2">
                    <SelectValue placeholder="対象者を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {targetOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.targetId && (
              <p className="text-xs text-[#FF0000] mt-3">
                {form.formState.errors.targetId?.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <FormInputComponent
              control={form.control}
              name="expireLength"
              label="有効期限"
              placeholder="期間を入力"
              className="placeholder:text-sm bg-white border border-black/10 rounded-md p-2 text-xs"
              inputMode="numeric"
            />

            <div className="flex flex-col">
              <p className="text-sm mb-1.5">単位</p>
              <Controller
                control={form.control}
                name="expireType"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full border border-white-bg rounded-md p-2">
                      <SelectValue placeholder="単位を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1">分</SelectItem>
                      <SelectItem value="2">時間</SelectItem>
                      <SelectItem value="3">日</SelectItem>
                      <SelectItem value="4">ヶ月</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.expireType && (
                <p className="text-xs text-[#FF0000] mt-3">
                  {form.formState.errors.expireType?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm mb-1.5">ニュース内容</p>
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <TiptapEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {form.formState.errors.content && (
              <p className="text-xs text-[#FF0000] mt-3">
                {form.formState.errors.content?.message}
              </p>
            )}
          </div>
        </div>
      </form>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white border border-black/10 rounded-md">
          <DialogHeader>
            <DialogTitle>ニュースを削除しますか？</DialogTitle>
            <DialogDescription>
              一度削除したニュースは復元できません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-[100px] cursor-pointer">
                キャンセル
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteNews}
              className="w-[100px] text-white cursor-pointer"
            >
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ServerActionLoadingComponent
        loading={isUpdatingNews}
        message="ニュースを更新しています"
      />
    </Form>
  );
};

export default NewsUpdatePage;
