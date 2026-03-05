import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useUserProfile1Update } from "@/hooks/fc";
import { useFCUploadProfile } from "@/hooks/fc/useFileUpload";
import { UserNameSectionFormValues, userNameSectionSchema } from "@/lib/schema";
import { UserDetail, UserProfile1Update } from "@/types/fc/user.type";
import { getPublicUrl } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageComponent from "../ImageComponent";
import LoadingIndicator from "../ui/LoadingIndicator";
import PopupBox from "../ui/PopupBox";

export const UserNameSection = ({ userDetail }: { userDetail: UserDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadProfile, isPending: isUploadProfilePending } =
    useFCUploadProfile();
  const [preview, setPreview] = useState<string | null>(
    userDetail?.user?.userPhoto || null
  );

  const { mutate: userProfile1Update, isPending: isUserProfile1UpdatePending } =
    useUserProfile1Update();

  const form = useForm<UserNameSectionFormValues>({
    resolver: zodResolver(userNameSectionSchema),
    mode: "onChange",
    defaultValues: {
      tantoName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (userDetail) {
      form.reset({
        tantoName: userDetail.tantoName || "",
        phoneNumber: userDetail.user?.phoneNumber || "",
      });
      if (userDetail.user?.userPhoto) {
        setPreview(getPublicUrl(userDetail.user?.userPhoto));
      }
    }
  }, [userDetail, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onSubmit = (values: UserNameSectionFormValues) => {
    const updateData: UserProfile1Update = {
      tantoName: values.tantoName,
      phoneNumber: values.phoneNumber,
    };

    // Send updateData to server
    userProfile1Update(updateData, {
      onSuccess: () => {
        toast.success("プロフィール情報が正常に更新されました");
        queryClient.invalidateQueries({
          queryKey: ["user-detail"],
        });

        setIsEditing(false);
      },
      onError: () => {
        toast.error("プロフィール情報の更新に失敗しました");
      },
    });
  };

  /**
   * To upload image
   * @param e
   * @returns
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルをアップロードしてください");
      return;
    }

    //validate file size
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ファイルサイズは10MB以下にしてください");
      return;
    }

    try {
      // Show preview
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      // Upload the file
      uploadProfile(
        { files: [file] },
        {
          onSuccess: () => {
            toast.success("プロフィール画像を更新しました");
            // Optionally update the user data in the cache
            queryClient.invalidateQueries({ queryKey: ["user-detail"] });
          },
          onError: (error) => {
            console.error("Error uploading profile image:", error);
            toast.error("プロフィール画像のアップロードに失敗しました");
            setPreview(null);
          },
        }
      );
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("画像の処理中にエラーが発生しました");
      setPreview(null);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    // Reset form when closing
    form.reset();
  };

  return (
    <>
      <Card className="bg-white rounded-lg shadow-lg relative border-none">
        <CardContent className="p-6 ">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-full   p-2">
              {preview ? (
                <div className="relative w-full h-full">
                  <ImageComponent
                    imgURL={preview}
                    imgName={"User"}
                    width={100}
                    height={100}
                    className={`object-cover w-full h-full rounded-full ${
                      isUploadProfilePending ? "opacity-50" : ""
                    }`}
                  />
                  {isUploadProfilePending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingIndicator size="sm" />
                    </div>
                  )}
                </div>
              ) : (
                <User className="w-full h-full text-gray-500" />
              )}
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute z-10 bottom-3 right-3 border bg-white border-black p-1 rounded-full shadow-sm cursor-pointer"
              >
                <Pencil className="w-4 h-4" fill="black" stroke="white" />
              </button>
            </div>
            <div className="flex-1 w-full">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">
                    {userDetail?.tantoName}
                  </h2>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{userDetail?.user?.phoneNumber}</p>
                  <p>{userDetail?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full p-0 absolute top-2 right-2 cursor-pointer"
          onClick={handleEdit}
        >
          <Pencil className="w-5 h-5" fill="black" stroke="white" />
        </Button>
      </Card>

      <PopupBox
        isOpen={isEditing}
        onClose={handleClose}
        showConfirmButton={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* name */}
            <FormInputComponent
              id="name"
              control={form.control}
              name="tantoName"
              label="氏名"
              required
              maxLength={50}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            {/* phoneNumber */}
            <FormInputComponent
              id="phoneNumber"
              control={form.control}
              name="phoneNumber"
              label="電話番号"
              required
              maxLength={15}
              className="w-full bg-white h-10 rounded-md border border-disabled/30 px-4 py-3"
            />

            <Button
              type="submit"
              variant="default"
              className={`w-full font-bold hover:bg-primary/90 text-white`}
              disabled={!form.formState.isValid || isUserProfile1UpdatePending}
            >
              {isUserProfile1UpdatePending ? (
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
