"use client";

import { useState, useMemo } from "react";
import { toolsData, categoriesList } from "./data";
import { Sidebar } from "./components/sidebar";
import { ToolCard } from "./components/tool-card";
import { FloatingBar } from "./components/floating-bar";
import { Footer } from "./components/footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-row w-full transition-colors duration-200">
      {/* Left Navigation Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Content Wrapper - max-w-8xl container */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-between">
        <main className="w-full max-w-[90rem] px-6 sm:px-8 pt-8 pb-24 flex flex-col min-w-0 mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Design Engineer Tools
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              A curated gallery of useful tools & site previews for web-focused design engineers.
            </p>

            {/* Category Filter Scrollable Tabs */}
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-semibold"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </header>

          {/* Tools Grid - 4 cards per row */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {selectedCategory} Tools ({filteredTools.length})
              </div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
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
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => setSelectedCategory(category)}
      />
    </div>
  );
}