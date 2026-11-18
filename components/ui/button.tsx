"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-white shadow-[0_18px_40px_rgba(91,33,182,0.25)] hover:-translate-y-0.5 hover:shadow-[0_24px_44px_rgba(91,33,182,0.32)]",
        secondary:
          "bg-white/70 text-slate-900 shadow-sm ring-1 ring-slate-200/70 hover:bg-white dark:bg-slate-900/70 dark:text-slate-100 dark:ring-slate-800",
        outline:
          "border border-slate-200/80 bg-transparent text-slate-700 hover:bg-white/70 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/60",
        ghost:
          "bg-transparent text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-900/60",
        destructive:
          "bg-[linear-gradient(135deg,#ef4444,#b91c1c)] text-white shadow-[0_18px_40px_rgba(239,68,68,0.24)] hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-12 rounded-2xl px-6",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
