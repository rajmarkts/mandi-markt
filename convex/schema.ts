/**
 * Kirana Mandi - Convex Database Schema
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    clerkId: v.optional(v.string()),
    role: v.optional(v.union(v.literal("wholesaler"), v.literal("retailer"))),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    shopName: v.optional(v.string()),
    district: v.optional(v.string()),
    onboarded: v.boolean(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_district", ["district"]),

  products: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("vegetables"), v.literal("fruits"), v.literal("grains"),
      v.literal("spices"), v.literal("oils"), v.literal("dairy"),
      v.literal("dry_fruits"), v.literal("other")
    ),
    price: v.number(),
    unit: v.string(),
    stock: v.number(),
    district: v.string(),
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_wholesalerId", ["wholesalerId"])
    .index("by_district", ["district"])
    .index("by_category", ["category"])
    .index("by_district_and_category", ["district", "category"])
    .index("by_active", ["isActive"]),

  priceHistory: defineTable({
    productId: v.id("products"),
    productName: v.string(),
    oldPrice: v.number(),
    newPrice: v.number(),
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
    district: v.string(),
    category: v.string(),
    timestamp: v.number(),
    priceChange: v.number(),
    percentChange: v.number(),
  })
    .index("by_productId", ["productId"])
    .index("by_district", ["district"])
    .index("by_category", ["category"])
    .index("by_timestamp", ["timestamp"])
    .index("by_district_and_category", ["district", "category"]),

  orders: defineTable({
    retailerId: v.id("users"),
    retailerName: v.optional(v.string()),
    wholesalerId: v.id("users"),
    wholesalerName: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      unit: v.string(),
      priceAtOrder: v.number(),
      total: v.number(),
    })),
    status: v.union(
      v.literal("pending"), v.literal("confirmed"), v.literal("processing"),
      v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")
    ),
    total: v.number(),
    paymentType: v.union(v.literal("cash"), v.literal("khata"), v.literal("upi"), v.literal("bank_transfer")),
    paymentStatus: v.union(v.literal("pending"), v.literal("partial"), v.literal("paid")),
    amountPaid: v.number(),
    district: v.string(),
    notes: v.optional(v.string()),
    deliveryDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_retailerId", ["retailerId"])
    .index("by_wholesalerId", ["wholesalerId"])
    .index("by_district", ["district"])
    .index("by_status", ["status"])
    .index("by_paymentStatus", ["paymentStatus"])
    .index("by_createdAt", ["createdAt"]),

  marketTrends: defineTable({
    district: v.string(),
    category: v.string(),
    date: v.string(),
    avgPrice: v.number(),
    minPrice: v.number(),
    maxPrice: v.number(),
    totalProducts: v.number(),
    priceChangePercent: v.optional(v.number()),
    timestamp: v.number(),
  })
    .index("by_district", ["district"])
    .index("by_district_and_category", ["district", "category"])
    .index("by_date", ["date"])
    .index("by_district_category_date", ["district", "category", "date"]),
});