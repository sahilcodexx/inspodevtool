"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 py-12 text-zinc-100">
      <Card className="w-full max-w-sm border-zinc-800/80 bg-zinc-950/80 py-8 text-center shadow-2xl shadow-black/20">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-zinc-800 bg-zinc-900">
          <LoaderCircle className="size-5 animate-spin text-zinc-300" />
        </div>
        <CardHeader className="px-8">
          <CardTitle className="text-base">Completing sign in</CardTitle>
          <CardDescription>One moment while we connect your account.</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 py-12 text-zinc-100"><Card className="w-full max-w-sm border-zinc-800/80 bg-zinc-950/80 py-8 text-center shadow-2xl shadow-black/20"><div className="mx-auto grid size-12 place-items-center rounded-2xl border border-zinc-800 bg-zinc-900"><LoaderCircle className="size-5 animate-spin text-zinc-300" /></div><CardHeader className="px-8"><CardTitle className="text-base">Completing sign in</CardTitle><CardDescription>One moment while we connect your account.</CardDescription></CardHeader></Card></main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
