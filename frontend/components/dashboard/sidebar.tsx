"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, X } from "lucide-react";
import { YoutubeSummary3D } from "@/components/icons/youtube-summary-3d";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Summaries", href: "/dashboard/summaries", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r bg-neutral-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 dark:bg-neutral-900 ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        {/* Header with close button on mobile */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-lg">Summarize</span>
          </Link>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {sidebarLinks.map((link) => {
              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "text-foreground bg-neutral-200 dark:bg-neutral-800"
                      : "text-muted-foreground hover:text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
            <div className="bg-primary/10 h-10 w-10 rounded-full p-1">
              <YoutubeSummary3D className="h-full w-full" />
            </div>
            <div>
              <p className="text-sm font-medium">Pro Plan</p>
              <p className="text-muted-foreground text-xs">Active</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
