"use client";

import { Suspense, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    //TODO: Add loading skeleton
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
