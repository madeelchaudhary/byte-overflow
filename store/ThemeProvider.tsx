"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { THEMES } from "../constants/theme";

interface ThemeContextProps {
  theme: string;
  toggleTheme: (theme: keyof typeof THEMES) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);
export const useTheme = () => useContext(ThemeContext);

function getTheme() {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme");
    if (typeof storedPrefs === "string" && storedPrefs in THEMES) {
      return storedPrefs;
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
  const [theme, setTheme] = useState(getTheme);

  const toggleTheme: ThemeContextProps["toggleTheme"] = (theme) => {
    if (theme === "system") {
      localStorage.removeItem("color-theme");
    } else {
      localStorage.setItem("color-theme", theme);
    }

    setTheme(theme);
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
    for (const key of Object.keys(THEMES)) {
      document.body.classList.toggle(`${key}`, key === theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
