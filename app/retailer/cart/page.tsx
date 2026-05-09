"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, Phone, Send } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { sendOrderViaWhatsApp } from "@/lib/whatsapp";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

// Mock cart data
interface CartItem {
  id: string;
  productId: string;
  productName: string;
  unitName: string;
  price: number;
  quantity: number;
  unitWeightKg?: number | null;
}

const MOCK_CART: CartItem[] = [
  {
    id: "1",
    productId: "1",
    productName: "Desi Aloo (Potatoes)",
    unitName: "50kg (Full Bora)",
    price: 900,
    quantity: 2,
    unitWeightKg: 50,
  },
  {
    id: "2",
    productId: "2",
    productName: "Basmati Rice Premium",
    unitName: "30kg Bora",
    price: 3000,
    quantity: 1,
    unitWeightKg: 30,
  },
  {
    id: "3",
    productId: "3",
    productName: "Fresh Tomatoes",
    unitName: "5kg Crate",
    price: 180,
    quantity: 3,
    unitWeightKg: 5,
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(MOCK_CART);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = async () => {
    setIsSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Send WhatsApp message
    const success = sendOrderViaWhatsApp({
      retailerName: "Rajesh Kumar",
      retailerShop: "Sharma Kirana",
      wholesalerName: "Asha Kirana Store",
      wholesalerPhone: "+91-9876543210",
      items: cart.map((item) => ({
        productName: item.productName,
        variant: {
          unit_name: item.unitName,
          price: item.price,
          unit_weight_kg: item.unitWeightKg,
        },
        quantity: item.quantity,
      })),
      totalAmount: subtotal,
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
    });

    setIsSending(false);

    if (success) {
      setShowSuccess(true);
      setCart([]);
    }
  };

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 text-center max-w-xs">
          Add some fresh produce to get started
        </p>
        <Link href="/retailer">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <Send className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Sent!</h2>
        <p className="text-gray-500 mb-6 max-w-xs">
          Your order has been sent to the wholesaler via WhatsApp. They will confirm shortly.
        </p>
        <Link href="/retailer">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/retailer"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {cart.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.productName}</h3>
                  <p className="text-gray-500">{item.unitName}</p>
                  {item.unitWeightKg && (
                    <p className="text-xs text-gray-400">
                      ₹{(item.price / item.unitWeightKg).toFixed(2)}/kg
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center active:bg-gray-200"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-10 text-center text-xl font-bold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="w-12 h-12 bg-[#064e3b] text-white rounded-xl flex items-center justify-center active:bg-[#065f46]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-xl font-bold text-[#064e3b]">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <Card className="bg-gray-50">
        <div className="p-5 space-y-3">
          <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items ({totalItems})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="h-px bg-gray-300 my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Total</span>
              <span className="font-bold text-[#064e3b] text-2xl">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-[#064e3b]/5 rounded-xl cursor-pointer">
              <input type="radio" name="payment" defaultChecked className="w-5 h-5" />
              <span className="font-medium">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input type="radio" name="payment" className="w-5 h-5" />
              <span className="font-medium">Add to Khata (Credit)</span>
            </label>
          </div>
        </div>
      </Card>

      {/* WhatsApp Note */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Order will be sent via <strong>WhatsApp</strong> to the wholesaler. 
            You can discuss delivery details directly with them.
          </p>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          onClick={handlePlaceOrder}
          isLoading={isSending}
          className="w-full h-16 text-lg"
          size="touch"
        >
          <Send className="w-5 h-5 mr-2" />
          Place Order • {formatCurrency(subtotal)}
        </Button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Sends order via WhatsApp
        </p>
      </div>
    </div>
  );
}
