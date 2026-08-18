import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolsFromDatabase } from "@/lib/tools";
import { Sidebar } from "../../components/sidebar";
import { Navbar } from "../../components/navbar";
import { ToolCard } from "../../components/tool-card";
import { Footer } from "../../components/footer";
import { FloatingBar } from "../../components/floating-bar";
import { DeleteToolButton } from "../../components/delete-tool-button";
import { ArrowUpRight } from "lucide-react";
import { getImageProxyUrl } from "@/lib/tools";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
  const features =
    tool.features && tool.features.length > 0
      ? tool.features
      : getCategoryFeatures(tool.category, tool.name);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 flex flex-row w-full transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar selectedCategory={tool.category} categories={["All", ...Array.from(new Set(tools.map((item) => item.category))).sort()]} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-between">
        {/* Top Navbar */}
        <Navbar />

        <main className="relative w-full max-w-[82rem] border-x border-dashed border-zinc-200/50 px-5 pt-6 pb-32 sm:px-8 lg:px-10 dark:border-zinc-800/50 flex flex-col min-w-0 mx-auto">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={`/?category=${encodeURIComponent(tool.category)}`} />}>{tool.category}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{tool.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Tool identity and section navigation */}
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-dashed border-zinc-200/60 pb-5 dark:border-zinc-800/70">
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
            <div className="flex items-center gap-2.5">
              <DeleteToolButton toolId={tool.id} ownerId={tool.ownerId} />
              <Button render={<a href={tool.url} target="_blank" rel="noopener noreferrer" />} size="lg" className="rounded-full px-4 text-xs">
                Visit website <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="grid grid-cols-1 gap-6 border-b border-dashed border-zinc-200/60 pb-8 dark:border-zinc-800/70 lg:grid-cols-[minmax(0,1fr)_240px] items-start mb-8">
          {/* Preview image */}
          <div className="group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30 shadow-md">
            {tool.ogImage ? (
              <img
                src={getImageProxyUrl(tool.ogImage, tool.url)}
                alt={`${tool.name} preview`}
                className="w-full h-auto max-h-[720px] object-contain rounded-2xl sm:rounded-3xl transition-transform duration-300 ease-out group-hover:scale-[1.005]"
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

          <aside className="hidden border-x border-zinc-200/70 px-5 text-xs dark:border-zinc-800/80 lg:block">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">Similar tools</p>
                <span className="text-zinc-400" aria-hidden="true">↻</span>
              </div>
              <div className="space-y-1">
                {relatedTools.slice(0, 4).map((related) => (
                  <Link key={related.id} href={`/tools/${related.id}`} className="group/link flex items-center gap-2.5 rounded-lg px-2 py-2 text-zinc-600 transition hover:bg-zinc-200/60 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white">
                    <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                      <img src={`https://www.google.com/s2/favicons?domain=${new URL(related.url).hostname}&sz=32`} alt="" className="size-3.5" />
                    </span>
                    <span className="min-w-0 truncate font-medium">{related.name}</span>
                    <ArrowUpRight className="ml-auto size-3 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-60" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-200/70 pt-5 dark:border-zinc-800/80">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">Tool details</p>
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              </div>
              <dl className="divide-y divide-dashed divide-zinc-200/80 dark:divide-zinc-800/80">
                <div className="py-4 first:pt-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">Pricing</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Freemium</dd>
                </div>
                <div className="py-4">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">Category</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{tool.category}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">Category size</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{categorySize} tools</dd>
                </div>
                <div className="pt-4">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">Website</dt>
                  <dd className="mt-1 truncate font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{domain}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
          </div>

          {/* Mobile & Tablet Tool Details Bar (< lg) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 lg:hidden mb-8">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Pricing</div>
              <div className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">Freemium</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Category</div>
              <div className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{tool.category}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Category size</div>
              <div className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">{categorySize} tools</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Website</div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs font-semibold font-mono text-zinc-900 dark:text-zinc-100 truncate block hover:underline">
                {domain}
              </a>
            </div>
          </div>

          {/* Editorial details section */}
          <div className="mb-12 w-full">
            <div className="space-y-6">
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
                
                <div className="grid grid-cols-1 text-sm font-normal text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 border-b border-dashed border-zinc-200/70 px-4 py-3.5 dark:border-zinc-800/80 ${
                        idx < 2 ? "border-t" : ""
                      } ${idx % 2 === 0 ? "sm:border-r" : ""}`}
                    >
                      <span className="mt-0.5 font-mono text-sm text-zinc-400 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-5 font-mono">
                  Site domain: {domain}
                </div>
              </div>
            </div>
          </div>

          {/* Related Tools Grid */}
          {relatedTools.length > 0 && (
            <div className="mb-12 pt-8 border-t border-dashed border-zinc-200/70 dark:border-zinc-800/70 w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    More in {tool.category}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Discover related tools and references in this category.
                  </p>
                </div>
                <Link
                  href={`/?category=${encodeURIComponent(tool.category)}`}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
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

      <FloatingBar />
    </div>
  );
}
