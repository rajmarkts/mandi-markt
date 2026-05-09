"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-50 text-red-600 border-red-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
    info: "bg-blue-50 text-blue-600 border-blue-200",
  };

  const buttonVariants = {
    danger: "danger" as const,
    warning: "primary" as const,
    info: "primary" as const,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          {/* Icon */}
          <div className={`
            w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4
            ${variantStyles[variant]}
          `}>
            {variant === "danger" && <X className="w-7 h-7" />}
            {variant === "warning" && <AlertTriangle className="w-7 h-7" />}
            {variant === "info" && <AlertTriangle className="w-7 h-7" />}
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={buttonVariants[variant]}
              onClick={onConfirm}
              className="flex-1"
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
