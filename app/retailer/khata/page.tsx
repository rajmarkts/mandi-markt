"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Calendar, Wallet } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

// Mock Khata data
const MOCK_KHATA_DATA = {
  wholesalerName: "Asha Kirana Store",
  wholesalerShop: "Main Market, Sector 12",
  currentBalance: 4500,
  totalCreditGiven: 12500,
  totalPaid: 8000,
  entries: [
    {
      id: "1",
      date: "2024-01-15",
      type: "credit" as const,
      amount: 3200,
      description: "Order #1234 - Rice & Dal",
      relatedOrderId: "1234",
    },
    {
      id: "2",
      date: "2024-01-10",
      type: "payment" as const,
      amount: 5000,
      description: "Cash Payment",
    },
    {
      id: "3",
      date: "2024-01-05",
      type: "credit" as const,
      amount: 2800,
      description: "Order #1230 - Vegetables",
      relatedOrderId: "1230",
    },
    {
      id: "4",
      date: "2023-12-28",
      type: "payment" as const,
      amount: 3000,
      description: "UPI Payment",
    },
    {
      id: "5",
      date: "2023-12-20",
      type: "credit" as const,
      amount: 6500,
      description: "Order #1225 - Monthly Stock",
      relatedOrderId: "1225",
    },
  ],
};

export default function KhataPage() {
  const [filter, setFilter] = useState<"all" | "credit" | "payment">("all");

  const data = MOCK_KHATA_DATA;
  const isRetailerOwes = data.currentBalance > 0;

  const filteredEntries = data.entries.filter((entry) => {
    if (filter === "credit") return entry.type === "credit";
    if (filter === "payment") return entry.type === "payment";
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/retailer"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Khata (Ledger)</h1>
      </div>

      {/* Balance Card */}
      <Card className={cn(
        "border-2",
        isRetailerOwes ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"
      )}>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Outstanding Balance</p>
              <h2 className={cn(
                "text-4xl font-bold",
                isRetailerOwes ? "text-red-600" : "text-emerald-600"
              )}>
                {formatCurrency(Math.abs(data.currentBalance))}
              </h2>
              <p className={cn(
                "text-sm font-medium mt-2",
                isRetailerOwes ? "text-red-600" : "text-emerald-600"
              )}>
                {isRetailerOwes 
                  ? "⚠️ You owe this amount" 
                  : "✓ Wholesaler owes you"}
              </p>
            </div>
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              isRetailerOwes ? "bg-red-100" : "bg-emerald-100"
            )}>
              <Wallet className={cn(
                "w-7 h-7",
                isRetailerOwes ? "text-red-600" : "text-emerald-600"
              )} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-200/50">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Credit (Udhaar)</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(data.totalCreditGiven)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Paid</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(data.totalPaid)}</p>
            </div>
          </div>

          {isRetailerOwes && (
            <Button className="w-full mt-4 h-14" size="touch">
              Pay ₹{data.currentBalance.toFixed(0)} Now
            </Button>
          )}
        </div>
      </Card>

      {/* Wholesaler Info */}
      <Card>
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase mb-1">With Wholesaler</p>
          <h3 className="font-bold text-gray-900 text-lg">{data.wholesalerName}</h3>
          <p className="text-gray-500 text-sm">{data.wholesalerShop}</p>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Entries" },
          { id: "credit", label: "Credit (Udhaar)" },
          { id: "payment", label: "Payments" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
              filter === tab.id
                ? "bg-[#064e3b] text-white"
                : "bg-white text-gray-600 border border-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900">Transaction History</h3>

        {filteredEntries.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No entries found</p>
          </Card>
        ) : (
          filteredEntries.map((entry) => {
            const isCredit = entry.type === "credit";

            return (
              <Card key={entry.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      isCredit ? "bg-red-100" : "bg-emerald-100"
                    )}>
                      {isCredit ? (
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-gray-900">{entry.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(entry.date)}
                          </div>
                        </div>
                        <p className={cn(
                          "text-lg font-bold whitespace-nowrap",
                          isCredit ? "text-red-600" : "text-emerald-600"
                        )}>
                          {isCredit ? "+" : "-"}
                          {formatCurrency(entry.amount)}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <span className={cn(
                        "inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-3",
                        isCredit ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {isCredit ? "CREDIT (Udhaar)" : "PAYMENT"}
                      </span>

                      {/* Order Link */}
                      {entry.relatedOrderId && (
                        <Link
                          href={`/retailer/order/${entry.relatedOrderId}`}
                          className="ml-2 text-xs text-[#064e3b] font-medium hover:underline"
                        >
                          View Order →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gray-50">
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-gray-900">Quick Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Transactions</p>
              <p className="font-bold text-gray-900">{data.entries.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Activity</p>
              <p className="font-bold text-gray-900">{formatDate(data.entries[0]?.date || "")}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
