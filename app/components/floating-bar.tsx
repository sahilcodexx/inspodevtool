"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sun, Moon, ArrowUp } from "lucide-react";
import { applyTheme } from "./theme-switcher";

interface FloatingBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
}

export function FloatingBar({
  searchQuery = "",
  onSearchChange,
  selectedCategory = "All",
  onCategoryChange,
  categories = ["All", "Design & UI", "Inspiration", "Portfolios", "Useful Tools"],
}: FloatingBarProps) {
  const router = useRouter();
  const [internalSearch, setInternalSearch] = useState<string>(searchQuery);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    setInternalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const checkIsDark = () => {
      const root = document.documentElement;
      const themeAttr = root.getAttribute("data-theme");
      if (themeAttr === "dark") return true;
      if (themeAttr === "light") return false;
      return root.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    setIsDark(checkIsDark());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail === "dark") {
        setIsDark(true);
      } else if (customEvent.detail === "light") {
        setIsDark(false);
      } else if (customEvent.detail === "system") {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      } else {
        setIsDark(checkIsDark());
      }
    };

    window.addEventListener("det-theme-change", handleThemeChange);
    return () => window.removeEventListener("det-theme-change", handleThemeChange);
  }, []);

  const handleSearchInput = (val: string) => {
    setInternalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !onSearchChange) {
      router.push(`/?search=${encodeURIComponent(internalSearch)}`);
    }
  };

  const handleCategorySelect = (cat: string) => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      router.push(`/?category=${encodeURIComponent(cat)}`);
    }
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#141417]/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-full px-3 py-2 flex items-center gap-2 shadow-xl z-50 transition-all max-w-[92vw] sm:max-w-md">
      {/* Lucide Search Icon */}
      <div className="flex items-center gap-2 px-2 flex-1 min-w-0">
        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          value={internalSearch}
          onChange={(e) => handleSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search tools..."
          className="bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none w-full"
        />
      </div>

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => handleCategorySelect(e.target.value)}
        className="bg-zinc-100 dark:bg-zinc-800/80 text-xs font-medium text-zinc-700 dark:text-zinc-300 rounded-full px-3 py-1.5 outline-none border border-zinc-200 dark:border-zinc-700/80 cursor-pointer hidden sm:block"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Lucide Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        type="button"
        title="Toggle Theme"
        className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-300 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex-shrink-0 cursor-pointer"
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
        )}
      </button>

      {/* Lucide Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        type="button"
        title="Scroll to Top"
        className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-300 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex-shrink-0 cursor-pointer"
      >
        <ArrowUp className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
      </button>
    </div>
  );
}
