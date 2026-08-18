"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Send, CheckCircle2 } from "lucide-react";
import { createToolInDatabase } from "@/lib/appwrite-db";
import { DEFAULT_CATEGORY, getCategoryOptions, getToolsFromDatabase } from "@/lib/tools";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitToolModal({ isOpen, onClose }: SubmitToolModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const selectableCategories = useMemo(() => categories.filter((item) => item !== "All"), [categories]);

  useEffect(() => {
    if (!isOpen || categories.length) return;
    getToolsFromDatabase().then((tools) => {
      const nextCategories = getCategoryOptions(tools);
      setCategories(nextCategories);
      setCategory(DEFAULT_CATEGORY);
    });
  }, [categories.length, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const resolvedCategory = category === "__new__" ? newCategory.trim() : category;
    if (!resolvedCategory) {
      setError("Choose a category or enter a new category name.");
      return;
    }
    setSubmitting(true);
    try {
      const featuresArray = featuresText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      await createToolInDatabase({
        name,
        url,
        category: resolvedCategory,
        description,
        features: featuresArray,
      }, user?.$id || "");

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setUrl("");
        setCategory(DEFAULT_CATEGORY);
        setNewCategory("");
        setDescription("");
        setFeaturesText("");
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit tool.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Tool Submitted!
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Thank you for submitting your tool to Design Bookmark.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Submit a Tool
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Share a useful design or development resource with the community.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="tool-name">Tool name</FieldLabel>
                  <Input
                    id="tool-name"
                    type="text"
                    required
                    placeholder="e.g. React Bits"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="tool-url">Website URL</FieldLabel>
                  <Input
                    id="tool-url"
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <FieldDescription>Use the full URL, including https://</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="tool-category">Category</FieldLabel>
                  <FieldDescription>Choose the closest fit. You can also create a new category.</FieldDescription>
                  <select
                    id="tool-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    {selectableCategories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                    <option value="__new__">+ Create new category</option>
                  </select>
                  {category === "__new__" && (
                    <Input
                      aria-label="New category name"
                      autoFocus
                      required
                      placeholder="e.g. Motion & Animation"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="tool-description">Description</FieldLabel>
                  <textarea
                    id="tool-description"
                    rows={3}
                    placeholder="Brief summary of what this tool does..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="tool-features">Features &amp; Use Cases (Optional)</FieldLabel>
                  <FieldDescription>Enter each feature or use case point on a new line.</FieldDescription>
                  <textarea
                    id="tool-features"
                    rows={4}
                    placeholder={"Production-ready UI component library\nSeamless integration with Tailwind CSS\nAccessible component guidelines"}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 font-mono text-xs leading-relaxed"
                  />
                </Field>

                <FieldError>{error}</FieldError>
                <Button type="submit" disabled={submitting} className="w-full mt-1">
                  <Send className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit tool"}
                </Button>
              </FieldGroup>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
