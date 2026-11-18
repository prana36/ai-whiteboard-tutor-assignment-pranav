# RK Operator Control System

A responsive admin dashboard prototype for overseeing secure e-filing workstations. It brings operator status, restricted-browser sessions, policy allowlists, face-verification records, audit activity, and operational alerts into one control-center interface.

> **Project status:** This repository demonstrates the frontend experience using local, hardcoded sample data. It does not connect to a production API, perform real face recognition, or enforce workstation/browser policies.

## Project overview

The dashboard models a secure filing workflow for distributed operator workstations. Supervisors can review activity and identify issues across the operator fleet, including locked sessions, face mismatches, blocked navigation, device health, and filing outcomes.

The interface is built around a shared admin shell with navigation, responsive layouts, status indicators, summary cards, charts, searchable records, and light/dark themes. The app uses realistic sample records to make the screens and workflows explorable without a backend service.

## Features

- **Operations dashboard** — fleet and workflow summary cards, filing performance, alert categories, operator activity, and session-state charts.
- **Operator directory and detail** — operator and workstation status, compliance and device-health indicators, filing metrics, and operator-specific charts.
- **Session monitoring** — active, idle, locked, and re-verification states, face status, restricted-browser indicators, session duration, and lock counts.
- **Alert review** — incident severity and status summaries alongside an alert table.
- **Audit trail** — sample workstation and policy events with severity, timestamps, and source details.
- **Domain allowlist** — searchable domain policy records, categories, status, update details, and notes.
- **Face-enrollment roster** — searchable enrollment records with confidence, device, enrollment date, and last verification.
- **Admin login flow** — a client-side demo login and protected dashboard navigation for demonstrating the experience.
- **Responsive UI and theme toggle** — sidebar navigation adapts to smaller screens, with light and dark themes.
- **Reusable interface components** — shared cards, tables, badges, skeleton/loading states, navigation, and data visualizations.

## Application sections

| Route | Purpose |
| --- | --- |
| `/login` | Demo administrator sign-in |
| `/dashboard` | Operational overview and analytics |
| `/operators` | Operator directory |
| `/operators/[id]` | Individual operator profile and activity |
| `/sessions` | Session and workstation monitoring |
| `/alerts` | Alert and incident review |
| `/audit-logs` | Audit event history |
| `/allowlist` | Restricted-browser domain policy view |
| `/face-enrollment` | Face-enrollment roster view |

## Technology

- **Next.js 16** with the App Router
- **React 19** and **TypeScript**
- **Tailwind CSS 4** for styling
- **Recharts** for dashboard visualizations
- **Lucide React** for icons
- **Framer Motion** for interface motion
- **Radix UI Slot**, `class-variance-authority`, `clsx`, and `tailwind-merge` for reusable UI primitives and class composition
- **Sonner** for toast feedback

## Run locally

### Requirements

- Node.js compatible with the installed Next.js version
- npm

### Install and start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The root route redirects to the login screen unless a demo session is already stored. Demo credentials are prefilled in the form and defined in `lib/auth.ts`.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Demo behavior and implementation notes

- Dashboard content is sourced from `lib/mock-data.ts`; records and analytics are local sample data, not live operational telemetry.
- The sign-in flow is implemented in the browser in `lib/auth.ts`. It stores a demo session in browser storage and is **not production authentication**. There is no server-side authorization or identity provider.
- Allowlist add/edit/delete and face re-enrollment controls show prototype feedback; they do not persist changes or trigger real policy or biometric operations.
- Face enrollment and verification are represented as sample records and workflow states. No camera capture or biometric matching is performed.
- Real workstation monitoring, restricted-browser enforcement, OS policy sync, persistence, and alert delivery would require backend services and managed endpoint integrations.
- No environment variables are required to run the current frontend prototype. Keep any local `.env.local` values private; environment files are excluded from Git.

## Repository structure

```text
app/
  (admin)/             Admin dashboard routes
  (auth)/login/        Login route
  globals.css          Global styles and theme tokens
  layout.tsx           Root layout and metadata
components/            Shared dashboard, table, chart, and UI components
lib/
  auth.ts               Demo client-side session helpers
  mock-data.ts          Sample operators, sessions, alerts, and analytics
  utils.ts              Shared formatting and class utilities
types/index.ts          Shared TypeScript data models
```

## Engineering highlights

- Organized the product into route-level screens with a consistent shared admin shell.
- Defined reusable TypeScript models for the dashboard's operator, session, alert, audit, enrollment, and analytics data.
- Built reusable visual components so status and summary patterns stay consistent across sections.
- Added responsive navigation and layouts for desktop and mobile-sized screens.
- Used mock records to demonstrate operational states—including normal, idle, locked, and re-verification flows—without implying that a production control plane is connected.

---

Built as a portfolio/assignment project to demonstrate a secure-workstation operations dashboard UI.
