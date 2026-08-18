import { databases, APPWRITE_COLLECTION_ID, APPWRITE_DATABASE_ID } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

export type Tool = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  ogImage?: string;
  logo?: string;
  ownerId?: string;
  features?: string[];
};

export const CATEGORY_SUGGESTIONS = [
  "AI & Automation",
  "Resources & Learning",
  "Productivity",
  "Marketing & Business",
  "No-Code & Workflow",
  "Motion & Animation",
  "Websites & Showcases",
  "General & Miscellaneous",
] as const;

export const DEFAULT_CATEGORY = "General & Miscellaneous";

export function getImageProxyUrl(imageUrl?: string, baseUrl?: string) {
  if (!imageUrl) return "";
  try {
    return `/api/image?url=${encodeURIComponent(new URL(imageUrl, baseUrl).toString())}`;
  } catch {
    return "";
  }
}

type AppwriteDocument = {
  $id?: string;
  id?: string;
  name?: string;
  title?: string;
  url?: string;
  category?: string;
  description?: string;
  ogImage?: string;
  ogimage?: string;
  logo?: string;
  createdBy?: string;
  features?: string[] | string;
};

export function parseFeatures(raw?: string[] | string): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return raw.split(/\r?\n|;/).map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export function mapToolDocument(document: AppwriteDocument): Tool | null {
  if (!document.url || !(document.title || document.name) || !document.category) return null;
  return {
    id: document.$id || document.id || ID.unique(),
    name: document.title || document.name || "Untitled tool",
    url: document.url,
    category: document.category,
    description: document.description || "",
    ogImage: document.ogImage || document.ogimage || "",
    logo: document.logo || "",
    ownerId: document.createdBy || "",
    features: parseFeatures(document.features),
  };
}

export async function getToolsForOwner(ownerId: string) {
  if (!ownerId) return [];
  try {
    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, [
      Query.equal("createdBy", ownerId), Query.limit(100),
    ]);
    return response.documents
      .map((document) => mapToolDocument(document as AppwriteDocument))
      .filter((tool): tool is Tool => Boolean(tool));
  } catch (error) {
    console.error("Unable to load your submitted tools:", error);
    return [];
  }
}

export async function getToolsFromDatabase(category?: string): Promise<Tool[]> {
  try {
    const queries = [Query.limit(100)];
    if (category && category !== "All") queries.push(Query.equal("category", category));
    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, queries);
    return response.documents
      .map((document) => mapToolDocument(document as AppwriteDocument))
      .filter((tool): tool is Tool => Boolean(tool));
  } catch (error) {
    console.error("Unable to load tools from Appwrite:", error);
    return [];
  }
}

export function getCategories(tools: Tool[]) {
  return ["All", ...Array.from(new Set(tools.map((tool) => tool.category))).sort()];
}

export function getCategoryOptions(tools: Tool[]) {
  return Array.from(new Set([
    ...tools.map((tool) => tool.category),
    ...CATEGORY_SUGGESTIONS,
  ])).sort((a, b) => a.localeCompare(b));
}
