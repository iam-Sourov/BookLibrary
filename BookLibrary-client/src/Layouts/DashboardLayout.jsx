import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "../components/sidebar/Sidebar"
import { Outlet, ScrollRestoration } from "react-router";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-2">
        <SidebarTrigger />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
      <ScrollRestoration />
    </SidebarProvider>
  );
};

export default DashboardLayout;