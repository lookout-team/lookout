"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useMediaQuery } from "@react-hook/media-query";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

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
