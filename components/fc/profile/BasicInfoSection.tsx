import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUserProfile2Update } from "@/hooks/fc";
import { basicInfoFormSchema, BasicInfoFormValues } from "@/lib/schema";
import { UserDetail, UserProfile2Update } from "@/types/fc/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LoadingIndicator from "../ui/LoadingIndicator";
import PopupBox from "../ui/PopupBox";
import { InformationSection } from "./InformationSection";
import { toast } from "sonner";

export const BasicInfoSection = ({
  userDetail,
}: {
  userDetail: UserDetail;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: userProfile2Update, isPending: isUserProfile2UpdatePending } =
    useUserProfile2Update();

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      username: userDetail?.user.username || "",
      usernameKana: userDetail?.user.usernameKana || "",
      tantoPosition: userDetail?.tantoPosition || "",
      representativeName: userDetail?.representativeName || "",
      // postalCode: userDetail?.user.userAddresses?.[0]?.postalCode || "",
      // prefecture: userDetail?.user.userAddresses?.[0]?.prefecture || "",
      // address1: userDetail?.user.userAddresses?.[0]?.address1 || "",
    },
  });

  const handleEdit = () => setIsEditing(true);

  const onSubmit = (values: BasicInfoFormValues) => {
    const updateData: UserProfile2Update = {
      username: values.username,
      usernameKana: values.usernameKana,
      tantoPosition: values.tantoPosition,
      representativeName: values.representativeName,
      //postalCode: values.postalCode,
      //prefecture: values.prefecture,
      //address1: values.address1,
    };

    userProfile2Update(updateData, {
      onSuccess: () => {
        toast.success("基本情報が正常に更新されました");
        queryClient.invalidateQueries({
          queryKey: ["user-detail"],
        });
        setIsEditing(false);
      },
      onError: () => {
        toast.error("基本情報の更新に失敗しました");
      },
    });
  };
  const handleClose = () => {
    // Reset  when closing
    form.reset();
    setIsEditing(false);
  };

  return (
    <>
      <InformationSection
        handleEdit={handleEdit}
        title="基本情報"
        items={[
          { label: "会社名", value: userDetail?.user.username || "-" },
          {
            label: "会社名（フリガナ）",
            value: userDetail?.user.usernameKana || "-",
          },
          {
            label: "役職／部署名",
            value: userDetail?.tantoPosition || "-",
          },
          {
            label: "代表者名",
            value: userDetail?.representativeName || "-",
          },
          // {
          //   label: "住所",
          //   value: userDetail?.user.userAddresses?.[0].address1 || "-",
          // },
        ]}
      />

      <PopupBox
        isOpen={isEditing}
        onClose={handleClose}
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
              label="会社名"
              required
              maxLength={50}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* usernameKana */}
            <FormInputComponent
              id="usernameKana"
              control={form.control}
              name="usernameKana"
              label="会社名（カナ）"
              required
              maxLength={50}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* position */}
            <FormInputComponent
              id="tantoPosition"
              control={form.control}
              name="tantoPosition"
              label="役職／部署名 "
              required
              maxLength={50}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* representativeName */}
            <FormInputComponent
              id="representativeName"
              control={form.control}
              name="representativeName"
              label="代表者名"
              required
              maxLength={50}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* <div className="grid grid-cols-6 gap-1"> */}
            {/* postalCode */}
            {/* <div className="flex-1 col-span-1">
                <FormInputComponent
                  id="postalCode"
                  control={form.control}
                  name="postalCode"
                  label="郵便番号"
                  minLength={5}
                  maxLength={20}
                  required
                  className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                />
              </div> */}

            {/* prefecture */}
            {/* <div className="flex-1 col-span-2">
                <FormInputComponent
                  id="prefecture"
                  control={form.control}
                  name="prefecture"
                  label="都道府県"
                  required
                  className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
                />
              </div> */}

            {/* <div className="flex-1 col-span-3">
                <FormInputComponent
                  id="address1"
                  control={form.control}
                  name="address1"
                  label="番地・建物名・部屋番号"
                  required
                  className="w-full bg-white h-10 rounded-md border border-disposed/30 px-4 py-3"
                />
              </div> */}
            {/* </div> */}

            <Button
              type="submit"
              variant="default"
              className={`w-full font-bold hover:bg-primary/90 text-white`}
              disabled={!form.formState.isValid || isUserProfile2UpdatePending}
            >
              {isUserProfile2UpdatePending ? (
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
