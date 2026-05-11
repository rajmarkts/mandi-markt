"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, BookOpen, Store } from "lucide-react";
import Link from "next/link";
import { SearchHero } from "@/components/SearchHero";
import { CategoryChips, CATEGORIES } from "@/components/CategoryChips";
import { StoreProductCard } from "@/components/StoreProductCard";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import type { ProductWithVariants, ProductVariant } from "@/lib/types";

// Mock products data with Kirana Mandi branding
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
  {
    id: "4",
    name: "Yellow Moong Dal",
    category: "grains",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v10", product: "4", unit_name: "1kg", unit_weight_kg: 1, price: 140, stock_quantity: 150, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v11", product: "4", unit_name: "5kg Pack", unit_weight_kg: 5, price: 650, stock_quantity: 60, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v12", product: "4", unit_name: "25kg Bag", unit_weight_kg: 25, price: 3100, stock_quantity: 25, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "5",
    name: "Fresh Onions",
    category: "vegetables",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v13", product: "5", unit_name: "1kg", unit_weight_kg: 1, price: 35, stock_quantity: 200, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v14", product: "5", unit_name: "10kg Bag", unit_weight_kg: 10, price: 320, stock_quantity: 50, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v15", product: "5", unit_name: "50kg Bora", unit_weight_kg: 50, price: 1500, stock_quantity: 15, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "6",
    name: "Mustard Oil",
    category: "oils",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v16", product: "6", unit_name: "1L Bottle", unit_weight_kg: 1, price: 180, stock_quantity: 120, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v17", product: "6", unit_name: "5L Can", unit_weight_kg: 5, price: 850, stock_quantity: 40, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v18", product: "6", unit_name: "15L Tin", unit_weight_kg: 15, price: 2400, stock_quantity: 20, is_available: true, min_order_quantity: 1, created: "", updated: "" },
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

/**
 * RetailerCatalogPage Component.
 * Intent: To provide a high-efficiency discovery engine for retailers, 
 * minimizing search friction and facilitating quick bulk purchases during 
 * high-pressure market hours (e.g., 5:00 AM).
 */
export default function RetailerCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);

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
    <div className="min-h-screen bg-warm-gray pb-24">
      {/* Professional Hero with Search */}
      <SearchHero 
        onSearch={setSearchQuery}
        onFilter={() => {}}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <CategoryChips
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Wholesaler Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center">
            <Store className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">Asha Wholesale Traders</h2>
            <p className="text-base text-gray-500">Fresh produce • Daily rates • Bulk discounts</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-emerald">⭐ 4.8 Rating</p>
            <p className="text-xs text-gray-400">500+ orders delivered</p>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
            </h3>
            <span className="text-base text-gray-500">{filteredProducts.length} items</span>
          </div>

          {/* Products Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-xl text-gray-400 mb-2">🔍</p>
              <p className="text-lg font-medium text-gray-600">No products found</p>
              <p className="text-base text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="max-w-7xl mx-auto flex gap-3">
          <Link href="/retailer/cart" className="flex-1">
            <Button 
              className={cn(
                "w-full h-16 text-lg font-semibold relative",
                cartItemCount > 0 ? "bg-navy hover:bg-navy-dark" : ""
              )}
            >
              <ShoppingCart className="w-6 h-6 mr-3" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-emerald text-white text-base font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/retailer/khata">
            <Button variant="secondary" className="h-16 px-6 text-lg">
              <BookOpen className="w-6 h-6 mr-2" />
              <span className="hidden sm:inline">My Khata</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
