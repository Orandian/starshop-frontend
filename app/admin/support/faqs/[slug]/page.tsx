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
import { useFaqsById, useUpdateFaq, useDeleteFaq } from "@/hooks/admin/useFaqs";
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
import { decryptString } from "@/utils";
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

const FaqUpdatePage = () => {
  const params = useParams(); // Get the slug from the URL
  const router = useRouter(); // Get the router

  const [faqId, setFaqId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal state

  // Get the faqs by id
  const { data: faqs } = useFaqsById(faqId || 0);

  // Update faqs
  const {
    mutate: updateFaq,
    isPending: isUpdatingFaq,
  } = useUpdateFaq();

  // Delete faqs
  const { mutate: deleteFaq } = useDeleteFaq();

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
    updateFaq(
      {
        question: data.question,
        answer: data.answer,
        faqs_id: faqId || 0,
      },
      {
        onSuccess: () => {
          toast.success("FAQを更新しました");
          router.back();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  // Delete faqs handler
  const handleDeleteFaq = () => {
    deleteFaq(faqId || 0, {
      onSuccess: () => {
        toast.success("FAQを削除しました");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // Set form values
  useEffect(() => {
    if (faqs) {
      form.setValue("question", faqs.question);
      form.setValue("answer", faqs.answer);
    }
  }, [faqs, form]);

  // Set faq id
  useEffect(() => {
    if (params?.slug) {
      const decryptId = decryptString(params?.slug as string);
      setFaqId(Number(decryptId));
    }
  }, [params]);

  // Update faqs success handler
  // useEffect(() => {
  //   if (updateFaqSuccess) {
  //     toast.success("FAQを更新しました");
  //     router.back();
  //   }

  //   if (updateFaqError) {
  //     toast.error(updateFaqError.message);
  //   }
  // }, [updateFaqSuccess, updateFaqError, router]);

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
                <TiptapEditor value={field.value || ""} onChange={field.onChange} />
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

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white border border-black/10 rounded-md">
          <DialogHeader>
            <DialogTitle>FAQを削除しますか？</DialogTitle>
            <DialogDescription>
              一度削除したFAQは復元できません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-[100px] cursor-pointer">
                キャンセル
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteFaq}
              className="w-[100px] text-white cursor-pointer"
            >
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ServerActionLoadingComponent
        loading={isUpdatingFaq}
        message="FAQを更新しています"
      />
    </Form>
  );
};

export default FaqUpdatePage;
