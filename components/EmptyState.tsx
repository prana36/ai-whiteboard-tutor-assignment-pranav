import { Inbox } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <Inbox className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
