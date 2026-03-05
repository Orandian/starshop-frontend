import * as z from "zod";

/**
 * Form Schema
 * @author Paing Sett Kyaw
 * @created 2025-11-12
 * @updated ****-**-**
 */
export const supplySaleFormSchema = z
  .object({
    contractPeriod: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    contractAutoRenewal: z.enum(["有", "無"]),
    guarantee: z.enum(["1", "2"]),
    guaranteeAmount: z.string().optional(),
    termsAccepted: z.boolean().optional(),
     signature: z.string().min(1, {
      message: "署名が必要です",
    }),
    contractFcPlanMasterId: z.number().optional(),
    productName: z.string(),
    selectedPlan: z.number().optional(),
    totalAmount: z.number().optional(),
    
  })
  .refine(
    (data) => {
      if (data.guarantee === "2") {
        return data.guaranteeAmount && data.guaranteeAmount.trim() !== "";
      }
      return true;
    },
    {
      message: "保証金額を入力してください", // "Please enter the guarantee amount"
      path: ["guaranteeAmount"],
    }
  );

export type SupplySaleFormValues = z.infer<typeof supplySaleFormSchema>;