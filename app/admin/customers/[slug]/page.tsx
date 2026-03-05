"use client";
import { useGetCustomerById } from "@/hooks/admin/useCustomer";
import {
  decryptString,
  getUserType,
  formatDate,
  getBonusType,
  convertToYen,
  formatId,
  encodeShortString,
} from "@/utils";
import { use, useCallback } from "react";
import DetailCustomerHeader from "@/components/admin/profile/DetailCustomerHeader";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BasicInfoSection } from "@/components/admin/profile/BasicInfoSection";
import { DeliveryInfoSection } from "@/components/admin/profile/DeliveryInfoSection";
import { BillingInfoSection } from "@/components/admin/profile/BillingInfoSection";
import { AccountInfoSection } from "@/components/admin/profile/AccountInfoSection";
import { CompanyInfoSection } from "@/components/admin/profile/CompanyInfoSection";

const ProfilePage = (props: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const params = use(props.params);
  const { data: userDetail, isLoading: isUserLoading } = useGetCustomerById(
    decryptString(params.slug as string),
  );

  const getTodayYM = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() is 0-based
    return `${year}/${month}`;
  };

  const getReferLink = useCallback((userId: number) => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    return origin && userId && userId > 0
      ? `${origin}/partner/${encodeShortString(userId.toString())}`
      : "";
  }, []);

  const handleCopy = async (referLink: string) => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        if (referLink !== "") {
          await navigator.clipboard.writeText(referLink);
          toast.success("リンクをコピーしました");
        } else {
          toast.error("リンクが見つかりません");
        }
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const fcBasicInfo = [
    {
      label: "代理店 ID",
      value:
        userDetail?.fc_info?.createdAt &&
        formatId(userDetail?.fc_info?.createdAt, userDetail?.fc_info?.fcId),
      show: true,
    },
    {
      label: "代理店階層",
      value: getUserType(
        userDetail?.user_type || 0,
        Number(userDetail?.fc_info?.role) || 0,
      ),
      show: true,
    },
    {
      label: "リファラ",
      value: (
        <>
          <a
            href={getReferLink(Number(userDetail?.user_id) || 0)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            紹介リンク
          </a>
          <Copy
            className="inline-block ml-2 cursor-pointer text-gray-500"
            size={16}
            onClick={() =>
              handleCopy(getReferLink(Number(userDetail?.user_id)))
            }
          />
        </>
      ),
      show: true,
    },
    {
      label: "担当エリア",
      value: "全国統括",
      show: false, // will add in version 2
    },
    {
      label: "代理店ステータス",
      value: "活動中",
      show: false, // will add in version 2
    },
    {
      label: "代理店登録日",
      value: formatDate(
        userDetail?.fc_info?.createdAt || new Date().toISOString(),
      ),
      show: true,
    },
  ];

  const bonusInfo = [
    {
      label: "ボーナス対象種別",
      value: getBonusType(2, Number(userDetail?.fc_info?.role) || 0),
    },
    {
      label: "ボーナス累計受取額",
      value: userDetail?.totalBonus
        ? convertToYen(userDetail.totalBonus)
        : "¥0",
    },
    {
      label: "直近のボーナス",
      value: userDetail?.recentBonus
        ? convertToYen(userDetail.recentBonus) + " (" + getTodayYM() + ")"
        : "¥0 (" + getTodayYM() + ")",
    },
  ];

  return (
    <section className="px-4 md:px-10 py-4 md:py-10 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border">
      {/* back */}
      <div className="flex gap-2 text-left items-center">
        <ArrowLeft
          className="cursor-pointer"
          size={20}
          onClick={() => router.push("/admin/customers")}
        />
      </div>
      <div className="flex gap-2 md:flex-row flex-col">
        {/* Filters */}
        <DetailCustomerHeader slug={params.slug} />
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* left column */}
          <div>
            {/* basic information */}
            <BasicInfoSection
              userDetail={userDetail || {}}
              isUserLoading={isUserLoading}
            />
            {/* user addresses */}
            <div>
              <DeliveryInfoSection
                userDetail={userDetail || {}}
                isUserLoading={isUserLoading}
              />
              <BillingInfoSection
                userDetail={userDetail || {}}
                isUserLoading={isUserLoading}
              />
            </div>
          </div>
          {/* Right - all fc information */}
          {isUserLoading ? (
            // Skeleton for FC information section
            <div>
              <h3 className="py-4 text-primary">代理店情報</h3>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 py-1">
                  <Skeleton className="h-6 w-full bg-gray-200" />
                  <Skeleton className="h-6 w-full bg-gray-200" />
                </div>
              ))}
              <h3 className="py-4 text-primary">ボーナス情報</h3>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 py-1">
                  <Skeleton className="h-6 w-full bg-gray-200" />
                  <Skeleton className="h-6 w-full bg-gray-200" />
                </div>
              ))}
              <h3 className="py-4 text-primary">会社情報</h3>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 py-1">
                  <Skeleton className="h-6 w-full bg-gray-200" />
                  <Skeleton className="h-6 w-full bg-gray-200" />
                </div>
              ))}
              <h3 className="py-4 text-primary">口座情報</h3>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 py-1">
                  <Skeleton className="h-6 w-full bg-gray-200" />
                  <Skeleton className="h-6 w-full bg-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            userDetail?.user_type === 2 && (
              // FC information here
              <>
                <div>
                  <h3 className="py-4 text-primary">代理店情報</h3>
                  {/* FC Information */}
                  {isUserLoading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-2 py-1"
                        >
                          <Skeleton className="h-6 w-full bg-gray-200" />
                          <Skeleton className="h-6 w-full bg-gray-200" />
                        </div>
                      ))
                    : fcBasicInfo.map(
                        (info, index) =>
                          info.show !== false && (
                            <div
                              key={index}
                              className="grid grid-cols-2 gap-2 py-1"
                            >
                              <p className="font-bold text-sm">{info.label}:</p>
                              <p className="text-sm">
                                <span className="px-3 inline-flex leading-5 font-normal rounded-full py-1">
                                  {info.value || "-"}
                                </span>
                              </p>
                            </div>
                          ),
                      )}
                  {/* Bonus Information */}
                  <h3 className="py-4 text-primary">ボーナス情報</h3>
                  {isUserLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-2 py-1"
                        >
                          <Skeleton className="h-6 w-full bg-gray-200" />
                          <Skeleton className="h-6 w-full bg-gray-200" />
                        </div>
                      ))
                    : bonusInfo.map((info, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-2 py-1"
                        >
                          <p className="font-bold text-sm">{info.label}:</p>
                          <p className="text-sm">
                            {Array.isArray(info.value) ? (
                              info.value.map((bonus, i) => (
                                <span
                                  key={i}
                                  className={`${bonus.color || ""} px-3 inline-flex leading-5 font-normal rounded-full py-1 mr-1`}
                                >
                                  {bonus.label}
                                </span>
                              ))
                            ) : (
                              <span className="px-3 inline-flex leading-5 font-normal rounded-full py-1">
                                {info.value || "-"}
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                  {/* Company Information */}
                  <CompanyInfoSection
                    userDetail={userDetail || {}}
                    isUserLoading={isUserLoading}
                  />
                  {/* Account Information */}
                  <AccountInfoSection
                    userDetail={userDetail || {}}
                    isUserLoading={isUserLoading}
                  />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
