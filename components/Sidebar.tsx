"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Binary,
  Camera,
  LayoutDashboard,
  ListChecks,
  MonitorSmartphone,
  ShieldCheck,
  Users,
} from "lucide-react";

import { LogoutSection } from "@/components/LogoutSection";
import { StatusBadge } from "@/components/StatusBadge";
import { alerts, dashboardStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/operators", label: "Operators", icon: Users },
  { href: "/sessions", label: "Live Sessions", icon: MonitorSmartphone },
  { href: "/audit-logs", label: "Audit Logs", icon: ListChecks },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/allowlist", label: "Allowlist Config", icon: ShieldCheck },
  { href: "/face-enrollment", label: "Face Enrollment", icon: Camera },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const openAlerts = alerts.filter((alert) => alert.status !== "resolved").length;
  const successRate = dashboardStats.find((stat) => stat.key === "filingSuccessRate")?.value ?? 0;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/60 bg-white/85 px-5 pb-6 pt-5 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-transform duration-300 dark:border-slate-800/80 dark:bg-slate-950/88 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="rounded-[28px] border border-violet-200/60 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(20,184,166,0.12))] p-5 dark:border-violet-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-white shadow-lg">
              <Binary className="h-6 w-6" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-950 dark:text-white">
                RK Control
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Operator Control System</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Open alerts</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {openAlerts}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Success rate</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {successRate}%
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-2">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-[linear-gradient(135deg,rgba(124,58,237,0.16),rgba(20,184,166,0.14))] text-slate-950 shadow-sm dark:text-white"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/70 dark:hover:text-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {label}
                </span>
                {href === "/alerts" ? <StatusBadge value="open" className="hidden sm:inline-flex" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 rounded-[28px] border border-slate-200/70 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Workflow mode</p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-slate-950 dark:text-slate-100">
              Secure Filing Active
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Face verification, domain allowlist, and OS enforcement policies are live.
            </p>
          </div>
          <LogoutSection />
        </div>
      </div>
    </aside>
  );
}
