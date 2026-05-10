// TypeScript Interfaces for Kirana Mandi Database Schema

// ============================================
// ENUMS
// ============================================

export type UserRole = 'wholesaler' | 'retailer' | 'admin';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OfflineSyncStatus = 'synced' | 'pending' | 'conflict' | 'failed';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export type KhataEntryType = 'credit' | 'debit' | 'payment';

// ============================================
// POCKETBASE AUTH RECORDS
// ============================================

export interface User {
  id: string;
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
  created: string;
  updated: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
}

// ============================================
// WHOLESALER PROFILE (Extended user info)
// ============================================

export interface Wholesaler {
  id: string;
  user: string; // PocketBase user ID relation
  shop_name: string;
  location: string;
  phone: string;
  created: string;
  updated: string;
  expand?: {
    user?: User;
  };
}

// ============================================
// RETAILER PROFILE (Extended user info)
// ============================================

export interface Retailer {
  id: string;
  user: string; // PocketBase user ID relation
  shop_name: string;
  location: string;
  phone: string;
  preferred_wholesalers: string[]; // Array of wholesaler IDs
  created: string;
  updated: string;
  expand?: {
    user?: User;
  };
}

// ============================================
// PRODUCTS
// ============================================

export interface Product {
  id: string;
  wholesaler: string; // Wholesaler ID
  name: string;
  category: string;
  image: string; // File path
  is_active: boolean;
  created: string;
  updated: string;
  expand?: {
    wholesaler?: Wholesaler;
  };
}

// ============================================
// PRODUCT VARIANTS (Custom Units & Rates)
// ============================================

export interface ProductVariant {
  id: string;
  product: string; // Product ID
  unit_name: string; // e.g., "1kg", "5kg", "30kg", "50kg", "1 Bora", "Half crate"
  unit_weight_kg: number | null; // Optional: actual weight in kg for reference
  price: number; // Price for this specific unit
  stock_quantity: number;
  is_available: boolean;
  min_order_quantity: number; // Minimum quantity retailer can order
  created: string;
  updated: string;
  expand?: {
    product?: Product;
  };
}

// ============================================
// ORDERS
// ============================================

export interface Order {
  id: string;
  retailer: string; // Retailer user ID
  wholesaler: string; // Wholesaler user ID
  status: OrderStatus;
  offline_sync_status: OfflineSyncStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  notes: string;
  created_by_device_id: string | null; // For offline sync tracking
  last_synced_at: string | null;
  created: string;
  updated: string;
  expand?: {
    retailer?: Retailer;
    wholesaler?: Wholesaler;
  };
}

// ============================================
// ORDER ITEMS
// ============================================

export interface OrderItem {
  id: string;
  order: string; // Order ID
  product: string; // Product ID
  product_variant: string; // ProductVariant ID
  quantity: number;
  unit_price: number; // Price at time of order
  total_price: number;
  created: string;
  updated: string;
  expand?: {
    order?: Order;
    product?: Product;
    product_variant?: ProductVariant;
  };
}

// ============================================
// KHATA (Credit Ledger)
// ============================================

export interface Khata {
  id: string;
  wholesaler: string; // Wholesaler ID (creditor)
  retailer: string; // Retailer ID (debtor)
  total_credit_given: number;
  total_credit_repaid: number;
  current_balance: number; // Positive = retailer owes, Negative = wholesaler owes
  last_transaction_date: string;
  created: string;
  updated: string;
  expand?: {
    wholesaler?: Wholesaler;
    retailer?: Retailer;
  };
}

export interface KhataEntry {
  id: string;
  khata: string; // Khata ID
  entry_type: KhataEntryType;
  amount: number;
  description: string;
  related_order: string | null; // Order ID if linked to an order
  transaction_date: string;
  recorded_by: string; // User ID who recorded
  created: string;
  updated: string;
  expand?: {
    khata?: Khata;
    related_order?: Order;
    recorded_by?: User;
  };
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateOrderRequest {
  wholesaler_id: string;
  items: {
    product_variant_id: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface CreateKhataEntryRequest {
  wholesaler_id: string;
  retailer_id: string;
  entry_type: KhataEntryType;
  amount: number;
  description: string;
  related_order_id?: string;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

export interface OrderWithItems extends Order {
  items: OrderItemWithDetails[];
}

export interface OrderItemWithDetails extends OrderItem {
  product_name?: string;
  variant_unit_name?: string;
}

// ============================================
// OFFLINE SYNC TYPES
// ============================================

export interface PendingSyncRecord<T> {
  local_id: string;
  table: string;
  action: 'create' | 'update' | 'delete';
  data: T;
  timestamp: number;
  retry_count: number;
}

export interface SyncResult {
  success: boolean;
  synced_count: number;
  failed_records: PendingSyncRecord<unknown>[];
  conflicts: {
    local: unknown;
    server: unknown;
  }[];
}
