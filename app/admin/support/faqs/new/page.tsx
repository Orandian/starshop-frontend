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
import { toast } from "sonner";
import { useCreateFaq } from "@/hooks/admin/useFaqs";
import ServerActionLoadingComponent from "@/components/app/ServerActionLoadingComponent";

// Form schema validation
const FormSchema = z.object({
  question: z.string().min(1, "質問は必須です"),
  answer: z.string().refine(
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
});

const FaqPage = () => {
  const router = useRouter(); // Get the router

  // Create faq mutation
  const { mutate: createFaq, isPending: isCreatingFaq } = useCreateFaq();

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Form submit handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createFaq(data, {
      onSuccess: () => {
        toast.success("FAQを登録しました");
        router.push("/admin/support/faqs");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // Create faq success handler
  // useEffect(() => {
  //   if (createFaqSuccess) {
  //     toast.success("FAQを登録しました");
  //     router.push("/admin/settings/faqs");
  //   }

  //   if (createFaqError) {
  //     toast.error(createFaqError.message);
  //   }
  // }, [createFaqSuccess, createFaqError, router]);

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
              disabled={!form.formState.isValid || isCreatingFaq}
              className="bg-primary hover:bg-primary/60 text-white cursor-pointer"
            >
              登録
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <FormInputComponent
            control={form.control}
            name="question"
            label="質問"
            placeholder="質問"
            className="placeholder:text-sm bg-white border border-black/10 rounded-md p-2 text-xs"
          />
          <div className="flex flex-col">
            <p className="text-sm mb-1.5">回答</p>
            <Controller
              control={form.control}
              name="answer"
              render={({ field }) => (
                <TiptapEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            {form.formState.errors.answer && (
              <p className="text-xs text-[#FF0000] mt-3">
                {form.formState.errors.answer?.message}
              </p>
            )}
          </div>
        </div>
      </form>

      <ServerActionLoadingComponent
        loading={isCreatingFaq}
        message="FAQを登録しています"
      />
    </Form>
  );
};

export default FaqPage;
