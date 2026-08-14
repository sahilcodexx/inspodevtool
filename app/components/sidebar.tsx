"use client";

import * as React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

interface SidebarProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function SidebarNav({ selectedCategory = "All", onSelectCategory }: SidebarProps) {
  const categories = [
    { title: "All Tools", key: "All" },
    { title: "Components & UI", key: "Components & UI" },
    { title: "Inspiration", key: "Inspiration" },
    { title: "Icons & Assets", key: "Icons & Assets" },
    { title: "Dev Tools", key: "Dev Tools" },
    { title: "Portfolios", key: "Portfolios" },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-zinc-200/80 dark:border-zinc-800/80 bg-[#fbfbfd] dark:bg-[#0c0c0e] min-h-screen text-zinc-800 dark:text-zinc-200 select-none p-4 sticky top-0 h-screen overflow-y-auto transition-colors duration-200">
      {/* Sidebar Header matching sidebar-04 */}
      <div className="px-2 py-2 mb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
            <Compass className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition">
              Design Bookmark
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">v1.0.0</span>
          </div>
        </Link>
      </div>

      {/* Main Content Nav Groups - high contrast light & dark mode */}
      <div className="flex-1 space-y-6">
        {/* Categories Group */}
        <div>
          <div className="px-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2.5">
            Categories
          </div>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(cat.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer block ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Resources Group */}
        <div>
          <div className="px-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2.5">
            Explore
          </div>
          <div className="space-y-1">
            <a
              href="#"
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-all block"
            >
              Featured Collections
            </a>
            <a
              href="#"
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-all block"
            >
              Submit a Tool
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

export { SidebarNav as Sidebar };
