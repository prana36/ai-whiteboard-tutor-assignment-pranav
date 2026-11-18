import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  return (
    <div
      className={cn(
        "h-3 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#14b8a6)] transition-all",
          indicatorClassName
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
