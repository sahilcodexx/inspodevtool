"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setError("Appwrite did not return OAuth session credentials.");
      return;
    }

    let cancelled = false;
    void account
      .createSession(userId, secret)
      .then(async () => {
        await checkUser();
        if (!cancelled) router.replace("/");
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to complete sign in.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [checkUser, router, searchParams]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-zinc-100">
        <div>
          <p className="mb-4 text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => router.replace("/signup?mode=signin")}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900"
          >
            Return to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-400">
      Completing sign in…
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-400">Completing sign in…</main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
