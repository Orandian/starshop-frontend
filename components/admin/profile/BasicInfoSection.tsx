import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUserProfileUpdate } from "@/hooks/admin/useCustomer";
import { CustomerDetail, UpdateProfile } from "@/types/customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import PopupBox from "@/components/fc/ui/PopupBox";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Pencil } from "lucide-react";
import ImageComponent from "@/components/fc/ImageComponent";
import {
  getUserType,
  getUserTypeClass,
  formatDate,
  formatId,
  getPublicUrl,
} from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FcUserRole } from "@/utils/fc/fc-user-roles";

// FC role options
const roleOptions = [
  { value: FcUserRole.MANAGER, label: "代理店マネージャー" },
  { value: FcUserRole.CONSULTANT, label: "代理店コンサルタント" },
  { value: FcUserRole.LEADER, label: "代理店リーダー" },
  { value: FcUserRole.SPECIALIST, label: "代理店スペシャリスト" },
  { value: FcUserRole.NORMAL, label: "代理店メンバー" },
];

export const BasicInfoSection = ({
  userDetail,
  isUserLoading,
}: {
  userDetail: CustomerDetail;
  isUserLoading?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    username: z.string().min(1, "会社名を入力してください"),
    usernameKana: z.string().min(1, "フリガナを入力してください"),
    phoneNumber: z
      .string()
      .min(1, "電話番号を入力してください")
      .regex(
        /^0\d{1,4}-\d{1,4}-\d{4}$/,
        "有効な日本の電話番号を入力してください (例: 070-1234-1234)",
      ),
    tantoName:
      userDetail?.user_type === 2
        ? z.string().min(1, "担当者名を入力してください")
        : z.string().optional(),
    role:
      userDetail?.user_type === 2
        ? z.number().min(1, "フロント担当者を選択してください")
        : z.number().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const basicInfoData = [
    {
      label: "顧客ID",
      value:
        (userDetail?.createdAt &&
          formatId(userDetail?.createdAt, Number(userDetail?.user_id))) ||
        "-",
      class: "",
      show: true,
    },
    {
      label: `${userDetail.user_type === 2 ? "会社名" : "氏名"}`,
      value: userDetail?.username || "-",
      class: "",
      show: true,
    },
    {
      label: `${userDetail.user_type === 2 ? "会社名" : "氏名"}（カナ）`,
      value: userDetail?.usernameKana || "-",
      class: "",
      show: true,
    },
    {
      label: "担当者名",
      value: userDetail?.tantoName || "-",
      class: "",
      show: userDetail?.user_type === 2,
    },
    {
      label: "メール",
      value: userDetail?.email || "-",
      class: "",
      show: true,
    },
    {
      label: "電話番号",
      value: userDetail?.phone_number || "-",
      class: "",
      show: true,
    },
    {
      label: "登録日",
      value: userDetail?.createdAt ? formatDate(userDetail.createdAt) : "",
      class: "",
      show: true,
    },
    {
      label: "顧客タイプ",
      value: getUserType(
        userDetail?.user_type || 0,
        Number(userDetail?.fc_info?.role) || 0,
      ),
      class: getUserTypeClass(
        userDetail?.user_type || 0,
        Number(userDetail?.fc_info?.role) || 0,
      ),
      show: true,
    },
  ];

  const { mutate: userProfileUpdate, isPending: isUserProfileUpdatePending } =
    useUserProfileUpdate(userDetail?.user_id ?? "");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username:
        basicInfoData[1]?.value === "-" ? "" : basicInfoData[1]?.value || "",
      usernameKana:
        basicInfoData[2]?.value === "-" ? "" : basicInfoData[2]?.value || "",
      phoneNumber:
        basicInfoData[5]?.value === "-" ? "" : basicInfoData[5]?.value || "",
      tantoName:
        basicInfoData[3]?.value === "-" ? "" : basicInfoData[3]?.value || "",
      role: Number(userDetail?.fc_info?.role) || 0,
    },
  });

  const handleEdit = () => {
    // Reset form with current data
    form.reset({
      username: userDetail?.username || "",
      usernameKana: userDetail?.usernameKana || "",
      phoneNumber: userDetail?.phone_number || "",
      tantoName: userDetail?.tantoName || "",
      role: Number(userDetail?.fc_info?.role) || 0,
    });
    setIsEditing(true);
  };

  const onSubmit = (values: FormValues) => {
    const updateData: UpdateProfile = {
      username: values.username,
      usernameKana: values.usernameKana,
      phoneNumber: values.phoneNumber,
      tantoName: values.tantoName,
      role: values.role,
    };

    // Send updateData to server
    userProfileUpdate(updateData, {
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
      <div>
        <div className="flex items-center gap-2">
          <h3 className="py-4 text-primary mr-2">基本情報</h3>
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
        <div className="flex justify-center">
          {/* User Image */}
          <div className="relative w-32 h-32 rounded-full p-2">
            <div className="relative w-full h-full">
              {isUserLoading ? (
                <Skeleton className="w-full h-full rounded-full bg-gray-200" />
              ) : userDetail?.user_photo ? (
                <ImageComponent
                  imgURL={getPublicUrl(userDetail.user_photo)}
                  imgName="User"
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <User className="w-full h-full text-gray-500" />
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          {isUserLoading
            ? Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 py-1">
                  <Skeleton className="h-6 w-full bg-gray-200" />
                  <Skeleton className="h-6 w-full bg-gray-200" />
                </div>
              ))
            : basicInfoData.map((info, index: number) => (
                <div key={index} className="grid grid-cols-2 gap-2 py-1">
                  {info.show !== false && (
                    <>
                      <p className="font-bold">{info.label}:</p>
                      <p className="text-sm">
                        <span
                          className={`${info.class || ""} px-3 inline-flex leading-5 font-normal rounded-full py-1`}
                        >
                          {info.value || "-"}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              ))}
        </div>
      </div>

      <PopupBox
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        showConfirmButton={false}
        className="max-w-3xl"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* name */}
            <FormInputComponent
              id="username"
              control={form.control}
              name="username"
              label={`${userDetail?.user_type === 2 ? "会社名" : "氏名"}`}
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />
            {/* usernameKana */}
            <FormInputComponent
              id="usernameKana"
              control={form.control}
              name="usernameKana"
              label={`${userDetail?.user_type === 2 ? "会社名" : "氏名"}（カナ）`}
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />
            {/* tantoname */}
            {userDetail?.user_type === 2 && (
              <FormInputComponent
                id="tantoName"
                control={form.control}
                name="tantoName"
                label="担当者名"
                required
                className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
              />
            )}
            {/* phoneNumber */}
            <FormInputComponent
              id="phoneNumber"
              control={form.control}
              name="phoneNumber"
              label="電話番号"
              required
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />
            {userDetail?.user_type === 2 && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  代理店ロール
                  <span className="text-required text-xl">*</span>
                </label>
                <Select
                  value={form.watch("role")?.toString()}
                  onValueChange={(value) =>
                    form.setValue("role", Number(value))
                  }
                >
                  <SelectTrigger className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3">
                    <SelectValue placeholder="代理店ロールを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {roleOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              type="submit"
              variant="default"
              className={`w-full font-bold hover:bg-primary/90 text-white`}
              disabled={!form.formState.isValid || isUserProfileUpdatePending}
            >
              {isUserProfileUpdatePending ? (
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
