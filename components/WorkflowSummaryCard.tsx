import { ArrowRight, Lock, MonitorCog, ScanFace, ShieldAlert, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { workflowSteps } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap = {
  face: ScanFace,
  browser: MonitorCog,
  os: ShieldCheck,
  lock: Lock,
  alert: ShieldAlert,
};

const toneMap = {
  face: "from-violet-500/15 to-fuchsia-500/10 text-violet-700 dark:text-violet-200",
  browser: "from-teal-500/15 to-emerald-500/10 text-teal-700 dark:text-teal-200",
  os: "from-slate-500/15 to-slate-700/10 text-slate-700 dark:text-slate-200",
  lock: "from-amber-500/15 to-orange-500/10 text-amber-700 dark:text-amber-200",
  alert: "from-rose-500/15 to-red-500/10 text-rose-700 dark:text-rose-200",
};

export function WorkflowSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Summary</CardTitle>
        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
          Face Scan {"->"} Restricted Browser {"->"} Active Work {"->"} Auto Lock {"->"} Re-verify
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-5">
        {workflowSteps.map((step, index) => {
          const Icon = iconMap[step.tone];

          return (
            <div key={step.title} className="flex items-center gap-3 lg:flex-col lg:items-start">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ring-1 ring-white/70 dark:ring-slate-700/70",
                  toneMap[step.tone]
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-950 dark:text-slate-100">
                    {step.title}
                  </h3>
                  {index < workflowSteps.length - 1 ? (
                    <ArrowRight className="hidden h-4 w-4 text-slate-400 lg:block" />
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
