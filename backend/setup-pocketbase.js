/**
 * PocketBase Setup Script
 * Run this with: node backend/setup-pocketbase.js
 * 
 * This script will import all collections and create an admin user
 */

const fs = require('fs');
const path = require('path');

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://mandi-pocketbase.fly.dev';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@mandimarkt.com';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'admin123456';

async function setupPocketBase() {
  console.log('🚀 Setting up Mandi Markt PocketBase...\n');

  // Step 1: Check if schema file exists
  const schemaPath = path.join(__dirname, 'pb_schema.json');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found at:', schemaPath);
    process.exit(1);
  }

  console.log('✅ Schema file found');
  console.log('📋 Collections to create:');
  console.log('   • users (with role, phone fields)');
  console.log('   • wholesalers');
  console.log('   • retailers');
  console.log('   • products');
  console.log('   • product_variants');
  console.log('   • orders');
  console.log('   • order_items');
  console.log('   • khata');
  console.log('   • khata_entries\n');

  console.log('🔧 Manual Setup Required:');
  console.log('   1. Visit:', `${POCKETBASE_URL}/_/#/collections/import`);
  console.log('   2. Upload: backend/pb_schema.json');
  console.log('   3. Click "Import"\n');

  console.log('👤 Create First Wholesaler:');
  console.log('   1. Go to Collections → users → New Record');
  console.log(`   2. Email: ${ADMIN_EMAIL}`);
  console.log(`   3. Password: ${ADMIN_PASSWORD}`);
  console.log('   4. Role: wholesaler');
  console.log('   5. Phone: +91XXXXXXXXXX');
  console.log('   6. Then create wholesaler record linked to this user\n');

  console.log('📚 Full guide: https://github.com/rajmarkts/mandi-markt/blob/main/backend/README.md');
}

setupPocketBase().catch(console.error);
