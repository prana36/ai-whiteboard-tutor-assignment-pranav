"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AuditLog } from "@/types";
import { formatDateTime } from "@/lib/utils";

function humanize(value: string) {
  return value
    .split(/[_-]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuditLogTable({ data }: { data: AuditLog[] }) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const filteredLogs = data.filter((log) => {
    const matchesSearch =
      !deferredSearch ||
      [log.operatorName, log.machineId, log.eventType, log.description, log.ipAddress]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch.toLowerCase());

    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Audit Log Stream</CardTitle>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Every workstation event, verification change, and policy action is captured here.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative w-full md:w-[260px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
              placeholder="Search audit logs"
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
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredLogs.length === 0 ? (
          <EmptyState
            title="No audit logs match the current query"
            description="Try searching for a different operator, event type, or IP address."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {log.operatorName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{log.machineId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{humanize(log.eventType)}</TableCell>
                  <TableCell className="max-w-[420px]">
                    <p className="line-clamp-2">{log.description}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={log.severity} />
                  </TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
