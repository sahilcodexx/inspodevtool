import { databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "./appwrite";
import { ID, Query } from "appwrite";
import type { Tool } from "@/app/data";

export interface AppwriteToolDocument {
  $id?: string;
  name: string;
  url: string;
  category: string;
  description: string;
  ogImage?: string;
  logo?: string;
}

/**
 * Fetch all tool records from Appwrite Database 6a8073ac00388157613c
 */
export async function getToolsFromDatabase(category?: string) {
  try {
    const queries = [Query.limit(100)];
    if (category && category !== "All") {
      queries.push(Query.equal("category", category));
    }
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      queries
    );
    return response.documents;
  } catch (error) {
    console.warn("Appwrite DB query error:", error);
    return [];
  }
}

/**
 * Create a new tool record in Appwrite Database 6a8073ac00388157613c
 */
export async function createToolInDatabase(tool: Omit<Tool, "id">) {
  try {
    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        name: tool.name,
        url: tool.url,
        category: tool.category,
        description: tool.description,
        ogImage: tool.ogImage || "",
        logo: tool.logo || "",
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to create document in Appwrite DB:", error);
    throw error;
  }
}
