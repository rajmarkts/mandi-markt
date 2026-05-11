# Clerk Authentication Setup for Kirana Mandi

## Required Environment Variables

Add these to your `.env.local` file (create it in project root):

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (for redirect handling)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Your existing PocketBase URL
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-url.com

# Convex Backend URL (for real-time data)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## How to Get Clerk Keys

1. Go to https://clerk.com and create an account
2. Create a new application called "Kirana Mandi"
3. Copy the Publishable Key and Secret Key
4. Add them to your `.env.local`

## Authentication Flow

1. **Landing Page** (`/`) - Public, shows sign-in/sign-up options
2. **Sign In/Up** (`/sign-in`, `/sign-up`) - Clerk handles authentication
3. **Onboarding** (`/onboarding`) - User selects role (Wholesaler/Retailer)
4. **Role-Based Dashboard**:
   - Wholesalers → `/dashboard`
   - Retailers → `/retailer`

## Role-Based Access

### Wholesalers Can Access:
- `/dashboard` - Inventory management
- `/retailer` (view-only for testing)
- `/onboarding`

### Retailers Can Access:
- `/retailer` - Product catalog and ordering
- `/retailer/cart` - Shopping cart
- `/retailer/khata` - Credit/ledger management
- `/onboarding`

### Protected Routes:
All routes except `/`, `/sign-in`, `/sign-up`, and `/api/webhook` require authentication.

## User Metadata Structure

After onboarding, each user has metadata saved in Clerk:

```json
{
  "role": "wholesaler" | "retailer",
  "onboardingCompleted": true
}
```

## Components Available

### RoleGuard
Hide/show content based on user role:

```tsx
import { RoleGuard, WholesalerOnly, RetailerOnly } from "@/components/RoleGuard";

// Show only to wholesalers
<WholesalerOnly>
  <InventoryManager />
</WholesalerOnly>

// Show only to retailers
<RetailerOnly>
  <OrderButton />
</RetailerOnly>

// Custom allowed roles
<RoleGuard allowedRoles={["wholesaler", "retailer"]}>
  <SharedComponent />
</RoleGuard>
```

### Server-Side Role Check

```tsx
import { getUserRole, isWholesaler, isRetailer } from "@/lib/auth";

// In server components or API routes
const role = await getUserRole();
const isSeller = await isWholesaler();
```

## Testing Authentication

1. Visit `/sign-up` to create a new account
2. After signup, you'll be redirected to `/onboarding`
3. Select "I am a Wholesaler" or "I am a Retailer"
4. You'll be redirected to the appropriate dashboard

## Security Notes

- Never expose `CLERK_SECRET_KEY` to the client
- The middleware handles route protection automatically
- User role is stored in session metadata (secure)
- All API routes should verify authentication

## Troubleshooting

### "Cannot find module '@clerk/nextjs'"
Run: `npm install @clerk/nextjs`

### "Missing environment variables"
Check your `.env.local` file has all required keys

### "Redirect loop"
Ensure user metadata is being set correctly in `/onboarding`

---

# Convex Backend Setup

## How to Get Convex URL

1. Go to https://convex.dev and create an account
2. Create a new project called "kirana-mandi"
3. Run `npx convex dev` in your project to initialize
4. Copy the deployment URL from dashboard
5. Add to `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Convex Schema Deploy

After setup, deploy the schema:
```bash
npx convex push
```

## Sync Clerk Users to Convex

The onboarding page automatically syncs users to Convex using the `users.syncClerkUser` mutation.

Users are stored with:
- `clerkId` - Reference to Clerk auth
- `role` - wholesaler/retailer
- `district` - Local Mandi location
- `shopName`, `phone` - Business details

## Key Queries

### For Retailers (See Local Mandi Prices):
```typescript
const products = await ctx.runQuery(api.products.getByDistrict, {
  district: "Lucknow",  // User's district
  category: "vegetables",
});
```

### For Wholesalers (Manage Inventory):
```typescript
const myProducts = await ctx.runQuery(api.products.getByWholesaler, {
  wholesalerId: user._id,
});
```

### Track Price History:
```typescript
const history = await ctx.runQuery(api.priceHistory.getByProduct, {
  productId,
  limit: 30,
});
```

---

# Vercel Deployment Setup

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### Clerk Authentication (Required)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Convex Backend (Required)
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### PocketBase (Optional - if using)
```
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-url.com
```

### Build Settings (Required)
```
NEXT_TELEMETRY_DISABLED=1
```

## Vercel Build Configuration

Create `vercel.json` in project root:
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

## PWA Features Enabled

✅ Service Worker for offline support  
✅ Web App Manifest for "Add to Home Screen"  
✅ Stale-While-Revalidate caching  
✅ Apple Touch Icons & Meta Tags  
✅ Theme Color & Status Bar styling  

## Performance Optimizations

- **Images**: Using `next/image` with WebP/AVIF formats
- **Caching**: SWR (Stale-While-Revalidate) for instant loads
- **Offline**: Service Worker caches assets for offline use
- **Bundle**: Optimized with Turbopack

## Deployment Checklist

- [ ] Add all environment variables to Vercel
- [ ] Deploy Convex schema: `npx convex push`
- [ ] Configure Clerk webhook URL
- [ ] Test PWA on mobile device
- [ ] Verify offline functionality
