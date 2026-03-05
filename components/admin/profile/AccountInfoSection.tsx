import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUserBankInfoUpdate } from "@/hooks/admin/useCustomer";
import { UserBankUpdate } from "@/types/fc/user.type";
import { CustomerDetail } from "@/types/customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import PopupBox from "@/components/fc/ui/PopupBox";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";

export const formSchema = z.object({
  bankName: z.string().min(1, "銀行名を入力してください"),
  branchNumber: z
    .string()
    .min(1, "支店コードを入力してください")
    .regex(/^\d+$/, "数字のみ入力してください"),
  branchName: z.string().min(1, "支店名を入力してください"),
  bankAccountNumber: z
    .string()
    .min(1, "口座番号を入力してください")
    .max(7, "7桁まで入力してくだい“")
    .regex(/^\d+$/, "数字のみ入力してください"),
  bankAccountName: z.string().min(1, "口座名義を入力してください"),
});

type FormValues = z.infer<typeof formSchema>;

export const AccountInfoSection = ({
  userDetail,
  isUserLoading,
}: {
  userDetail: CustomerDetail;
  isUserLoading?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: userBankUpdate, isPending: isUserBankUpdatePending } =
    useUserBankInfoUpdate(userDetail?.user_id ?? "");

  const accountInfo = [
    {
      label: "銀行名",
      value: userDetail?.bank_info?.bankName,
    },
    {
      label: "支店コード",
      value: userDetail?.bank_info?.branchNumber,
    },
    {
      label: "支店名",
      value: userDetail?.bank_info?.branchName,
    },
    {
      label: "口座番号",
      value: userDetail?.bank_info?.bankAccountNumber,
    },
    {
      label: "口座名義",
      value: userDetail?.bank_info?.bankAccountName,
    },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      bankName: accountInfo[0]?.value || "",
      branchNumber: accountInfo[1]?.value || "",
      branchName: accountInfo[2]?.value || "",
      bankAccountNumber: accountInfo[3]?.value || "",
      bankAccountName: accountInfo[4]?.value || "",
    },
  });

  const handleEdit = () => {
    form.reset({
      bankName: accountInfo[0]?.value || "",
      branchNumber: accountInfo[1]?.value || "",
      branchName: accountInfo[2]?.value || "",
      bankAccountNumber: accountInfo[3]?.value || "",
      bankAccountName: accountInfo[4]?.value || "",
    });
    setIsEditing(true);
  };

  const onSubmit = (values: FormValues) => {
    const updateData: UserBankUpdate = {
      bankName: values.bankName,
      branchNumber: values.branchNumber,
      branchName: values.branchName,
      bankAccountNumber: values.bankAccountNumber,
      bankAccountName: values.bankAccountName,
    };

    userBankUpdate(updateData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["customer"],
        });
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <h3 className="py-4 text-primary mr-2">口座情報</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={handleEdit}
          className="h-7 w-7 rounded-full p-0 cursor-pointer"
        >
          <Pencil className="w-5 h-5" fill="black" stroke="white" />
        </Button>
      </div>
      {isUserLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 py-1">
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
            </div>
          ))
        : accountInfo.map((info, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 py-1">
              <p className="font-bold text-sm">{info.label}:</p>
              <p className="text-sm">
                <span
                  className={`px-3 inline-flex leading-5 font-normal rounded-full py-1`}
                >
                  {info.value || "-"}
                </span>
              </p>
            </div>
          ))}

      <PopupBox
        isOpen={isEditing}
        onClose={handleCancel}
        showConfirmButton={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Bank Name */}
            <FormInputComponent
              id="bankName"
              control={form.control}
              name="bankName"
              label="銀行名"
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* Branch Number */}
            <FormInputComponent
              id="branchNumber"
              control={form.control}
              name="branchNumber"
              label="支店コード"
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* Branch Name */}
            <FormInputComponent
              id="branchName"
              control={form.control}
              name="branchName"
              label="支店名"
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* Bank Account Number */}
            <FormInputComponent
              id="bankAccountNumber"
              control={form.control}
              name="bankAccountNumber"
              label="口座番号"
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />
            {/* Bank Account Name */}
            <FormInputComponent
              id="bankAccountName"
              control={form.control}
              name="bankAccountName"
              label="口座名義"
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            <Button
              type="submit"
              variant="default"
              className={`w-full font-bold hover:bg-primary/90 text-white`}
              disabled={!form.formState.isValid || isUserBankUpdatePending}
            >
              {isUserBankUpdatePending ? (
                <LoadingIndicator size="sm" />
              ) : (
                "更新"
              )}
            </Button>
          </form>
        </Form>
      </PopupBox>
    </>
  );
};
