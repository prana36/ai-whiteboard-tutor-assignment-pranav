"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, Lock, ScanFace, ShieldCheck, UserCheck } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LiveSession } from "@/types";
import { formatDateTime } from "@/lib/utils";

export function SessionCard({ session }: { session: LiveSession }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {session.sessionId}
              </p>
              <h3 className="mt-2 break-words font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-white">
                {session.operatorName}
              </h3>
              <p className="break-words text-sm text-slate-500 dark:text-slate-400">
                {session.machineId}
              </p>
            </div>
            <StatusBadge value={session.currentState} className="shrink-0" />
          </div>

          <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <ScanFace className="h-4 w-4 text-violet-500" />
              <span className="flex-1">Face status</span>
              <StatusBadge value={session.faceStatus} />
            </div>
            <div className="flex items-center gap-3">
              <UserCheck className="h-4 w-4 text-teal-500" />
              <span className="flex-1">Presence</span>
              <StatusBadge value={session.presenceStatus} />
            </div>
            <div className="flex items-center gap-3">
              <Clock3 className="h-4 w-4 text-amber-500" />
              <span className="flex-1">Started</span>
              <span>{formatDateTime(session.startTime)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-rose-500" />
              <span className="flex-1">Lock count</span>
              <span>{session.lockCount}</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              <span className="flex-1">Active URL</span>
              <span className="min-w-0 max-w-[180px] text-right text-xs [overflow-wrap:anywhere] sm:text-sm">
                {session.activeUrl}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-100/80 p-4 text-sm dark:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Successful filings</span>
              <span className="font-semibold text-slate-950 dark:text-slate-100">
                {session.successfulFilings}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Duration</span>
              <span className="font-semibold text-slate-950 dark:text-slate-100">
                {session.durationMinutes} mins
              </span>
            </div>
          </div>

          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href={`/operators/${session.operatorId}`}>Open operator detail</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
