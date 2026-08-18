"use client";

import React, { useState } from "react";
import { UserDropdown } from "@/components/ui/user-dropdown";
import DemoOne from "@/components/ui/demo";

export default function DemoPage() {
  const [selectedStatus, setSelectedStatus] = useState("online");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const customUser = {
    name: "Ayman Echakar",
    username: "@aymanch-03",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    initials: "AE",
    status: selectedStatus,
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-8 gap-8">
      <div className="text-center max-w-md space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">User Dropdown Component Demo</h1>
        <p className="text-zinc-400 text-sm">
          Interactive preview of the rich user dropdown component with sub-menus, badges, and dark/light theme support.
        </p>
      </div>

      <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400">Default Demo Component:</span>
          <DemoOne />
        </div>

        <div className="w-full border-t border-zinc-800 my-2" />

        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400">Controlled Interactive Component:</span>
          <UserDropdown
            user={customUser}
            selectedStatus={selectedStatus}
            onStatusChange={(status) => setSelectedStatus(status)}
            onAction={(action) => setLastAction(action || "none")}
          />
        </div>

        {lastAction && (
          <p className="text-xs text-amber-400 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-800/40">
            Last triggered action: <span className="font-semibold">{lastAction}</span>
          </p>
        )}
      </div>
    </main>
  );
}
