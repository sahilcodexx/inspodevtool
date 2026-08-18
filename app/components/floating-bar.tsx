"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUp } from "lucide-react";

interface FloatingBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function FloatingBar({
  searchQuery = "",
  onSearchChange,
}: FloatingBarProps) {
  const router = useRouter();
  const [internalSearch, setInternalSearch] = useState<string>(searchQuery);

  useEffect(() => {
    setInternalSearch(searchQuery);
  }, [searchQuery]);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl backdrop-saturate-150 border border-white/60 dark:border-zinc-800/60 rounded-full px-3.5 py-2 sm:py-2.5 flex items-center gap-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] ring-1 ring-black/5 dark:ring-white/10 z-50 transition-all duration-300 max-w-[90vw] w-full sm:w-[380px] hover:bg-white/80 dark:hover:bg-zinc-900/60">
      {/* Lucide Search Icon */}
      <div className="flex items-center gap-2.5 px-1 flex-1 min-w-0">
        <Search className="w-4.5 h-4.5 text-zinc-400 dark:text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          value={internalSearch}
          onChange={(e) => handleSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search tools..."
          className="bg-transparent text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 outline-none w-full"
        />
      </div>

      {/* Lucide Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        type="button"
        title="Scroll to Top"
        className="w-[34px] h-[34px] rounded-full bg-white/50 dark:bg-zinc-800/60 border border-white/80 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 flex items-center justify-center hover:bg-white/90 dark:hover:bg-zinc-700/80 transition flex-shrink-0 cursor-pointer shadow-xs active:scale-95"
      >
        <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700 dark:text-zinc-200" />
      </button>
    </div>
  );
}
