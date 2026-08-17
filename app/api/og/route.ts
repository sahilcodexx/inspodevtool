import { NextResponse } from "next/server";

/**
 * OG fetching is intentionally handled before upload and stored in Appwrite.
 * This route remains only as a safe compatibility response for old links.
 */
export function GET() {
  return NextResponse.json({ error: "OG fetching is no longer performed at runtime." }, { status: 410 });
}
