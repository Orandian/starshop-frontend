import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUserBankUpdate } from "@/hooks/fc";
import { accountInfoFormSchema, AccountInfoFormValues } from "@/lib/schema";
import { UserBankUpdate, UserDetail } from "@/types/fc/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LoadingIndicator from "../ui/LoadingIndicator";
import PopupBox from "../ui/PopupBox";
import { InformationSection } from "./InformationSection";
import { toast } from "sonner";

export const AccountInfoSection = ({
  userDetail,
}: {
  userDetail: UserDetail;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: userBankUpdate, isPending: isUserBankUpdatePending } =
    useUserBankUpdate();

  const form = useForm<AccountInfoFormValues>({
    resolver: zodResolver(accountInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      bankName: userDetail?.bankName || "",
      branchNumber: userDetail?.branchNumber || "",
      branchName: userDetail?.branchName || "",
      bankAccountNumber: userDetail?.bankAccountNumber || "",
      bankAccountName: userDetail?.bankAccountName || "",
    },
  });

  const handleEdit = () => setIsEditing(true);

  const onSubmit = (values: AccountInfoFormValues) => {
    const updateData: UserBankUpdate = {
      bankName: values.bankName,
      branchNumber: values.branchNumber,
      branchName: values.branchName,
      bankAccountNumber: values.bankAccountNumber,
      bankAccountName: values.bankAccountName,
    };

    userBankUpdate(updateData, {
      onSuccess: () => {
        toast.success("口座情報が正常に更新されました");
        queryClient.invalidateQueries({
          queryKey: ["user-detail"],
        });
        setIsEditing(false);
      },
      onError: () => {
        toast.error("口座情報の更新に失敗しました");
      },
    });
  };

  const handleCancel = () => {
    //reset when cancel
    form.reset();
    setIsEditing(false);
  };

  return (
    <>
      <InformationSection
        handleEdit={handleEdit}
        title="口座情報"
        items={[
          { label: "銀行名", value: userDetail?.bankName || "-" },
          { label: "支店コード", value: userDetail?.branchNumber || "-" },
          { label: "支店名", value: userDetail?.branchName || "-" },
          {
            label: "口座番号",
            value: userDetail?.bankAccountNumber || "-",
          },
          {
            label: "口座名義",
            value: userDetail?.bankAccountName || "-",
          },
        ]}
      />

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
