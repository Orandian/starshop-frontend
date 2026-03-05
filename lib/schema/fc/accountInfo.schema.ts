import z from "zod";

export const accountInfoFormSchema = z.object({
  bankName: z.string().min(1, "銀行名を入力してください"),
  branchNumber: z
    .string()
    .min(1, "支店コードを入力してください")
    .regex(/^\d+$/, "数字のみ入力してください"),
  branchName: z.string().min(1, "支店名を入力してください"),
  bankAccountNumber: z
    .string()
    .min(1, "口座番号を入力してください")
    .max(7,"7桁まで入力してくだい")
    .regex(/^\d+$/, "数字のみ入力してください"),
  bankAccountName: z.string().min(1, "口座名義を入力してください"),
});

export type AccountInfoFormValues = z.infer<typeof accountInfoFormSchema>;
