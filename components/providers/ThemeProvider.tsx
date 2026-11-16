"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Dark is the signature look; the light ("white") theme is one click away
 * and remembered per visitor. next-themes injects a blocking script so the
 * stored theme is applied before first paint (no flash).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="ry-theme"
      themes={["dark", "light"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
