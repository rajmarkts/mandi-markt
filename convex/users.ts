/**
 * User Mutations and Queries
 * Handles Clerk sync and user management
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Sync Clerk user to Convex after signup/onboarding
 * Called from frontend after Clerk authentication
 */
export const syncClerkUser = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal("wholesaler"), v.literal("retailer")),
    district: v.string(),
    shopName: v.optional(v.string()),
    phone: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        role: args.role,
        district: args.district,
        shopName: args.shopName,
        phone: args.phone,
        name: args.name,
        email: args.email,
        updatedAt: now,
      });
      return { success: true, userId: existing._id, action: "updated" };
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      role: args.role,
      district: args.district,
      shopName: args.shopName,
      phone: args.phone,
      name: args.name,
      email: args.email,
      createdAt: now,
      updatedAt: now,
    });
    
    return { success: true, userId, action: "created" };
  },
});

/**
 * Get current user by Clerk ID
 */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    return user;
  },
});

/**
 * Get user profile with ID
 */
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    shopName: v.optional(v.string()),
    phone: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Partial<typeof args> = { ...args };
    delete (updates as { userId?: string }).userId;
    
    await ctx.db.patch(args.userId, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * List wholesalers in a district
 * Used by retailers to find local suppliers
 */
export const getWholesalersByDistrict = query({
  args: { district: v.string() },
  handler: async (ctx, args) => {
    const wholesalers = await ctx.db
      .query("users")
      .withIndex("by_district_and_role", (q) => 
        q.eq("district", args.district).eq("role", "wholesaler")
      )
      .collect();
    
    return wholesalers;
  },
});

/**
 * Get user's district (for location-based queries)
 */
export const getUserDistrict = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    return user?.district || null;
  },
});
