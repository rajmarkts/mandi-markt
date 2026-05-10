"use client";

import { Search, SlidersHorizontal, TrendingUp, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";

interface SearchHeroProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export function SearchHero({ onSearch, onFilter }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="bg-gradient-to-br from-navy to-navy-dark text-white">
      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-8 sm:pt-8 sm:pb-10">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Kirana Mandi</h1>
              <p className="text-xs sm:text-sm text-blue-200">B2B Wholesale Marketplace</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-200">
            <ShieldCheck className="w-5 h-5 text-emerald" />
            <span className="text-sm hidden sm:inline">Verified Suppliers</span>
          </div>
        </div>

        {/* Trust Badges - Mobile Scrollable */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 whitespace-nowrap">
            <TrendingUp className="w-5 h-5 text-emerald" />
            <span className="text-sm font-medium">Best Rates</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 whitespace-nowrap">
            <ShieldCheck className="w-5 h-5 text-emerald" />
            <span className="text-sm font-medium">Quality Assured</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 whitespace-nowrap">
            <Truck className="w-5 h-5 text-emerald" />
            <span className="text-sm font-medium">Fast Delivery</span>
          </div>
        </div>

        {/* Prominent Search Bar - Amazon/Blinkit Style */}
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden ring-4 ring-white/20">
            {/* Search Icon */}
            <div className="pl-4 pr-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search: Aloo, Tomato, Rice, Dal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-4 sm:py-5 text-lg sm:text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none min-w-0"
            />
            
            {/* Filter Button */}
            <button
              type="button"
              onClick={onFilter}
              className="px-4 py-4 border-l border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-6 h-6 text-gray-500" />
            </button>
            
            {/* Search Button */}
            <button
              type="submit"
              className="bg-emerald hover:bg-emerald-dark text-white px-6 sm:px-8 py-4 sm:py-5 font-semibold text-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Category Pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          {["Vegetables", "Fruits", "Rice & Dal", "Spices", "Oil & Ghee"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSearchQuery(cat);
                onSearch?.(cat);
              }}
              className="bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
