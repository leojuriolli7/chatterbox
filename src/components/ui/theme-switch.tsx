"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-neutral-500 hover:text-black hover:bg-neutral-100 dark:hover:text-white dark:hover:bg-neutral-600">
        <Sun className="h-6 w-6 shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-black dark:group-hover:text-white" />
        <Moon className="absolute h-6 w-6 shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-black dark:group-hover:text-white" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
