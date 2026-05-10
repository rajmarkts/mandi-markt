# Kirana Mandi - Convex Backend

## Architecture Overview

Location-based B2B marketplace backend using Convex for real-time data sync.

## Schema Collections

### 1. `users`
Synced from Clerk authentication with role and district info.
- **Indexes**: `by_clerkId`, `by_role`, `by_district`, `by_district_and_role`

### 2. `products`
Location-based product listings with local Mandi pricing.
- **Indexes**: `by_wholesalerId`, `by_district`, `by_category`, `by_district_and_category`

### 3. `priceHistory`
Tracks every price change for market trend analysis.
- **Indexes**: `by_productId`, `by_district`, `by_category`, `by_timestamp`

### 4. `orders`
B2B order management with payment tracking.
- **Indexes**: `by_retailerId`, `by_wholesalerId`, `by_district`, `by_status`

### 5. `marketTrends`
Aggregated daily market data for trend analysis.

## Key Features

### Location-Based Pricing
Retailers see only products from their local district (Mandi):
```typescript
// Query local products
const localProducts = await ctx.db
  .query("products")
  .withIndex("by_district", (q) => q.eq("district", "Lucknow"))
  .collect();
```

### Price History Tracking
Every price update creates a history entry:
```typescript
// Update price + track history
await ctx.runMutation(api.products.updatePrice, {
  productId,
  newPrice: 45,
  wholesalerId,
});
```

### Clerk Sync
Webhook endpoint syncs Clerk users to Convex automatically.

## Environment Setup

Add to `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Get your Convex URL from https://dashboard.convex.dev

## Deployment

1. Push schema:
```bash
npx convex push
```

2. Deploy to production:
```bash
npx convex deploy
```

## Queries Available

### For Retailers
- `products.getByDistrict` - See local Mandi prices
- `products.searchInDistrict` - Search local products
- `priceHistory.getByDistrict` - Track local price trends
- `orders.create` - Place order
- `orders.getByRetailer` - Order history

### For Wholesalers
- `products.getByWholesaler` - Manage inventory
- `products.updatePrice` - Update prices (auto-tracks history)
- `orders.getByWholesaler` - Incoming orders
- `orders.updateStatus` - Update order status
- `orders.recordPayment` - Track payments

## Security Model

- Row-level security via queries (filters by district/ownership)
- Authentication via Clerk
- User role stored in metadata
- Wholesalers can only edit their own products
