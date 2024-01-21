"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/store/ThemeProvider";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES } from "@/constants/theme";
import Image from "next/image";

function ThemeToggle() {
  const { setTheme, theme: mode } = useTheme()!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="h-auto p-0 focus:bg-light-900 data-[state-open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state-open]:bg-dark-200"
        >
          <SunIcon className="active-theme h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="active-theme absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="absolute -right-4 mt-3 min-w-28 rounded border py-2 dark:border-dark-400 dark:bg-dark-300 dark:text-light-900"
        align="end"
      >
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400"
          >
            <Image
              src={theme.icon}
              alt={theme.label}
              height={16}
              width={16}
              className={`${theme.value === mode ? "active-theme" : ""}`}
            />
            <p
              className={`body-semibold text-light-500 ${
                theme.value === mode
                  ? "text-dark100_light900 text-primary-500"
                  : ""
              }`}
            >
              {theme.label}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
