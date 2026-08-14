"use client";

import { useState, useEffect } from "react";

type Theme = "dark" | "light" | "system";

const OPTIONS: { id: Theme; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "system", label: "System" },
];

export function applyTheme(next: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  let isDark = false;
  if (next === "system") {
    root.removeAttribute("data-theme");
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", isDark);
  } else {
    root.setAttribute("data-theme", next);
    isDark = next === "dark";
    root.classList.toggle("dark", isDark);
  }

  try {
    localStorage.setItem("det-theme", next);
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent("det-theme-change", { detail: next }));
}

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("det-theme") as Theme | null;
      if (saved === "dark" || saved === "light" || saved === "system") {
        setCurrentTheme(saved);
        applyTheme(saved);
      } else {
        applyTheme("dark");
      }
    } catch {
      applyTheme("dark");
    }

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail) {
        setCurrentTheme(customEvent.detail);
      }
    };

    window.addEventListener("det-theme-change", handleThemeChange);
    return () => window.removeEventListener("det-theme-change", handleThemeChange);
  }, []);

  return (
    <span className="flex items-center">
      {OPTIONS.map((option, i) => (
        <span key={option.id} className="flex items-center">
          {i > 0 && <span className="text-zinc-500 dark:text-zinc-500 mx-[7px]">/</span>}
          <button
            type="button"
            onClick={() => {
              setCurrentTheme(option.id);
              applyTheme(option.id);
            }}
            className={`text-sm leading-none transition-colors duration-150 cursor-pointer ${
              currentTheme === option.id
                ? "text-zinc-900 dark:text-zinc-100 font-medium"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {option.label}
          </button>
        </span>
      ))}
    </span>
  );
}