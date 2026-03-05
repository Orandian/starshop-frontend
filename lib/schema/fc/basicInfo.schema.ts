import { z } from "zod";

// Custom validation for furigana (hiragana and katakana only)
const furiganaRegex = /^[\u3040-\u309F\u30A0-\u30FF\s]*$/; // Hiragana, Katakana, and spaces

export const basicInfoFormSchema = z.object({
  username: z.string().min(1, "会社名を入力してください"),
  usernameKana: z
    .string()
    .min(1, "会社名（カナ）は必須です")
    .max(50, "会社名（カナ）は50文字以内で入力してください")
    .regex(furiganaRegex, "フリガナを入力してください（ひらがな、カタカナのみ）"),
  tantoPosition: z.string().min(1, "役職名を入力してください"),
  representativeName: z.string().min(1, "代表者名を入力してください"),
  //postalCode: z.string().min(1, "郵便番号を入力してください"),
  //prefecture: z.string().min(1, "都道府県を入力してください"),
  //address1: z.string().min(1, "住所を入力してください"),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoFormSchema>;
