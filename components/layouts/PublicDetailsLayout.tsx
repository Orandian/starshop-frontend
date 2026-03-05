// import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const PublicDetailsLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "my-32 scroll-pt-20 container mx-auto px-0 md:px-6 lg:px-8",
        className
      )}
    >
      {/* <div className="w-full border-b border-white-bg" /> */}
      {/* <div className="py-10 px-4">
        <ChevronLeft size={26} className="cursor-pointer" onClick={() => history.back()} />
      </div> */}
      {children}
    </div>
  );
};

export default PublicDetailsLayout;
