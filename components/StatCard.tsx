"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ActivitySquare,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Eye,
  FileCheck2,
  LockKeyhole,
  ShieldBan,
  ShieldCheck,
  TimerReset,
  UserCheck,
  Users,
  Webcam,
  Webhook,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  helperText: string;
  tone: "face" | "browser" | "lock" | "alert" | "os" | "neutral";
  icon:
    | "activity"
    | "activity-square"
    | "alert-circle"
    | "alert-triangle"
    | "eye"
    | "file-check"
    | "lock-keyhole"
    | "shield-ban"
    | "shield-check"
    | "timer-reset"
    | "user-check"
    | "users"
    | "webcam"
    | "webhook";
  percent?: boolean;
}

const iconMap: Record<StatCardProps["icon"], LucideIcon> = {
  activity: Activity,
  "activity-square": ActivitySquare,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  eye: Eye,
  "file-check": FileCheck2,
  "lock-keyhole": LockKeyhole,
  "shield-ban": ShieldBan,
  "shield-check": ShieldCheck,
  "timer-reset": TimerReset,
  "user-check": UserCheck,
  users: Users,
  webcam: Webcam,
  webhook: Webhook,
};

const toneStyles = {
  face: "from-violet-500/20 to-fuchsia-500/10 text-violet-700 dark:text-violet-200",
  browser: "from-teal-500/20 to-emerald-500/10 text-teal-700 dark:text-teal-200",
  lock: "from-amber-500/20 to-orange-500/10 text-amber-700 dark:text-amber-200",
  alert: "from-rose-500/20 to-red-500/10 text-rose-700 dark:text-rose-200",
  os: "from-slate-500/20 to-slate-700/10 text-slate-700 dark:text-slate-200",
  neutral: "from-sky-500/20 to-indigo-500/10 text-sky-700 dark:text-sky-200",
};

export function StatCard({
  title,
  value,
  change,
  helperText,
  tone,
  icon,
  percent = false,
}: StatCardProps) {
  const Icon = iconMap[icon];
  const TrendIcon =
    change.startsWith("+") ? ArrowUpRight : change.startsWith("-") ? ArrowDownRight : ArrowRight;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="break-words text-sm font-medium text-slate-500 dark:text-slate-400">
                {title}
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {percent ? formatPercent(value) : formatNumber(value)}
              </p>
            </div>
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-white/70 dark:ring-slate-700/60",
                toneStyles[tone]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <TrendIcon className="h-4 w-4" />
              {change}
            </div>
            <p className="break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
              {helperText}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
