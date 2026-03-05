import { z } from "zod";

export const userNameSectionSchema = z.object({
  tantoName: z.string().min(1, "担当者名を入力してください"),
  phoneNumber: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(
      /^0\d{1,4}-\d{1,4}-\d{4}$/,
      "有効な日本の電話番号を入力してください (例: 070-1234-1234)"
    ),
});
export type UserNameSectionFormValues = z.infer<typeof userNameSectionSchema>;