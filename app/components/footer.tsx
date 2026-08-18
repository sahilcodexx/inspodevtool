import React from "react";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pb-12 pt-[56px] border-t border-zinc-200/60 dark:border-zinc-800/60 mt-12">
      <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-4 text-sm">
        <span>© 2026</span>
        <span className="flex items-center gap-2">
          Created by
          <a
            href="https://x.com/sahilcodex"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[9px] font-semibold leading-none">
              SC
            </span>
            <span className="underline underline-offset-2">sahilcodex</span>
          </a>
        </span>
      </p>
      <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 text-sm">
        <span className="select-none">Theme:</span>
        <ThemeSwitcher />
      </p>
    </footer>
  );
}