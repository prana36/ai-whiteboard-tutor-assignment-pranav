"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AlertTypePoint,
  DailyFilingPoint,
  FaceVerificationPoint,
  FilingPerformancePoint,
  OperatorActivityPoint,
  SessionDistributionPoint,
} from "@/types";

const tooltipStyle = {
  borderRadius: 20,
  border: "1px solid rgba(148, 163, 184, 0.2)",
  background: "rgba(15, 23, 42, 0.92)",
  color: "#f8fafc",
};

export function DashboardCharts({
  dailySuccessfulFilings,
  alertsByType,
  operatorActivityTrend,
  sessionStateDistribution,
}: {
  dailySuccessfulFilings: DailyFilingPoint[];
  alertsByType: AlertTypePoint[];
  operatorActivityTrend: OperatorActivityPoint[];
  sessionStateDistribution: SessionDistributionPoint[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Daily Successful Filings</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySuccessfulFilings}>
              <defs>
                <linearGradient id="filingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area
                type="monotone"
                dataKey="successful"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#filingsGradient)"
                name="Successful"
              />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerts by Type</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alertsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
              <XAxis dataKey="type" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="total" radius={[12, 12, 0, 0]} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operator Activity Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={operatorActivityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
              <XAxis dataKey="slot" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeOperators"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Active"
              />
              <Line type="monotone" dataKey="idleOperators" stroke="#64748b" strokeWidth={2} name="Idle" />
              <Line type="monotone" dataKey="lockedSessions" stroke="#f59e0b" strokeWidth={2} name="Locked" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session State Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sessionStateDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={110}
                paddingAngle={4}
              >
                {sessionStateDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function OperatorDetailCharts({
  filingPerformance,
  faceVerificationTrend,
}: {
  filingPerformance: FilingPerformancePoint[];
  faceVerificationTrend: FaceVerificationPoint[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Filing Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filingPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="successful" fill="#14b8a6" radius={[10, 10, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Face Verification Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={faceVerificationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="matches" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="mismatches" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
