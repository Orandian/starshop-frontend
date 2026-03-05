import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserDetail } from "@/hooks/fc";
import { logout } from "@/lib/api/auth";
import { useUserStore } from "@/store/useAuthStore";
import { getPublicUrl } from "@/utils";
import { LogOut, User, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageComponent from "./ImageComponent";
import LoadingIndicator from "./ui/LoadingIndicator";
import PopupBox from "./ui/PopupBox";

const FCProfileDropDown = () => {
  const router = useRouter();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const { data: userDetail, isLoading: isLoadingUserDetail } = useUserDetail();



const handleLogout = async () => {
  // Clear the user state and token
  setIsPopUpOpen(true);
  useUserStore.setState({ user: null, token: null });
  await logout(); // Make sure to await the logout API call
  
  // Show the popup and redirect
  router.push("/login");
  router.refresh(); // Ensure the page refreshes to clear any cached data
};

// In your JSX, make sure the onClick only calls handleLogout
<DropdownMenuItem 
  onClick={handleLogout} 
  className="flex items-center gap-2 cursor-pointer"
>
  <LogOut className="h-4 w-4" />
  <span>ログアウト</span>
</DropdownMenuItem>

  const handleLogoutClick = () => {
    setIsPopUpOpen(true);
  };

  const confirmLogout = () => {
    handleLogout();
    setIsPopUpOpen(false);
  };




  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center cursor-pointer gap-2 p-0.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
            disabled={isLoadingUserDetail}
          >
            {isLoadingUserDetail ? (
              <div className="flex justify-center items-center w-7 h-7">
                <LoadingIndicator />
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {userDetail?.data?.user.userPhoto ? (
                    <ImageComponent
                      imgURL={getPublicUrl(userDetail.data.user.userPhoto) || ""}
                      imgName={"User"}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 mr-3">
                  {userDetail?.data?.user?.username || "User"}
                </span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1">
          <DropdownMenuItem
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            onClick={() => router.push("/fc/profile")}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PopupBox
        isOpen={isPopUpOpen}
        onClose={() => setIsPopUpOpen(false)}
        onConfirm={confirmLogout}
        confirmButtonText="ログアウト"
        cancelButtonText="キャンセル"
        showCancelButton={true}
        isLoading={false}
      >
        <p className="mb-4 font-medium text-center">ログアウトしますか？</p>
      </PopupBox>
    </>
  );
};

export default FCProfileDropDown;