import { SessionCard } from "@/components/SessionCard";
import { StatCard } from "@/components/StatCard";
import { liveSessions } from "@/lib/mock-data";

export default function SessionsPage() {
  const activeCount = liveSessions.filter((session) => session.currentState === "active").length;
  const lockedCount = liveSessions.filter((session) => session.currentState === "locked").length;
  const reverifyCount = liveSessions.filter((session) => session.currentState === "reverify").length;
  const totalLocks = liveSessions.reduce((sum, session) => sum + session.lockCount, 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Live sessions"
          value={liveSessions.length}
          change="+1 vs last hour"
          helperText="Workstations currently reporting to the cloud dashboard."
          tone="browser"
          icon="activity"
        />
        <StatCard
          title="Active session state"
          value={activeCount}
          change="Secure browser live"
          helperText="Operators actively working in the restricted browser."
          tone="browser"
          icon="shield-check"
        />
        <StatCard
          title="Locked sessions"
          value={lockedCount}
          change="Needs unlock"
          helperText="Sessions paused by absence detection or mismatch events."
          tone="lock"
          icon="lock-keyhole"
        />
        <StatCard
          title="Re-verification queue"
          value={reverifyCount}
          change="Awaiting operator"
          helperText="Returned operators that still need a fresh face scan."
          tone="face"
          icon="timer-reset"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 xl:grid-cols-2">
          {liveSessions.map((session) => (
            <SessionCard key={session.sessionId} session={session} />
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-slate-100">
              Session control notes
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              All sessions run under restricted browser policy with presence-aware auto-lock. A
              total of {totalLocks} auto-lock or manual lock actions have been recorded today.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-slate-100">
              Secure browser health
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              All 8 sessions report restricted browser mode enabled, cloud sync online, and
              workstation policy heartbeat active.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
