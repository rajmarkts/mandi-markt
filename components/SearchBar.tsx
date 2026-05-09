"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search products...",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-[#064e3b]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-14 pl-12 pr-12",
          "bg-white text-gray-900",
          "border-2 border-[#064e3b]/20 rounded-2xl",
          "placeholder:text-gray-400",
          "focus:outline-none focus:border-[#064e3b] focus:ring-4 focus:ring-[#064e3b]/10",
          "transition-all duration-200",
          "text-base sm:text-lg"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </div>
        </button>
      )}
    </div>
  );
}
