"use client";

import BackToMenu from "@/components/app/BackToMenu";
import GuildeLinkComponent from "@/components/app/GuildeLinkComponent";
import ParamsList from "@/components/app/ParamsList";

interface ComponentLayoutProps {
  children: React.ReactNode;
  componentTitle: string;
  componentPath: string;
  params: { name: string; type: string }[];
}

const ComponentLayout = ({ children, componentTitle, componentPath, params }: ComponentLayoutProps) => {
  return (
    <div className="pt-8">
      <BackToMenu />

      <div className="space-y-6 mt-6">
        <GuildeLinkComponent
          title={componentTitle}
          name={componentPath}
        />
        <ParamsList params={params} />
        {children}

        <div className="h-[80px]" />
      </div>
    </div>
  );
};

export default ComponentLayout;
