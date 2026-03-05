"use client";

import { z } from "zod";
import ComponentLayout from "@/components/layouts/ComponentLayout";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const FormSchema = z.object({
  username: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("メールアドレスは正しく入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

const InputPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast("Submitted values:", {
      description: JSON.stringify(data),
    });
  };
  return (
    <ComponentLayout
      componentTitle="Form Input"
      componentPath="@/components/app/public/FormInputComponent.tsx"
      params={FormInputComponent.Params}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-2/3"
        >
          <FormInputComponent
            control={form.control}
            name="username"
            label="名前"
            placeholder="名前を入力してください"
            description="This is your public display name."
          />
          <FormInputComponent
            control={form.control}
            name="email"
            label="メールアドレス"
            type="email"
            placeholder="メールアドレスを入力してください"
          />
          <FormInputComponent
            control={form.control}
            name="password"
            label="パスワード"
            type="password"
            placeholder="パスワードを入力してください"
          />
          <Button
            type="submit"
            className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
          >
            送信
          </Button>
        </form>
      </Form>
    </ComponentLayout>
  );
};

export default InputPage;
