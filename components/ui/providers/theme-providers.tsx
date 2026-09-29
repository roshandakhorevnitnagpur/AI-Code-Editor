"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (nextTheme: Theme) => {
      const resolved = nextTheme === "system" ? (media.matches ? "dark" : "light") : nextTheme;
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.style.colorScheme = resolved;
      setResolvedTheme(resolved);
    };
    const storedTheme = window.localStorage.getItem("theme") as Theme | null;
    const initialTheme = storedTheme ?? "system";
    // This state mirrors a browser preference after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const onSystemThemeChange = () => {
      if ((window.localStorage.getItem("theme") ?? "system") === "system") applyTheme("system");
    };
    media.addEventListener("change", onSystemThemeChange);
    return () => media.removeEventListener("change", onSystemThemeChange);
  }, []);

  const updateTheme = React.useCallback((nextTheme: Theme) => {
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
    const resolved = nextTheme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : nextTheme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
    setResolvedTheme(resolved);
  }, []);

  const value = React.useMemo(() => ({ theme, setTheme: updateTheme, resolvedTheme }), [theme, updateTheme, resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => React.useContext(ThemeContext);
