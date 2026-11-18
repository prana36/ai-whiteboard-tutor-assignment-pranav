"use client";

import { useDeferredValue, useState } from "react";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allowlistDomains } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function AllowlistPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredDomains = allowlistDomains.filter((domain) =>
    [domain.domain, domain.category, domain.notes].join(" ").toLowerCase().includes(deferredSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Allowlisted domains</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-slate-100">
              {allowlistDomains.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Internal domains</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-slate-100">
              {allowlistDomains.filter((domain) => domain.domain.includes("rkcontrol")).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Review queue</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-950 dark:text-slate-100">
              {allowlistDomains.filter((domain) => domain.status === "review").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Policy owner</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-950 dark:text-slate-100">
              Control Admin
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Allowlist Configuration</CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Mock-only controls for secure filing domains in the restricted browser.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:w-[280px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-11"
                placeholder="Search domains"
              />
            </div>
            <Button onClick={() => toast.info("Add domain is mocked for this prototype build.")}>
              <Plus className="h-4 w-4" />
              Add domain
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDomains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="max-w-[260px] font-semibold text-slate-900 dark:text-slate-100 [overflow-wrap:anywhere]">
                    {domain.domain}
                  </TableCell>
                  <TableCell>{domain.category}</TableCell>
                  <TableCell>
                    <StatusBadge value={domain.status} />
                  </TableCell>
                  <TableCell>{formatDateTime(domain.lastUpdated)}</TableCell>
                  <TableCell className="max-w-[320px] break-words">{domain.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info(`Edit is mocked for ${domain.domain}`)}
                      >
                        <SquarePen className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.warning(`Delete is mocked for ${domain.domain}`)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredDomains.map((domain) => (
          <Card key={`${domain.id}-card`}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-950 dark:text-slate-100 [overflow-wrap:anywhere]">
                    {domain.domain}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{domain.category}</p>
                </div>
                <StatusBadge value={domain.status} className="shrink-0" />
              </div>
              <p className="break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                {domain.notes}
              </p>
              <div className="rounded-2xl bg-slate-100/80 p-4 text-sm dark:bg-slate-900/80">
                <p className="text-slate-500 dark:text-slate-400">Updated by</p>
                <p className="mt-1 break-words font-semibold text-slate-900 dark:text-slate-100">
                  {domain.addedBy}
                </p>
                <p className="mt-2 break-words text-slate-500 dark:text-slate-400">
                  {formatDateTime(domain.lastUpdated)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
