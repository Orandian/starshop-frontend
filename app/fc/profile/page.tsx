"use client";
import { AccountInfoSection } from "@/components/fc/profile/AccountInfoSection";
import { BasicInfoSection } from "@/components/fc/profile/BasicInfoSection";
import { UserNameSection } from "@/components/fc/profile/UserNameSection";
import { DeliveryInfoSection } from "@/components/fc/profile/DeliveryInfoSection";
import { BillingInfoSection } from "@/components/fc/profile/BillingInfoSection";
import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { useUserDetail } from "@/hooks/fc/useRegister";
import { UserDetail } from "@/types/fc/user.type";

const ProfilePage = () => {
  const { data: userDetail, isLoading: isUserLoading } = useUserDetail();

  if (isUserLoading) {
    return <LoadingIndicator size="md" />;
  }
  return (
    <section className="max-w-4xl mx-auto">
      <div className="mx-auto space-y-6">
        {/* Profile Header Card */}
        <UserNameSection userDetail={userDetail?.data as UserDetail} />

        {/* Basic Information Card */}
        <BasicInfoSection userDetail={userDetail?.data as UserDetail} />

        {/* Account Information Card */}
        <AccountInfoSection userDetail={userDetail?.data as UserDetail} />

        {/* Delivery Information Card */}
        <DeliveryInfoSection userDetail={userDetail?.data as UserDetail} />

        {/* Billing Information Card */}
        <BillingInfoSection userDetail={userDetail?.data as UserDetail} />
      </div>
    </section>
  );
};

export default ProfilePage;
