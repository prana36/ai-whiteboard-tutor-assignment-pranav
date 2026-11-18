import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MonitorSmartphone } from "lucide-react";

import { OperatorDetailCharts } from "@/components/AnalyticsCharts";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getOperatorAlerts,
  getOperatorAuditLogs,
  getOperatorById,
  getOperatorFaceTrend,
  getOperatorMachineHealth,
  getOperatorPerformanceSeries,
  getOperatorSession,
} from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default async function OperatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const operator = getOperatorById(id);

  if (!operator) {
    notFound();
  }

  const currentSession = getOperatorSession(id);
  const recentLogs = getOperatorAuditLogs(id);
  const recentAlerts = getOperatorAlerts(id);
  const filingPerformance = getOperatorPerformanceSeries(id);
  const faceTrend = getOperatorFaceTrend(id);
  const machineHealth = getOperatorMachineHealth(id);

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost">
        <Link href="/operators">
          <ArrowLeft className="h-4 w-4" />
          Back to operators
        </Link>
      </Button>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
              <Avatar name={operator.name} seed={operator.id} size="lg" />
              <div className="min-w-0">
                <h2 className="break-words font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-slate-100">
                  {operator.name}
                </h2>
                <p className="break-words text-sm text-slate-500 dark:text-slate-400">
                  {operator.employeeCode} - {operator.machineId}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatusBadge value={operator.status} />
              <StatusBadge value={operator.riskLevel} />
              <StatusBadge value={operator.faceVerified ? "verified" : "mismatch"} />
            </div>

            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/80">
                <p className="text-slate-500 dark:text-slate-400">Location</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {operator.location}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/80">
                <p className="text-slate-500 dark:text-slate-400">Shift</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {operator.shift}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/80">
                <p className="text-slate-500 dark:text-slate-400">Current domain</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 [overflow-wrap:anywhere]">
                  {operator.currentDomain}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-900/80">
                <p className="text-slate-500 dark:text-slate-400">Last seen</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {formatDateTime(operator.lastSeen)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Successful filings"
            value={operator.successfulCases}
            change="+3 since morning"
            helperText="Completed filings under the secure browser policy today."
            tone="browser"
            icon="file-check"
          />
          <StatCard
            title="Failed filings"
            value={operator.failedCases}
            change="Watch queue"
            helperText="Attempts that require correction or resubmission."
            tone="alert"
            icon="alert-triangle"
          />
          <StatCard
            title="Blocked attempts"
            value={operator.blockedAttempts}
            change="Policy enforced"
            helperText="URL or OS actions stopped by the control stack today."
            tone="alert"
            icon="shield-ban"
          />
          <StatCard
            title="Face mismatches"
            value={operator.faceMismatchCount}
            change="Biometric review"
            helperText="Mismatch detections tied to this operator across the current cycle."
            tone="face"
            icon="webcam"
          />
        </div>
      </section>

      <OperatorDetailCharts
        filingPerformance={filingPerformance}
        faceVerificationTrend={faceTrend}
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Current Session Info</CardTitle>
          </CardHeader>
          <CardContent>
            {currentSession ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <MonitorSmartphone className="h-5 w-5 text-teal-500" />
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {currentSession.sessionId}
                  </p>
                  <StatusBadge value={currentSession.currentState} className="shrink-0" />
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex flex-col gap-1 rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-900/80 sm:flex-row sm:items-start sm:justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Active URL</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 sm:max-w-[60%] sm:text-right [overflow-wrap:anywhere]">
                      {currentSession.activeUrl}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Face status</span>
                    <StatusBadge value={currentSession.faceStatus} className="shrink-0" />
                  </div>
                  <div className="flex flex-col gap-2 rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Presence</span>
                    <StatusBadge value={currentSession.presenceStatus} className="shrink-0" />
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Lock count</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentSession.lockCount}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                No live session is currently attached to this operator.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Machine Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {machineHealth.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                    <p className="break-words text-sm text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                  <StatusBadge value={item.status} className="shrink-0" />
                </div>
                <Progress
                  value={item.value}
                  indicatorClassName={
                    item.status === "healthy"
                      ? "bg-[linear-gradient(90deg,#14b8a6,#10b981)]"
                      : item.status === "watch"
                        ? "bg-[linear-gradient(90deg,#f59e0b,#f97316)]"
                        : "bg-[linear-gradient(90deg,#ef4444,#dc2626)]"
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="break-words font-semibold text-slate-900 dark:text-slate-100">
                    {log.eventType}
                  </p>
                  <StatusBadge value={log.severity} className="shrink-0" />
                </div>
                <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {log.description}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {formatDateTime(log.timestamp)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="break-words font-semibold text-slate-900 dark:text-slate-100">
                      {alert.alertType}
                    </p>
                    <StatusBadge value={alert.status} className="shrink-0" />
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {alert.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <StatusBadge value={alert.severity} className="shrink-0" />
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {formatDateTime(alert.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                No recent alerts linked to this operator.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
