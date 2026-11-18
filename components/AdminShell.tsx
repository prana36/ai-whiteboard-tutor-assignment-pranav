"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { PageSkeleton } from "@/components/PageSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { isAdminAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authenticated = isAdminAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] px-4 py-8 text-[var(--text-primary)] sm:px-6 lg:px-8">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-violet-500/12 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[20%] h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative min-h-screen lg:pl-72">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
