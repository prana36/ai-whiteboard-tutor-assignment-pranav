"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { clearAdminSession, getAdminSession } from "@/lib/auth";
import { cn, formatDateTime } from "@/lib/utils";

interface LogoutSectionProps {
  variant?: "compact" | "panel";
  className?: string;
}

export function LogoutSection({
  variant = "panel",
  className,
}: LogoutSectionProps) {
  const router = useRouter();
  const adminSession = getAdminSession();

  function handleLogout() {
    clearAdminSession();
    toast.success("Admin session closed");
    router.replace("/login");
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex max-w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/70",
          className
        )}
      >
        <Avatar name={adminSession?.email ?? "Admin"} size="sm" />
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {adminSession?.role ?? "Control Supervisor"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {adminSession?.email ?? "admin@rkcontrol.com"}
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="hidden xl:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[24px] border border-slate-200/70 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar name={adminSession?.email ?? "Admin"} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {adminSession?.role ?? "Control Supervisor"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {adminSession?.email ?? "admin@rkcontrol.com"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-950/70">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Admin Session
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Logged in since{" "}
            {adminSession?.loggedInAt ? formatDateTime(adminSession.loggedInAt) : "active session"}
          </p>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout admin
        </Button>
      </div>
    </div>
  );
}
