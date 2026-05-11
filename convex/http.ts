/**
 * Convex HTTP Router
 * Webhook handlers for external services
 */

import { httpRouter } from "convex/server";

const http = httpRouter();

/**
 * Webhook handler for Clerk user events
 * Syncs Clerk user data to Convex
 */
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: async (ctx, request) => {
  // Verify webhook signature (in production, verify with Clerk secret)
  const payload = await request.json();
  
  const eventType = payload.type;
  const userData = payload.data;
  
  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        // Check if user exists in Convex
        const existing = await ctx.runQuery(
          ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", userData.id))
            .first()
        );
        
        const userInfo = {
          clerkId: userData.id,
          role: userData.unsafe_metadata?.role || "retailer",
          district: userData.unsafe_metadata?.district || "default",
          shopName: userData.unsafe_metadata?.shopName,
          phone: userData.phone_numbers?.[0]?.phone_number || "",
          name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          email: userData.email_addresses?.[0]?.email_address,
        };
        
        if (existing) {
          // Update
          await ctx.runMutation(
            ctx.db.patch(existing._id, {
              ...userInfo,
              updatedAt: Date.now(),
            })
          );
        } else {
          // Create
          await ctx.runMutation(
            ctx.db.insert("users", {
              ...userInfo,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
          );
        }
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      case "user.deleted": {
        // Optionally soft-delete or mark user as inactive
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      default:
        return new Response(JSON.stringify({ message: "Event ignored" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
},
});

// Export the router as default
export default http;
