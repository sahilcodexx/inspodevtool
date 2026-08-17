"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LogOut, LogIn, UserPlus, ChevronDown, LayoutDashboard } from "lucide-react";
import { avatars } from "@/lib/appwrite";

export function UserAuthButton() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
    );
  }

  if (user) {
    const avatarUrl =
      user.prefs?.avatar ||
      avatars.getInitials(user.name || user.email, 100, 100).toString();

    const userInitial = (user.name || user.email || "U")[0].toUpperCase();

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 p-1 pl-2 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer shadow-xs"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-700 text-white flex items-center justify-center font-semibold text-xs shrink-0">
            <img
              src={avatarUrl}
              alt={user.name || "User Profile"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-white font-bold text-xs -z-10">
              {userInitial}
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-xs text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate">
            {user.name || user.email.split("@")[0]}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1" />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
            onClick={() => setMenuOpen(false)}
          >
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-700 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                <img
                  src={avatarUrl}
                  alt={user.name || "User Profile"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {user.name || "User"}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium">
              <LayoutDashboard className="w-3.5 h-3.5" /> My tools
            </Link>

            <button
              onClick={() => signOut()}
              className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition cursor-pointer font-medium mt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/signup?mode=signin"
        className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1.5"
      >
        <LogIn className="w-3.5 h-3.5" />
        Sign In
      </Link>

      <Link
        href="/signup?mode=signup"
        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition cursor-pointer shadow-xs flex items-center gap-1.5"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Sign Up
      </Link>
    </div>
  );
}
