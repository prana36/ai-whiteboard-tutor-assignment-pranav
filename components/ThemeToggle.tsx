"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useThemePreference } from "@/components/AppProviders";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemePreference();

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className="rounded-2xl"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </Button>
  );
}
