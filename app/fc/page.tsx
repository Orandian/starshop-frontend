"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FCPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/fc/mypage");
  }, [router]);

  return null; // or a loading spinner if needed
};

export default FCPage;