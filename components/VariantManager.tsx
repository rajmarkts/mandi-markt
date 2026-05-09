"use client";

import { useState } from "react";
import { Plus, Trash2, Package, Tag } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { cn, formatCurrency } from "@/lib/utils";
import type { ProductVariant } from "@/lib/types";

interface VariantFormData {
  unit_name: string;
  unit_weight_kg: string;
  price: string;
  stock_quantity: string;
  min_order_quantity: string;
}

interface VariantManagerProps {
  variants: Partial<ProductVariant>[];
  onChange: (variants: Partial<ProductVariant>[]) => void;
}

const EXAMPLE_UNITS = [
  { label: "1 kg", value: "1kg" },
  { label: "5 kg", value: "5kg" },
  { label: "10 kg", value: "10kg" },
  { label: "25 kg (1/2 Bora)", value: "25kg" },
  { label: "30 kg (Bora)", value: "30kg" },
  { label: "50 kg (1 Bora)", value: "50kg" },
  { label: "100 kg (2 Bora)", value: "100kg" },
];

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<VariantFormData>({
    unit_name: "",
    unit_weight_kg: "",
    price: "",
    stock_quantity: "",
    min_order_quantity: "1",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newVariant: Partial<ProductVariant> = {
      unit_name: formData.unit_name,
      unit_weight_kg: formData.unit_weight_kg ? parseFloat(formData.unit_weight_kg) : null,
      price: parseFloat(formData.price),
      stock_quantity: formData.stock_quantity ? parseFloat(formData.stock_quantity) : 0,
      min_order_quantity: parseInt(formData.min_order_quantity) || 1,
      is_available: true,
    };

    if (editingIndex !== null) {
      const updated = [...variants];
      updated[editingIndex] = { ...updated[editingIndex], ...newVariant };
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...variants, newVariant]);
    }

    setFormData({
      unit_name: "",
      unit_weight_kg: "",
      price: "",
      stock_quantity: "",
      min_order_quantity: "1",
    });
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    const variant = variants[index];
    setFormData({
      unit_name: variant.unit_name || "",
      unit_weight_kg: variant.unit_weight_kg?.toString() || "",
      price: variant.price?.toString() || "",
      stock_quantity: variant.stock_quantity?.toString() || "",
      min_order_quantity: variant.min_order_quantity?.toString() || "1",
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleQuickAdd = (unitValue: string) => {
    setFormData((prev) => ({ ...prev, unit_name: unitValue }));
    setShowForm(true);
  };

  // Calculate per-kg price for comparison
  const getPerKgPrice = (variant: Partial<ProductVariant>): number | null => {
    if (!variant.unit_weight_kg || variant.unit_weight_kg <= 0) return null;
    return variant.price! / variant.unit_weight_kg;
  };

  // Find the best deal (lowest per-kg price)
  const getBestDeal = (): Partial<ProductVariant> | null => {
    if (variants.length === 0) return null;
    let best: Partial<ProductVariant> | null = null;
    let bestPrice = Infinity;

    variants.forEach((v) => {
      const perKg = getPerKgPrice(v);
      if (perKg && perKg < bestPrice) {
        bestPrice = perKg;
        best = v;
      }
    });

    return best;
  };

  const bestDeal = getBestDeal();

  return (
    <div className="space-y-4">
      {/* Existing Variants List */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Added Units & Rates ({variants.length})
          </p>
          
          <div className="grid gap-3">
            {variants.map((variant, index) => {
              const perKgPrice = getPerKgPrice(variant);
              const isBestDeal = bestDeal && variant.unit_name === bestDeal.unit_name;
              
              return (
                <div
                  key={index}
                  onClick={() => handleEdit(index)}
                  className={cn(
                    "bg-white border-2 rounded-xl p-4 cursor-pointer transition-all",
                    "active:scale-[0.98] hover:border-emerald-400",
                    isBestDeal ? "border-emerald-300 bg-emerald-50/50" : "border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-gray-900">
                          {variant.unit_name}
                        </span>
                        {isBestDeal && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            BEST VALUE
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(variant.price || 0)}
                        </span>
                        {perKgPrice && (
                          <span className="text-gray-500">
                            ₹{perKgPrice.toFixed(2)}/kg
                          </span>
                        )}
                        {variant.stock_quantity !== undefined && variant.stock_quantity > 0 && (
                          <span className="text-gray-500">
                            Stock: {variant.stock_quantity} units
                          </span>
                        )}
                        {variant.min_order_quantity && variant.min_order_quantity > 1 && (
                          <span className="text-orange-600 text-xs">
                            Min: {variant.min_order_quantity}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(index);
                      }}
                      className="ml-3 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      aria-label="Delete variant"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Add Buttons */}
      {!showForm && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Quick Add Common Units:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_UNITS.map((unit) => (
              <button
                key={unit.value}
                onClick={() => handleQuickAdd(unit.value)}
                className="px-4 py-2 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-lg text-sm font-medium transition-colors"
              >
                {unit.label}
              </button>
            ))}
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            variant="secondary"
            className="w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Custom Unit
          </Button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <p className="font-medium text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            {editingIndex !== null ? "Edit Unit" : "Add Custom Unit"}
          </p>
          
          <div className="space-y-4">
            <Input
              label="Unit Name (e.g., 42kg, 1 Bora, Half Crate)"
              placeholder="Enter unit name..."
              value={formData.unit_name}
              onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })}
              helperText="Examples: 42kg sack, 30kg bora, 1 crate, 5kg box"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight in KG (Optional)"
                type="number"
                step="0.1"
                placeholder="e.g., 42"
                value={formData.unit_weight_kg}
                onChange={(e) => setFormData({ ...formData, unit_weight_kg: e.target.value })}
                helperText="For per-kg pricing"
              />
              
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                placeholder="e.g., 840"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock Quantity"
                type="number"
                placeholder="e.g., 100"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              />
              
              <Input
                label="Min Order Qty"
                type="number"
                placeholder="e.g., 1"
                value={formData.min_order_quantity}
                onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })}
                helperText="Minimum units per order"
              />
            </div>

            {/* Smart Pricing Preview */}
            {formData.unit_weight_kg && formData.price && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-sm font-medium text-emerald-800">
                  Per-kg rate: ₹{(parseFloat(formData.price) / parseFloat(formData.unit_weight_kg)).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAdd}
              disabled={!formData.unit_name || !formData.price}
              className="flex-1"
            >
              {editingIndex !== null ? "Save Changes" : "Add Unit"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
                setFormData({
                  unit_name: "",
                  unit_weight_kg: "",
                  price: "",
                  stock_quantity: "",
                  min_order_quantity: "1",
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
