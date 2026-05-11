/**
 * Convex HTTP Router
 * Webhook handlers for external services
 */

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

/**
 * Webhook handler for Clerk user events
 * Syncs Clerk user data to Convex
 */
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let payload: { type?: string; data?: any } = {};
    
    // Safely parse request body
    try {
      payload = await request.json();
    } catch (parseError) {
      console.error("Failed to parse webhook payload:", parseError);
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    const eventType = payload.type;
    const userData = payload.data;
  
    // Validate required fields
    if (!eventType || !userData) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        // Import the internal functions to call via runQuery/runMutation
        const userInfo = {
          clerkId: userData.id,
          role: userData.unsafe_metadata?.role || "retailer",
          district: userData.unsafe_metadata?.district || "default",
          shopName: userData.unsafe_metadata?.shopName,
          phone: userData.phone_numbers?.[0]?.phone_number || "",
          name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          email: userData.email_addresses?.[0]?.email_address,
        };
        
        // Call the syncClerkUser mutation to handle the database operations
        await ctx.runMutation(api.users.syncClerkUser, {
          clerkId: userData.id,
          role: userInfo.role as "wholesaler" | "retailer",
          district: userInfo.district,
          shopName: userInfo.shopName,
          phone: userInfo.phone,
          name: userInfo.name,
          email: userInfo.email,
        });
        
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
}),
});

// Export the router as default
export default http;
