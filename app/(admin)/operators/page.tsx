import { OperatorTable } from "@/components/OperatorTable";
import { StatCard } from "@/components/StatCard";
import { operators } from "@/lib/mock-data";

export default function OperatorsPage() {
  const activeOperators = operators.filter((operator) => operator.status === "active").length;
  const lockedOperators = operators.filter((operator) => operator.status === "locked").length;
  const highRiskOperators = operators.filter((operator) =>
    ["high", "critical"].includes(operator.riskLevel)
  ).length;
  const faceVerifiedOperators = operators.filter((operator) => operator.faceVerified).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tracked operators"
          value={operators.length}
          change="+2 this week"
          helperText="Full operator roster connected to the RK control cloud."
          tone="neutral"
          icon="users"
        />
        <StatCard
          title="Currently active"
          value={activeOperators}
          change="+1 since last check"
          helperText="Operators with an active restricted browser session."
          tone="browser"
          icon="user-check"
        />
        <StatCard
          title="Locked workstations"
          value={lockedOperators}
          change="Requires review"
          helperText="Machines awaiting unlock or re-verification."
          tone="lock"
          icon="lock-keyhole"
        />
        <StatCard
          title="Face verified"
          value={faceVerifiedOperators}
          change="Stable coverage"
          helperText="Operators with valid biometric verification in the current cycle."
          tone="face"
          icon="shield-check"
        />
      </section>

      <OperatorTable data={operators} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-slate-100">
            Low-risk operators
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {operators.filter((operator) => operator.riskLevel === "low").length} operators are
            within healthy filing, presence, and enforcement thresholds.
          </p>
        </div>
        <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-slate-100">
            Elevated review queue
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {highRiskOperators} operators need closer supervision due to mismatches, blocks, or
            higher filing failure rates.
          </p>
        </div>
        <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-slate-100">
            Coverage snapshot
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Bench coverage spans 12 operators across 8 monitored live sessions and multiple court
            locations.
          </p>
        </div>
      </div>
    </div>
  );
}
