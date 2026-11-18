"use client";

import { startTransition, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search, Shield } from "lucide-react";
import { toast } from "sonner";

import { LogoutSection } from "@/components/LogoutSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { alerts } from "@/lib/mock-data";

interface TopbarProps {
  onOpenSidebar: () => void;
}

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/operators/")) {
    return {
      title: "Operator Detail",
      description: "Deep view of filing health, live session state, and recent control signals.",
    };
  }

  const map: Record<string, { title: string; description: string }> = {
    "/dashboard": {
      title: "Control Overview",
      description: "Real-time compliance, filing throughput, and active workstation monitoring.",
    },
    "/operators": {
      title: "Operators",
      description: "Operator roster, live status, risk posture, and daily filing performance.",
    },
    "/sessions": {
      title: "Live Sessions",
      description: "Secure browser sessions, presence state, and re-verification flow.",
    },
    "/audit-logs": {
      title: "Audit Logs",
      description: "Time-sequenced workstation and operator events for compliance review.",
    },
    "/alerts": {
      title: "Alerts Center",
      description: "High-signal incidents requiring supervisor attention and resolution tracking.",
    },
    "/allowlist": {
      title: "Allowlist Config",
      description: "Approved domains available inside the restricted browser environment.",
    },
    "/face-enrollment": {
      title: "Face Enrollment",
      description: "Biometric enrollment health and device confidence across operators.",
    },
  };

  return (
    map[pathname] ?? {
      title: "RK Control",
      description: "Secure admin dashboard for operator workstation control.",
    }
  );
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const pageMeta = getPageMeta(pathname);
  const openAlerts = alerts.filter((alert) => alert.status !== "resolved").length;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();

    if (!query) {
      return;
    }

    startTransition(() => {
      router.push(`/operators?search=${encodeURIComponent(query)}`);
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 py-4 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/70 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="lg:hidden"
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              <Shield className="h-4 w-4" />
              Cloud Admin Dashboard
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950 dark:text-white">
              {pageMeta.title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {pageMeta.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center xl:justify-end">
          <form onSubmit={handleSubmit} className="relative w-full md:w-[320px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
              placeholder="Search operators, machines, domains"
            />
          </form>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="relative"
              onClick={() => toast.info(`${openAlerts} active alerts are waiting for review.`)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            </Button>
            <ThemeToggle />
            <LogoutSection variant="compact" />
          </div>
        </div>
      </div>
    </header>
  );
}
