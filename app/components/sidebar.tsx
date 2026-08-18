"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Component,
  Lightbulb,
  Palette,
  Code2,
  Briefcase,
  FolderHeart,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
} from "lucide-react";
import { SubmitToolModal } from "./submit-tool-modal";

interface SidebarProps {
  selectedCategory?: string;
  categories?: string[];
  onSelectCategory?: (category: string) => void;
}

export function SidebarNav({
  selectedCategory = "All",
  categories: categoryNames,
  onSelectCategory,
}: SidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const iconMap = [LayoutGrid, Component, Lightbulb, Palette, Code2, Briefcase];
  const categories = (
    categoryNames || [
      "All",
      "Components & UI",
      "Inspiration",
      "Icons & Assets",
      "Dev Tools",
      "Portfolios",
    ]
  ).map((key, index) => ({
    title: key === "All" ? "All Tools" : key,
    key,
    icon: iconMap[index % iconMap.length],
  }));

  const handleCategoryClick = (catKey: string) => {
    if (onSelectCategory) {
      onSelectCategory(catKey);
    } else {
      router.push(`/?category=${encodeURIComponent(catKey)}`);
    }
  };

  return (
    <>
      <aside
        className={`hidden md:flex shrink-0 flex-col border-r border-zinc-200/70 dark:border-zinc-800/80 bg-[#fafafa] dark:bg-[#171717] min-h-screen text-zinc-800 dark:text-zinc-200 select-none sticky top-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16 p-2.5" : "w-60 p-4"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center mb-6 px-1 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2.5 group overflow-hidden"
            >
              <div className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs">
                <Command className="size-3.5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition">
                  Design Bookmark
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                  v1.0.0
                </span>
              </div>
            </Link>
          )}

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Categories Group */}
        <div className="flex-1 w-full space-y-6">
          <div>
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                Categories
              </div>
            )}
            <div className="space-y-0.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                const IconComponent = cat.icon;

                return (
                  <button
                    key={cat.key}
                    type="button"
                    title={cat.title}
                    onClick={() => handleCategoryClick(cat.key)}
                    className={`w-full text-left rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2.5 ${
                      isCollapsed ? "justify-center p-2" : "px-2.5 py-2"
                    } ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-semibold"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{cat.title}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explore Group */}
          <div>
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                Explore
              </div>
            )}
            <div className="space-y-0.5">
              <Link
                href="/"
                title="Featured Collections"
                className={`w-full text-left rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 transition-all flex items-center gap-2.5 ${
                  isCollapsed ? "justify-center p-2" : "px-2.5 py-2"
                }`}
              >
                <FolderHeart className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">Featured Collections</span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Submit a Tool Pinned Bottom CTA */}
        <div className="mt-auto pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 w-full">
          <button
            type="button"
            onClick={() => setSubmitModalOpen(true)}
            title="Submit a Tool"
            className={`w-full font-medium text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-2xs ${
              isCollapsed ? "p-2.5" : "px-3 py-2"
            }`}
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            {!isCollapsed && <span>Submit a Tool</span>}
          </button>
        </div>
      </aside>

      {/* Submit Tool Modal */}
      <SubmitToolModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />
    </>
  );
}

export { SidebarNav as Sidebar };
