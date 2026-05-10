/**
 * Product Mutations and Queries
 * Location-based product management for local Mandi pricing
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new product (Wholesaler only)
 */
export const create = mutation({
  args: {
    name: v.string(),
    category: v.union(
      v.literal("vegetables"),
      v.literal("fruits"),
      v.literal("grains"),
      v.literal("spices"),
      v.literal("oils"),
      v.literal("dairy"),
      v.literal("dry_fruits"),
      v.literal("other")
    ),
    price: v.number(),
    unit: v.string(),
    stock: v.number(),
    district: v.string(),
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const productId = await ctx.db.insert("products", {
      name: args.name,
      category: args.category,
      price: args.price,
      unit: args.unit,
      stock: args.stock,
      district: args.district,
      wholesalerId: args.wholesalerId,
      wholesalerName: args.wholesalerName,
      description: args.description,
      imageUrl: args.imageUrl,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    return { success: true, productId };
  },
});

/**
 * Update product price with history tracking
 * Automatically creates priceHistory entry
 */
export const updatePrice = mutation({
  args: {
    productId: v.id("products"),
    newPrice: v.number(),
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      return { success: false, error: "Product not found" };
    }
    
    const oldPrice = product.price;
    const now = Date.now();
    
    // Update product price
    await ctx.db.patch(args.productId, {
      price: args.newPrice,
      updatedAt: now,
    });
    
    // Record price history
    const priceChange = args.newPrice - oldPrice;
    const percentChange = oldPrice > 0 ? (priceChange / oldPrice) * 100 : 0;
    
    await ctx.db.insert("priceHistory", {
      productId: args.productId,
      productName: product.name,
      oldPrice,
      newPrice: args.newPrice,
      wholesalerId: args.wholesalerId,
      wholesalerName: args.wholesalerName,
      district: product.district,
      category: product.category,
      timestamp: now,
      priceChange,
      percentChange,
    });
    
    return { 
      success: true, 
      oldPrice, 
      newPrice: args.newPrice,
      priceChange,
      percentChange,
    };
  },
});

/**
 * Update product stock
 */
export const updateStock = mutation({
  args: {
    productId: v.id("products"),
    newStock: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.productId, {
      stock: args.newStock,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * Toggle product active status
 */
export const toggleActive = mutation({
  args: {
    productId: v.id("products"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.productId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * Delete product
 */
export const remove = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
    return { success: true };
  },
});

/**
 * ============================================
 * QUERIES - Location-based product discovery
 * ============================================
 */

/**
 * Get products by district - KEY QUERY for local Mandi
 * Retailers see only products from their local district
 */
export const getByDistrict = query({
  args: {
    district: v.string(),
    category: v.optional(v.union(
      v.literal("vegetables"),
      v.literal("fruits"),
      v.literal("grains"),
      v.literal("spices"),
      v.literal("oils"),
      v.literal("dairy"),
      v.literal("dry_fruits"),
      v.literal("other")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("products")
      .withIndex("by_district", (q) => q.eq("district", args.district));
    
    // Filter by category if provided
    if (args.category) {
      query = ctx.db
        .query("products")
        .withIndex("by_district_and_category", (q) => 
          q.eq("district", args.district).eq("category", args.category)
        );
    }
    
    // Only return active products
    const products = await query
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 100);
    
    return products;
  },
});

/**
 * Search products within district
 */
export const searchInDistrict = query({
  args: {
    district: v.string(),
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.or(
            q.contains(q.field("name"), args.searchQuery),
            q.contains(q.field("category"), args.searchQuery)
          )
        )
      )
      .take(50);
    
    return products;
  },
});

/**
 * Get products by wholesaler (for wholesaler dashboard)
 */
export const getByWholesaler = query({
  args: {
    wholesalerId: v.id("users"),
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("products")
      .withIndex("by_wholesalerId", (q) => q.eq("wholesalerId", args.wholesalerId));
    
    if (!args.includeInactive) {
      query = query.filter((q) => q.eq(q.field("isActive"), true));
    }
    
    const products = await query.order("desc").collect();
    return products;
  },
});

/**
 * Get single product by ID
 */
export const getById = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

/**
 * Get products with low stock (for wholesaler alerts)
 */
export const getLowStock = query({
  args: {
    wholesalerId: v.id("users"),
    threshold: v.number(), // e.g., 10
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_wholesalerId", (q) => q.eq("wholesalerId", args.wholesalerId))
      .filter((q) => 
        q.and(
          q.lt(q.field("stock"), args.threshold),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();
    
    return products;
  },
});
