"use client";

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
  icon?: string;
}

interface CategoryChipsProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

const CATEGORIES: Category[] = [
  { id: "all", label: "All", icon: "🛒" },
  { id: "vegetables", label: "Veggies", icon: "🥬" },
  { id: "fruits", label: "Fruits", icon: "🍎" },
  { id: "grains", label: "Grains", icon: "🌾" },
  { id: "spices", label: "Spices", icon: "🌶️" },
  { id: "dairy", label: "Dairy", icon: "🥛" },
  { id: "oils", label: "Oils", icon: "🛢️" },
  { id: "dry_fruits", label: "Dry Fruits", icon: "🥜" },
];

export { CATEGORIES };

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((category) => {
        const isSelected = selected === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95",
              "border-2",
              isSelected
                ? "bg-[#064e3b] text-white border-[#064e3b] shadow-md"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#064e3b] hover:text-[#064e3b]"
            )}
          >
            {category.icon && <span className="text-base">{category.icon}</span>}
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
