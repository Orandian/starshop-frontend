"use client";

import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import PublicLayout from "@/components/layouts/PublicLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PublicLayout>
      <PublicDetailsLayout>{children}</PublicDetailsLayout>
    </PublicLayout>
  );
};

export default layout;
