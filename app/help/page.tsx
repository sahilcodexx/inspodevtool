import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 flex flex-col w-full">
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center px-6 py-10 sm:py-14">
        <div className="typeset typeset-changelog max-w-[37em] w-full mx-auto">
          <div className="mb-6 not-prose">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>

          <h1>Help &amp; Documentation</h1>
          <p>
            Welcome to the <strong>Design Bookmark</strong> support center. Below you
            will find developer portfolio details, social handles, and answers to common
            platform questions.
          </p>

          <h2>Connect &amp; Developer Handles</h2>
          <p>
            This platform is curated and maintained by <strong>Sahil Singh</strong> (
            <em>@sahilcodex</em>). Connect via any of the handles below:
          </p>

          <ul>
            <li>
              <strong>Portfolio:</strong>{" "}
              <a
                href="https://sahilcodex.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                sahilcodex.vercel.app
              </a>
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a
                href="https://github.com/sahilcodexx"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/sahilcodexx
              </a>
            </li>
            <li>
              <strong>X (Twitter):</strong>{" "}
              <a
                href="https://x.com/sahilcodex"
                target="_blank"
                rel="noopener noreferrer"
              >
                x.com/sahilcodex
              </a>
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a
                href="https://www.linkedin.com/in/sahil-singh-tech/"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/sahil-singh-tech
              </a>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:sahil207003@gmail.com">sahil207003@gmail.com</a>
            </li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>How do I use the User Dropdown menu?</h3>
          <p>
            The <code>UserDropdown</code> component is located in the top-right header
            navbar. Click on your profile avatar to view live status updates, appearance
            settings, and account preferences.
          </p>

          <h3>How do I switch themes?</h3>
          <p>
            Click the sun/moon theme toggle button in the top navbar, or open your
            profile dropdown menu to select <em>Light</em> or <em>Dark</em> theme.
          </p>

          <h3>How does category filtering work?</h3>
          <p>
            Select any category pill on the home page or choose a category from the top
            navigation dropdown to filter developer tools instantly without reloading the
            page.
          </p>

          <h3>How do I submit a new tool or report an issue?</h3>
          <p>
            Reach out directly on{" "}
            <a
              href="https://github.com/sahilcodexx"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{" "}
            or via email at{" "}
            <a href="mailto:sahil207003@gmail.com">sahil207003@gmail.com</a>.
          </p>
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
