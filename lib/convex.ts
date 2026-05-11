/**
 * Convex Client Setup for Kirana Mandi
 * Initialize Convex connection with SWR caching
 */

import { ConvexReactClient } from "convex/react";

// Create Convex client with optimized caching
export const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "",
  {
    // Enable verbose logging in development
    verbose: process.env.NODE_ENV === "development",
  }
);

// SWR (Stale-While-Revalidate) cache configuration
export const convexCacheConfig = {
  // Cache products for 5 minutes - prices don't change often
  products: { ttl: 5 * 60 * 1000 },
  // Cache user data for 10 minutes
  users: { ttl: 10 * 60 * 1000 },
  // Cache orders for 1 minute - more dynamic
  orders: { ttl: 60 * 1000 },
  // Cache price history for 30 minutes
  priceHistory: { ttl: 30 * 60 * 1000 },
};

// Export for use in components
export { useQuery, useMutation } from "convex/react";
