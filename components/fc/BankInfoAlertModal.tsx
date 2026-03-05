import { useUserBankUpdate } from "@/hooks/fc";
import { AccountInfoFormValues, accountInfoFormSchema } from "@/lib/schema";
import { UserBankUpdate, UserDetail } from "@/types/fc/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import FormInputComponent from "../app/public/FormInputComponent";
import { Button } from "../ui/button";
import LoadingIndicator from "./ui/LoadingIndicator";

interface BankInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userBankInfo?: UserDetail
}

const BankInfoModal: React.FC<BankInfoModalProps> = ({
  isOpen,
  onSuccess,
  userBankInfo = {},
}) => {

  const queryClient = useQueryClient();

  const { mutate: userBankUpdate, isPending: isUserBankUpdatePending } =
    useUserBankUpdate();
  const form = useForm<AccountInfoFormValues>({
    resolver: zodResolver(accountInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      bankName: userBankInfo?.bankName || "",
      branchNumber: userBankInfo?.branchNumber || "",
      branchName: userBankInfo?.branchName || "",
      bankAccountNumber: userBankInfo?.bankAccountNumber || "",
      bankAccountName: userBankInfo?.bankAccountName || "",
    },
  });

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
        queryClient.invalidateQueries({
          queryKey: ["user-detail"],
        });
        onSuccess();
      },
    });
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50  ">
      <div className="fixed inset-0 bg-dark/60 bg-opacity-50" />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              銀行情報の登録
            </h2>
          </div>
          {/* Note: No close button as per requirements */}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              銀行情報を登録してください。この情報は報酬の支払いに必要です。
              登録が完了するまでこの画面は閉じることができません。
            </p>
          </div>

          <FormProvider {...form}>
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
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default BankInfoModal;
