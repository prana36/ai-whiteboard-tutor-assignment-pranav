"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

import { isAdminAuthenticated } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isAdminAuthenticated() ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200">
        <Shield className="h-4 w-4 text-violet-500" />
        Redirecting to RK control access...
      </div>
    </div>
  );
}
