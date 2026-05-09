"use client";

import { useState } from "react";
import { Trash2, Plus, Minus, AlertCircle, X } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { cn, formatCurrency } from "@/lib/utils";

interface CartItem {
  productId: string;
  productName: string;
  image?: string;
  category: string;
  variant: {
    id: string;
    unit_name: string;
    price: number;
    unit_weight_kg?: number | null;
  };
  quantity: number;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  wholesalerName: string;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onCheckout: () => void;
}

export function CartSheet({
  isOpen,
  onClose,
  items,
  wholesalerName,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSheetProps) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setIsPlacingOrder(true);
    await onCheckout();
    setIsPlacingOrder(false);
  };

  // Group items by category for display
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Your Cart"
      height="lg"
    >
      <div className="space-y-4 pb-24">
        {/* Wholesaler Info */}
        <div className="bg-[#064e3b]/5 rounded-xl p-4 border border-[#064e3b]/10">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Ordering from</p>
          <p className="font-bold text-[#064e3b] text-lg">{wholesalerName}</p>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
            <p className="text-gray-500 mt-1">Add some products to get started</p>
          </div>
        )}

        {/* Cart Items by Category */}
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              {category.replace("_", " ")}
            </h3>
            
            {categoryItems.map((item) => (
              <div
                key={`${item.productId}-${item.variant.id}`}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{item.productName}</h4>
                    <p className="text-sm text-gray-500">{item.variant.unit_name}</p>
                    
                    {/* Per-kg price */}
                    {item.variant.unit_weight_kg && item.variant.unit_weight_kg > 0 && (
                      <p className="text-xs text-gray-400">
                        ₹{(item.variant.price / item.variant.unit_weight_kg).toFixed(2)}/kg
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-[#064e3b]">
                      {formatCurrency(item.variant.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.variant.price)} each
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => onRemoveItem(item.productId, item.variant.id)}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Remove</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.variant.id, -1)}
                      disabled={item.quantity <= 1}
                      className="w-10 h-10 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center active:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.variant.id, 1)}
                      className="w-10 h-10 bg-[#064e3b] text-white rounded-xl flex items-center justify-center active:bg-[#065f46]"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="bg-white rounded-xl p-5 border-2 border-[#064e3b]/10 space-y-3">
            <h3 className="font-bold text-gray-900">Order Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({totalItems})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-[#064e3b] font-medium">Free</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-[#064e3b] text-2xl">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <Button
              onClick={handleCheckout}
              isLoading={isPlacingOrder}
              className="w-full h-14 text-lg"
            >
              Place Order • {formatCurrency(subtotal)}
            </Button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Cash on Delivery • Pay via Khata (Credit)
            </p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
