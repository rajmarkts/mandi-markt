import PocketBase from 'pocketbase';
import type {
  User,
  Wholesaler,
  Retailer,
  Product,
  ProductVariant,
  Order,
  OrderItem,
  Khata,
  KhataEntry,
} from './types';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

// ============================================
// COLLECTION NAMES
// ============================================

export const COLLECTIONS = {
  USERS: 'users',
  WHOLESALERS: 'wholesalers',
  RETAILERS: 'retailers',
  PRODUCTS: 'products',
  PRODUCT_VARIANTS: 'product_variants',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  KHATA: 'khata',
  KHATA_ENTRIES: 'khata_entries',
} as const;

// ============================================
// AUTH HELPERS
// ============================================

export const authHelpers = {
  getCurrentUser(): User | null {
    return pb.authStore.model as User | null;
  },

  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  async login(email: string, password: string): Promise<User> {
    const authData = await pb
      .collection(COLLECTIONS.USERS)
      .authWithPassword(email, password);
    return authData.record as unknown as User;
  },

  async logout(): Promise<void> {
    pb.authStore.clear();
  },

  async register(
    email: string,
    password: string,
    passwordConfirm: string,
    userData: Partial<User>
  ): Promise<User> {
    const data = {
      email,
      password,
      passwordConfirm,
      ...userData,
    };
    const record = await pb.collection(COLLECTIONS.USERS).create<User>(data);
    return record;
  },
};

// ============================================
// WHOLESALER API
// ============================================

export const wholesalerApi = {
  async getAll(): Promise<Wholesaler[]> {
    return pb
      .collection(COLLECTIONS.WHOLESALERS)
      .getFullList<Wholesaler>({
        expand: 'user',
      });
  },

  async getById(id: string): Promise<Wholesaler> {
    return pb.collection(COLLECTIONS.WHOLESALERS).getOne<Wholesaler>(id, {
      expand: 'user',
    });
  },

  async getByUser(userId: string): Promise<Wholesaler | null> {
    const result = await pb
      .collection(COLLECTIONS.WHOLESALERS)
      .getList<Wholesaler>(1, 1, {
        filter: `user = "${userId}"`,
      });
    return result.items[0] || null;
  },

  async create(data: Omit<Wholesaler, 'id' | 'created' | 'updated'>): Promise<Wholesaler> {
    return pb.collection(COLLECTIONS.WHOLESALERS).create<Wholesaler>(data);
  },

  async update(id: string, data: Partial<Wholesaler>): Promise<Wholesaler> {
    return pb.collection(COLLECTIONS.WHOLESALERS).update<Wholesaler>(id, data);
  },
};

// ============================================
// RETAILER API
// ============================================

export const retailerApi = {
  async getAll(): Promise<Retailer[]> {
    return pb.collection(COLLECTIONS.RETAILERS).getFullList<Retailer>({
      expand: 'user',
    });
  },

  async getById(id: string): Promise<Retailer> {
    return pb.collection(COLLECTIONS.RETAILERS).getOne<Retailer>(id, {
      expand: 'user',
    });
  },

  async getByUser(userId: string): Promise<Retailer | null> {
    const result = await pb
      .collection(COLLECTIONS.RETAILERS)
      .getList<Retailer>(1, 1, {
        filter: `user = "${userId}"`,
      });
    return result.items[0] || null;
  },

  async create(data: Omit<Retailer, 'id' | 'created' | 'updated'>): Promise<Retailer> {
    return pb.collection(COLLECTIONS.RETAILERS).create<Retailer>(data);
  },

  async update(id: string, data: Partial<Retailer>): Promise<Retailer> {
    return pb.collection(COLLECTIONS.RETAILERS).update<Retailer>(id, data);
  },
};

// ============================================
// PRODUCT API
// ============================================

export const productApi = {
  async getAll(): Promise<Product[]> {
    return pb.collection(COLLECTIONS.PRODUCTS).getFullList<Product>({
      filter: 'is_active = true',
      expand: 'wholesaler',
    });
  },

  async getByWholesaler(wholesalerId: string): Promise<Product[]> {
    return pb.collection(COLLECTIONS.PRODUCTS).getFullList<Product>({
      filter: `wholesaler = "${wholesalerId}" && is_active = true`,
    });
  },

  async getById(id: string): Promise<Product> {
    return pb.collection(COLLECTIONS.PRODUCTS).getOne<Product>(id, {
      expand: 'wholesaler',
    });
  },

  async create(data: Omit<Product, 'id' | 'created' | 'updated'>): Promise<Product> {
    return pb.collection(COLLECTIONS.PRODUCTS).create<Product>(data);
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return pb.collection(COLLECTIONS.PRODUCTS).update<Product>(id, data);
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.PRODUCTS).delete(id);
  },
};

// ============================================
// PRODUCT VARIANT API
// ============================================

export const productVariantApi = {
  async getAll(): Promise<ProductVariant[]> {
    return pb
      .collection(COLLECTIONS.PRODUCT_VARIANTS)
      .getFullList<ProductVariant>({
        filter: 'is_available = true',
        expand: 'product',
      });
  },

  async getByProduct(productId: string): Promise<ProductVariant[]> {
    return pb
      .collection(COLLECTIONS.PRODUCT_VARIANTS)
      .getFullList<ProductVariant>({
        filter: `product = "${productId}" && is_available = true`,
      });
  },

  async getById(id: string): Promise<ProductVariant> {
    return pb
      .collection(COLLECTIONS.PRODUCT_VARIANTS)
      .getOne<ProductVariant>(id, {
        expand: 'product',
      });
  },

  async create(
    data: Omit<ProductVariant, 'id' | 'created' | 'updated'>
  ): Promise<ProductVariant> {
    return pb
      .collection(COLLECTIONS.PRODUCT_VARIANTS)
      .create<ProductVariant>(data);
  },

  async update(
    id: string,
    data: Partial<ProductVariant>
  ): Promise<ProductVariant> {
    return pb
      .collection(COLLECTIONS.PRODUCT_VARIANTS)
      .update<ProductVariant>(id, data);
  },

  async delete(id: string): Promise<void> {
    await pb.collection(COLLECTIONS.PRODUCT_VARIANTS).delete(id);
  },
};

// ============================================
// ORDER API
// ============================================

export const orderApi = {
  async getAll(): Promise<Order[]> {
    return pb.collection(COLLECTIONS.ORDERS).getFullList<Order>({
      expand: 'retailer,wholesaler',
      sort: '-created',
    });
  },

  async getByRetailer(retailerId: string): Promise<Order[]> {
    return pb.collection(COLLECTIONS.ORDERS).getFullList<Order>({
      filter: `retailer = "${retailerId}"`,
      expand: 'wholesaler',
      sort: '-created',
    });
  },

  async getByWholesaler(wholesalerId: string): Promise<Order[]> {
    return pb.collection(COLLECTIONS.ORDERS).getFullList<Order>({
      filter: `wholesaler = "${wholesalerId}"`,
      expand: 'retailer',
      sort: '-created',
    });
  },

  async getById(id: string): Promise<Order> {
    return pb.collection(COLLECTIONS.ORDERS).getOne<Order>(id, {
      expand: 'retailer,wholesaler',
    });
  },

  async create(data: Omit<Order, 'id' | 'created' | 'updated'>): Promise<Order> {
    return pb.collection(COLLECTIONS.ORDERS).create<Order>(data);
  },

  async update(id: string, data: Partial<Order>): Promise<Order> {
    return pb.collection(COLLECTIONS.ORDERS).update<Order>(id, data);
  },

  async updateSyncStatus(
    id: string,
    syncStatus: Order['offline_sync_status']
  ): Promise<Order> {
    return pb.collection(COLLECTIONS.ORDERS).update<Order>(id, {
      offline_sync_status: syncStatus,
      last_synced_at: new Date().toISOString(),
    });
  },

  async updatePaymentStatus(
    id: string,
    paymentStatus: Order['payment_status'],
    amountPaid: number
  ): Promise<Order> {
    const order = await this.getById(id);
    const newAmountPaid = order.amount_paid + amountPaid;
    const newAmountDue = order.total_amount - newAmountPaid;

    return pb.collection(COLLECTIONS.ORDERS).update<Order>(id, {
      payment_status: paymentStatus,
      amount_paid: newAmountPaid,
      amount_due: newAmountDue,
    });
  },
};

// ============================================
// ORDER ITEM API
// ============================================

export const orderItemApi = {
  async getByOrder(orderId: string): Promise<OrderItem[]> {
    return pb.collection(COLLECTIONS.ORDER_ITEMS).getFullList<OrderItem>({
      filter: `order = "${orderId}"`,
      expand: 'product,product_variant',
    });
  },

  async create(
    data: Omit<OrderItem, 'id' | 'created' | 'updated'>
  ): Promise<OrderItem> {
    return pb.collection(COLLECTIONS.ORDER_ITEMS).create<OrderItem>(data);
  },

  async createBatch(
    items: Omit<OrderItem, 'id' | 'created' | 'updated'>[]
  ): Promise<OrderItem[]> {
    const promises = items.map((item) => this.create(item));
    return Promise.all(promises);
  },
};

// ============================================
// KHATA API (Credit Ledger)
// ============================================

export const khataApi = {
  async getAll(): Promise<Khata[]> {
    return pb.collection(COLLECTIONS.KHATA).getFullList<Khata>({
      expand: 'wholesaler,retailer',
    });
  },

  async getByWholesaler(wholesalerId: string): Promise<Khata[]> {
    return pb.collection(COLLECTIONS.KHATA).getFullList<Khata>({
      filter: `wholesaler = "${wholesalerId}"`,
      expand: 'retailer',
    });
  },

  async getByRetailer(retailerId: string): Promise<Khata[]> {
    return pb.collection(COLLECTIONS.KHATA).getFullList<Khata>({
      filter: `retailer = "${retailerId}"`,
      expand: 'wholesaler',
    });
  },

  async getByPair(
    wholesalerId: string,
    retailerId: string
  ): Promise<Khata | null> {
    const result = await pb
      .collection(COLLECTIONS.KHATA)
      .getList<Khata>(1, 1, {
        filter: `wholesaler = "${wholesalerId}" && retailer = "${retailerId}"`,
      });
    return result.items[0] || null;
  },

  async getOrCreate(
    wholesalerId: string,
    retailerId: string
  ): Promise<Khata> {
    const existing = await this.getByPair(wholesalerId, retailerId);
    if (existing) return existing;

    return pb.collection(COLLECTIONS.KHATA).create<Khata>({
      wholesaler: wholesalerId,
      retailer: retailerId,
      total_credit_given: 0,
      total_credit_repaid: 0,
      current_balance: 0,
      last_transaction_date: new Date().toISOString(),
    });
  },

  async updateBalance(
    khataId: string,
    entryType: KhataEntry['entry_type'],
    amount: number
  ): Promise<Khata> {
    const khata = await pb.collection(COLLECTIONS.KHATA).getOne<Khata>(khataId);

    let newBalance = khata.current_balance;
    let newCreditGiven = khata.total_credit_given;
    let newCreditRepaid = khata.total_credit_repaid;

    switch (entryType) {
      case 'credit':
        newBalance += amount;
        newCreditGiven += amount;
        break;
      case 'debit':
        newBalance -= amount;
        break;
      case 'payment':
        newBalance -= amount;
        newCreditRepaid += amount;
        break;
    }

    return pb.collection(COLLECTIONS.KHATA).update<Khata>(khataId, {
      current_balance: newBalance,
      total_credit_given: newCreditGiven,
      total_credit_repaid: newCreditRepaid,
      last_transaction_date: new Date().toISOString(),
    });
  },
};

// ============================================
// KHATA ENTRIES API
// ============================================

export const khataEntryApi = {
  async getByKhata(khataId: string): Promise<KhataEntry[]> {
    return pb.collection(COLLECTIONS.KHATA_ENTRIES).getFullList<KhataEntry>({
      filter: `khata = "${khataId}"`,
      sort: '-transaction_date',
      expand: 'recorded_by,related_order',
    });
  },

  async create(
    data: Omit<KhataEntry, 'id' | 'created' | 'updated'>
  ): Promise<KhataEntry> {
    // First create the entry
    const entry = await pb
      .collection(COLLECTIONS.KHATA_ENTRIES)
      .create<KhataEntry>(data);

    // Then update the Khata balance
    await khataApi.updateBalance(data.khata, data.entry_type, data.amount);

    return entry;
  },

  async getRecentEntries(limit: number = 20): Promise<KhataEntry[]> {
    return pb.collection(COLLECTIONS.KHATA_ENTRIES).getFullList<KhataEntry>({
      sort: '-transaction_date',
      limit: limit,
      expand: 'khata,khata.wholesaler,khata.retailer',
    });
  },
};

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export const realtimeApi = {
  subscribeOrders(callback: (data: Order) => void): () => void {
    pb.collection(COLLECTIONS.ORDERS).subscribe('*', (e) => {
      callback(e.record as unknown as Order);
    });
    return () => pb.collection(COLLECTIONS.ORDERS).unsubscribe('*');
  },

  subscribeKhata(callback: (data: Khata) => void): () => void {
    pb.collection(COLLECTIONS.KHATA).subscribe('*', (e) => {
      callback(e.record as unknown as Khata);
    });
    return () => pb.collection(COLLECTIONS.KHATA).unsubscribe('*');
  },
};
