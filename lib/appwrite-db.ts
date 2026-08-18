import { databases, functions, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, APPWRITE_OG_FUNCTION_ID } from "./appwrite";
import { ExecutionMethod, ID, Permission, Query, Role } from "appwrite";
import type { Tool } from "@/lib/tools";
export { getCategories, getToolsFromDatabase } from "@/lib/tools";

async function fetchOgImage(url: string) {
  try {
    const execution = await functions.createExecution(
      APPWRITE_OG_FUNCTION_ID,
      JSON.stringify({ url }),
      false,
      undefined,
      ExecutionMethod.POST,
      { "content-type": "application/json" }
    );

    if (execution.responseStatusCode >= 200 && execution.responseStatusCode < 300) {
      const result = JSON.parse(execution.responseBody || "{}");
      return typeof result.ogImage === "string" ? result.ogImage : "";
    }

    console.warn("OG image function returned an error:", {
      status: execution.responseStatusCode,
      body: execution.responseBody,
    });
  } catch (error) {
    console.warn("OG image function unavailable; saving without a preview:", error);
  }
  return "";
}

/**
 * Create a new tool record in Appwrite Database 6a8073ac00388157613c
 */
export async function createToolInDatabase(tool: Omit<Tool, "id">, ownerId: string) {
  try {
    if (!ownerId) throw new Error("You must be signed in to submit a tool.");
    // Never replace a missing OG image with a screenshot. A screenshot is not
    // the submitted site's OG asset and can make broken metadata look valid.
    const ogImage = tool.ogImage || (await fetchOgImage(tool.url));
    const documentData = {
      title: tool.name,
      url: tool.url,
      category: tool.category,
      description: tool.description,
      // Store the resolved OG URL; Vercel only renders the image.
      ogimage: ogImage,
      logo: tool.logo || "",
      createdBy: ownerId,
      ...(tool.features && tool.features.length > 0 ? { features: tool.features } : {}),
    };
    const existing = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.equal("url", tool.url), Query.equal("createdBy", ownerId), Query.limit(1)]
    );
    const response = existing.documents[0]
      ? await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_ID,
          existing.documents[0].$id,
          documentData,
          [Permission.read(Role.any()), Permission.update(Role.user(ownerId)), Permission.delete(Role.user(ownerId))]
        )
      : await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_ID,
          ID.unique(),
          documentData,
          [Permission.read(Role.any()), Permission.update(Role.user(ownerId)), Permission.delete(Role.user(ownerId))]
        );
    return response;
  } catch (error) {
    console.error("Failed to create document in Appwrite DB:", error);
    throw error;
  }
}

export async function refreshToolOgImage(toolId: string, url: string) {
  const ogImage = await fetchOgImage(url);
  return databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_COLLECTION_ID,
    toolId,
    { ogimage: ogImage },
  );
}

export async function updateToolInDatabase(toolId: string, data: Partial<Omit<Tool, "id">>, ownerId: string) {
  return databases.updateDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, toolId, {
    ...(data.name ? { title: data.name } : {}),
    ...(data.url ? { url: data.url } : {}),
    ...(data.category ? { category: data.category } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.ogImage !== undefined ? { ogimage: data.ogImage } : {}),
    ...(data.logo !== undefined ? { logo: data.logo } : {}),
    createdBy: ownerId,
  });
}

export async function deleteToolFromDatabase(toolId: string) {
  return databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, toolId);
}
