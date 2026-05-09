"use client";

import { Package, Plus } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No products yet",
  description = "Add your first product to start selling to retailers",
  actionLabel = "Add Product",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <Package className="w-10 h-10 text-emerald-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {onAction && (
        <Button onClick={onAction} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
