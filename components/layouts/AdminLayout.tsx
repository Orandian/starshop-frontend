"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <SidebarTrigger onClick={() => setOpen(!open)} />
          <div className="p-4 md:p-10 max-w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
