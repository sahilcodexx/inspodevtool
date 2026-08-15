"use client";

import { useEffect } from "react";
import { client } from "@/lib/appwrite";

export function AppwritePing() {
  useEffect(() => {
    // Automatically ping the Appwrite backend server on app load to verify setup
    client
      .ping()
      .then((res) => {
        console.log("Appwrite ping response:", res);
      })
      .catch((err) => {
        console.log("Appwrite ping status:", err);
      });
  }, []);

  return null;
}
