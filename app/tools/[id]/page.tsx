import Link from "next/link";
import { notFound } from "next/navigation";
import { toolsData } from "../../data";
import { Sidebar } from "../../components/sidebar";
import { ToolCard } from "../../components/tool-card";
import { Footer } from "../../components/footer";
import { FloatingBar } from "../../components/floating-bar";
import { ArrowUpRight, Bookmark } from "lucide-react";

interface ToolPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return toolsData.map((tool) => ({
    id: tool.id,
  }));
}

function getCategoryFeatures(category: string, toolName: string) {
  switch (category) {
    case "Inspiration":
      return [
        `High-resolution visual design patterns & interactive showcases`,
        `Direct reference implementations for ${toolName}`,
        `Modern UI/UX showcases tailored for design engineers`,
        `Curated web experiences and responsive layout ideas`,
        `Production-tested visual aesthetics & motion concepts`,
      ];
    case "Components & UI":
      return [
        `Production-ready UI components and component libraries`,
        `Seamless integration with Tailwind CSS & modern web frameworks`,
        `Accessible component guidelines and interactive patterns`,
        `High-quality vector graphics, SVG icons & design tokens`,
        `Copy-paste code snippets for fast developer workflow`,
      ];
    case "Dev Tools":
      return [
        `Developer utilities built for daily workflow optimization`,
        `Fast asset generators, mockups & snippet builders`,
        `Open-source web utilities with instant browser preview`,
        `Performance-focused tools for frontend developers`,
        `Streamlined creation workflow without friction`,
      ];
    case "Portfolios":
      return [
        `Curated portfolio showcases from top design engineers`,
        `Creative web experiences & interactive 3D WebGL implementations`,
        `Minimalist personal websites & detailed case studies`,
        `Inspirational typography and motion design references`,
        `Clean grid structures & modern layout techniques`,
      ];
    default:
      return [
        `Curated high-performance resources for design engineers`,
        `Direct access to official documentation & components`,
        `Modern web design patterns and interactive references`,
        `Optimized for fast developer workflow and creation`,
      ];
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { id } = await params;
  const tool = toolsData.find((t) => t.id === id);

  if (!tool) {
    notFound();
  }

  const domain = new URL(tool.url).hostname.replace(/^www\./, "");
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const relatedTools = toolsData.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 8);
  const categorySize = toolsData.filter((t) => t.category === tool.category).length;
  const features = getCategoryFeatures(tool.category, tool.name);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-row w-full transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar selectedCategory={tool.category} />

      {/* Main Content Area - max-w-[90rem] container (max-w-8xl) */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-between">
        <main className="w-full max-w-[90rem] px-6 sm:px-8 pt-8 pb-32 flex flex-col min-w-0 mx-auto">
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between gap-4 mb-6 text-xs text-zinc-500 dark:text-zinc-400 w-full">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">
                Home
              </Link>
              <span>/</span>
              <Link href={`/?category=${encodeURIComponent(tool.category)}`} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">
                {tool.category}
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">{tool.name}</span>
            </div>
          </div>

          {/* 1.91:1 Aspect Ratio Preview Image Card */}
          <div className="group relative aspect-[1.91/1] max-h-[520px] w-full rounded-lg overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100 dark:bg-[#121215] shadow-xs mb-8 flex items-center justify-center p-2">
            {tool.ogImage ? (
              <img
                src={tool.ogImage}
                alt={`${tool.name} preview`}
                className="max-w-full max-h-full object-contain rounded-md group-hover:scale-[1.015] transition-transform duration-500"
              />
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center w-full h-full">
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-3 p-3 shadow-xs">
                  <img src={favicon} alt="" className="w-8 h-8 object-contain" />
                </div>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{tool.name}</h2>
                <p className="text-xs font-mono text-zinc-400 mt-1">{domain}</p>
              </div>
            )}

            {/* Hover Center Action Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-2xs rounded-lg">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>Visit website</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tool Header & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60 mb-8 w-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center p-2.5 shadow-xs shrink-0">
                <img src={favicon} alt="" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {tool.name}
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{tool.category}</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 font-medium">
                    Freemium
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 font-medium">
                    In {tool.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-sm rounded-full transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Visit website</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Bookmark tool"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details 2-Column Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-start w-full">
            {/* Left Side (Spans 8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* ABOUT Section */}
              <div>
                <div className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3">
                  ABOUT
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
                  {tool.name}
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                  {tool.description || `Curated resource and design engineering reference for ${tool.name}.`}
                </p>
              </div>

              {/* FEATURES & USE CASES */}
              <div>
                <div className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">
                  FEATURES & USE CASES
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 text-sm font-normal text-zinc-600 dark:text-zinc-300">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-zinc-400 font-mono text-sm">›</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-5 font-mono">
                  Site domain: {domain}
                </div>
              </div>

              {/* WHERE [TOOL NAME] APPEARS section */}
              <div className="pt-2">
                <div className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">
                  WHERE {tool.name.toUpperCase()} APPEARS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="#"
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                        Top {tool.category} Tools
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        One of {categorySize} tools in {tool.category}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition" />
                  </a>

                  <a
                    href="#"
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                        Design Engineer Directory
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Official Curated Bookmark
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition" />
                  </a>
                </div>
              </div>

              {/* Ready to try CTA box */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-between gap-4 mt-6">
                <div>
                  <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Ready to visit {tool.name}?
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                    Opens {domain} directly.
                  </div>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-full transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Visit website</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Side (Spans 4 cols) - Metadata Specs Card */}
            <div className="lg:col-span-4 bg-[#f8f8fa] dark:bg-[#141417] p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
              <div>
                <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  PRICING
                </div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  Freemium
                </div>
              </div>

              <div className="pt-3.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  CATEGORY
                </div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  {tool.category}
                </div>
              </div>

              <div className="pt-3.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  CATEGORY SIZE
                </div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  {categorySize} tools
                </div>
              </div>

              <div className="pt-3.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  WEBSITE
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline mt-1 block truncate font-mono"
                >
                  {domain}
                </a>
              </div>
            </div>
          </div>

          {/* Related Tools Grid - 4 Cards per row */}
          {relatedTools.length > 0 && (
            <div className="mb-12 w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Related {tool.category} Tools
                </h2>
                <Link
                  href={`/?category=${encodeURIComponent(tool.category)}`}
                  className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Browse all {categorySize} →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                {relatedTools.map((r) => (
                  <ToolCard key={r.id} tool={r} />
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Floating Pill Bar */}
      <FloatingBar selectedCategory={tool.category} />
    </div>
  );
}
