"use client";

import { useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt, 
  Calendar,
  IndianRupee,
  AlertCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { Button } from "./Button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface KhataEntry {
  id: string;
  date: string;
  type: "credit" | "debit" | "payment";
  amount: number;
  description: string;
  relatedOrderId?: string;
}

interface KhataData {
  wholesalerName: string;
  wholesalerShop: string;
  currentBalance: number; // Positive = retailer owes, Negative = wholesaler owes
  totalCreditGiven: number;
  totalPaid: number;
  entries: KhataEntry[];
}

interface KhataViewProps {
  data: KhataData;
  onPayNow?: (amount: number) => void;
  onViewOrder?: (orderId: string) => void;
}

export function KhataView({ data, onPayNow, onViewOrder }: KhataViewProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");

  const isRetailerOwes = data.currentBalance > 0;
  const isWolesalerOwes = data.currentBalance < 0;
  const isSettled = data.currentBalance === 0;

  // Filter entries
  const filteredEntries = data.entries.filter((entry) => {
    if (filter === "pending") return entry.type === "credit";
    if (filter === "paid") return entry.type === "payment";
    return true;
  });

  // Calculate pending amount (unpaid credit)
  const pendingAmount = data.entries
    .filter((e) => e.type === "credit")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-5">
      {/* Balance Card */}
      <Card className={cn(
        "border-2",
        isRetailerOwes ? "bg-red-50 border-red-200" : 
        isWolesalerOwes ? "bg-emerald-50 border-emerald-200" : 
        "bg-gray-50 border-gray-200"
      )}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Outstanding Balance</p>
              <h2 className={cn(
                "text-4xl font-bold",
                isRetailerOwes ? "text-red-600" : 
                isWolesalerOwes ? "text-emerald-600" : 
                "text-gray-600"
              )}>
                {formatCurrency(Math.abs(data.currentBalance))}
              </h2>
              <p className={cn(
                "text-sm font-medium mt-2",
                isRetailerOwes ? "text-red-600" : 
                isWolesalerOwes ? "text-emerald-600" : 
                "text-gray-500"
              )}>
                {isRetailerOwes 
                  ? "⚠️ You owe this amount" 
                  : isWolesalerOwes 
                  ? "✓ Wholesaler owes you" 
                  : "✓ All settled up"}
              </p>
            </div>
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              isRetailerOwes ? "bg-red-100" : 
              isWolesalerOwes ? "bg-emerald-100" : 
              "bg-gray-100"
            )}>
              <Wallet className={cn(
                "w-7 h-7",
                isRetailerOwes ? "text-red-600" : 
                isWolesalerOwes ? "text-emerald-600" : 
                "text-gray-600"
              )} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-200/50">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Credit</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(data.totalCreditGiven)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Paid</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(data.totalPaid)}</p>
            </div>
          </div>

          {/* Pay Now Button */}
          {isRetailerOwes && onPayNow && (
            <Button
              onClick={() => onPayNow(data.currentBalance)}
              className="w-full mt-4 h-14"
              size="touch"
            >
              <IndianRupee className="w-5 h-5 mr-2" />
              Pay ₹{data.currentBalance.toFixed(0)} Now
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Entries" },
          { id: "pending", label: "Pending Bills" },
          { id: "paid", label: "Payments Made" },
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

      {/* Entries List */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-gray-500" />
          Transaction History
        </h3>

        {filteredEntries.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No {filter === "all" ? "" : filter} entries found</p>
          </Card>
        ) : (
          filteredEntries.map((entry) => {
            const isCredit = entry.type === "credit";
            const isPayment = entry.type === "payment";

            return (
              <Card key={entry.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      isCredit ? "bg-red-100" : 
                      isPayment ? "bg-emerald-100" : 
                      "bg-gray-100"
                    )}>
                      {isCredit ? (
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      ) : isPayment ? (
                        <ArrowDownLeft className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Receipt className="w-6 h-6 text-gray-600" />
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
                          isCredit ? "text-red-600" : 
                          isPayment ? "text-emerald-600" : 
                          "text-gray-900"
                        )}>
                          {isCredit ? "+" : isPayment ? "-" : ""}
                          {formatCurrency(entry.amount)}
                        </p>
                      </div>

                      {/* Type Badge & Order Link */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold",
                          isCredit ? "bg-red-100 text-red-700" : 
                          isPayment ? "bg-emerald-100 text-emerald-700" : 
                          "bg-gray-100 text-gray-700"
                        )}>
                          {isCredit ? "CREDIT (Udhaar)" : isPayment ? "PAYMENT" : "ADJUSTMENT"}
                        </span>
                        
                        {entry.relatedOrderId && onViewOrder && (
                          <button
                            onClick={() => onViewOrder(entry.relatedOrderId!)}
                            className="text-xs text-[#064e3b] font-medium hover:underline"
                          >
                            View Order →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Pending Bills Alert */}
      {pendingAmount > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Pending Payment Reminder</p>
                <p className="text-sm text-amber-700 mt-1">
                  You have {formatCurrency(pendingAmount)} in pending bills. 
                  Please clear them to maintain good credit standing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
