import { AlertTable } from "@/components/AlertTable";
import { StatCard } from "@/components/StatCard";
import { alerts } from "@/lib/mock-data";

export default function AlertsPage() {
  const openAlerts = alerts.filter((alert) => alert.status === "open").length;
  const investigatingAlerts = alerts.filter((alert) => alert.status === "investigating").length;
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical").length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total alerts"
          value={alerts.length}
          change="+3 in last hour"
          helperText="All generated incidents for the control center today."
          tone="alert"
          icon="alert-triangle"
        />
        <StatCard
          title="Open alerts"
          value={openAlerts}
          change="Immediate action"
          helperText="Alerts waiting for ownership or direct intervention."
          tone="alert"
          icon="alert-circle"
        />
        <StatCard
          title="Investigating"
          value={investigatingAlerts}
          change="Supervisor review"
          helperText="Incidents currently being examined or revalidated."
          tone="lock"
          icon="eye"
        />
        <StatCard
          title="Critical alerts"
          value={criticalAlerts}
          change="Escalated"
          helperText="Policy breach or enforcement failures requiring immediate response."
          tone="alert"
          icon="shield-ban"
        />
      </section>

      <AlertTable data={alerts} />
    </div>
  );
}
