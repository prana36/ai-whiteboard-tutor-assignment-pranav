import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-violet-200 bg-violet-100/80 text-violet-700 dark:border-violet-900 dark:bg-violet-950/70 dark:text-violet-200",
        secondary:
          "border-slate-200 bg-slate-100/90 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200",
        success:
          "border-emerald-200 bg-emerald-100/90 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200",
        warning:
          "border-amber-200 bg-amber-100/90 text-amber-700 dark:border-amber-900 dark:bg-amber-950/70 dark:text-amber-200",
        danger:
          "border-rose-200 bg-rose-100/90 text-rose-700 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
