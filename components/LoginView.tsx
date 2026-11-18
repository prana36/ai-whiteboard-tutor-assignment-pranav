"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  ScanFace,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  isAdminAuthenticated,
  storeAdminSession,
  validateAdminCredentials,
} from "@/lib/auth";

const loginHighlights = [
  {
    title: "Face ID verification",
    description: "Only validated operators can access a filing session.",
    icon: ScanFace,
    color: "text-violet-500",
  },
  {
    title: "Restricted browser",
    description:
      "Allowlisted government domains only with full activity monitoring.",
    icon: ShieldCheck,
    color: "text-teal-500",
  },
  {
    title: "Auto-lock enforcement",
    description:
      "Workstations lock instantly when the operator leaves the device.",
    icon: LockKeyhole,
    color: "text-amber-500",
  },
];

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    if (!validateAdminCredentials(email, password)) {
      setSubmitting(false);
      toast.error("Invalid admin credentials. Use the RK control admin login.");
      return;
    }

    storeAdminSession();
    toast.success("Welcome back. Redirecting to the control dashboard.");

    startTransition(() => {
      router.replace("/dashboard");
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 shadow-sm dark:border-violet-900/60 dark:bg-slate-950/70 dark:text-violet-200">
          RK Operator Control System
        </div>
        <div className="space-y-4">
          <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
            Secure filing oversight with live operator control.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Monitor restricted operator workstations, verify presence with face
            ID, enforce browser policy, auto-lock inactive machines, and review
            alerts from one premium cloud console.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {loginHighlights.map(({ title, description, icon: Icon, color }) => (
            <Card key={title}>
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-950 dark:text-slate-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b border-white/60 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(20,184,166,0.12))] p-8 dark:border-slate-800/80">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              <TriangleAlert className="h-4 w-4 text-rose-500" />
              Admin Login Required
            </div>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-white">
              Enter the cloud control panel
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              This prototype uses frontend-only login with hardcoded credentials
              for the admin dashboard flow.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@rkcontrol.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin password"
              />
            </div>
            {/* 
            <div className="rounded-[24px] border border-dashed border-slate-200/80 bg-slate-100/70 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Demo credentials</p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Email: {ADMIN_EMAIL}
                <br />
                Password: {ADMIN_PASSWORD}
              </p>
            </div> */}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Login to dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
