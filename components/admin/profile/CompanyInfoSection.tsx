import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUserCompanyInfoUpdate } from "@/hooks/admin/useCustomer";
import { CompanyInfoUpdate, CustomerDetail } from "@/types/customers";
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
  //   username: z.string().min(1, "会社名を入力してください"),
  //   usernameKana: z.string().min(1, "フリガナを入力してください"),
  tantoPosition: z.string().min(1, "役職名を入力してください"),
  representativeName: z.string().min(1, "代表者名を入力してください"),
});

type FormValues = z.infer<typeof formSchema>;

export const CompanyInfoSection = ({
  userDetail,
  isUserLoading,
}: {
  userDetail: CustomerDetail;
  isUserLoading?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const companyInfo = [
    // {
    //   label: "会社名",
    //   value: userDetail?.username,
    // },
    // {
    //   label: "会社名（フリガナ）",
    //   value: userDetail?.usernameKana,
    // },
    {
      label: "役職／部署名",
      value: userDetail?.company_info?.tantoPosition,
    },
    {
      label: "代表者名",
      value: userDetail?.company_info?.representativeName,
    },
  ];

  const {
    mutate: userCompanyInfoUpdate,
    isPending: isUserCompanyInfoUpdatePending,
  } = useUserCompanyInfoUpdate(userDetail?.user_id ?? "");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      //   username: basicInfoData?.username || "",
      //   usernameKana: basicInfoData?.usernameKana || "",
      tantoPosition: companyInfo[0].value || "",
      representativeName: companyInfo[1].value || "",
    },
  });

  // TODO: check and change if needed
  const handleEdit = () => {
    form.reset({
      tantoPosition: companyInfo[0].value || "",
      representativeName: companyInfo[1].value || "",
    });
    setIsEditing(true);
  };

  // TODO: check and change if needed
  const onSubmit = (values: FormValues) => {
    const updateData: CompanyInfoUpdate = {
      //   username: values.username,
      //   usernameKana: values.usernameKana,
      tantoPosition: values.tantoPosition,
      representativeName: values.representativeName,
    };

    userCompanyInfoUpdate(updateData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["customer"],
        });
        setIsEditing(false);
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <h3 className="py-4 text-primary mr-2">会社情報</h3>
        {!isUserLoading && (
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full p-0 cursor-pointer"
            onClick={handleEdit}
          >
            <Pencil className="w-5 h-5" fill="black" stroke="white" />
          </Button>
        )}
      </div>
      {isUserLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 py-1">
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
            </div>
          ))
        : companyInfo.map((info, index) => (
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
        onClose={() => setIsEditing(false)}
        showConfirmButton={false}
        className="max-w-3xl"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* name */}
            {/* <FormInputComponent
                id="username"
                control={form.control}
                name="username"
                label="会社名"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              /> */}

            {/* usernameKana */}
            {/* <FormInputComponent
                id="usernameKana"
                control={form.control}
                name="usernameKana"
                label="会社名（カナ）"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              /> */}

            {/* position */}
            <FormInputComponent
              id="tantoPosition"
              control={form.control}
              name="tantoPosition"
              label="役職／部署名 "
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* representativeName */}
            <FormInputComponent
              id="representativeName"
              control={form.control}
              name="representativeName"
              label="代表者名"
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            <Button
              type="submit"
              variant="default"
              className={`w-full font-bold hover:bg-primary/90 text-white`}
              disabled={
                !form.formState.isValid || isUserCompanyInfoUpdatePending
              }
            >
              {isUserCompanyInfoUpdatePending ? (
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
