import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string) {
  const now = Date.now();
  const target = new Date(value).getTime();
  const diffMinutes = Math.round((target - now) / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getAvatarTone(seed: string) {
  const palettes = [
    "from-violet-500 via-fuchsia-500 to-pink-500",
    "from-cyan-500 via-sky-500 to-indigo-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-rose-500",
    "from-slate-500 via-zinc-500 to-slate-700",
  ];

  const total = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palettes[total % palettes.length];
}
