"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { UserAuthButton } from "./user-auth-button";
import { applyTheme } from "./theme-switcher";

interface NavbarProps {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function Navbar({ categories, selectedCategory, onCategoryChange }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    syncTheme();
    window.addEventListener("det-theme-change", syncTheme);
    return () => window.removeEventListener("det-theme-change", syncTheme);
  }, []);

  return (
    <header className="w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5"
        >
          Design Bookmark
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {categories && selectedCategory && onCategoryChange && (
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            aria-label="Filter by category"
            className="hidden max-w-48 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-400 sm:block dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        )}
        <button
          type="button"
          onClick={() => applyTheme(isDark ? "light" : "dark")}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="grid size-8 place-items-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </button>
        <UserAuthButton />
      </div>
    </header>
  );
}
