"use client";

import { useState } from "react";
import { Package, ChevronDown, Check, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "./Button";
import type { Product, ProductVariant } from "@/lib/types";

interface StoreProductCardProps {
  product: Product & { variants: ProductVariant[] };
  selectedVariant: ProductVariant | null;
  quantity: number;
  onSelectVariant: (variant: ProductVariant) => void;
  onAddToCart: () => void;
  onUpdateQuantity: (delta: number) => void;
  onOpenUnitSelector: () => void;
}

export function StoreProductCard({
  product,
  selectedVariant,
  quantity,
  onSelectVariant,
  onAddToCart,
  onUpdateQuantity,
  onOpenUnitSelector,
}: StoreProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Calculate per-kg price for the selected variant
  const perKgPrice = selectedVariant?.unit_weight_kg
    ? selectedVariant.price / selectedVariant.unit_weight_kg
    : null;

  // Find best per-kg deal among all variants
  const bestPerKgPrice = product.variants.reduce<{ price: number; variant: ProductVariant } | null>(
    (best, variant) => {
      if (!variant.unit_weight_kg || variant.unit_weight_kg <= 0) return best;
      const perKg = variant.price / variant.unit_weight_kg;
      if (!best || perKg < best.price) {
        return { price: perKg, variant };
      }
      return best;
    },
    null
  );

  const isBestDeal = selectedVariant && bestPerKgPrice?.variant.id === selectedVariant.id;

  // Get appropriate button state
  const getButtonContent = () => {
    if (quantity > 0) {
      return (
        <div className="flex items-center justify-between w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateQuantity(-1);
            }}
            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center active:bg-white/30"
          >
            <span className="text-xl font-bold">−</span>
          </button>
          <span className="text-lg font-bold">{quantity}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateQuantity(1);
            }}
            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center active:bg-white/30"
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
      );
    }
    return (
      <>
        <span className="text-lg font-semibold">Add</span>
        <span className="text-sm opacity-90">+</span>
      </>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative">
        {product.image && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Package className="w-16 h-16 mb-2 opacity-50" />
            <span className="text-sm">{product.category}</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#064e3b] rounded-lg shadow-sm">
            {product.category?.replace("_", " ")}
          </span>
        </div>

        {/* Best Deal Badge */}
        {isBestDeal && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-[#064e3b] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Best Value
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2">
          {product.name}
        </h3>

        {/* Unit Selector Button - Father's Feature */}
        <button
          onClick={onOpenUnitSelector}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 transition-colors",
            selectedVariant
              ? "bg-[#064e3b]/10 border border-[#064e3b]/30"
              : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {selectedVariant ? selectedVariant.unit_name : "Select Unit"}
            </span>
            {selectedVariant && perKgPrice && (
              <span className="text-xs text-gray-500">
                (₹{perKgPrice.toFixed(0)}/kg)
              </span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-5 h-5 transition-transform",
            selectedVariant ? "text-[#064e3b]" : "text-gray-400"
          )} />
        </button>

        {/* Price & Add Button Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Price Display */}
          <div className="flex-1">
            {selectedVariant ? (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#064e3b]">
                  {formatCurrency(selectedVariant.price)}
                </span>
                {selectedVariant.unit_name && (
                  <span className="text-sm text-gray-500">/{selectedVariant.unit_name}</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Select a unit to see price</span>
            )}
            
            {/* Per-kg comparison */}
            {perKgPrice && !isBestDeal && bestPerKgPrice && (
              <p className="text-xs text-gray-500 mt-0.5">
                Best: ₹{bestPerKgPrice.price.toFixed(0)}/kg with {bestPerKgPrice.variant.unit_name}
              </p>
            )}
          </div>

          {/* Add Button */}
          <Button
            onClick={selectedVariant ? () => onUpdateQuantity(quantity === 0 ? 1 : 0) : onOpenUnitSelector}
            variant={quantity > 0 ? "primary" : selectedVariant ? "primary" : "secondary"}
            size="sm"
            className={cn(
              "min-w-[100px] h-12",
              quantity > 0 ? "bg-[#064e3b] hover:bg-[#065f46]" : "",
              !selectedVariant && "border-2 border-dashed"
            )}
            disabled={!selectedVariant && false}
          >
            {getButtonContent()}
          </Button>
        </div>

        {/* Stock Info */}
        {selectedVariant?.stock_quantity !== undefined && selectedVariant.stock_quantity <= 10 && (
          <p className="text-xs text-orange-600 mt-2 font-medium">
            Only {selectedVariant.stock_quantity} left in stock
          </p>
        )}
      </div>
    </div>
  );
}
