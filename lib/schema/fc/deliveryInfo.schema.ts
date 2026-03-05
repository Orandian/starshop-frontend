import { z } from "zod";

export const deliveryInfoFormSchema = z.object({
  name: z.string().min(1, "銀行名を入力してください"),
  phoneNumber: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(
      /^0\d{1,4}-\d{1,4}-\d{4}$/,
      "有効な日本の電話番号を入力してください (例: 070-1234-1234)"
    ), //070-1234-1234
  postalCode: z
    .string()
    .min(7, "郵便番号は7文字で入力してください")
    .max(7, "郵便番号は7文字で入力してください"),
  prefecture: z.string().min(1, "都道府県を入力してください"), // city_ward_town + address + prefecture
  address2: z.string().min(1, "住所を入力してください"), //user type address
});

export type DeliveryInfoFormValues = z.infer<typeof deliveryInfoFormSchema>;