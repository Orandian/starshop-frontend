"use client";

import AddressForm from "@/components/profile/AddressForm";
import OrderTable from "@/components/profile/OrderTable";
import PasswordUpdateForm from "@/components/profile/PasswordUpdateForm";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { cn } from "@/lib/utils";
import { useState } from "react";
// import SubscriptionTable from "@/components/profile/SubscriptionTable";

const ProfilePage = () => {
  const [selectedTag, setSelectedTag] = useState<string>("注文履歴書");
  const tags = ["注文履歴書", "配送先", "パスワード変更"];
  return (
    <div className="md:space-y-8 space-y-4">
      <ProfileHeader />

      <div className="px-4">
        <div className="bg-white/40 border border-white-bg rounded-md md:p-6 p-4 drop-shadow-xl md:space-y-6 space-y-4">
          <div className="flex flex-row-center space-x-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "w-[100px] py-2 rounded-full text-xs text-white-bg inline-block cursor-pointer",
                  tag === selectedTag
                    ? "bg-dark text-white hover:bg-dark/80"
                    : "bg-dark/30 text-black hover:bg-dark/20"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {selectedTag === "注文履歴書" && <OrderTable />}
            {/* {selectedTag === "定期購入書" && <SubscriptionTable />} */}
            {selectedTag === "配送先" && <AddressForm />}
            {selectedTag === "パスワード変更" && <PasswordUpdateForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
