import Image from "next/image";
import ProfileImage from "@/public/profile/profileDummy.jpg";
import { Pencil } from "lucide-react";
import { useProfileAPI, useUserNameUpdate } from "@/hooks/user/useProfile";
import { useState, useEffect } from "react";
import ProfileImageDialog from "./ProfileImageDialog";
import { getProfileImage, getPublicUrl } from "@/utils";
import { useUploadProfileImage } from "@/hooks/user/useStorage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInputComponent from "@/components/app/public/FormInputComponent";
import { Form } from "@/components/ui/form";
import { MESSAGES } from "@/types/messages";
import { UserProfile } from "@/types/profile/profile.type";
import { useProfileLogout } from "@/hooks/useLogout";
import { ApiError } from "@/lib/api/api.gateway";

const FormSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(50, "名前は50文字以内で入力してください"),
});

const ProfileHeader = () => {
  const router = useRouter(); // Create a router instance
  const { data: profileData, refetch } = useProfileAPI(); // Fetch the profile data
  const { handleUserLogout } = useProfileLogout();

  const { mutate: uploadProfileImage, isSuccess, isError, error, isPending } =
    useUploadProfileImage();
  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useUserNameUpdate(); // Initialize the update profile mutation
    const [open, setOpen] = useState(false); // State to toggle the dialog
  const [profileImage, setProfileImage] = useState<string | null>(null); // State to store the profile image
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // State to store the preview URL
  const [openNameDialog, setOpenNameDialog] = useState(false); // State to toggle the name dialog
  const [profile, setProfile] = useState<UserProfile | null>(null); // State to store the profile
  const [updateMessage, setUpdateMessage] = useState(MESSAGES.USER.UPDATE_SUCCESS); 

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    updateProfile(data, {
      onSuccess:async (res) => {
        setUpdateMessage(res.message || MESSAGES.USER.UPDATE_SUCCESS);
        refetch();
        setOpenNameDialog(false);
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.data.message);
          return;
        }
        toast.error(MESSAGES.USER.UPDATE_FAILED);
      },
    });
  };

  const handleOpen = () => {
    if (profileImage) {
      setPreviewUrl(getProfileImage(profileImage));
    }
    setOpen(true);
  };

  const handleLogout = async () => {
    await handleUserLogout();
    router.push("/login");
  };

  useEffect(() => {
    if (!profileData?.data && form) return;
    const profile = (profileData?.data) as unknown as UserProfile;
    setProfile(profile);
    form.reset({
      name: profile?.username || "",
    });
    setProfileImage(profile?.userPhoto || null);

  }, [profileData, form]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateMessage);
      refetch();
      setOpen(false);
    }
  }, [isSuccess, setOpen, refetch , updateMessage]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || MESSAGES.USER.UPDATE_FAILED);
    }
  }, [isError, error]);

  return (
    <div className="px-4">
      <div className="md:h-[200px] h-[150px] w-full rounded-md drop-shadow-xl md:px-16 px-4 md:py-6 py-4 bg-gradient-to-r from-primary/90 from-40% to-white to-120% relative">
        <div className="flex md:space-x-6 space-x-3 items-center h-full">
          <div className="md:w-[120px] md:h-[120px] w-[90px] h-[90px] rounded-full border-[5px] border-white relative">
            <Image
              src={profileImage ? getPublicUrl(profileImage) : ProfileImage}
              alt=""
              className="w-full h-full object-cover rounded-full"
              width={200}
              height={200}
            />

            <div
              onClick={handleOpen}
              className="absolute bottom-0 right-0 p-1.5 bg-tertiary rounded-full cursor-pointer text-white"
            >
              <Pencil size={16} />
            </div>
          </div>

          <div className="inline-block md:space-y-3 space-y-2">
            <h1 className="text-white relative">
              {profile?.firstName && profile?.lastName
                ? `${profile?.firstName} ${profile?.lastName}`
                : profile?.username}

              <button
                onClick={() => setOpenNameDialog(true)}
                className="absolute -top-4 -right-8 p-1.5 bg-tertiary rounded-full cursor-pointer text-white"
              >
                <Pencil size={16} />
              </button>
            </h1>
            <p className="text-normal text-white">{profile?.email}</p>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <Button
            onClick={handleLogout}
            className="w-[100px] text-black cursor-pointer bg-white-bg hover:bg-white-bg/80 border border-black/20"
          >
            Logout
          </Button>
        </div>
      </div>
      <ProfileImageDialog
        open={open}
        setOpen={setOpen}
        profileImage={profileImage || ""}
        setProfileImage={setProfileImage}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        uploadProfileImage={
          (file: File) => {
            uploadProfileImage({ file });
          }
        }
        isPending={isPending}
      />
      <Dialog open={openNameDialog} onOpenChange={setOpenNameDialog}>
        <DialogContent className="bg-white border border-white-bg rounded-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-2"
            >
              <DialogHeader>
                <DialogTitle>名前変更</DialogTitle>
              </DialogHeader>

              <FormInputComponent
                name="name"
                label="名前"
                type="text"
                control={form.control}
                placeholder="名前を入力してください"
              />

              <DialogFooter className="flex justify-end gap-4 mt-4">
                <DialogClose
                  type="button"
                  className="w-[100px] text-black cursor-pointer bg-white-bg hover:bg-white-bg/80 border border-black/20 rounded-md"
                >
                  キャンセル
                </DialogClose>
                <Button
                  type="submit"
                  className="w-[100px] text-white-bg cursor-pointer"
                  disabled={isUpdateProfilePending}
                >
                  {isUpdateProfilePending ? "更新中..." : "更新"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;
