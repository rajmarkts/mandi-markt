/**
 * Kirana Mandi - Convex Database Schema
 * Location-based B2B marketplace for agricultural trade
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // USERS - Synced from Clerk with role & location
  // ============================================
  users: defineTable({
    // Clerk authentication reference
    tokenIdentifier: v.string(),
    
    // User role: wholesaler or retailer
    role: v.optional(v.union(v.literal("wholesaler"), v.literal("retailer"))),
    
    // User profile
    name: v.string(),
    
    // Onboarding status - tracks who has finished setup
    onboarded: v.boolean(),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"]),

  // ============================================
  // PRODUCTS - With location-based pricing
  // ============================================
  products: defineTable({
    // Product info
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
    
    // Current price & unit
    price: v.number(),
    unit: v.string(), // "kg", "litre", "piece", etc.
    
    // Stock availability
    stock: v.number(),
    
    // Location - which mandi/district this product belongs to
    district: v.string(),
    
    // Reference to wholesaler who listed this
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
    
    // Product details
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    
    // Active status
    isActive: v.boolean(),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_wholesalerId", ["wholesalerId"])
    .index("by_district", ["district"])
    .index("by_category", ["category"])
    .index("by_district_and_category", ["district", "category"])
    .index("by_active", ["isActive"]),

  // ============================================
  // PRICE HISTORY - Track market trends
  // ============================================
  priceHistory: defineTable({
    // Reference to product
    productId: v.id("products"),
    productName: v.string(),
    
    // Price change details
    oldPrice: v.number(),
    newPrice: v.number(),
    
    // Which wholesaler made the change
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
    
    // Location context
    district: v.string(),
    
    // Category for trend analysis
    category: v.string(),
    
    // Timestamp of change
    timestamp: v.number(),
    
    // Calculated fields for quick analysis
    priceChange: v.number(), // newPrice - oldPrice
    percentChange: v.number(), // ((new - old) / old) * 100
  })
    .index("by_productId", ["productId"])
    .index("by_district", ["district"])
    .index("by_category", ["category"])
    .index("by_timestamp", ["timestamp"])
    .index("by_district_and_category", ["district", "category"]),

  // ============================================
  // ORDERS - With payment tracking
  // ============================================
  orders: defineTable({
    // Order parties
    retailerId: v.id("users"),
    retailerName: v.optional(v.string()),
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
    
    // Order items (simplified for query performance)
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      unit: v.string(),
      priceAtOrder: v.number(),
      total: v.number(),
    })),
    
    // Order status
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    
    // Financials
    total: v.number(),
    
    // Payment tracking
    paymentType: v.union(
      v.literal("cash"),
      v.literal("khata"),
      v.literal("upi"),
      v.literal("bank_transfer")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("partial"),
      v.literal("paid")
    ),
    amountPaid: v.number(),
    
    // Location context
    district: v.string(),
    
    // Additional info
    notes: v.optional(v.string()),
    deliveryDate: v.optional(v.number()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_retailerId", ["retailerId"])
    .index("by_wholesalerId", ["wholesalerId"])
    .index("by_district", ["district"])
    .index("by_status", ["status"])
    .index("by_paymentStatus", ["paymentStatus"])
    .index("by_createdAt", ["createdAt"]),

  // ============================================
  // MARKET TRENDS - Aggregated price data
  // ============================================
  marketTrends: defineTable({
    // Location & category
    district: v.string(),
    category: v.string(),
    
    // Date for the trend (daily aggregation)
    date: v.string(), // YYYY-MM-DD format
    
    // Aggregated stats
    avgPrice: v.number(),
    minPrice: v.number(),
    maxPrice: v.number(),
    totalProducts: v.number(),
    
    // Change from previous day
    priceChangePercent: v.optional(v.number()),
    
    // Timestamp
    timestamp: v.number(),
  })
    .index("by_district_and_category", ["district", "category"])
    .index("by_date", ["date"])
    .index("by_district_category_date", ["district", "category", "date"]),
});
