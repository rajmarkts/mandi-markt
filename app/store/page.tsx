"use client";

import { useState, useMemo, useCallback } from "react";
import { Store, Loader2 } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips, CATEGORIES } from "@/components/CategoryChips";
import { StoreProductCard } from "@/components/StoreProductCard";
import { UnitSelectorSheet } from "@/components/UnitSelectorSheet";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { CartSheet } from "@/components/CartSheet";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Product, ProductVariant, ProductWithVariants } from "@/lib/types";

// Mock data - Desi Aloo, Basmati Rice with multiple variants
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
      { id: "v10", product: "3", unit_name: "10kg Box", unit_weight_kg: 10, price: 350, stock_quantity: 25, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "4",
    name: "Red Onions",
    category: "vegetables",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v11", product: "4", unit_name: "1kg", unit_weight_kg: 1, price: 35, stock_quantity: 120, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v12", product: "4", unit_name: "25kg Sack", unit_weight_kg: 25, price: 750, stock_quantity: 35, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v13", product: "4", unit_name: "50kg (Full Sack)", unit_weight_kg: 50, price: 1400, stock_quantity: 18, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "5",
    name: "Turmeric Powder",
    category: "spices",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v14", product: "5", unit_name: "100g", unit_weight_kg: 0.1, price: 35, stock_quantity: 50, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v15", product: "5", unit_name: "250g", unit_weight_kg: 0.25, price: 80, stock_quantity: 40, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v16", product: "5", unit_name: "1kg Pack", unit_weight_kg: 1, price: 280, stock_quantity: 20, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "6",
    name: "Fresh Milk",
    category: "dairy",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v17", product: "6", unit_name: "500ml Packet", unit_weight_kg: 0.5, price: 28, stock_quantity: 200, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v18", product: "6", unit_name: "1 Litre", unit_weight_kg: 1, price: 54, stock_quantity: 150, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
];

interface CartItem {
  productId: string;
  productName: string;
  image?: string;
  category: string;
  variant: ProductVariant;
  quantity: number;
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products] = useState(MOCK_PRODUCTS);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
  // Unit selector state
  const [unitSelectorProduct, setUnitSelectorProduct] = useState<ProductWithVariants | null>(null);
  const [tempSelectedVariant, setTempSelectedVariant] = useState<ProductVariant | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart helpers
  const getCartItem = useCallback((productId: string, variantId: string) => {
    return cart.find((item) => item.productId === productId && item.variant.id === variantId);
  }, [cart]);

  const getTotalQuantityForProduct = useCallback((productId: string) => {
    return cart
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Add to cart
  const handleAddToCart = useCallback((product: ProductWithVariants, variant: ProductVariant) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.variant.id === variant.id
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          image: product.image,
          category: product.category,
          variant,
          quantity: 1,
        },
      ];
    });
  }, []);

  // Update quantity
  const handleUpdateQuantity = useCallback((productId: string, variantId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.variant.id === variantId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }, []);

  // Remove from cart
  const handleRemoveItem = useCallback((productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variant.id === variantId)
      )
    );
  }, []);

  // Open unit selector
  const handleOpenUnitSelector = useCallback((product: ProductWithVariants) => {
    setUnitSelectorProduct(product);
    // Pre-select first variant if none selected for this product
    const existingCartItem = cart.find((item) => item.productId === product.id);
    setTempSelectedVariant(existingCartItem?.variant || product.variants[0] || null);
  }, [cart]);

  // Confirm unit selection
  const handleConfirmUnit = useCallback(() => {
    if (unitSelectorProduct && tempSelectedVariant) {
      handleAddToCart(unitSelectorProduct, tempSelectedVariant);
      setUnitSelectorProduct(null);
      setTempSelectedVariant(null);
    }
  }, [unitSelectorProduct, tempSelectedVariant, handleAddToCart]);

  // Handle cart update from product card
  const handleProductCardUpdate = useCallback((product: ProductWithVariants, variant: ProductVariant, delta: number) => {
    handleUpdateQuantity(product.id, variant.id, delta);
  }, [handleUpdateQuantity]);

  // Place order
  const handleCheckout = useCallback(async () => {
    setIsPlacingOrder(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPlacingOrder(false);
    setIsCartOpen(false);
    setShowOrderSuccess(true);
    setCart([]);
  }, []);

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for Aloo, Rice, Dal..."
        />
        
        <CategoryChips
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Store Header */}
      <div className="flex items-center gap-3 py-2">
        <div className="w-12 h-12 bg-[#064e3b] rounded-xl flex items-center justify-center">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Asha Kirana Store</h2>
          <p className="text-sm text-gray-500">Fresh produce daily • 2km away</p>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-sm text-[#064e3b] font-medium hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            // Find if this product has any items in cart
            const productCartItems = cart.filter((item) => item.productId === product.id);
            const totalQuantity = productCartItems.reduce((sum, item) => sum + item.quantity, 0);
            // For display, show the first variant if multiple in cart
            const selectedVariant = productCartItems[0]?.variant || null;

            return (
              <StoreProductCard
                key={product.id}
                product={product}
                selectedVariant={selectedVariant}
                quantity={totalQuantity}
                onSelectVariant={(variant) => {
                  handleAddToCart(product, variant);
                }}
                onAddToCart={() => handleOpenUnitSelector(product)}
                onUpdateQuantity={(delta) => {
                  if (selectedVariant) {
                    handleProductCardUpdate(product, selectedVariant, delta);
                  }
                }}
                onOpenUnitSelector={() => handleOpenUnitSelector(product)}
              />
            );
          })}
        </div>
      )}

      {/* Unit Selector Bottom Sheet */}
      <UnitSelectorSheet
        isOpen={!!unitSelectorProduct}
        onClose={() => {
          setUnitSelectorProduct(null);
          setTempSelectedVariant(null);
        }}
        productName={unitSelectorProduct?.name || ""}
        variants={unitSelectorProduct?.variants || []}
        selectedVariant={tempSelectedVariant}
        onSelect={setTempSelectedVariant}
        onConfirm={handleConfirmUnit}
      />

      {/* Floating Cart Bar */}
      <FloatingCartBar
        items={cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variant: {
            unit_name: item.variant.unit_name,
            price: item.variant.price,
          },
          quantity: item.quantity,
        }))}
        onCheckout={() => setIsCartOpen(true)}
      />

      {/* Cart Sheet / Checkout */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        wholesalerName="Asha Kirana Store"
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Order Success Dialog */}
      <ConfirmDialog
        isOpen={showOrderSuccess}
        title="Order Placed!"
        message="Your order has been sent to Asha Kirana Store. They will confirm shortly."
        confirmLabel="Continue Shopping"
        cancelLabel=""
        variant="info"
        onConfirm={() => setShowOrderSuccess(false)}
        onCancel={() => setShowOrderSuccess(false)}
      />

      {/* Loading Overlay */}
      {isPlacingOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-10 h-10 animate-spin text-[#064e3b]" />
            <p className="font-bold text-gray-900 text-lg">Placing your order...</p>
          </div>
        </div>
      )}
    </div>
  );
}
