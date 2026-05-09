"use client";

import { Check, Package, TrendingDown } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { cn, formatCurrency } from "@/lib/utils";
import type { ProductVariant } from "@/lib/types";

interface UnitSelectorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
  onConfirm: () => void;
}

export function UnitSelectorSheet({
  isOpen,
  onClose,
  productName,
  variants,
  selectedVariant,
  onSelect,
  onConfirm,
}: UnitSelectorSheetProps) {
  // Calculate per-kg prices for all variants
  const variantsWithPerKg = variants.map((variant) => {
    const perKgPrice =
      variant.unit_weight_kg && variant.unit_weight_kg > 0
        ? variant.price / variant.unit_weight_kg
        : null;
    return { variant, perKgPrice };
  });

  // Find best per-kg price
  const bestPerKg = variantsWithPerKg.reduce<{ price: number; variantId: string } | null>(
    (best, { perKgPrice, variant }) => {
      if (!perKgPrice) return best;
      if (!best || perKgPrice < best.price) {
        return { price: perKgPrice, variantId: variant.id };
      }
      return best;
    },
    null
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Select Unit - ${productName}`}
      height="auto"
    >
      <div className="space-y-4">
        {/* Info Text */}
        <div className="bg-[#064e3b]/5 rounded-xl p-4 border border-[#064e3b]/10">
          <p className="text-sm text-[#064e3b]">
            <TrendingDown className="w-4 h-4 inline mr-1" />
            <strong>Tip:</strong> Choose larger packs for better per-kg prices. 
            Prices update instantly as you select.
          </p>
        </div>

        {/* Unit Options */}
        <div className="space-y-2">
          {variantsWithPerKg.map(({ variant, perKgPrice }) => {
            const isSelected = selectedVariant?.id === variant.id;
            const isBestDeal = bestPerKg?.variantId === variant.id;

            return (
              <button
                key={variant.id}
                onClick={() => onSelect(variant)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                  "active:scale-[0.98]",
                  isSelected
                    ? "bg-[#064e3b] border-[#064e3b] text-white"
                    : "bg-white border-gray-200 hover:border-[#064e3b]/50"
                )}
              >
                {/* Selection Indicator */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    isSelected
                      ? "bg-white border-white"
                      : "border-gray-300"
                  )}
                >
                  {isSelected && <Check className="w-4 h-4 text-[#064e3b]" />}
                </div>

                {/* Unit Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-lg font-bold",
                      isSelected ? "text-white" : "text-gray-900"
                    )}>
                      {variant.unit_name}
                    </span>
                    {isBestDeal && (
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-bold rounded-full",
                        isSelected ? "bg-white text-[#064e3b]" : "bg-[#064e3b] text-white"
                      )}>
                        BEST VALUE
                      </span>
                    )}
                  </div>
                  
                  {variant.unit_weight_kg && (
                    <span className={cn(
                      "text-sm",
                      isSelected ? "text-emerald-100" : "text-gray-500"
                    )}>
                      {variant.unit_weight_kg} kg
                    </span>
                  )}
                  
                  {variant.min_order_quantity && variant.min_order_quantity > 1 && (
                    <span className={cn(
                      "text-xs ml-2",
                      isSelected ? "text-emerald-200" : "text-orange-600"
                    )}>
                      Min: {variant.min_order_quantity}
                    </span>
                  )}
                </div>

                {/* Price Info */}
                <div className="text-right">
                  <span className={cn(
                    "text-xl font-bold block",
                    isSelected ? "text-white" : "text-[#064e3b]"
                  )}>
                    {formatCurrency(variant.price)}
                  </span>
                  
                  {perKgPrice && (
                    <span className={cn(
                      "text-sm",
                      isSelected ? "text-emerald-100" : "text-gray-500"
                    )}>
                      ₹{perKgPrice.toFixed(2)}/kg
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selectedVariant && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Selected:</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">{selectedVariant.unit_name}</span>
              <span className="text-xl font-bold text-[#064e3b]">
                {formatCurrency(selectedVariant.price)}
              </span>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <Button
          onClick={onConfirm}
          disabled={!selectedVariant}
          className="w-full h-14 text-lg"
        >
          {selectedVariant ? (
            <>Add {selectedVariant.unit_name} to Cart</>
          ) : (
            <>Select a Unit</>
          )}
        </Button>
      </div>
    </BottomSheet>
  );
}
