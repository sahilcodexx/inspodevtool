"use client";

import { useState } from "react";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#16161a] p-5 sm:p-6 rounded-[20px] border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
          The weekly drop
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
          The best new tools, every week. No spam, unsubscribe anytime.
        </p>
      </div>

      {submitted ? (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-medium text-center">
          ✓ You&apos;re subscribed! Check your inbox soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="w-full px-4 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-sm rounded-full transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
