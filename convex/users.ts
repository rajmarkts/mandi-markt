import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeUser = mutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();
    
    if (existing) {
      return { success: true, userId: existing._id, action: "exists" };
    }
    
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      role: undefined,
      onboarded: false,
    });
    
    return { success: true, userId, action: "created" };
  },
});

export const syncClerkUser = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal("wholesaler"), v.literal("retailer")),
    district: v.optional(v.string()),
    shopName: v.optional(v.string()),
    phone: v.optional(v.string()),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        role: args.role,
        district: args.district,
        shopName: args.shopName,
        phone: args.phone,
        name: args.name || "User",
        email: args.email,
        updatedAt: now,
      });
      return { success: true, userId: existing._id, action: "updated" };
    }
    
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: `https://clerk.com|${args.clerkId}`,
      clerkId: args.clerkId,
      role: args.role,
      district: args.district,
      shopName: args.shopName,
      phone: args.phone,
      name: args.name || "User",
      email: args.email,
      onboarded: true,
      createdAt: now,
      updatedAt: now,
    });
    
    return { success: true, userId, action: "created" };
  },
});

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

export const getByTokenIdentifier = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();
    return user;
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

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

export const getWholesalersByDistrict = query({
  args: { district: v.string() },
  handler: async (ctx, args) => {
    const wholesalers = await ctx.db
      .query("users")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .filter((q) => q.eq(q.field("role"), "wholesaler"))
      .collect();
    return wholesalers;
  },
});

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