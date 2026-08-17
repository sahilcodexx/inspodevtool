"use client";

import React from "react";
import { UserAuthButton } from "./user-auth-button";

export function Navbar() {
  return (
    <header className="w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Design Bookmark
        </span>
      </div>

      <div className="flex items-center gap-4">
        <UserAuthButton />
      </div>
    </header>
  );
}
