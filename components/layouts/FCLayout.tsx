"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/fc-sidebar/app-sidebar";
import { useState } from "react";

const FCLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content with defined height and positioning context */}
        <main className="flex-1 min-w-0 flex flex-col relative h-screen">
          <SidebarTrigger onClick={() => setOpen(!open)} isFC />
          <div className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-10 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default FCLayout;
