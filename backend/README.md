# PocketBase Setup for Mandi Markt

## Quick Setup (3 minutes)

### Step 1: Import Collections

1. Open PocketBase Admin: `https://mandi-pocketbase.fly.dev/_/#/collections/import`
2. Upload `pb_schema.json` file from this folder
3. Click **"Import Collections"**
4. Done! All tables are created.

### Step 2: Create Admin User

1. Go to **Collections → users → New Record**
2. Fill in:
   - **Email**: `admin@mandimarkt.com`
   - **Password**: Choose a strong password
   - **Name**: `Admin User`
   - **Role**: `admin`
   - **Phone**: `+91XXXXXXXXXX`
3. Save

### Step 3: Create First Wholesaler

1. Go to **Collections → wholesalers → New Record**
2. Fill in:
   - **Created By**: Select the admin user you just created
   - **Name**: `Your Business Name`
   - **Phone**: `+91XXXXXXXXXX`
   - **Address**: Your address
   - **City**: Your city
   - **State**: Your state
   - **Is Verified**: ✅ true
3. Save

### Step 4: Add Sample Product

1. Go to **Collections → products → New Record**
2. Fill in:
   - **Name**: `Desi Aloo (Potatoes)`
   - **Category**: `vegetables`
   - **Wholesaler**: Select your wholesaler
   - **Image**: Upload a photo
   - **Is Active**: ✅ true
3. Save

4. Go to **Collections → product_variants → New Record**
   - **Product**: Select the product you just created
   - **Unit Name**: `50kg Bora`
   - **Unit Weight Kg**: `50`
   - **Price**: `900`
   - **Stock Quantity**: `100`
   - **Min Order Quantity**: `1`
   - **Is Available**: ✅ true
5. Save

## Verify Setup

Visit your Netlify frontend:
- `mandimarkt.netlify.app/retailer` - Should show the sample product
- `mandimarkt.netlify.app/dashboard` - Should allow adding more products

## Troubleshooting

### "Failed to import collections"
- Make sure you're using PocketBase v0.22.0 or later
- Check if collections already exist (delete them first if needed)

### "Cannot connect to PocketBase"
- Verify Railway URL is correct
- Check Railway dashboard for service status

### "Images not uploading"
- In PocketBase Admin: **Settings → File storage**
- Ensure max file size is at least 5MB
- Allowed MIME types include: `image/jpeg, image/png, image/webp`

## API Endpoints

After setup, your frontend connects to:
- **API URL**: `https://mandi-pocketbase.fly.dev`
- **Admin Panel**: `https://mandi-pocketbase.fly.dev/_`

## Need Help?

Open an issue at: https://github.com/rajmarkts/mandi-markt/issues
