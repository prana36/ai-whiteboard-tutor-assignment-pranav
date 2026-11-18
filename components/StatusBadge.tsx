import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  value: string;
  className?: string;
}

const statusMap: Record<
  string,
  {
    variant: "default" | "secondary" | "success" | "warning" | "danger";
    dot: string;
    label?: string;
  }
> = {
  active: { variant: "success", dot: "bg-emerald-500" },
  idle: { variant: "secondary", dot: "bg-slate-400" },
  locked: { variant: "warning", dot: "bg-amber-500" },
  offline: { variant: "secondary", dot: "bg-slate-500" },
  verified: { variant: "default", dot: "bg-violet-500" },
  mismatch: { variant: "danger", dot: "bg-rose-500" },
  pending: { variant: "warning", dot: "bg-amber-500" },
  present: { variant: "success", dot: "bg-emerald-500" },
  away: { variant: "warning", dot: "bg-amber-500" },
  returned: { variant: "default", dot: "bg-violet-500" },
  low: { variant: "success", dot: "bg-emerald-500" },
  medium: { variant: "warning", dot: "bg-amber-500" },
  high: { variant: "danger", dot: "bg-rose-500" },
  critical: { variant: "danger", dot: "bg-rose-600" },
  open: { variant: "danger", dot: "bg-rose-500" },
  investigating: { variant: "warning", dot: "bg-amber-500" },
  resolved: { variant: "success", dot: "bg-emerald-500" },
  review: { variant: "warning", dot: "bg-amber-500" },
};

function humanizeValue(value: string) {
  return value
    .split(/[_-]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function StatusBadge({ value, className }: StatusBadgeProps) {
  const key = value.toLowerCase();
  const config = statusMap[key] ?? { variant: "secondary" as const, dot: "bg-slate-400" };

  return (
    <Badge variant={config.variant} className={cn("gap-2", className)}>
      <span className={cn("h-2 w-2 rounded-full", config.dot)} />
      {config.label ?? humanizeValue(value)}
    </Badge>
  );
}
