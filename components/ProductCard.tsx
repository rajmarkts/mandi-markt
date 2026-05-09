"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2, Package, Tag, Store } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { formatCurrency } from "@/lib/utils";
import type { ProductVariant, ProductWithVariants } from "@/lib/types";

interface ProductCardProps {
  product: ProductWithVariants;
  onEdit: (product: ProductWithVariants) => void;
  onDelete: (product: ProductWithVariants) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const variants = product.variants || [];
  const lowestPrice = variants.length > 0
    ? Math.min(...variants.map((v) => v.price))
    : null;
  const highestPrice = variants.length > 0
    ? Math.max(...variants.map((v) => v.price))
    : null;

  // Find best per-kg deal
  const getBestPerKgPrice = (): { price: number; unit: string } | null => {
    let best: { price: number; unit: string } | null = null;
    
    variants.forEach((v) => {
      if (v.unit_weight_kg && v.unit_weight_kg > 0) {
        const perKg = v.price / v.unit_weight_kg;
        if (!best || perKg < best.price) {
          best = { price: perKg, unit: v.unit_name };
        }
      }
    });
    
    return best;
  };

  const bestDeal = getBestPerKgPrice();

  return (
    <Card className="relative overflow-visible">
      {/* Actions Menu */}
      {showActions && (
        <div className="absolute top-14 right-3 bg-white rounded-xl shadow-xl border z-50 min-w-40 overflow-hidden">
          <button
            onClick={() => {
              onEdit(product);
              setShowActions(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100"
          >
            <Edit2 className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Edit</span>
          </button>
          <button
            onClick={() => {
              onDelete(product);
              setShowActions(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 active:bg-red-100 text-red-600"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete</span>
          </button>
          <button
            onClick={() => setShowActions(false)}
            className="w-full px-4 py-3 text-center text-sm text-gray-500 hover:bg-gray-50 border-t"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Card Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
            {product.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize flex items-center gap-1 mt-0.5">
                  <Tag className="w-3.5 h-3.5" />
                  {product.category?.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors -mr-2 -mt-2"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Price Range */}
            <div className="mt-2">
              {lowestPrice !== null && highestPrice !== null ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(lowestPrice)}
                  </span>
                  {lowestPrice !== highestPrice && (
                    <span className="text-sm text-gray-500">
                      - {formatCurrency(highestPrice)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 italic">No pricing set</span>
              )}
            </div>

            {/* Best Deal Badge */}
            {bestDeal && variants.length > 1 && (
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                <Store className="w-3 h-3" />
                Best: ₹{bestDeal.price.toFixed(2)}/kg
              </div>
            )}

            {/* Variant Count */}
            <div className="mt-2 text-sm text-gray-500">
              {variants.length} unit{variants.length !== 1 ? "s" : ""} available
            </div>
          </div>
        </div>

        {/* Variants Preview */}
        {variants.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowVariants(!showVariants)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <span>View all units & prices</span>
              <svg
                className={`w-5 h-5 transition-transform ${showVariants ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showVariants && (
              <div className="mt-3 space-y-2">
                {variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{variant.unit_name}</span>
                      {variant.unit_weight_kg && (
                        <span className="text-xs text-gray-500">
                          ({variant.unit_weight_kg}kg)
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(variant.price)}
                      </span>
                      {variant.unit_weight_kg && variant.unit_weight_kg > 0 && (
                        <span className="block text-xs text-gray-500">
                          ₹{(variant.price / variant.unit_weight_kg).toFixed(2)}/kg
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit2 className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
