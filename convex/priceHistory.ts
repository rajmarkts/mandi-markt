/**
 * Price History Queries & Market Trends
 * Track price changes and market trends by district
 */

import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get price history for a specific product
 */
export const getByProduct = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(args.limit || 30);
    
    return history;
  },
});

/**
 * Get price history by district
 * Shows all price changes in a local mandi
 */
export const getByDistrict = query({
  args: {
    district: v.string(),
    days: v.optional(v.number()), // Last N days
  },
  handler: async (ctx, args) => {
    const cutoff = args.days 
      ? Date.now() - (args.days * 24 * 60 * 60 * 1000)
      : 0;
    
    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .order("desc")
      .take(100);
    
    return history;
  },
});

/**
 * Get market trends by category
 * Aggregated price trends for market analysis
 */
export const getCategoryTrends = query({
  args: {
    district: v.string(),
    category: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoff = args.days 
      ? Date.now() - (args.days * 24 * 60 * 60 * 1000)
      : Date.now() - (30 * 24 * 60 * 60 * 1000); // Default 30 days
    
    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_district_and_category", (q) => 
        q.eq("district", args.district).eq("category", args.category)
      )
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .order("desc")
      .collect();
    
    // Calculate trend statistics
    if (history.length === 0) {
      return { 
        history: [], 
        trend: "stable", 
        avgChange: 0,
        priceRange: { min: 0, max: 0 },
      };
    }
    
    const changes = history.map(h => h.percentChange);
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    
    const prices = history.map(h => h.newPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    let trend: "rising" | "falling" | "stable" = "stable";
    if (avgChange > 5) trend = "rising";
    else if (avgChange < -5) trend = "falling";
    
    return {
      history,
      trend,
      avgChange,
      priceRange: { min, max },
    };
  },
});

/**
 * Get price comparison across wholesalers in district
 */
export const getWholesalerComparison = query({
  args: {
    district: v.string(),
    productName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get latest prices from each wholesaler for this product
    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .filter((q) => q.eq(q.field("productName"), args.productName))
      .order("desc")
      .take(50);
    
    // Group by wholesaler and get latest
    const byWholesaler = new Map();
    
    for (const entry of history) {
      if (!byWholesaler.has(entry.wholesalerId)) {
        byWholesaler.set(entry.wholesalerId, {
          wholesalerId: entry.wholesalerId,
          wholesalerName: entry.wholesalerName,
          currentPrice: entry.newPrice,
          lastUpdated: entry.timestamp,
          priceChange: entry.percentChange,
        });
      }
    }
    
    return Array.from(byWholesaler.values());
  },
});

/**
 * Get top price changes (significant market movements)
 */
export const getTopMovers = query({
  args: {
    district: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .filter((q) => q.gte(q.field("timestamp"), oneDayAgo))
      .order("desc")
      .take(100);
    
    // Sort by absolute percent change
    const sorted = history.sort((a, b) => 
      Math.abs(b.percentChange) - Math.abs(a.percentChange)
    );
    
    return sorted.slice(0, args.limit || 10);
  },
});

/**
 * Generate daily market report
 */
export const getDailyReport = query({
  args: {
    district: v.string(),
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    // Get existing trend data if available
    const trend = await ctx.db
      .query("marketTrends")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .filter((q) => q.eq(q.field("date"), args.date))
      .first();
    
    if (trend) {
      return trend;
    }
    
    // Generate from price history
    const startOfDay = new Date(args.date).getTime();
    const endOfDay = startOfDay + (24 * 60 * 60 * 1000);
    
    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .filter((q) => 
        q.and(
          q.gte(q.field("timestamp"), startOfDay),
          q.lt(q.field("timestamp"), endOfDay)
        )
      )
      .collect();
    
    if (history.length === 0) {
      return null;
    }
    
    const prices = history.map(h => h.newPrice);
    
    return {
      district: args.district,
      date: args.date,
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      totalProducts: new Set(history.map(h => h.productId)).size,
    };
  },
});
