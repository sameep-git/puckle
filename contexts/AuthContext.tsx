// contexts/AuthContext.tsx
'use client'

import { useMemo } from 'react'
import { useConvexAuth, useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '@/convex/_generated/api'

// Minimal user type for compatibility
type User = {
  id: string;
  email?: string;
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export function useAuthContextData(): AuthContextType {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut: convexSignOut, signIn: convexSignIn } = useAuthActions();

  // Fetch user details if authenticated
  const userData = useQuery(api.users.viewer);

  const user = useMemo(() => {
    if (!isAuthenticated || !userData) return null;
    return {
      id: userData._id,
      email: userData.email,
    };
  }, [isAuthenticated, userData]);

  // Map server errors to user-friendly messages
  const getAuthErrorMessage = (error: unknown): string => {
    const message = error instanceof Error ? error.message : String(error);

    // Common Convex Auth error patterns
    if (message.includes("InvalidAccountId") || message.includes("Invalid credentials")) {
      return "Invalid email or password. Please check your credentials.";
    }
    if (message.includes("Account already exists") || message.includes("already registered")) {
      return "An account with this email already exists. Try signing in instead.";
    }
    if (message.includes("password") && message.includes("8")) {
      return "Password must be at least 8 characters long.";
    }
    if (message.includes("Invalid email")) {
      return "Please enter a valid email address.";
    }

    // Fallback for unknown errors
    return "Something went wrong. Please try again.";
  };

  const signIn = async (email: string, password: string) => {
    try {
      await convexSignIn("password", { email, password, flow: "signIn" });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await convexSignIn("password", { email, password, flow: "signUp" });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const signOut = async () => {
    await convexSignOut();
  };

  return {
    user,
    loading: isLoading,
    signIn,
    signUp,
    signOut
  };
}

// Export a wrapper or just the hook. 
// The existing code imported `useAuth` from here.
// We'll export `useAuth` as the hook.
export const useAuth = useAuthContextData;