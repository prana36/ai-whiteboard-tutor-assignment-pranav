export type OperatorStatus = "active" | "idle" | "locked" | "offline";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type SessionState = "active" | "idle" | "locked" | "reverify" | "ended";

export type FaceStatus = "verified" | "mismatch" | "pending";

export type PresenceStatus = "present" | "away" | "returned";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export type AlertStatus = "open" | "investigating" | "resolved";

export interface Operator {
  id: string;
  name: string;
  employeeCode: string;
  machineId: string;
  location: string;
  status: OperatorStatus;
  faceVerified: boolean;
  currentDomain: string;
  todayFiledCases: number;
  successfulCases: number;
  failedCases: number;
  blockedAttempts: number;
  lastSeen: string;
  shift: string;
  riskLevel: RiskLevel;
  faceMatchCount: number;
  faceMismatchCount: number;
  complianceScore: number;
  deviceHealth: number;
}

export interface LiveSession {
  sessionId: string;
  operatorId: string;
  operatorName: string;
  machineId: string;
  startTime: string;
  currentState: SessionState;
  faceStatus: FaceStatus;
  activeUrl: string;
  presenceStatus: PresenceStatus;
  lockCount: number;
  successfulFilings: number;
  durationMinutes: number;
  restrictedBrowser: boolean;
  autoLockArmed: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  machineId: string;
  eventType: string;
  description: string;
  severity: SeverityLevel;
  ipAddress: string;
}

export interface AlertItem {
  id: string;
  operatorId: string;
  operatorName: string;
  machineId: string;
  alertType: string;
  message: string;
  severity: SeverityLevel;
  createdAt: string;
  status: AlertStatus;
}

export interface AllowlistDomain {
  id: string;
  domain: string;
  category: string;
  notes: string;
  addedBy: string;
  lastUpdated: string;
  status: "active" | "review";
}

export interface FaceEnrollment {
  id: string;
  operatorId: string;
  operatorName: string;
  employeeCode: string;
  enrolledDate: string;
  confidenceScore: number;
  device: string;
  lastVerification: string;
}

export interface DashboardStat {
  key: string;
  label: string;
  value: number;
  change: string;
  trend: "up" | "down" | "stable";
  tone: "face" | "browser" | "lock" | "alert" | "os" | "neutral";
  helperText: string;
}

export interface DailyFilingPoint {
  day: string;
  successful: number;
  failed: number;
  reverify: number;
}

export interface AlertTypePoint {
  type: string;
  total: number;
}

export interface OperatorActivityPoint {
  slot: string;
  activeOperators: number;
  idleOperators: number;
  lockedSessions: number;
}

export interface SessionDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface FaceVerificationPoint {
  label: string;
  matches: number;
  mismatches: number;
}

export interface FilingPerformancePoint {
  label: string;
  successful: number;
  failed: number;
}

export interface MachineHealthItem {
  label: string;
  value: number;
  status: "healthy" | "watch" | "risk";
  description: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
  tone: "face" | "browser" | "lock" | "alert" | "os";
}

export interface AnalyticsSnapshot {
  dashboardStats: DashboardStat[];
  operators: Operator[];
  liveSessions: LiveSession[];
  auditLogs: AuditLog[];
  alerts: AlertItem[];
  allowlistDomains: AllowlistDomain[];
  faceEnrollments: FaceEnrollment[];
  dailySuccessfulFilings: DailyFilingPoint[];
  alertsByType: AlertTypePoint[];
  operatorActivityTrend: OperatorActivityPoint[];
  sessionStateDistribution: SessionDistributionPoint[];
  blockedUrlAttemptTrend: FilingPerformancePoint[];
  faceVerificationTrend: FaceVerificationPoint[];
  workflowSteps: WorkflowStep[];
}
