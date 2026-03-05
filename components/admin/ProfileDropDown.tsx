import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/useAuthStore";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PopupBox from "./PopupBox";

const ProfileDropDown = () => {
  const { logout } = useUserStore();
  const router = useRouter();
  const { user } = useUserStore();

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleLogout = async () => {
  // Clear the user state and token
  setIsPopUpOpen(true);
  useUserStore.setState({ user: null, token: null });
  await logout(); // Make sure to await the logout API call
  
  // Show the popup and redirect
  router.push("/login");
  router.refresh(); // Ensure the page refreshes to clear any cached data
  };

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
          <Button className="bg-white text-black border border-black/10 rounded-full w-fit h-10 hover:bg-black/10 active:bg-black/10 focus:outline-none focus:ring-0 cursor-pointer">
            <User />
            <p>{user?.username}</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white border border-black/10 cursor-pointer"
          align="end"
        >
          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="text-red-500 hover:bg-white-bg active:text-white focus:outline-none focus:ring-0 cursor-pointer"
          >
            ログアウト
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

export default ProfileDropDown;
