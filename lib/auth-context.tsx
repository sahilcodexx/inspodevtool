"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { Models, OAuthProvider, ID } from "appwrite";

type AppwriteError = { code?: number; type?: string };

function getAppwriteError(error: unknown): AppwriteError | null {
  return error && typeof error === "object" ? (error as AppwriteError) : null;
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkUser = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && window.location.search.includes("secret")) {
        try {
          await account.getSession("current");
        } catch {
          // Ignore session fetch error during OAuth callback exchange
        }
      }

      const current = await account.get();
      setUser(current);
    } catch (error: unknown) {
      // Appwrite returns 401 when there is no browser session. Keep that
      // state quiet, but do not hide configuration/endpoint errors such as
      // a 404 (which otherwise looks exactly like a logged-out user).
      const appwriteError = getAppwriteError(error);
      if (appwriteError?.code !== 401 && appwriteError?.type !== "user_unauthorized") {
        console.error("Unable to load the current Appwrite user:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await account.createEmailPasswordSession(email, pass);
    } catch (err: unknown) {
      const appwriteError = getAppwriteError(err);
      if (appwriteError?.type === "session_already_exists" || appwriteError?.code === 409) {
        await checkUser();
        return;
      }
      throw err;
    }
    await checkUser();
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const userName = name || email.split("@")[0];
    try {
      await account.create(ID.unique(), email, pass, userName);
    } catch (err: unknown) {
      const appwriteError = getAppwriteError(err);
      if (appwriteError?.type === "user_already_exists" || appwriteError?.code === 409) {
        await signInWithEmail(email, pass);
        return;
      }
      throw err;
    }

    await signInWithEmail(email, pass);
  };

  const signInWithGoogle = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    // Use the token flow so the callback can explicitly exchange Appwrite's
    // userId/secret for a browser session. This avoids OAuth succeeding while
    // /account still returns 401 with no a_session cookie.
    account.createOAuth2Token(
      OAuthProvider.Google,
      `${origin}/auth/callback`,
      `${origin}/signup?mode=signin`
    );
  };

  const signOut = async () => {
    try {
      await account.deleteSession("current");
    } catch {
      // Session already cleared
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
