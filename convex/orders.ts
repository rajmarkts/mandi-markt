/**
 * Order Mutations and Queries
 * B2B order management with payment tracking
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new order (Retailer places order)
 */
export const create = mutation({
  args: {
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
    total: v.number(),
    paymentType: v.union(
      v.literal("cash"),
      v.literal("khata"),
      v.literal("upi"),
      v.literal("bank_transfer")
    ),
    district: v.string(),
    notes: v.optional(v.string()),
    deliveryDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const orderId = await ctx.db.insert("orders", {
      retailerId: args.retailerId,
      retailerName: args.retailerName,
      wholesalerId: args.wholesalerId,
      wholesalerName: args.wholesalerName,
      items: args.items,
      status: "pending",
      total: args.total,
      paymentType: args.paymentType,
      paymentStatus: args.paymentType === "cash" ? "pending" : "pending",
      amountPaid: 0,
      district: args.district,
      notes: args.notes,
      deliveryDate: args.deliveryDate,
      createdAt: now,
      updatedAt: now,
    });
    
    return { success: true, orderId };
  },
});

/**
 * Update order status (Wholesaler updates)
 */
export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * Record payment on order
 */
export const recordPayment = mutation({
  args: {
    orderId: v.id("orders"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    
    const newAmountPaid = order.amountPaid + args.amount;
    const total = order.total;
    
    // Determine payment status
    let paymentStatus: "pending" | "partial" | "paid" = "pending";
    if (newAmountPaid >= total) {
      paymentStatus = "paid";
    } else if (newAmountPaid > 0) {
      paymentStatus = "partial";
    }
    
    await ctx.db.patch(args.orderId, {
      amountPaid: newAmountPaid,
      paymentStatus,
      updatedAt: Date.now(),
    });
    
    return { 
      success: true, 
      amountPaid: newAmountPaid,
      remaining: total - newAmountPaid,
      paymentStatus,
    };
  },
});

/**
 * Cancel order
 */
export const cancel = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * ============================================
 * QUERIES
 * ============================================
 */

/**
 * Get orders for retailer
 */
export const getByRetailer = query({
  args: {
    retailerId: v.id("users"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("orders")
      .withIndex("by_retailerId", (q) => q.eq("retailerId", args.retailerId));
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const orders = await query
      .order("desc")
      .take(args.limit || 50);
    
    return orders;
  },
});

/**
 * Get orders for wholesaler
 */
export const getByWholesaler = query({
  args: {
    wholesalerId: v.id("users"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("orders")
      .withIndex("by_wholesalerId", (q) => q.eq("wholesalerId", args.wholesalerId));
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const orders = await query
      .order("desc")
      .take(args.limit || 50);
    
    return orders;
  },
});

/**
 * Get single order
 */
export const getById = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

/**
 * Get pending orders count (for dashboard badges)
 */
export const getPendingCount = query({
  args: {
    wholesalerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_wholesalerId", (q) => q.eq("wholesalerId", args.wholesalerId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
    
    return orders.length;
  },
});

/**
 * Get Khata (credit) orders - unpaid or partially paid
 */
export const getKhataOrders = query({
  args: {
    retailerId: v.optional(v.id("users")),
    wholesalerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let query;
    
    if (args.retailerId) {
      query = ctx.db
        .query("orders")
        .withIndex("by_retailerId", (q) => q.eq("retailerId", args.retailerId));
    } else if (args.wholesalerId) {
      query = ctx.db
        .query("orders")
        .withIndex("by_wholesalerId", (q) => q.eq("wholesalerId", args.wholesalerId));
    } else {
      return [];
    }
    
    const orders = await query
      .filter((q) => 
        q.or(
          q.eq(q.field("paymentStatus"), "pending"),
          q.eq(q.field("paymentStatus"), "partial")
        )
      )
      .order("desc")
      .collect();
    
    // Calculate total credit
    const totalCredit = orders.reduce((sum, order) => {
      return sum + (order.total - order.amountPaid);
    }, 0);
    
    return {
      orders,
      totalCredit,
      count: orders.length,
    };
  },
});
