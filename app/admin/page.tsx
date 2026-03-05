"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return null; // or a loading spinner if needed
};

export default AdminPage;