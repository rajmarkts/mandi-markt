"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: "sm" | "md" | "lg" | "auto" | "full";
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = "auto",
}: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      // Unmount after animation
      setTimeout(() => setIsMounted(false), 300);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const heightClasses = {
    sm: "max-h-[40vh]",
    md: "max-h-[60vh]",
    lg: "max-h-[80vh]",
    auto: "max-h-[85vh]",
    full: "max-h-[95vh]",
  };

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Sheet */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out",
          heightClasses[height],
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle bar for visual affordance */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
