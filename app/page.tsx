"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Tool } from "@/lib/tools";
import { getCategories, getToolsFromDatabase } from "@/lib/tools";
import { Sidebar } from "./components/sidebar";
import { Navbar } from "./components/navbar";
import { ToolCard } from "./components/tool-card";
import { FloatingBar } from "./components/floating-bar";
import { Footer } from "./components/footer";

function CategorySection({ title, tools }: { title: string; tools: Tool[] }) {
  if (!tools.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-zinc-200/70 pb-3 dark:border-zinc-800/80">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{tools.length} {tools.length === 1 ? "tool" : "tools"}</span>
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </section>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => categoryFromUrl || "All"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getToolsFromDatabase().then((items) => {
      if (active) {
        setTools(items);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, tools]);

  const categoriesList = getCategories(tools);
  const categorySections = (selectedCategory === "All"
    ? categoriesList.filter((category) => category !== "All")
    : [selectedCategory]
  ).map((category) => ({
    category,
    tools: filteredTools.filter((tool) => tool.category === category),
  })).filter((section) => section.tools.length > 0);


  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-row w-full transition-colors duration-200">
      {/* Left Navigation Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        categories={categoriesList}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-between">
        {/* Top Navbar */}
        <Navbar
          categories={categoriesList}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => setSelectedCategory(category)}
        />

        <main className="w-full max-w-[90rem] px-6 sm:px-8 pt-8 pb-24 flex flex-col min-w-0 mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Tools for better digital work
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              A curated library of useful products, resources, and creative references.
            </p>
          </header>

          {/* Category sections */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-2.5">
                    <div className="aspect-[1.91/1] rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="h-2.5 w-full rounded bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredTools.length > 0 ? (
              <>
                {categorySections.map((section) => (
                  <CategorySection key={section.category} title={section.category} tools={section.tools} />
                ))}
              </>
            ) : (
              <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
                <p className="text-base font-medium">No tools found</p>
                <p className="text-xs mt-1">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Floating Pill Bar */}
      <FloatingBar
        searchQuery={searchQuery}
        onSearchChange={(query) => setSearchQuery(query)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
