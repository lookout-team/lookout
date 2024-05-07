"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (isDarkMode) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class">{children}</NextThemesProvider>
    </NextUIProvider>
  );
}
