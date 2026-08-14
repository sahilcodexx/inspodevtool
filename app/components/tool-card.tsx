"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <div className="group relative bg-[#f6f6f8] dark:bg-[#141417] p-3 rounded-[20px] border border-zinc-200/80 dark:border-zinc-800/80 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between h-full w-full">
      <div className="flex flex-col flex-1">
        {/* Top Preview Image Container - aspect-[1.91/1] fits OG image standard 1200x630 perfectly without cropping */}
        <Link href={`/tools/${tool.id}`} className="block relative aspect-[1.91/1] w-full rounded-[14px] overflow-hidden bg-zinc-100 dark:bg-[#121215] border border-zinc-200/60 dark:border-zinc-800/60 mb-3 flex items-center justify-center cursor-pointer p-1">
          {tool.ogImage && !imageError ? (
            <img
              src={tool.ogImage}
              alt={`${tool.name} preview`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`object-contain max-w-full max-h-full rounded-lg group-hover:scale-[1.02] transition-all duration-300 ease-out ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          ) : (
            /* Sleek Edge-to-Edge Browser Mock Banner */
            <div className="relative w-full h-full flex flex-col justify-between p-3 select-none overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
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
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center p-1.5 shadow-xs mb-1.5">
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

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-[14px]" />
        </Link>

        {/* Favicon & Title Row */}
        <div className="flex items-center justify-between gap-2 mb-1 px-1">
          <Link href={`/tools/${tool.id}`} className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer">
            <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-zinc-800 flex-shrink-0 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs">
              <img
                src={tool.logo || defaultFavicon}
                alt=""
                className="w-3.5 h-3.5 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <h3 className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100 tracking-tight line-clamp-1 group-hover:text-black dark:group-hover:text-white transition-colors">
              {tool.name}
            </h3>
          </Link>

          {/* Direct link external arrow button */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition p-1 text-xs shrink-0"
            title="Open external website"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Subtitle / Description */}
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 line-clamp-2 px-1 leading-snug font-normal">
          {tool.description || `${domain} - Curated design engineer tool.`}
        </p>
      </div>
    </div>
  );
}
