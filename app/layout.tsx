import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Scribblewise — Learn it by seeing it",
    template: "%s | Scribblewise",
  },
  description: "A curious, AI-powered visual tutor that teaches ideas through synchronized whiteboard sketches and voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-app)] font-[family-name:var(--font-sans)] text-[var(--text-primary)]">{children}</body>
    </html>
  );
}
