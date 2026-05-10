/**
 * Convex Client Setup for Kirana Mandi
 * Initialize Convex connection
 */

import { ConvexReactClient } from "convex/react";

// Create Convex client
export const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || ""
);

// Export for use in components
export { useQuery, useMutation } from "convex/react";
