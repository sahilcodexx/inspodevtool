"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LogIn } from "lucide-react";
import { avatars } from "@/lib/appwrite";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { useRouter } from "next/navigation";
import { applyTheme } from "./theme-switcher";

export function UserAuthButton() {
  const { user, loading, signOut } = useAuth();
  const [userStatus, setUserStatus] = useState("online");
  const router = useRouter();

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
    );
  }

  const handleAction = (action?: string) => {
    if (!action) return;
    switch (action) {
      case "appearance":
        const isDark = document.documentElement.classList.contains("dark");
        applyTheme(isDark ? "light" : "dark");
        break;
      case "whats-new":
        router.push("/whats-new");
        break;
      case "help":
        router.push("/help");
        break;
      case "profile":
      case "settings":
      case "switch":
        router.push("/dashboard");
        break;
      case "logout":
        if (user) {
          signOut();
        }
        router.push("/signup?mode=signin");
        break;
      default:
        break;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signup?mode=signin"
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1.5"
        >
          <LogIn className="w-3.5 h-3.5" />
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition cursor-pointer shadow-xs"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const avatarUrl =
    user.prefs?.avatar ||
    avatars.getInitials(user.name || user.email, 100, 100).toString();

  const userInitials = (user.name || user.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userData = {
    name: user.name || "User",
    username: `@${user.email ? user.email.split("@")[0] : "user"}`,
    avatar: avatarUrl,
    initials: userInitials,
    status: userStatus,
  };

  return (
    <UserDropdown
      user={userData}
      selectedStatus={userStatus}
      onStatusChange={(newStatus) => setUserStatus(newStatus)}
      onAction={handleAction}
    />
  );
}
