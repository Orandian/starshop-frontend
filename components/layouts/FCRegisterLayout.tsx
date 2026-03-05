"use client";
import ImageComponent from "@/components/fc/ImageComponent";
import Logo from "@/public/fc/logo.png";

const FCRegisterLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Logo */}
        <div className="p-4  flex justify-start items-center border-b-4 border-product-card-btn">
          <ImageComponent
            imgURL={Logo.src}
            imgName="fc-logo"
            className="w-auto h-auto"
          ></ImageComponent>
        </div>
        <div className="p-2 md:p-4  max-w-full">{children}</div>
      </main>
    </div>
  );
};

export default FCRegisterLayout;
