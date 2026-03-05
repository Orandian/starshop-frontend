"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import TiptapEditor from "@/components/app/TipTapEditor";
import { Form } from "@/components/ui/form";
import { useCreateNews } from "@/hooks/admin/useNews";
import { toast } from "sonner";
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
    }
  ),
  newsDate: z.string().min(1, "日付は必須です"),
  targetId: z.string().min(1, "対象者は必須です"),
  expireLength: z.string().min(1, "期間は必須です"),
  expireType: z.string().min(1, "単位は必須です"),
});

const NewsPage = () => {
  const router = useRouter(); // Get the router

  // Create news mutation
  const { mutate: createNews, isPending: isCreatingNews } = useCreateNews();

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      newsDate: "",
      targetId: "",
      expireLength: "",
      expireType: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Form submit handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const payload = {
      ...data,
      targetId: Number(data.targetId),
      expireLength: data.expireLength ? Number(data.expireLength) : undefined,
      expireType: data.expireType ? Number(data.expireType) : undefined,
    };
    createNews(payload, {
      onSuccess: () => {
        toast.success("ニュースを登録しました");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || "ニュース情報の登録に失敗しました");
      },
    });
  };

  const targetOptions = [
    { value: 0, label: "すべて" },
    { value: 1, label: "一般" },
    { value: 2, label: "代理店" },
  ];

  // Create news success handler
  // useEffect(() => {
  //   if (createNewsSuccess) {
  //     toast.success("ニュースを登録しました");
  //     router.back();
  //   }

  //   if (createNewsError) {
  //     toast.error(createNewsError.message);
  //   }
  // }, [createNewsSuccess, createNewsError, router]);

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
              className="bg-primary hover:bg-primary/60 text-white cursor-pointer"
              disabled={isCreatingNews || !form.formState.isValid}
            >
              登録
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
              name="newsDate"
              render={({ field }) => (
                <AdminDatePicker
                  value={field.value || ""}
                  onChange={field.onChange}
                  styleName="w-full border border-white-bg rounded-md p-2"
                />
              )}
            />
            {form.formState.errors.newsDate && (
              <p className="text-xs text-[#FF0000] mt-3">
                {form.formState.errors.newsDate?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-sm mb-1.5">対象者</p>
            <Controller
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
                <Select value={field.value?.toString()} onValueChange={field.onChange}>
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

      <ServerActionLoadingComponent
        loading={isCreatingNews}
        message="ニュースを登録しています"
      />
    </Form>
  );
};

export default NewsPage;
