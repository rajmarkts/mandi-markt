/**
 * Clerk Authentication Utilities for Kirana Mandi
 * Provides role-based access control and user type helpers
 */

import { auth, currentUser } from "@clerk/nextjs/server";

export type UserRole = "wholesaler" | "retailer" | null;

/**
 * Get the current user's role from session metadata
 */
export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata?.role as UserRole || null;
}

/**
 * Check if current user is a wholesaler
 */
export async function isWholesaler(): Promise<boolean> {
  const role = await getUserRole();
  return role === "wholesaler";
}

/**
 * Check if current user is a retailer
 */
export async function isRetailer(): Promise<boolean> {
  const role = await getUserRole();
  return role === "retailer";
}

/**
 * Get full user data including role
 */
export async function getCurrentUserWithRole() {
  const user = await currentUser();
  const role = await getUserRole();
  
  return {
    user,
    role,
    isWholesaler: role === "wholesaler",
    isRetailer: role === "retailer",
    hasCompletedOnboarding: role !== null,
  };
}

/**
 * Server-side redirect helper based on role
 */
export function getRoleBasedRedirect(role: UserRole): string {
  switch (role) {
    case "wholesaler":
      return "/dashboard";
    case "retailer":
      return "/retailer";
    default:
      return "/onboarding";
  }
}
