"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";

interface FilterSidebarProps {
  categories: any[];
  activeCategory: string | null;
  activePriceRange: { min?: number; max?: number } | null;
  onCategoryChange: (categoryId: string | null) => void;
  onPriceRangeChange: (min?: number, max?: number) => void;
  onClearFilters: () => void;
}

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 to $50", min: 25, max: 50 },
  { label: "$50 to $100", min: 50, max: 100 },
  { label: "$100 to $200", min: 100, max: 200 },
  { label: "$200 & Above", min: 200, max: undefined },
];

export const FilterSidebar = ({
  categories,
  activeCategory,
  activePriceRange,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  const hasFilters = activeCategory || activePriceRange;

  const handleCustomPrice = () => {
    const min = customMin ? parseFloat(customMin) : undefined;
    const max = customMax ? parseFloat(customMax) : undefined;
    if (min !== undefined || max !== undefined) {
      onPriceRangeChange(min, max);
    }
  };

  const isPriceActive = (range: { min: number; max?: number }) => {
    if (!activePriceRange) return false;
    return activePriceRange.min === range.min && activePriceRange.max === range.max;
  };

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-gray-200 p-4 min-h-screen">
      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={() => {
            onClearFilters();
            setCustomMin("");
            setCustomMax("");
          }}
          className="flex items-center gap-1 text-xs text-[#007185] hover:text-[#c45500] hover:underline mb-4 cursor-pointer"
        >
          <X className="h-3 w-3" />
          Clear all filters
        </button>
      )}

      {/* Department / Categories */}
      <div className="mb-6">
        <h4 className="font-bold text-sm mb-2 text-gray-900">Department</h4>
        <ul className="text-sm text-gray-800 flex flex-col gap-1 list-none">
          <li
            className={`cursor-pointer hover:text-[#c45500] py-0.5 pl-1 rounded transition-colors ${
              !activeCategory ? "font-bold text-[#c45500]" : ""
            }`}
            onClick={() => onCategoryChange(null)}
          >
            All
          </li>
          {categories.map((cat: any) => (
            <li
              key={cat.id}
              className={`cursor-pointer hover:text-[#c45500] py-0.5 pl-3 rounded transition-colors flex items-center justify-between ${
                activeCategory === cat.id ? "font-bold text-[#c45500]" : ""
              }`}
              onClick={() => onCategoryChange(cat.id)}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-gray-400">({cat._count?.products || 0})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer Reviews (decorative for now) */}
      <div className="mb-6">
        <h4 className="font-bold text-sm mb-2 text-gray-900">Customer Reviews</h4>
        <ul className="text-sm flex flex-col gap-1.5 cursor-pointer list-none">
          {[4, 3, 2, 1].map((stars) => (
            <li key={stars} className="flex flex-row items-center gap-1.5 group py-0.5">
              <div className="flex text-[#ffa41c]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-[15px] w-[15px] ${i < stars ? "fill-current" : ""}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-700 group-hover:text-[#c45500]">& Up</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-bold text-sm mb-2 text-gray-900">Price</h4>
        <ul className="text-sm text-gray-800 flex flex-col gap-1 list-none">
          {PRICE_RANGES.map((range) => (
            <li
              key={range.label}
              className={`cursor-pointer hover:text-[#c45500] py-0.5 pl-1 rounded transition-colors ${
                isPriceActive(range) ? "font-bold text-[#c45500]" : ""
              }`}
              onClick={() => onPriceRangeChange(range.min, range.max)}
            >
              {range.label}
            </li>
          ))}
        </ul>

        {/* Custom Price Range */}
        <div className="flex items-center gap-1.5 mt-3">
          <input
            type="number"
            placeholder="$ Min"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            className="w-[72px] p-1.5 border border-gray-300 rounded text-sm outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="number"
            placeholder="$ Max"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            className="w-[72px] p-1.5 border border-gray-300 rounded text-sm outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
          />
          <button
            onClick={handleCustomPrice}
            className="bg-white border border-gray-300 rounded px-2.5 py-1.5 text-sm shadow-sm hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Go
          </button>
        </div>
      </div>

      {/* Availability (decorative) */}
      <div className="mb-6">
        <h4 className="font-bold text-sm mb-2 text-gray-900">Availability</h4>
        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked className="accent-[#007185] h-4 w-4" />
          <label className="text-gray-700 cursor-pointer">Include Out of Stock</label>
        </div>
      </div>

      {/* Deals (decorative) */}
      <div className="mb-6">
        <h4 className="font-bold text-sm mb-2 text-gray-900">Deals & Discounts</h4>
        <ul className="text-sm text-gray-800 flex flex-col gap-1 list-none">
          <li className="cursor-pointer hover:text-[#c45500] py-0.5 pl-1">All Discounts</li>
          <li className="cursor-pointer hover:text-[#c45500] py-0.5 pl-1">Today&apos;s Deals</li>
        </ul>
      </div>
    </aside>
  );
};
