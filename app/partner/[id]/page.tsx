"use client";

import LoadingIndicator from "@/components/fc/ui/LoadingIndicator";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicPartnerRedirect() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;



  useEffect(() => {
    const targetUrl = `/fc/register/account-create?id=${id}`;
    router.replace(targetUrl);
  }, [id, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingIndicator size="lg" />
    </div>
  );
}
