"use client";

import { AuthComponent } from "@/components/ui/sign-up";
import { useAuth } from "@/lib/auth-context";
import { Compass, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AppLogo = () => (
  <Link href="/" className="flex items-center justify-center p-1.5 rounded-lg bg-blue-600 text-white">
    <Compass className="h-4 w-4" />
  </Link>
);

function SignUpPageContent() {
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "signin" ? "signin" : "signup";

  const handleSignUpSubmit = async (email: string, pass: string) => {
    const defaultName = email.split("@")[0];
    await signUpWithEmail(email, pass, defaultName);
    router.push("/");
  };

  const handleSignInSubmit = async (email: string, pass: string) => {
    await signInWithEmail(email, pass);
    router.push("/");
  };

  return (
    <div className="relative w-full min-h-screen bg-zinc-950">
      {/* Top Right Exit Link */}
      <Link
        href="/"
        className="fixed top-6 right-6 z-50 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/80 transition shadow-lg cursor-pointer"
        title="Back to Home"
      >
        <X className="w-5 h-5" />
      </Link>

      <AuthComponent
        logo={<AppLogo />}
        brandName="Design Bookmark"
        mode={mode}
        onSignUpSubmit={handleSignUpSubmit}
        onSignInSubmit={handleSignInSubmit}
        onGoogleSignIn={signInWithGoogle}
      />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpPageContent />
    </Suspense>
  );
}
