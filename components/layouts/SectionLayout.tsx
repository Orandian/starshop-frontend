import { cn } from "@/lib/utils";

const SectionLayout = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <section className={cn("relative h-screen w-screen", className)}>{children}</section>;
};

export default SectionLayout;
