import React from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col w-full">
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center px-6 py-12 sm:py-16">
        <div className="typeset typeset-changelog max-w-[37em] w-full mx-auto">
          <h1>Changelog</h1>

          <h2>v1.2.0</h2>
          <p>
            <em>August 2026</em>
          </p>

          <ul>
            <li>
              <strong>Added:</strong> <code>UserDropdown</code> header component
              with live status badges, dark mode toggle, and custom avatar fallbacks.
            </li>
            <li>
              <strong>Added:</strong> <code>shadcn/typeset</code> integration for
              single-stylesheet markdown typography across platform documentation.
            </li>
            <li>
              <strong>Updated:</strong> upgraded styling setup to Tailwind v4 with
              standardized Geist typography variables (<code>--font-geist</code> and{" "}
              <code>--font-geist-mono</code>).
            </li>
            <li>
              <strong>Fixed:</strong> full strict TypeScript compatibility across all
              component interfaces.
            </li>
          </ul>

          <h3>Features & Enhancements</h3>
          <p>
            The navigation header and theme synchronization now support smooth
            transitions across light and dark modes with zero layout shift.
          </p>

          <h2>v1.1.0</h2>
          <p>
            <em>July 2026</em>
          </p>

          <ul>
            <li>
              <strong>Added:</strong> Appwrite database integration for dynamic developer
              tools collection loading.
            </li>
            <li>
              <strong>Added:</strong> instant category filtering directly from the top
              navigation menu.
            </li>
            <li>
              <strong>Improved:</strong> high-performance Open Graph image preview proxy
              for tool detail pages.
            </li>
          </ul>

          <h2>v1.0.0</h2>
          <p>
            <em>June 2026</em>
          </p>

          <ul>
            <li>
              <strong>Initial Release:</strong> launched curated directory of developer
              tools, design engineering resources, and component libraries.
            </li>
          </ul>
        </div>
      </main>

      <div className="w-full flex justify-center px-6">
        <div className="max-w-[37em] w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}