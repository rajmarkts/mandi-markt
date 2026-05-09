"use client";

import { useState, useMemo } from "react";
import { Store, ShoppingCart, BookOpen, Cloud, CloudOff } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips, CATEGORIES } from "@/components/CategoryChips";
import { StoreProductCard } from "@/components/StoreProductCard";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import type { ProductWithVariants, ProductVariant } from "@/lib/types";

// Mock products data
const MOCK_PRODUCTS: ProductWithVariants[] = [
  {
    id: "1",
    name: "Desi Aloo (Potatoes)",
    category: "vegetables",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v1", product: "1", unit_name: "1kg", unit_weight_kg: 1, price: 25, stock_quantity: 100, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v2", product: "1", unit_name: "5kg Pack", unit_weight_kg: 5, price: 110, stock_quantity: 50, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v3", product: "1", unit_name: "25kg (1/2 Bora)", unit_weight_kg: 25, price: 500, stock_quantity: 30, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v4", product: "1", unit_name: "50kg (Full Bora)", unit_weight_kg: 50, price: 900, stock_quantity: 20, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "2",
    name: "Basmati Rice Premium",
    category: "grains",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v5", product: "2", unit_name: "1kg", unit_weight_kg: 1, price: 120, stock_quantity: 200, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v6", product: "2", unit_name: "5kg Pack", unit_weight_kg: 5, price: 550, stock_quantity: 100, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v7", product: "2", unit_name: "30kg Bora", unit_weight_kg: 30, price: 3000, stock_quantity: 30, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "3",
    name: "Fresh Tomatoes",
    category: "vegetables",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v8", product: "3", unit_name: "1kg", unit_weight_kg: 1, price: 40, stock_quantity: 80, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v9", product: "3", unit_name: "5kg Crate", unit_weight_kg: 5, price: 180, stock_quantity: 40, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
];

// Simple cart store (in real app, use context or state management)
interface CartItem {
  productId: string;
  productName: string;
  variant: ProductVariant;
  quantity: number;
}

export default function RetailerCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOnline, setIsOnline] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Check online status
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
  }

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  return (
    <div className="space-y-5">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CloudOff className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-bold text-amber-900">Working in Offline Mode</p>
              <p className="text-sm text-amber-700">Orders will sync when internet returns</p>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Cloud className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Online</span>
            </>
          ) : (
            <>
              <CloudOff className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Offline</span>
            </>
          )}
        </div>
        <span className="text-xs text-gray-500">Local Sync Active</span>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Aloo, Rice, Dal..."
        />
        <CategoryChips
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Wholesaler Info */}
      <div className="flex items-center gap-3 py-2">
        <div className="w-12 h-12 bg-[#064e3b] rounded-xl flex items-center justify-center">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Asha Kirana Store</h2>
          <p className="text-sm text-gray-500">Fresh produce daily</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/retailer/product/${product.id}`}
            className="block"
          >
            <StoreProductCard
              product={product}
              selectedVariant={null}
              quantity={0}
              onSelectVariant={() => {}}
              onAddToCart={() => {}}
              onUpdateQuantity={() => {}}
              onOpenUnitSelector={() => {}}
            />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto flex gap-3">
          <Link href="/retailer/cart" className="flex-1">
            <Button 
              className={cn(
                "w-full h-14 relative",
                cartItemCount > 0 && "bg-[#064e3b]"
              )}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/retailer/khata">
            <Button variant="secondary" className="h-14 px-6">
              <BookOpen className="w-5 h-5 mr-2" />
              My Khata
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
