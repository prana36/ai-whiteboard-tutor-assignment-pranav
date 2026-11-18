import { AuditLogTable } from "@/components/AuditLogTable";
import { StatCard } from "@/components/StatCard";
import { auditLogs } from "@/lib/mock-data";

export default function AuditLogsPage() {
  const highSeverityLogs = auditLogs.filter((log) => ["high", "critical"].includes(log.severity)).length;
  const policyEvents = auditLogs.filter((log) => log.eventType.includes("policy")).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total log entries"
          value={auditLogs.length}
          change="Live stream"
          helperText="Hardcoded audit rows simulating workstation and operator activity."
          tone="neutral"
          icon="activity-square"
        />
        <StatCard
          title="High severity logs"
          value={highSeverityLogs}
          change="Needs review"
          helperText="Events that may require incident follow-up or supervisor notes."
          tone="alert"
          icon="alert-triangle"
        />
        <StatCard
          title="Policy sync events"
          value={policyEvents}
          change="Healthy cadence"
          helperText="OS-level control policies synced back to the workstation fleet."
          tone="os"
          icon="shield-check"
        />
        <StatCard
          title="Unique source IPs"
          value={new Set(auditLogs.map((log) => log.ipAddress)).size}
          change="Bench wide"
          helperText="Distinct internal workstation addresses in the audit stream."
          tone="browser"
          icon="webhook"
        />
      </section>

      <AuditLogTable data={auditLogs} />
    </div>
  );
}
