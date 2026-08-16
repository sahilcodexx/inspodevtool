"use client";

import { useEffect } from "react";
import {
  client,
  databases,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
} from "@/lib/appwrite";

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

    // 2. Ping the collection that is actually configured for this app.
    // "tools" was an old collection name and caused a misleading 404 on
    // every page load.
    databases
      .listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID)
      .then((res: unknown) => {
        console.log(
          `✓ Appwrite Database (${APPWRITE_DATABASE_ID}/${APPWRITE_COLLECTION_ID}) Verified:`,
          res
        );
      })
      .catch((err: unknown) => {
        console.error(
          `Appwrite DB (${APPWRITE_DATABASE_ID}/${APPWRITE_COLLECTION_ID}) status:`,
          err
        );
      });
  }, []);

  return null;
}
