"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AlertItem } from "@/types";
import { formatDateTime } from "@/lib/utils";

function humanize(value: string) {
  return value
    .split(/[_-]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AlertTable({ data }: { data: AlertItem[] }) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const filteredAlerts = data.filter((alert) => {
    const matchesSearch =
      !deferredSearch ||
      [alert.operatorName, alert.machineId, alert.alertType, alert.message]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch.toLowerCase());

    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Alerts Queue</CardTitle>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Review incident severity, open investigations, and resolved control events.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative w-full md:w-[260px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
              placeholder="Search alerts"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
            className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <option value="all">All severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <option value="all">All states</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredAlerts.length === 0 ? (
          <EmptyState
            title="No alerts match the selected filters"
            description="Clear the search or adjust severity and status to bring alerts back into view."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{humanize(alert.alertType)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {alert.operatorName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{alert.machineId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[420px]">
                    <p className="line-clamp-2">{alert.message}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={alert.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={alert.status} />
                  </TableCell>
                  <TableCell>{formatDateTime(alert.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
