"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X, Plus } from "lucide-react";
import { UserAuthButton } from "./user-auth-button";
import { applyTheme } from "./theme-switcher";
import { SubmitToolModal } from "./submit-tool-modal";

interface NavbarProps {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function Navbar({ categories, selectedCategory, onCategoryChange }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    syncTheme();
    window.addEventListener("det-theme-change", syncTheme);
    return () => window.removeEventListener("det-theme-change", syncTheme);
  }, []);

  const defaultCategories = [
    "All",
    "Components & UI",
    "Inspiration",
    "Icons & Assets",
    "Dev Tools",
    "Portfolios",
  ];

  const catList = categories || defaultCategories;

  return (
    <>
      <header className="w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 transition-colors duration-200">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden grid size-8 place-items-center rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="size-4" />
          </button>

          <Link
            href="/"
            className="text-xs sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5"
          >
            Design Bookmark
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {selectedCategory && onCategoryChange && (
            <select
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
              aria-label="Filter by category"
              className="max-w-[120px] sm:max-w-48 rounded-full border border-zinc-200 bg-zinc-100 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-zinc-700 outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 truncate"
            >
              {catList.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => applyTheme(isDark ? "light" : "dark")}
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="grid size-8 place-items-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 shrink-0"
          >
            {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>

          <UserAuthButton />
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#fafafa] dark:bg-[#141417] text-zinc-800 dark:text-zinc-200 h-full p-5 flex flex-col justify-between shadow-2xl z-10 border-r border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                Categories
              </div>
              <div className="space-y-1">
                {catList.map((catKey) => {
                  const isActive = selectedCategory === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => {
                        onCategoryChange?.(catKey);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left rounded-lg text-xs font-medium px-3 py-2 transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <span>{catKey === "All" ? "All Tools" : catKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSubmitModalOpen(true);
                }}
                className="w-full font-medium text-xs rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-xs"
              >
                <Plus className="size-4 text-blue-600 dark:text-blue-400" />
                <span>Submit a Tool</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <SubmitToolModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />
    </>
  );
}
