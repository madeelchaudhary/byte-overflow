"use client";
import { createContext, useState, useContext, useEffect } from "react";

import { THEMES } from "../constants/theme";

type Theme = (typeof THEMES)[number]["value"];
interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);
export const useTheme = () => useContext(ThemeContext);

function getTheme() {
  const themes = THEMES.map((theme) => theme.value);

  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme");
    if (
      typeof storedPrefs === "string" &&
      themes.includes(storedPrefs as any)
    ) {
      return storedPrefs as Theme;
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches) {
      return "dark";
    }
  }

  // If you want to use light theme as the default, return "light" instead
  return "dark";
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getTheme);

  const setMode: ThemeContextProps["setTheme"] = (theme) => {
    localStorage.setItem("color-theme", theme);

    setTheme(theme);
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
    const themes = THEMES.map((theme) => theme.value);
    for (const key of themes) {
      document.body.classList.toggle(`${key}`, key === theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
