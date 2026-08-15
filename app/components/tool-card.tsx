"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tool } from "../data";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const domain = new URL(tool.url).hostname.replace(/^www\./, "");
  const defaultFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <div className="group flex flex-col gap-2 w-full">
      {/* Top Preview Image Container - rounded-lg for clean subtle corner radius */}
      <Link
        href={`/tools/${tool.id}`}
        className="block relative aspect-[1.91/1] w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-[#141417] border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xs group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-all duration-300 cursor-pointer"
      >
        {tool.ogImage && !imageError ? (
          <img
            src={tool.ogImage}
            alt={`${tool.name} preview`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-300 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ) : (
          /* Clean Browser Fallback Banner */
          <div className="relative w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-zinc-100 via-zinc-200/50 to-zinc-100 dark:from-[#18181c] dark:via-[#22222a] dark:to-[#141417] select-none">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 truncate max-w-[120px]">
                {domain}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center px-2">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center p-1.5 shadow-xs mb-1.5">
                <img
                  src={tool.logo || defaultFavicon}
                  alt=""
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-tight line-clamp-1">
                {tool.name}
              </span>
            </div>
            <div className="h-1 w-full bg-zinc-200/60 dark:bg-zinc-800/60 rounded-full" />
          </div>
        )}
      </Link>

      {/* Clean Meta Line: [Tool Name] • [Description/Category] */}
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 px-0.5 min-w-0">
        <Link
          href={`/tools/${tool.id}`}
          className="hover:underline font-bold tracking-tight text-zinc-900 dark:text-zinc-100 shrink-0 cursor-pointer"
        >
          {tool.name}
        </Link>

        <span className="text-zinc-400 dark:text-zinc-600 font-normal shrink-0">•</span>

        <span className="text-zinc-500 dark:text-zinc-400 font-normal truncate">
          {tool.description || tool.category}
        </span>
      </div>
    </div>
  );
}
