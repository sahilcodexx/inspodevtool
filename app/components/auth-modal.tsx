"use client";

import React from "react";
import { AuthComponent } from "@/components/ui/sign-up";
import { useAuth } from "@/lib/auth-context";
import { X, Compass } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

const AppLogo = () => (
  <div className="flex items-center justify-center p-1.5 rounded-lg bg-blue-600 text-white">
    <Compass className="h-4 w-4" />
  </div>
);

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSignUpSubmit = async (email: string, pass: string) => {
    const name = email.split("@")[0];
    await signUpWithEmail(email, pass, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-[620px] max-h-[92vh] bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800/80 flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition cursor-pointer border border-zinc-700/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* easemize/sign-up Auth Component */}
        <div className="w-full h-full flex flex-col">
          <AuthComponent
            logo={<AppLogo />}
            brandName="Design Bookmark"
            onSignUpSubmit={handleSignUpSubmit}
            onGoogleSignIn={signInWithGoogle}
          />
        </div>
      </div>
    </div>
  );
}
