"use client";

import React, { Suspense, useEffect } from "react";
// import Image from "next/image";
import AuthBgImage from "@/public/auth/authbg.png";
import AuthBgImage1 from "@/public/auth/authbg1.png";
import AuthBgImage2 from "@/public/auth/authbg2.png";

import { useSearchParams } from "next/navigation";
// import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import LogoHolder from "../app/LogoHolder";
import SlickSlider from "../ui/SlickSlider";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const [reason, setReason] = React.useState<string | null>(null);

  const images = [
    { src: AuthBgImage.src, alt: '画像 1' },
    { src: AuthBgImage1.src, alt: '画像 2' },
    { src: AuthBgImage2.src, alt: '画像 3' },
  ];
    
  // const handleBack = () => {
  //   router.back();
  // };

  useEffect(() => {
    if (searchParams.get("reason") === "inactive") {
      setReason("inactive");
    }
  }, [searchParams]);

  useEffect(() => {
    if (reason === "inactive") {
      toast.error(
        "このアカウントは無効化されています。管理者に連絡してください。"
      );
    }
  }, [reason]);

  return (
    <Suspense fallback={<div>読み込み中。。。</div>}>
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="w-full md:w-1/2 flex items-center justify-center h-full relative">
          <div className="h-[100%] w-[80%] max-sm:w-[96%]">
            <div className="absolute top-8 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 w-auto ml-4 md:hidden">
              <LogoHolder />
            </div>
            <div className="relative top-1/2 transform -translate-y-1/2 h-auto">{children}</div>
          </div>
        </div>
        <div className="md:block hidden w-1/2 h-full">
          <div className="absolute z-10 top-8 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 w-auto ml-4">
            <LogoHolder />
          </div>
          <SlickSlider images={images}/>
        </div>
      </div>
    </Suspense>
  );
};

export default AuthLayout;
