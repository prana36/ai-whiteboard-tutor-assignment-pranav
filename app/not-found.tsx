import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-xl">
        <CardContent className="flex flex-col items-center gap-5 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
            <SearchX className="h-7 w-7" />
          </div>
          <div className="space-y-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-white">
              Page not found
            </h1>
            <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
              The requested RK control view could not be located. Head back to the dashboard and
              continue from there.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
