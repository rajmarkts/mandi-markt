"use client";

import { ShoppingCart, ChevronRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface CartItem {
  productId: string;
  productName: string;
  variant: {
    unit_name: string;
    price: number;
  };
  quantity: number;
}

interface FloatingCartBarProps {
  items: CartItem[];
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

export function FloatingCartBar({ items, onCheckout, isCheckingOut }: FloatingCartBarProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onCheckout}
          disabled={isCheckingOut}
          className={cn(
            "w-full flex items-center justify-between",
            "bg-[#064e3b] text-white",
            "rounded-2xl shadow-2xl shadow-[#064e3b]/30",
            "p-4 pr-5",
            "active:scale-[0.98] transition-transform",
            "disabled:opacity-70"
          )}
        >
          {/* Left: Cart Icon & Item Count */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              {/* Item Badge */}
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-[#064e3b] text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm text-emerald-100">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
              </p>
              <p className="text-xs text-emerald-200/80 hidden sm:block">
                Tap to review & checkout
              </p>
            </div>
          </div>

          {/* Right: Total Price & Arrow */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-emerald-200">Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPrice)}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
