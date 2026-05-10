"use client";

import { useRef } from "react";
import { Printer, CheckCircle2, Store, Calendar, User, Phone } from "lucide-react";
import { Button } from "./Button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface BillItem {
  productName: string;
  unit_name: string;
  price: number;
  quantity: number;
  unit_weight_kg?: number | null;
}

interface PrintableBillProps {
  orderId: string;
  retailerName: string;
  retailerShop?: string;
  retailerPhone?: string;
  wholesalerName: string;
  wholesalerShop?: string;
  wholesalerPhone?: string;
  items: BillItem[];
  totalAmount: number;
  orderDate: string;
  paymentStatus: "pending" | "partial" | "paid" | "overdue";
  onPrint?: () => void;
}

export function PrintableBill({
  orderId,
  retailerName,
  retailerShop,
  retailerPhone,
  wholesalerName,
  wholesalerShop,
  wholesalerPhone,
  items,
  totalAmount,
  orderDate,
  paymentStatus,
  onPrint,
}: PrintableBillProps) {
  const billRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    }
    window.print();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const statusLabels = {
    pending: { label: "PENDING", color: "bg-amber-100 text-amber-800" },
    partial: { label: "PARTIAL PAID", color: "bg-blue-100 text-blue-800" },
    paid: { label: "PAID", color: "bg-emerald-100 text-emerald-800" },
    overdue: { label: "OVERDUE", color: "bg-red-100 text-red-800" },
  };

  return (
    <div className="space-y-4">
      {/* Print Button (hidden when printing) */}
      <div className="print:hidden">
        <Button onClick={handlePrint} className="w-full h-14" size="touch">
          <Printer className="w-5 h-5 mr-2" />
          Print Bill
        </Button>
        <p className="text-center text-sm text-gray-500 mt-2">
          Use black & white printer for best results
        </p>
      </div>

      {/* Bill Content (this gets printed) */}
      <div
        ref={billRef}
        className={cn(
          "bg-white p-6 sm:p-8",
          "print:p-0 print:m-0 print:shadow-none print:border-none",
          "border-2 border-gray-300 rounded-xl shadow-sm"
        )}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 print:text-black">
            MANDI MARKT
          </h1>
          <p className="text-sm text-gray-600 print:text-gray-800">
            Fresh Produce B2B Marketplace
          </p>
          <p className="text-xs text-gray-500 print:text-gray-600 mt-1">
            Order Confirmation & Bill
          </p>
        </div>

        {/* Bill Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500 print:text-gray-700">Bill No:</p>
            <p className="font-bold text-gray-900 print:text-black">#{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 print:text-gray-700">Date:</p>
            <p className="font-bold text-gray-900 print:text-black">
              {formatDate(orderDate)}
            </p>
          </div>
        </div>

        {/* Party Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm border-t border-b border-gray-300 py-3">
          {/* Seller */}
          <div>
            <p className="text-xs text-gray-500 print:text-gray-700 uppercase tracking-wider mb-1">
              From (Seller)
            </p>
            <p className="font-bold text-gray-900 print:text-black">{wholesalerName}</p>
            {wholesalerShop && (
              <p className="text-gray-700 print:text-gray-900">{wholesalerShop}</p>
            )}
            {wholesalerPhone && (
              <p className="text-gray-600 print:text-gray-800">Ph: {wholesalerPhone}</p>
            )}
          </div>

          {/* Buyer */}
          <div className="text-right">
            <p className="text-xs text-gray-500 print:text-gray-700 uppercase tracking-wider mb-1">
              To (Buyer)
            </p>
            <p className="font-bold text-gray-900 print:text-black">{retailerName}</p>
            {retailerShop && (
              <p className="text-gray-700 print:text-gray-900">{retailerShop}</p>
            )}
            {retailerPhone && (
              <p className="text-gray-600 print:text-gray-800">Ph: {retailerPhone}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2 font-bold text-gray-900 print:text-black">#</th>
              <th className="text-left py-2 font-bold text-gray-900 print:text-black">Item</th>
              <th className="text-right py-2 font-bold text-gray-900 print:text-black">Qty</th>
              <th className="text-right py-2 font-bold text-gray-900 print:text-black">Rate</th>
              <th className="text-right py-2 font-bold text-gray-900 print:text-black">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-2 text-gray-700 print:text-gray-900">{index + 1}</td>
                <td className="py-2">
                  <p className="font-medium text-gray-900 print:text-black">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500 print:text-gray-700">
                    {item.unit_name}
                    {item.unit_weight_kg && ` (${item.unit_weight_kg}kg)`}
                  </p>
                </td>
                <td className="py-2 text-right text-gray-700 print:text-gray-900">
                  {item.quantity}
                </td>
                <td className="py-2 text-right text-gray-700 print:text-gray-900">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-2 text-right font-medium text-gray-900 print:text-black">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t-2 border-gray-800 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 print:text-gray-800">
              Total Items: {totalItems}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900 print:text-black">
              TOTAL AMOUNT:
            </span>
            <span className="text-2xl font-bold text-gray-900 print:text-black">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mt-4 pt-3 border-t border-gray-300">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold",
            statusLabels[paymentStatus].color
          )}>
            <CheckCircle2 className="w-5 h-5" />
            Payment Status: {statusLabels[paymentStatus].label}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500 print:text-gray-700">
          <p>Thank you for your business!</p>
          <p className="mt-1">Kirana Mandi - Connecting Farmers & Retailers</p>
          <p className="mt-2">_________________________</p>
          <p className="mt-1">Authorized Signature</p>
        </div>

        {/* Print Timestamp */}
        <div className="mt-4 text-center text-xs text-gray-400 print:text-gray-600">
          Printed on: {formatDate(new Date().toISOString())}
        </div>
      </div>
    </div>
  );
}
