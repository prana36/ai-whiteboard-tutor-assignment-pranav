import { DashboardCharts } from "@/components/AnalyticsCharts";
import { SessionCard } from "@/components/SessionCard";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { WorkflowSummaryCard } from "@/components/WorkflowSummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  alerts,
  analyticsDataJson,
  auditLogs,
  dailySuccessfulFilings,
  dashboardStats,
  liveSessions,
  operatorActivityTrend,
  operatorLeaderboard,
  sessionStateDistribution,
  alertsByType,
} from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

const iconMap = {
  totalOperators: "users",
  activeSessions: "shield-check",
  lockedSessions: "lock-keyhole",
  totalAlertsToday: "alert-triangle",
  blockedUrlAttempts: "shield-ban",
  faceMismatches: "webcam",
  successfulFilingsToday: "file-check",
  filingSuccessRate: "shield-check",
} as const;

export default function DashboardPage() {
  const recentAlerts = alerts.slice(0, 5);
  const recentLogs = auditLogs.slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const icon = iconMap[stat.key as keyof typeof iconMap] ?? "shield-check";

          return (
            <StatCard
              key={stat.key}
              title={stat.label}
              value={stat.value}
              change={stat.change}
              helperText={stat.helperText}
              tone={stat.tone}
              icon={icon}
              percent={stat.key === "filingSuccessRate"}
            />
          );
        })}
      </section>

      <DashboardCharts
        dailySuccessfulFilings={dailySuccessfulFilings}
        alertsByType={alertsByType}
        operatorActivityTrend={operatorActivityTrend}
        sessionStateDistribution={sessionStateDistribution}
      />

      <WorkflowSummaryCard />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Live Session Spotlight</CardTitle>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              High-visibility sessions with presence and face verification updates.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {liveSessions.slice(0, 4).map((session) => (
              <SessionCard key={session.sessionId} session={session} />
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Filing Operators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {operatorLeaderboard.map((operator, index) => (
                <div
                  key={operator.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-900/80"
                >
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-slate-900 dark:text-slate-100">
                      #{index + 1} {operator.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {operator.blockedAttempts} blocked attempts today
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950 dark:text-slate-100">
                      {operator.successfulCases}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      successful
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priority Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-slate-900 dark:text-slate-100">
                        {alert.operatorName}
                      </p>
                      <p className="mt-1 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {alert.message}
                      </p>
                    </div>
                    <StatusBadge value={alert.severity} className="shrink-0" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                    <span className="break-words">{alert.machineId}</span>
                    <span>{formatDateTime(alert.createdAt)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Recent workstation actions and compliance events from the audit stream.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex gap-4 rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800"
              >
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-500" />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {log.operatorName}
                    </p>
                    <StatusBadge value={log.severity} />
                  </div>
                  <p className="break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {log.description}
                  </p>
                  <p className="break-words text-xs uppercase tracking-[0.18em] text-slate-400">
                    {formatDateTime(log.timestamp)} - {log.machineId}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Raw Analytics JSON</CardTitle>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Full hardcoded analytics snapshot used by this prototype dashboard.
            </p>
          </CardHeader>
          <CardContent>
            <details className="group rounded-[24px] border border-slate-200/70 bg-slate-100/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                Expand analytics JSON
              </summary>
              <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                {analyticsDataJson}
              </pre>
            </details>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
