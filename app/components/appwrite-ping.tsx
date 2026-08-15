"use client";

import { useEffect } from "react";
import { client, databases, APPWRITE_DATABASE_ID } from "@/lib/appwrite";

export function AppwritePing() {
  useEffect(() => {
    // 1. Ping Appwrite server backend
    client
      .ping()
      .then((res: unknown) => {
        console.log("✓ Appwrite Server Connected successfully:", res);
      })
      .catch((err: unknown) => {
        console.log("Appwrite server ping status:", err);
      });

    // 2. Ping Appwrite Database 6a8073ac00388157613c
    databases
      .listDocuments(APPWRITE_DATABASE_ID, "tools")
      .then((res: unknown) => {
        console.log(`✓ Appwrite Database (${APPWRITE_DATABASE_ID}) Verified:`, res);
      })
      .catch((err: unknown) => {
        console.log(`Appwrite DB (${APPWRITE_DATABASE_ID}) status:`, err);
      });
  }, []);

  return null;
}
