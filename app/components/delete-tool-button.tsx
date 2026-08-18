"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { deleteToolFromDatabase } from "@/lib/appwrite-db";

interface DeleteToolButtonProps {
  toolId: string;
  ownerId?: string;
}

export function DeleteToolButton({ toolId, ownerId }: DeleteToolButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Render only if the logged-in user is the owner of this tool
  if (!user?.$id || !ownerId || user.$id !== ownerId) {
    return null;
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteToolFromDatabase(toolId);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to delete tool:", err);
      alert("Failed to delete tool. Please try again.");
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (deleting) {
    return (
      <div className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium border border-red-500/30 bg-red-500/10 text-red-500">
        <Loader2 className="size-3.5 animate-spin" />
        <span>Deleting...</span>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
        <span className="text-xs text-red-500 font-medium hidden sm:inline mr-0.5">
          Delete site?
        </span>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all cursor-pointer"
          title="Confirm Delete"
        >
          <Check className="size-3.5" />
          <span>Confirm</span>
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex items-center justify-center size-9 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
          title="Cancel"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition cursor-pointer"
    >
      <Trash2 className="size-3.5" />
      <span>Delete</span>
    </button>
  );
}
