"use client";

import { useDeferredValue, useState } from "react";
import { RefreshCcw, Search, ShieldCheck, Webcam } from "lucide-react";
import { toast } from "sonner";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { faceEnrollments } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function FaceEnrollmentPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const filteredEnrollments = faceEnrollments.filter((entry) =>
    [entry.operatorName, entry.employeeCode, entry.device]
      .join(" ")
      .toLowerCase()
      .includes(deferredSearch.toLowerCase())
  );
  const averageConfidence = (
    faceEnrollments.reduce((sum, entry) => sum + entry.confidenceScore, 0) / faceEnrollments.length
  ).toFixed(1);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Enrolled operators</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-slate-100">
              {faceEnrollments.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Average confidence</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-slate-100">
              {averageConfidence}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Devices in use</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-slate-100">
              {new Set(faceEnrollments.map((entry) => entry.device)).size}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Enrollment state</p>
            <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-emerald-600 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
              Stable
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Face Enrollment Roster</CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Search enrolled operators and trigger mocked re-enrollment actions.
            </p>
          </div>
          <div className="relative w-full md:w-[280px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
              placeholder="Search enrollments"
            />
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredEnrollments.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-4">
                <Avatar name={entry.operatorName} seed={entry.operatorId} size="lg" />
                <div className="min-w-0">
                  <h3 className="break-words font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-slate-100">
                    {entry.operatorName}
                  </h3>
                  <p className="break-words text-sm text-slate-500 dark:text-slate-400">
                    {entry.employeeCode}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 rounded-2xl bg-slate-100/80 p-4 text-sm dark:bg-slate-900/80">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Confidence</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {entry.confidenceScore}%
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Device</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 sm:max-w-[52%] sm:text-right [overflow-wrap:anywhere]">
                    {entry.device}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Enrolled</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 sm:max-w-[52%] sm:text-right">
                    {formatDateTime(entry.enrolledDate)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Last verification</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 sm:max-w-[52%] sm:text-right">
                    {formatDateTime(entry.lastVerification)}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.success(`Mock re-enrollment started for ${entry.operatorName}`)}
              >
                <RefreshCcw className="h-4 w-4" />
                Re-enroll operator
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {filteredEnrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <Webcam className="h-8 w-8 text-slate-400" />
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              No enrolled operators match this search
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try using a different operator name, employee code, or device name.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
