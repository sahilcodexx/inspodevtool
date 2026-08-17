import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolsFromDatabase } from "@/lib/tools";
import { Sidebar } from "../../components/sidebar";
import { Navbar } from "../../components/navbar";
import { ToolCard } from "../../components/tool-card";
import { Footer } from "../../components/footer";
import { FloatingBar } from "../../components/floating-bar";
import { ArrowUpRight, Bookmark, Flag, Share2 } from "lucide-react";
import { getImageProxyUrl } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

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
  const tools = await getToolsFromDatabase();
  const tool = tools.find((t) => t.id === id);

  if (!tool) {
    notFound();
  }

  const domain = new URL(tool.url).hostname.replace(/^www\./, "");
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const relatedTools = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 8);
  const categorySize = tools.filter((t) => t.category === tool.category).length;
  const features = getCategoryFeatures(tool.category, tool.name);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-row w-full transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar selectedCategory={tool.category} categories={["All", ...Array.from(new Set(tools.map((item) => item.category))).sort()]} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-between">
        {/* Top Navbar */}
        <Navbar />

        <main className="w-full max-w-[82rem] px-5 sm:px-8 lg:px-10 pt-6 pb-32 flex flex-col min-w-0 mx-auto">
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between gap-4 mb-4 text-xs text-zinc-500 dark:text-zinc-400 w-full">
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

          {/* Tool identity and section navigation */}
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-zinc-200/60 dark:border-zinc-800/80 pb-4 mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center p-2 shadow-xs shrink-0">
                <img src={favicon} alt="" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {tool.name}
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{domain}</p>
              </div>
            </div>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold flex items-center gap-2 hover:bg-zinc-700 dark:hover:bg-white active:scale-[0.98] transition duration-150"
            >
              Visit website <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-5 border-b border-zinc-200/60 dark:border-zinc-800/80 mb-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span className="relative pb-3 text-zinc-900 dark:text-zinc-100 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-zinc-900 dark:after:bg-zinc-100">Overview</span>
            <span className="pb-3">Details</span>
            <span className="pb-3">Related tools</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-6 items-start mb-8">
          {/* Preview image */}
          <div className="group relative aspect-[2.05/1] max-h-[440px] w-full rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100 dark:bg-[#121215] shadow-xs flex items-center justify-center">
            {tool.ogImage ? (
              <img
                src={getImageProxyUrl(tool.ogImage, tool.url)}
                alt={`${tool.name} preview`}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.012] transition-transform duration-300 ease-out"
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
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out flex items-center justify-center backdrop-blur-2xs rounded-2xl">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold text-sm shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-transform duration-150 ease-out flex items-center gap-2"
              >
                <span>Visit website</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <aside className="hidden lg:block border-l border-zinc-200/60 dark:border-zinc-800/80 pl-5 text-xs">
            <div className="space-y-1">
              <button type="button" className="w-full flex items-center gap-2.5 py-2 text-left text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                <Bookmark className="w-3.5 h-3.5" /> Add to collection
              </button>
              <button type="button" className="w-full flex items-center gap-2.5 py-2 text-left text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button type="button" className="w-full flex items-center gap-2.5 py-2 text-left text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                <Flag className="w-3.5 h-3.5" /> Report a problem
              </button>
            </div>
            <div className="mt-7 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Similar tools</p>
              <div className="space-y-2.5">
                {relatedTools.slice(0, 4).map((related) => (
                  <Link key={related.id} href={`/tools/${related.id}`} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition">
                    <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={`https://www.google.com/s2/favicons?domain=${new URL(related.url).hostname}&sz=32`} alt="" className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{related.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
          </div>

          {/* Tool Header & Action Buttons */}
          <div className="hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center p-2.5 shadow-xs shrink-0">
                <img src={favicon} alt="" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 mb-16 items-start w-full">
            {/* Left Side */}
            <div className="lg:col-span-8 space-y-8">
              {/* ABOUT Section */}
              <div>
                <div className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3">
                  ABOUT
                </div>
                <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed tracking-tight max-w-3xl">
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

              {/* WHERE APPEARS */}
              <div className="pt-2">
                <div className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">
                  WHERE {tool.name.toUpperCase()} APPEARS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={`/?category=${encodeURIComponent(tool.category)}`}
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
                  </Link>

                  <Link
                    href="/"
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
                  </Link>
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

            {/* Right Side */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 bg-[#f8f8fa] dark:bg-[#141417] p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
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

          {/* Related Tools Grid */}
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
