"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Toaster } from "sonner";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "rk-control-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("theme-dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      return nextTheme;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <Toaster
        closeButton
        richColors
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "!rounded-3xl !border !border-white/70 !bg-white/95 !text-slate-900 !shadow-[0_24px_60px_rgba(15,23,42,0.18)] dark:!border-slate-700 dark:!bg-slate-950/95 dark:!text-slate-100",
          },
        }}
      />
    </ThemeContext.Provider>
  );
}

export function useThemePreference() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemePreference must be used within AppProviders");
  }

  return context;
}
