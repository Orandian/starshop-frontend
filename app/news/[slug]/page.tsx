"use client";

import BannerComponent from "@/components/app/BannerComponent";
import BannerImage from "@/public/products/Banner.png";
import PublicLayout from "@/components/layouts/PublicLayout";
import { useEffect, useState } from "react";
import { decryptString } from "@/utils";
import { useParams } from "next/navigation";
import { useNewsById } from "@/hooks/user/useNews";

export default function NewsDetailPage() {
  const params = useParams(); // Get the slug from the URL

  const [newsId, setNewsId] = useState<number | null>(null);

  // Get the news by id
  const { data: news } = useNewsById(newsId);

  // Set news id
  useEffect(() => {
    if (params?.slug) {
      const decryptedId = decryptString(params?.slug as string);
      setNewsId(Number(decryptedId));
    }
  }, [params]);

  return (
    <PublicLayout>
      <BannerComponent image={BannerImage} />

      <div className="container md:px-10 md:py-10 px-5 py-5 space-y-6 border-[0px] mx-auto md:my-10 my-5">
        <div className="bg-white/50 md:p-10 p-6 rounded-[10px]">
          <p className="text-sm text-gray-500 mb-2">{news?.data?.newsDate.join("/") || "N/A"}</p>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{news?.data?.title}</h1>
          </div>
          <div className="mt-5 text-sm" dangerouslySetInnerHTML={{ __html: news?.data?.content || "" }} />
        </div>
      </div>
    </PublicLayout>
  );
}
