"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, Plus, Minus, ShoppingCart, Check, Star } from "lucide-react";
import { Button } from "@/components/Button";
import { cn, formatCurrency } from "@/lib/utils";
import type { ProductWithVariants } from "@/lib/types";

// Mock product data
const MOCK_PRODUCT: ProductWithVariants = {
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
};

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedVariant, setSelectedVariant] = useState(MOCK_PRODUCT.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const perKgPrice = selectedVariant.unit_weight_kg
    ? selectedVariant.price / selectedVariant.unit_weight_kg
    : null;

  // Find best deal
  const bestPerKg = MOCK_PRODUCT.variants.reduce<{ price: number; variantId: string } | null>(
    (best, variant) => {
      if (!variant.unit_weight_kg || variant.unit_weight_kg <= 0) return best;
      const perKg = variant.price / variant.unit_weight_kg;
      if (!best || perKg < best.price) {
        return { price: perKg, variantId: variant.id };
      }
      return best;
    },
    null
  );

  const isBestDeal = bestPerKg?.variantId === selectedVariant.id;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-5 -mx-4 sm:mx-0">
      {/* Back Button */}
      <Link
        href="/retailer"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 sm:px-0"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back to Catalog</span>
      </Link>

      {/* Product Image */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 aspect-square relative">
        {MOCK_PRODUCT.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={MOCK_PRODUCT.image}
            alt={MOCK_PRODUCT.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Package className="w-24 h-24 mb-4 opacity-50" />
            <span className="text-lg">{MOCK_PRODUCT.category}</span>
          </div>
        )}
        
        {/* Best Deal Badge */}
        {isBestDeal && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-[#064e3b] text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              Best Value
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 sm:px-0 space-y-5">
        <div>
          <span className="px-3 py-1 bg-[#064e3b]/10 text-[#064e3b] text-sm font-medium rounded-full">
            {MOCK_PRODUCT.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">{MOCK_PRODUCT.name}</h1>
          <p className="text-gray-500 mt-2">Fresh farm produce directly from wholesalers</p>
        </div>

        {/* Unit Selection */}
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900 text-lg">Select Unit</h2>
          <div className="grid grid-cols-2 gap-3">
            {MOCK_PRODUCT.variants.map((variant) => {
              const vPerKg = variant.unit_weight_kg
                ? variant.price / variant.unit_weight_kg
                : null;
              const isSelected = selectedVariant.id === variant.id;
              const isBest = bestPerKg?.variantId === variant.id;

              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all active:scale-95",
                    isSelected
                      ? "bg-[#064e3b] border-[#064e3b] text-white"
                      : "bg-white border-gray-200 hover:border-[#064e3b]"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "font-bold",
                      isSelected ? "text-white" : "text-gray-900"
                    )}>
                      {variant.unit_name}
                    </span>
                    {isSelected && <Check className="w-5 h-5" />}
                  </div>
                  
                  <p className={cn(
                    "text-xl font-bold",
                    isSelected ? "text-white" : "text-[#064e3b]"
                  )}>
                    {formatCurrency(variant.price)}
                  </p>
                  
                  {vPerKg && (
                    <p className={cn(
                      "text-xs mt-1",
                      isSelected ? "text-emerald-100" : "text-gray-500"
                    )}>
                      ₹{vPerKg.toFixed(2)}/kg
                    </p>
                  )}
                  
                  {isBest && !isSelected && (
                    <span className="mt-2 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                      BEST VALUE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-[#064e3b]">
              {formatCurrency(selectedVariant.price * quantity)}
            </span>
            <span className="text-gray-500">
              for {quantity} × {selectedVariant.unit_name}
            </span>
          </div>
          {perKgPrice && (
            <p className="text-gray-600">
              ₹{perKgPrice.toFixed(2)} per kg
              {isBestDeal && (
                <span className="ml-2 text-emerald-600 font-bold">
                  (Best Deal!)
                </span>
              )}
            </p>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900">Quantity</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center active:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <Minus className="w-6 h-6 text-gray-700" />
            </button>
            <span className="w-16 text-center text-2xl font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-14 h-14 bg-[#064e3b] text-white rounded-xl flex items-center justify-center active:bg-[#065f46] transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 h-16 text-lg",
                addedToCart && "bg-emerald-600"
              )}
              size="touch"
            >
              {addedToCart ? (
                <>
                  <Check className="w-6 h-6 mr-2" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <Link href="/retailer/cart" className="flex-1">
              <Button variant="secondary" className="w-full h-16 text-lg" size="touch">
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom buttons */}
      <div className="h-24" />
    </div>
  );
}
