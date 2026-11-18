import type {
  AlertItem,
  AllowlistDomain,
  AnalyticsSnapshot,
  AuditLog,
  DailyFilingPoint,
  DashboardStat,
  FaceEnrollment,
  FaceVerificationPoint,
  FilingPerformancePoint,
  LiveSession,
  MachineHealthItem,
  Operator,
  OperatorActivityPoint,
  SessionDistributionPoint,
  WorkflowStep,
} from "@/types";

const baseTime = new Date("2026-04-07T12:18:00+05:30").getTime();

function isoMinutesAgo(minutes: number) {
  return new Date(baseTime - minutes * 60 * 1000).toISOString();
}

export const allowlistDomains: AllowlistDomain[] = [
  {
    id: "allow-001",
    domain: "efiling.ecourts.gov.in",
    category: "Primary Filing",
    notes: "Core filing endpoint for civil and criminal submissions.",
    addedBy: "Policy Engine",
    lastUpdated: "2026-04-07T08:10:00+05:30",
    status: "active",
  },
  {
    id: "allow-002",
    domain: "auth.ecourts.gov.in",
    category: "Authentication",
    notes: "Identity validation and token exchange.",
    addedBy: "Policy Engine",
    lastUpdated: "2026-04-07T08:12:00+05:30",
    status: "active",
  },
  {
    id: "allow-003",
    domain: "uploads.ecourts.gov.in",
    category: "Document Uploads",
    notes: "Secure evidence and annexure uploads.",
    addedBy: "Control Admin",
    lastUpdated: "2026-04-06T18:30:00+05:30",
    status: "active",
  },
  {
    id: "allow-004",
    domain: "assets.ecourts.gov.in",
    category: "Static Assets",
    notes: "Required scripts and assets for e-filing pages.",
    addedBy: "Control Admin",
    lastUpdated: "2026-04-06T18:44:00+05:30",
    status: "active",
  },
  {
    id: "allow-005",
    domain: "internal.rkcontrol.local",
    category: "Internal Portal",
    notes: "Operational dashboards and machine sync services.",
    addedBy: "Control Admin",
    lastUpdated: "2026-04-05T12:50:00+05:30",
    status: "active",
  },
  {
    id: "allow-006",
    domain: "api.rkcontrol.local",
    category: "Internal API",
    notes: "Policy, heartbeat, and alert sync endpoints.",
    addedBy: "Control Admin",
    lastUpdated: "2026-04-05T13:05:00+05:30",
    status: "active",
  },
  {
    id: "allow-007",
    domain: "search.ecourts.gov.in",
    category: "Case Search",
    notes: "Reference search for filing validation.",
    addedBy: "Policy Engine",
    lastUpdated: "2026-04-04T15:22:00+05:30",
    status: "active",
  },
  {
    id: "allow-008",
    domain: "payments.ecourts.gov.in",
    category: "Payments",
    notes: "Court fee and e-stamp confirmation workflow.",
    addedBy: "Policy Engine",
    lastUpdated: "2026-04-04T15:30:00+05:30",
    status: "review",
  },
  {
    id: "allow-009",
    domain: "docs.ecourts.gov.in",
    category: "Reference Docs",
    notes: "Procedural circulars and filing documentation.",
    addedBy: "Control Admin",
    lastUpdated: "2026-04-03T10:42:00+05:30",
    status: "active",
  },
  {
    id: "allow-010",
    domain: "static.ecourts.gov.in",
    category: "Fallback Static",
    notes: "Static fallback content for government assets.",
    addedBy: "Policy Engine",
    lastUpdated: "2026-04-03T11:08:00+05:30",
    status: "active",
  },
];

export const operators: Operator[] = [
  {
    id: "op-001",
    name: "Ananya Rao",
    employeeCode: "RK-OP-001",
    machineId: "RK-WS-17",
    location: "Bengaluru Bench A",
    status: "active",
    faceVerified: true,
    currentDomain: "efiling.ecourts.gov.in",
    todayFiledCases: 21,
    successfulCases: 19,
    failedCases: 2,
    blockedAttempts: 1,
    lastSeen: "2026-04-07T11:42:00+05:30",
    shift: "Morning",
    riskLevel: "low",
    faceMatchCount: 31,
    faceMismatchCount: 1,
    complianceScore: 98,
    deviceHealth: 96,
  },
  {
    id: "op-002",
    name: "Vivek Sharma",
    employeeCode: "RK-OP-002",
    machineId: "RK-WS-21",
    location: "Pune Bench C",
    status: "active",
    faceVerified: true,
    currentDomain: "uploads.ecourts.gov.in",
    todayFiledCases: 20,
    successfulCases: 17,
    failedCases: 3,
    blockedAttempts: 3,
    lastSeen: "2026-04-07T11:39:00+05:30",
    shift: "Morning",
    riskLevel: "medium",
    faceMatchCount: 28,
    faceMismatchCount: 2,
    complianceScore: 93,
    deviceHealth: 90,
  },
  {
    id: "op-003",
    name: "Priya Nair",
    employeeCode: "RK-OP-003",
    machineId: "RK-WS-05",
    location: "Chennai Bench B",
    status: "idle",
    faceVerified: true,
    currentDomain: "auth.ecourts.gov.in",
    todayFiledCases: 16,
    successfulCases: 14,
    failedCases: 2,
    blockedAttempts: 2,
    lastSeen: "2026-04-07T11:18:00+05:30",
    shift: "Morning",
    riskLevel: "medium",
    faceMatchCount: 23,
    faceMismatchCount: 1,
    complianceScore: 91,
    deviceHealth: 88,
  },
  {
    id: "op-004",
    name: "Rahul Verma",
    employeeCode: "RK-OP-004",
    machineId: "RK-WS-11",
    location: "Nagpur Bench A",
    status: "locked",
    faceVerified: false,
    currentDomain: "system://lock-screen",
    todayFiledCases: 11,
    successfulCases: 8,
    failedCases: 3,
    blockedAttempts: 4,
    lastSeen: "2026-04-07T10:56:00+05:30",
    shift: "General",
    riskLevel: "high",
    faceMatchCount: 17,
    faceMismatchCount: 3,
    complianceScore: 82,
    deviceHealth: 78,
  },
  {
    id: "op-005",
    name: "Sneha Kulkarni",
    employeeCode: "RK-OP-005",
    machineId: "RK-WS-08",
    location: "Mumbai Bench D",
    status: "active",
    faceVerified: true,
    currentDomain: "efiling.ecourts.gov.in",
    todayFiledCases: 16,
    successfulCases: 15,
    failedCases: 1,
    blockedAttempts: 1,
    lastSeen: "2026-04-07T11:47:00+05:30",
    shift: "Morning",
    riskLevel: "low",
    faceMatchCount: 26,
    faceMismatchCount: 0,
    complianceScore: 97,
    deviceHealth: 95,
  },
  {
    id: "op-006",
    name: "Arjun Singh",
    employeeCode: "RK-OP-006",
    machineId: "RK-WS-03",
    location: "Jaipur Bench C",
    status: "idle",
    faceVerified: true,
    currentDomain: "search.ecourts.gov.in",
    todayFiledCases: 13,
    successfulCases: 11,
    failedCases: 2,
    blockedAttempts: 2,
    lastSeen: "2026-04-07T11:04:00+05:30",
    shift: "General",
    riskLevel: "medium",
    faceMatchCount: 21,
    faceMismatchCount: 1,
    complianceScore: 89,
    deviceHealth: 85,
  },
  {
    id: "op-007",
    name: "Meera Joshi",
    employeeCode: "RK-OP-007",
    machineId: "RK-WS-14",
    location: "Hyderabad Bench B",
    status: "active",
    faceVerified: true,
    currentDomain: "uploads.ecourts.gov.in",
    todayFiledCases: 19,
    successfulCases: 18,
    failedCases: 1,
    blockedAttempts: 0,
    lastSeen: "2026-04-07T11:44:00+05:30",
    shift: "Morning",
    riskLevel: "low",
    faceMatchCount: 30,
    faceMismatchCount: 1,
    complianceScore: 96,
    deviceHealth: 94,
  },
  {
    id: "op-008",
    name: "Kiran Patel",
    employeeCode: "RK-OP-008",
    machineId: "RK-WS-10",
    location: "Ahmedabad Bench A",
    status: "locked",
    faceVerified: false,
    currentDomain: "system://lock-screen",
    todayFiledCases: 12,
    successfulCases: 9,
    failedCases: 3,
    blockedAttempts: 5,
    lastSeen: "2026-04-07T10:40:00+05:30",
    shift: "General",
    riskLevel: "critical",
    faceMatchCount: 16,
    faceMismatchCount: 3,
    complianceScore: 76,
    deviceHealth: 72,
  },
  {
    id: "op-009",
    name: "Neha Gupta",
    employeeCode: "RK-OP-009",
    machineId: "RK-WS-26",
    location: "Delhi Bench C",
    status: "offline",
    faceVerified: false,
    currentDomain: "-",
    todayFiledCases: 6,
    successfulCases: 5,
    failedCases: 1,
    blockedAttempts: 1,
    lastSeen: "2026-04-07T09:28:00+05:30",
    shift: "Morning",
    riskLevel: "medium",
    faceMatchCount: 11,
    faceMismatchCount: 0,
    complianceScore: 88,
    deviceHealth: 74,
  },
  {
    id: "op-010",
    name: "Aditya Menon",
    employeeCode: "RK-OP-010",
    machineId: "RK-WS-19",
    location: "Kochi Bench A",
    status: "active",
    faceVerified: true,
    currentDomain: "payments.ecourts.gov.in",
    todayFiledCases: 18,
    successfulCases: 16,
    failedCases: 2,
    blockedAttempts: 2,
    lastSeen: "2026-04-07T11:36:00+05:30",
    shift: "Morning",
    riskLevel: "low",
    faceMatchCount: 24,
    faceMismatchCount: 1,
    complianceScore: 94,
    deviceHealth: 92,
  },
  {
    id: "op-011",
    name: "Kavya Iyer",
    employeeCode: "RK-OP-011",
    machineId: "RK-WS-16",
    location: "Bengaluru Bench C",
    status: "active",
    faceVerified: true,
    currentDomain: "efiling.ecourts.gov.in",
    todayFiledCases: 22,
    successfulCases: 20,
    failedCases: 2,
    blockedAttempts: 1,
    lastSeen: "2026-04-07T11:48:00+05:30",
    shift: "Morning",
    riskLevel: "low",
    faceMatchCount: 32,
    faceMismatchCount: 0,
    complianceScore: 99,
    deviceHealth: 97,
  },
  {
    id: "op-012",
    name: "Sameer Khan",
    employeeCode: "RK-OP-012",
    machineId: "RK-WS-04",
    location: "Lucknow Bench B",
    status: "offline",
    faceVerified: false,
    currentDomain: "-",
    todayFiledCases: 8,
    successfulCases: 6,
    failedCases: 2,
    blockedAttempts: 3,
    lastSeen: "2026-04-07T08:54:00+05:30",
    shift: "General",
    riskLevel: "high",
    faceMatchCount: 13,
    faceMismatchCount: 2,
    complianceScore: 79,
    deviceHealth: 71,
  },
];

export const liveSessions: LiveSession[] = [
  {
    sessionId: "SES-1001",
    operatorId: "op-001",
    operatorName: "Ananya Rao",
    machineId: "RK-WS-17",
    startTime: "2026-04-07T08:58:00+05:30",
    currentState: "active",
    faceStatus: "verified",
    activeUrl: "efiling.ecourts.gov.in/case/create",
    presenceStatus: "present",
    lockCount: 0,
    successfulFilings: 19,
    durationMinutes: 168,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
  {
    sessionId: "SES-1002",
    operatorId: "op-002",
    operatorName: "Vivek Sharma",
    machineId: "RK-WS-21",
    startTime: "2026-04-07T09:05:00+05:30",
    currentState: "active",
    faceStatus: "verified",
    activeUrl: "uploads.ecourts.gov.in/evidence",
    presenceStatus: "present",
    lockCount: 1,
    successfulFilings: 17,
    durationMinutes: 161,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
  {
    sessionId: "SES-1003",
    operatorId: "op-003",
    operatorName: "Priya Nair",
    machineId: "RK-WS-05",
    startTime: "2026-04-07T08:44:00+05:30",
    currentState: "idle",
    faceStatus: "verified",
    activeUrl: "auth.ecourts.gov.in/session/validate",
    presenceStatus: "away",
    lockCount: 0,
    successfulFilings: 14,
    durationMinutes: 179,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
  {
    sessionId: "SES-1004",
    operatorId: "op-004",
    operatorName: "Rahul Verma",
    machineId: "RK-WS-11",
    startTime: "2026-04-07T09:12:00+05:30",
    currentState: "locked",
    faceStatus: "mismatch",
    activeUrl: "system://lock-screen",
    presenceStatus: "away",
    lockCount: 2,
    successfulFilings: 8,
    durationMinutes: 152,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
  {
    sessionId: "SES-1005",
    operatorId: "op-005",
    operatorName: "Sneha Kulkarni",
    machineId: "RK-WS-08",
    startTime: "2026-04-07T08:52:00+05:30",
    currentState: "active",
    faceStatus: "verified",
    activeUrl: "efiling.ecourts.gov.in/draft/preview",
    presenceStatus: "present",
    lockCount: 0,
    successfulFilings: 15,
    durationMinutes: 171,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
  {
    sessionId: "SES-1006",
    operatorId: "op-007",
    operatorName: "Meera Joshi",
    machineId: "RK-WS-14",
    startTime: "2026-04-07T09:18:00+05:30",
    currentState: "reverify",
    faceStatus: "pending",
    activeUrl: "uploads.ecourts.gov.in/pending",
    presenceStatus: "returned",
    lockCount: 1,
    successfulFilings: 18,
    durationMinutes: 146,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
  {
    sessionId: "SES-1007",
    operatorId: "op-010",
    operatorName: "Aditya Menon",
    machineId: "RK-WS-19",
    startTime: "2026-04-07T09:00:00+05:30",
    currentState: "active",
    faceStatus: "verified",
    activeUrl: "payments.ecourts.gov.in/receipt",
    presenceStatus: "present",
    lockCount: 0,
    successfulFilings: 16,
    durationMinutes: 166,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
  {
    sessionId: "SES-1008",
    operatorId: "op-008",
    operatorName: "Kiran Patel",
    machineId: "RK-WS-10",
    startTime: "2026-04-07T08:41:00+05:30",
    currentState: "locked",
    faceStatus: "mismatch",
    activeUrl: "system://lock-screen",
    presenceStatus: "away",
    lockCount: 3,
    successfulFilings: 9,
    durationMinutes: 183,
    restrictedBrowser: true,
    autoLockArmed: true,
  },
];

const blockedDomains = [
  "youtube.com",
  "mail.google.com",
  "drive.google.com",
  "web.whatsapp.com",
  "facebook.com",
  "chat.openai.com",
];

const auditTemplates = [
  {
    eventType: "session_started",
    severity: "low" as const,
    description: (operator: Operator) =>
      `Restricted browser session initiated on ${operator.machineId}.`,
  },
  {
    eventType: "face_verified",
    severity: "low" as const,
    description: (operator: Operator, index: number) =>
      `Face ID verification passed at ${97 + (index % 3)}% confidence for ${operator.name}.`,
  },
  {
    eventType: "filing_submitted",
    severity: "low" as const,
    description: (operator: Operator, index: number) =>
      `Filing batch FC-${3200 + index} submitted successfully to ${operator.currentDomain === "-" ? "efiling.ecourts.gov.in" : operator.currentDomain}.`,
  },
  {
    eventType: "domain_blocked",
    severity: "medium" as const,
    description: (_operator: Operator, index: number) =>
      `Navigation to ${blockedDomains[index % blockedDomains.length]} blocked by allowlist policy.`,
  },
  {
    eventType: "auto_lock",
    severity: "medium" as const,
    description: () => "Auto-lock triggered after 90 seconds of operator absence.",
  },
  {
    eventType: "face_mismatch",
    severity: "high" as const,
    description: (operator: Operator) =>
      `Face mismatch detected during live session on ${operator.machineId}; re-verification required.`,
  },
  {
    eventType: "policy_sync",
    severity: "low" as const,
    description: () => "OS-level enforcement policy synced from cloud admin control.",
  },
  {
    eventType: "browser_launched",
    severity: "low" as const,
    description: () => "Restricted browser launched in secure kiosk mode.",
  },
  {
    eventType: "usb_blocked",
    severity: "medium" as const,
    description: () => "External storage mount attempt blocked by workstation policy.",
  },
  {
    eventType: "session_reverified",
    severity: "medium" as const,
    description: (operator: Operator) =>
      `${operator.name} successfully re-verified after auto-lock recovery.`,
  },
];

export const auditLogs: AuditLog[] = Array.from({ length: 50 }, (_, index) => {
  const operator = operators[index % operators.length];
  const template = auditTemplates[index % auditTemplates.length];

  return {
    id: `AUD-${(index + 1).toString().padStart(3, "0")}`,
    timestamp: isoMinutesAgo(index * 7 + 3),
    operatorId: operator.id,
    operatorName: operator.name,
    machineId: operator.machineId,
    eventType: template.eventType,
    description: template.description(operator, index),
    severity: template.severity,
    ipAddress: `10.16.32.${24 + (index % 40)}`,
  };
});

const alertTemplates = [
  {
    alertType: "blocked_url",
    severity: "medium" as const,
    status: "open" as const,
    message: (operator: Operator, index: number) =>
      `${operator.name} attempted ${blockedDomains[index % blockedDomains.length]} outside the secure allowlist.`,
  },
  {
    alertType: "face_mismatch",
    severity: "high" as const,
    status: "investigating" as const,
    message: (operator: Operator) =>
      `Face mismatch persisted for ${operator.name}; workstation remains locked for manual review.`,
  },
  {
    alertType: "extended_absence",
    severity: "medium" as const,
    status: "resolved" as const,
    message: (operator: Operator) =>
      `${operator.name} exceeded idle threshold and auto-lock sequence completed.`,
  },
  {
    alertType: "policy_breach",
    severity: "critical" as const,
    status: "open" as const,
    message: (operator: Operator) =>
      `OS-level control service was interrupted on ${operator.machineId}; enforcement recovered but requires validation.`,
  },
  {
    alertType: "camera_unavailable",
    severity: "high" as const,
    status: "investigating" as const,
    message: (operator: Operator) =>
      `Face capture device reported intermittent camera feed for ${operator.name}.`,
  },
  {
    alertType: "high_failure_rate",
    severity: "medium" as const,
    status: "resolved" as const,
    message: (operator: Operator) =>
      `${operator.name} crossed the filing failure threshold; supervisor note added to queue.`,
  },
];

export const alerts: AlertItem[] = Array.from({ length: 20 }, (_, index) => {
  const operator = operators[(index * 2) % operators.length];
  const template = alertTemplates[index % alertTemplates.length];

  return {
    id: `ALR-${(index + 1).toString().padStart(3, "0")}`,
    operatorId: operator.id,
    operatorName: operator.name,
    machineId: operator.machineId,
    alertType: template.alertType,
    message: template.message(operator, index),
    severity: template.severity,
    createdAt: isoMinutesAgo(index * 19 + 8),
    status: template.status,
  };
});

export const faceEnrollments: FaceEnrollment[] = [
  {
    id: "face-001",
    operatorId: "op-001",
    operatorName: "Ananya Rao",
    employeeCode: "RK-OP-001",
    enrolledDate: "2026-03-28T10:15:00+05:30",
    confidenceScore: 99.1,
    device: "Intel RealSense Cam 2",
    lastVerification: "2026-04-07T11:42:00+05:30",
  },
  {
    id: "face-002",
    operatorId: "op-002",
    operatorName: "Vivek Sharma",
    employeeCode: "RK-OP-002",
    enrolledDate: "2026-03-29T09:42:00+05:30",
    confidenceScore: 98.4,
    device: "Logitech SecureCam",
    lastVerification: "2026-04-07T11:39:00+05:30",
  },
  {
    id: "face-003",
    operatorId: "op-005",
    operatorName: "Sneha Kulkarni",
    employeeCode: "RK-OP-005",
    enrolledDate: "2026-03-31T15:12:00+05:30",
    confidenceScore: 99.3,
    device: "Intel RealSense Cam 2",
    lastVerification: "2026-04-07T11:47:00+05:30",
  },
  {
    id: "face-004",
    operatorId: "op-007",
    operatorName: "Meera Joshi",
    employeeCode: "RK-OP-007",
    enrolledDate: "2026-04-01T14:18:00+05:30",
    confidenceScore: 97.9,
    device: "Dell Secure Vision",
    lastVerification: "2026-04-07T11:44:00+05:30",
  },
  {
    id: "face-005",
    operatorId: "op-010",
    operatorName: "Aditya Menon",
    employeeCode: "RK-OP-010",
    enrolledDate: "2026-04-02T11:06:00+05:30",
    confidenceScore: 98.7,
    device: "Logitech SecureCam",
    lastVerification: "2026-04-07T11:36:00+05:30",
  },
  {
    id: "face-006",
    operatorId: "op-011",
    operatorName: "Kavya Iyer",
    employeeCode: "RK-OP-011",
    enrolledDate: "2026-04-02T16:22:00+05:30",
    confidenceScore: 99.5,
    device: "Intel RealSense Cam 2",
    lastVerification: "2026-04-07T11:48:00+05:30",
  },
];

export const dailySuccessfulFilings: DailyFilingPoint[] = [
  { day: "Apr 1", successful: 118, failed: 10, reverify: 5 },
  { day: "Apr 2", successful: 124, failed: 9, reverify: 4 },
  { day: "Apr 3", successful: 127, failed: 8, reverify: 5 },
  { day: "Apr 4", successful: 131, failed: 11, reverify: 6 },
  { day: "Apr 5", successful: 129, failed: 9, reverify: 5 },
  { day: "Apr 6", successful: 136, failed: 7, reverify: 4 },
  { day: "Apr 7", successful: 158, failed: 24, reverify: 7 },
];

export const alertsByType = [
  { type: "Blocked URL", total: 8 },
  { type: "Face Mismatch", total: 4 },
  { type: "Extended Absence", total: 3 },
  { type: "Policy Breach", total: 2 },
  { type: "Camera Issue", total: 2 },
  { type: "High Failure", total: 1 },
];

export const operatorActivityTrend: OperatorActivityPoint[] = [
  { slot: "08:00", activeOperators: 3, idleOperators: 0, lockedSessions: 0 },
  { slot: "09:00", activeOperators: 7, idleOperators: 1, lockedSessions: 0 },
  { slot: "10:00", activeOperators: 8, idleOperators: 1, lockedSessions: 1 },
  { slot: "11:00", activeOperators: 6, idleOperators: 2, lockedSessions: 2 },
  { slot: "12:00", activeOperators: 5, idleOperators: 2, lockedSessions: 2 },
  { slot: "13:00", activeOperators: 7, idleOperators: 1, lockedSessions: 1 },
  { slot: "14:00", activeOperators: 6, idleOperators: 1, lockedSessions: 1 },
];

export const sessionStateDistribution: SessionDistributionPoint[] = [
  { name: "Active", value: 4, color: "#14b8a6" },
  { name: "Idle", value: 1, color: "#64748b" },
  { name: "Locked", value: 2, color: "#f59e0b" },
  { name: "Re-verify", value: 1, color: "#7c3aed" },
];

export const blockedUrlAttemptTrend: FilingPerformancePoint[] = [
  { label: "Apr 1", successful: 6, failed: 1 },
  { label: "Apr 2", successful: 4, failed: 2 },
  { label: "Apr 3", successful: 5, failed: 1 },
  { label: "Apr 4", successful: 7, failed: 3 },
  { label: "Apr 5", successful: 6, failed: 2 },
  { label: "Apr 6", successful: 4, failed: 1 },
  { label: "Apr 7", successful: 8, failed: 2 },
];

export const faceVerificationTrend: FaceVerificationPoint[] = [
  { label: "Apr 1", matches: 128, mismatches: 4 },
  { label: "Apr 2", matches: 132, mismatches: 3 },
  { label: "Apr 3", matches: 134, mismatches: 5 },
  { label: "Apr 4", matches: 129, mismatches: 4 },
  { label: "Apr 5", matches: 138, mismatches: 3 },
  { label: "Apr 6", matches: 142, mismatches: 2 },
  { label: "Apr 7", matches: 156, mismatches: 6 },
];

export const workflowSteps: WorkflowStep[] = [
  {
    title: "Face Scan",
    description: "Biometric presence check verifies the assigned operator before secure access begins.",
    tone: "face",
  },
  {
    title: "Restricted Browser",
    description: "A hardened browser session opens with only allowlisted e-filing domains enabled.",
    tone: "browser",
  },
  {
    title: "Active Work",
    description: "Filing actions, URL usage, and workstation activity are monitored in real time.",
    tone: "os",
  },
  {
    title: "Auto Lock",
    description: "The machine locks if the operator leaves, camera feed drops, or presence confidence falls.",
    tone: "lock",
  },
  {
    title: "Re-verify",
    description: "Return-to-work requires a fresh face match before filing access resumes.",
    tone: "alert",
  },
];

export const dashboardStats: DashboardStat[] = [
  {
    key: "totalOperators",
    label: "Total operators",
    value: operators.length,
    change: "+2 this week",
    trend: "up",
    tone: "neutral",
    helperText: "Assigned and tracked across all benches.",
  },
  {
    key: "activeSessions",
    label: "Active sessions",
    value: liveSessions.length,
    change: "+1 vs last hour",
    trend: "up",
    tone: "browser",
    helperText: "Live secure browser sessions currently monitored.",
  },
  {
    key: "lockedSessions",
    label: "Locked sessions",
    value: liveSessions.filter((session) => session.currentState === "locked").length,
    change: "Needs review",
    trend: "down",
    tone: "lock",
    helperText: "Operator workstations awaiting unlock or re-verification.",
  },
  {
    key: "totalAlertsToday",
    label: "Total alerts today",
    value: alerts.length,
    change: "+3 in last hour",
    trend: "up",
    tone: "alert",
    helperText: "All active and resolved security alerts for the day.",
  },
  {
    key: "blockedUrlAttempts",
    label: "Blocked URL attempts",
    value: operators.reduce((sum, operator) => sum + operator.blockedAttempts, 0),
    change: "-12% vs yesterday",
    trend: "down",
    tone: "alert",
    helperText: "Attempts stopped by the secure domain allowlist.",
  },
  {
    key: "faceMismatches",
    label: "Face mismatches",
    value: operators.reduce((sum, operator) => sum + operator.faceMismatchCount, 0),
    change: "+2 new cases",
    trend: "up",
    tone: "face",
    helperText: "Detected mismatches across all monitored workstations.",
  },
  {
    key: "successfulFilingsToday",
    label: "Successful filings today",
    value: operators.reduce((sum, operator) => sum + operator.successfulCases, 0),
    change: "+14 vs yesterday",
    trend: "up",
    tone: "browser",
    helperText: "Completed filing actions recorded across the operator fleet.",
  },
  {
    key: "filingSuccessRate",
    label: "Filing success rate",
    value: Number(
      (
        (operators.reduce((sum, operator) => sum + operator.successfulCases, 0) /
          operators.reduce((sum, operator) => sum + operator.todayFiledCases, 0)) *
        100
      ).toFixed(1)
    ),
    change: "+1.8% vs weekly avg",
    trend: "up",
    tone: "os",
    helperText: "Stable completion rate across all active shifts.",
  },
];

export const operatorLeaderboard = [...operators]
  .sort((left, right) => right.successfulCases - left.successfulCases)
  .slice(0, 6)
  .map((operator) => ({
    name: operator.name,
    successfulCases: operator.successfulCases,
    blockedAttempts: operator.blockedAttempts,
  }));

export const analyticsSnapshot: AnalyticsSnapshot = {
  dashboardStats,
  operators,
  liveSessions,
  auditLogs,
  alerts,
  allowlistDomains,
  faceEnrollments,
  dailySuccessfulFilings,
  alertsByType,
  operatorActivityTrend,
  sessionStateDistribution,
  blockedUrlAttemptTrend,
  faceVerificationTrend,
  workflowSteps,
};

export const analyticsDataJson = JSON.stringify(analyticsSnapshot, null, 2);

export function getOperatorById(id: string) {
  return operators.find((operator) => operator.id === id);
}

export function getOperatorSession(id: string) {
  return liveSessions.find((session) => session.operatorId === id);
}

export function getOperatorAuditLogs(id: string) {
  return auditLogs.filter((log) => log.operatorId === id).slice(0, 8);
}

export function getOperatorAlerts(id: string) {
  return alerts.filter((alert) => alert.operatorId === id).slice(0, 5);
}

function numericSeed(id: string) {
  return Number(id.replace(/\D/g, "")) || 1;
}

export function getOperatorPerformanceSeries(id: string): FilingPerformancePoint[] {
  const seed = numericSeed(id);
  const base = [2, 3, 4, 5, 4, 6, 7];

  return ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"].map(
    (label, index) => ({
      label,
      successful: base[index] + (seed % 4),
      failed: index % 3 === 0 ? 1 : seed % 2,
    })
  );
}

export function getOperatorFaceTrend(id: string): FaceVerificationPoint[] {
  const seed = numericSeed(id);

  return ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 6", "Apr 7"].map(
    (label, index) => ({
      label,
      matches: 18 + index + (seed % 5),
      mismatches: index % 4 === 0 ? 1 : seed % 2,
    })
  );
}

export function getOperatorMachineHealth(id: string): MachineHealthItem[] {
  const operator = getOperatorById(id);
  const health = operator?.deviceHealth ?? 82;
  const compliance = operator?.complianceScore ?? 84;

  return [
    {
      label: "Camera Sensor",
      value: Math.min(100, health + 2),
      status: health > 88 ? "healthy" : health > 76 ? "watch" : "risk",
      description: "Real-time face capture availability and frame quality.",
    },
    {
      label: "Restricted Browser",
      value: Math.min(100, compliance + 1),
      status: compliance > 90 ? "healthy" : compliance > 78 ? "watch" : "risk",
      description: "Secure browser policy package and certificate state.",
    },
    {
      label: "OS Enforcement",
      value: compliance,
      status: compliance > 90 ? "healthy" : compliance > 78 ? "watch" : "risk",
      description: "Kiosk lock, policy service, and tamper resistance health.",
    },
    {
      label: "Network Heartbeat",
      value: Math.max(68, health - 4),
      status: health > 86 ? "healthy" : health > 74 ? "watch" : "risk",
      description: "Cloud sync latency and device heartbeat freshness.",
    },
  ];
}
