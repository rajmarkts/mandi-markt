"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Printer, 
  CheckCircle2, 
  Package, 
  Phone, 
  MapPin,
  Share2,
  Clock,
  Calendar
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

// Mock order data
const MOCK_ORDER = {
  id: "ORD-123456",
  status: "confirmed",
  paymentStatus: "pending",
  orderDate: "2024-01-15T10:30:00",
  retailerName: "Rajesh Kumar",
  retailerShop: "Sharma Kirana",
  retailerPhone: "+91-9876543210",
  retailerAddress: "Shop 45, Main Market, Delhi",
  wholesalerName: "Asha Kirana Store",
  wholesalerShop: "Wholesale Market, Sector 12",
  wholesalerPhone: "+91-9876543210",
  items: [
    {
      id: "1",
      productName: "Desi Aloo (Potatoes)",
      unitName: "50kg (Full Bora)",
      unitWeightKg: 50,
      price: 900,
      quantity: 2,
    },
    {
      id: "2",
      productName: "Basmati Rice Premium",
      unitName: "30kg Bora",
      unitWeightKg: 30,
      price: 3000,
      quantity: 1,
    },
    {
      id: "3",
      productName: "Fresh Tomatoes",
      unitName: "5kg Crate",
      unitWeightKg: 5,
      price: 180,
      quantity: 3,
    },
  ],
  subtotal: 7140,
  delivery: 0,
  total: 7140,
  notes: "Please deliver before 6 PM",
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const order = MOCK_ORDER;
  const billRef = useRef<HTMLDivElement>(null);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = order.items.reduce(
    (sum, item) => sum + (item.unitWeightKg || 0) * item.quantity,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order ${order.id}`,
          text: `Order from ${order.retailerShop} - Total: ${formatCurrency(order.total)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="space-y-5 pb-32">
      {/* Header - Hidden when printing */}
      <div className="print:hidden flex items-center gap-3">
        <Link
          href="/retailer"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
      </div>

      {/* Success Banner */}
      <Card className="bg-emerald-50 border-emerald-200 print:bg-white print:border-gray-300">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 print:bg-gray-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 print:text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900 print:text-gray-900">
                Order Confirmed!
              </h2>
              <p className="text-emerald-700 print:text-gray-600 mt-1">
                Your order has been sent to {order.wholesalerName}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-emerald-600 print:text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(order.orderDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {totalItems} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bill / Invoice - This gets printed */}
      <div ref={billRef} className="print:p-0">
        <Card className="overflow-hidden border-2 border-gray-300 print:shadow-none print:border-gray-400">
          {/* Bill Header */}
          <div className="bg-gray-900 text-white p-6 print:bg-white print:text-black print:border-b-2 print:border-black">
            <div className="text-center">
              <h1 className="text-2xl font-bold print:text-3xl">MANDI MARKT</h1>
              <p className="text-sm opacity-80 print:text-gray-600">Order Confirmation & Bill</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Bill Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 print:text-gray-600">Order Number</p>
                <p className="font-bold text-lg text-gray-900 print:text-black">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 print:text-gray-600">Date</p>
                <p className="font-bold text-lg text-gray-900 print:text-black">
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>

            {/* Party Details */}
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-b border-gray-200 py-4 print:border-gray-400">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">From (Seller)</p>
                <p className="font-bold text-gray-900 print:text-black text-lg">{order.wholesalerName}</p>
                {order.wholesalerShop && (
                  <p className="text-gray-700 print:text-gray-800">{order.wholesalerShop}</p>
                )}
                <p className="flex items-center gap-1 text-gray-600 print:text-gray-700 mt-1">
                  <Phone className="w-3.5 h-3.5" />
                  {order.wholesalerPhone}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">To (Buyer)</p>
                <p className="font-bold text-gray-900 print:text-black text-lg">{order.retailerName}</p>
                {order.retailerShop && (
                  <p className="text-gray-700 print:text-gray-800">{order.retailerShop}</p>
                )}
                <p className="flex items-center justify-end gap-1 text-gray-600 print:text-gray-700 mt-1">
                  <Phone className="w-3.5 h-3.5" />
                  {order.retailerPhone}
                </p>
                {order.retailerAddress && (
                  <p className="flex items-center justify-end gap-1 text-gray-500 print:text-gray-600 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {order.retailerAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-sm print:text-base">
              <thead>
                <tr className="border-b-2 border-gray-800 print:border-black">
                  <th className="text-left py-3 font-bold">#</th>
                  <th className="text-left py-3 font-bold">Item</th>
                  <th className="text-right py-3 font-bold">Qty</th>
                  <th className="text-right py-3 font-bold">Rate</th>
                  <th className="text-right py-3 font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 print:border-gray-300">
                    <td className="py-3 text-gray-600 print:text-gray-800">{index + 1}</td>
                    <td className="py-3">
                      <p className="font-bold text-gray-900 print:text-black">{item.productName}</p>
                      <p className="text-xs text-gray-500 print:text-gray-600">
                        {item.unitName} {item.unitWeightKg && `(${item.unitWeightKg}kg)`}
                      </p>
                    </td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 text-right font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="border-t-2 border-gray-800 pt-4 space-y-2 print:border-black">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 print:text-gray-700">Total Items</span>
                <span>{totalItems}</span>
              </div>
              {totalWeight > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 print:text-gray-700">Total Weight</span>
                  <span>{totalWeight} kg</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 print:text-gray-700">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 print:text-gray-700">Delivery</span>
                <span className="text-emerald-600 print:text-gray-700">Free</span>
              </div>
              <div className="h-px bg-gray-300 my-3 print:bg-gray-400" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl text-gray-900 print:text-black">TOTAL</span>
                <span className="font-bold text-3xl text-gray-900 print:text-black">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 print:bg-gray-100 print:border-gray-300">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 print:text-gray-600" />
                <div>
                  <p className="font-bold text-amber-900 print:text-gray-900">Payment Pending</p>
                  <p className="text-sm text-amber-700 print:text-gray-600">
                    Pay via Cash on Delivery or add to Khata
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-gray-50 rounded-xl p-4 print:bg-white print:border print:border-gray-300">
                <p className="text-sm font-bold text-gray-700 mb-1">Order Notes:</p>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200 print:border-gray-400">
              <p className="text-sm text-gray-500 print:text-gray-600">
                Thank you for your business!
              </p>
              <p className="text-xs text-gray-400 print:text-gray-500 mt-1">
                Mandi Markt - Fresh Produce B2B Marketplace
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 print:border-gray-400">
                <p className="text-xs text-gray-400 print:text-gray-500">_________________________</p>
                <p className="text-xs text-gray-500 print:text-gray-600 mt-1">Authorized Signature</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons - Hidden when printing */}
      <div className="print:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button
            onClick={handlePrint}
            className="flex-1 h-16 text-lg"
            size="touch"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Bill
          </Button>
          <Button
            onClick={handleShare}
            variant="secondary"
            className="h-16 px-6"
            size="touch"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          Use black & white printer for best results
        </p>
      </div>
    </div>
  );
}
