"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sliders, X } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  size: number;
  bhk: number | null;
  description: string;
  image: string[];
  createdAt: Date;
  updatedAt: Date;
  type?: string;
}

interface FilterDrawerProps {
  properties: Property[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: { min: number; max: number };
  sizeRange: { min: number; max: number };
  bhkFilter: number | null;
  typeFilter: string | null;
}

export const FilterDrawer = ({
  properties,
  onFilterChange,
}: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [sizeRange, setSizeRange] = useState({ min: 0, max: 0 });
  const [bhkFilter, setBhkFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Calculate dynamic ranges from properties
  const dynamicRanges = useMemo(() => {
    if (properties.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 0,
        minSize: 0,
        maxSize: 0,
        bhk: [],
        types: [],
      };
    }

    const prices = properties.map((p) => p.price);
    const sizes = properties.map((p) => p.size);
    const bhk = Array.from(
      new Set(properties.map((p) => p.bhk).filter((b) => b !== null))
    ).sort((a, b) => (a ?? 0) - (b ?? 0));
    const types = Array.from(
      new Set(
        properties
          .map((p) => p.type)
          .filter((t) => t !== null && t !== undefined)
      )
    );

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minSize: Math.min(...sizes),
      maxSize: Math.max(...sizes),
      bhk,
      types,
    };
  }, [properties]);

  // Initialize ranges on first open
  const handleOpen = () => {
    if (priceRange.min === 0 && priceRange.max === 0) {
      setPriceRange({
        min: dynamicRanges.minPrice,
        max: dynamicRanges.maxPrice,
      });
      setSizeRange({
        min: dynamicRanges.minSize,
        max: dynamicRanges.maxSize,
      });
    }
    setIsOpen(true);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      sizeRange,
      bhkFilter,
      typeFilter,
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setPriceRange({
      min: dynamicRanges.minPrice,
      max: dynamicRanges.maxPrice,
    });
    setSizeRange({
      min: dynamicRanges.minSize,
      max: dynamicRanges.maxSize,
    });
    setBhkFilter(null);
    setTypeFilter(null);
    onFilterChange({
      priceRange: {
        min: dynamicRanges.minPrice,
        max: dynamicRanges.maxPrice,
      },
      sizeRange: {
        min: dynamicRanges.minSize,
        max: dynamicRanges.maxSize,
      },
      bhkFilter: null,
      typeFilter: null,
    });
  };

  return (
    <>
      {/* Filter Button */}
      <Button
        onClick={handleOpen}
        variant="outline"
        className="flex items-center gap-2 h-10 px-4 rounded-lg font-medium"
      >
        <Sliders className="w-4 h-4" />
        Filters
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Price Range - Single Slider */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900">
              Price Range
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-xs text-slate-600 mb-1">Min</p>
                  <p className="text-sm font-semibold text-slate-900">
                    ₹{priceRange.min.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600 mb-1">Max</p>
                  <p className="text-sm font-semibold text-slate-900">
                    ₹{priceRange.max.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <input
                type="range"
                min={dynamicRanges.minPrice}
                max={dynamicRanges.maxPrice}
                value={priceRange.min}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  if (newMin <= priceRange.max) {
                    setPriceRange({ ...priceRange, min: newMin });
                  }
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <input
                type="range"
                min={dynamicRanges.minPrice}
                max={dynamicRanges.maxPrice}
                value={priceRange.max}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  if (newMax >= priceRange.min) {
                    setPriceRange({ ...priceRange, max: newMax });
                  }
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          </div>

          {/* Size Range - Input Fields */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900">
              Size (Sq. Ft)
            </label>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1.5">
                  Minimum Size
                </p>
                <Input
                  type="number"
                  placeholder="Min sqft"
                  value={sizeRange.min || ""}
                  onChange={(e) =>
                    setSizeRange({
                      ...sizeRange,
                      min: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-10 text-sm rounded-lg"
                />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1.5">
                  Maximum Size
                </p>
                <Input
                  type="number"
                  placeholder="Max sqft"
                  value={sizeRange.max || ""}
                  onChange={(e) =>
                    setSizeRange({
                      ...sizeRange,
                      max: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-10 text-sm rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* BHK */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">BHK</label>
            <Select
              value={bhkFilter?.toString() || "all"}
              onValueChange={(value) =>
                setBhkFilter(value === "all" ? null : parseInt(value))
              }
            >
              <SelectTrigger className="h-10 rounded-lg">
                <SelectValue placeholder="Select BHK" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {dynamicRanges.bhk.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} BHK
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          {dynamicRanges.types.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">
                Property Type
              </label>
              <Select
                value={typeFilter || "all"}
                onValueChange={(value) =>
                  setTypeFilter(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {dynamicRanges.types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 space-y-2">
          <Button
            onClick={handleApplyFilters}
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="w-full h-10 rounded-lg font-semibold"
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  );
};
