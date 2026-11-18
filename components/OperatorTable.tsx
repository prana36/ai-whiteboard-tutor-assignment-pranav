"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Operator } from "@/types";
import { formatDateTime } from "@/lib/utils";

export function OperatorTable({ data }: { data: Operator[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const filteredOperators = data.filter((operator) => {
    const matchesSearch =
      !deferredSearch ||
      [operator.name, operator.employeeCode, operator.machineId, operator.currentDomain]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch.toLowerCase());

    const matchesStatus = statusFilter === "all" || operator.status === statusFilter;
    const matchesRisk = riskFilter === "all" || operator.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Operator Command Board</CardTitle>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Search by operator, employee code, workstation, or active domain.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative w-full md:w-[280px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
              placeholder="Search operators"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="locked">Locked</option>
            <option value="offline">Offline</option>
          </select>
          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <option value="all">All risks</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredOperators.length === 0 ? (
          <EmptyState
            title="No operators match the current filters"
            description="Try removing one of the status or risk filters, or search using a machine ID."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current domain</TableHead>
                <TableHead>Cases today</TableHead>
                <TableHead>Blocked attempts</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperators.map((operator) => (
                <TableRow key={operator.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={operator.name} seed={operator.id} />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {operator.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {operator.employeeCode} - {operator.machineId}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={operator.status} />
                  </TableCell>
                  <TableCell className="max-w-[220px] [overflow-wrap:anywhere]">
                    {operator.currentDomain}
                  </TableCell>
                  <TableCell>
                    {operator.successfulCases}/{operator.todayFiledCases}
                  </TableCell>
                  <TableCell>{operator.blockedAttempts}</TableCell>
                  <TableCell>
                    <StatusBadge value={operator.riskLevel} />
                  </TableCell>
                  <TableCell>{formatDateTime(operator.lastSeen)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/operators/${operator.id}`}>
                        Open
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
