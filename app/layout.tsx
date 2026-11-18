import type { Metadata } from "next";

import { AppProviders } from "@/components/AppProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RK Operator Control System",
    template: "%s | RK Operator Control System",
  },
  description:
    "Modern admin dashboard for restricted filing workstations with face ID, browser control, alerts, and audit oversight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-app)] font-[family-name:var(--font-sans)] text-[var(--text-primary)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
