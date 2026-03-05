import PublicLayout from "@/components/layouts/PublicLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export default layout;