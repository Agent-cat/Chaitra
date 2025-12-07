"use client";

import { useEffect, useState, useMemo } from "react";
import { getProperties } from "@/action/property.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterDrawer, type FilterState } from "@/components/FilterDrawer";
import { Search, X } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  size: number;
  bhk: number | null;
  type: string | null;
  description: string;
  image: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 0 },
    sizeRange: { min: 0, max: 0 },
    bhkFilter: null,
    typeFilter: null,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const result = await getProperties();
        if (result.success && result.properties) {
          setProperties(result.properties);
        } else {
          setError(result.error || "Failed to fetch properties");
        }
      } catch (err) {
        setError("An error occurred while fetching properties");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search query and filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.name.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query);

      const matchesPrice =
        filters.priceRange.min === 0 && filters.priceRange.max === 0
          ? true
          : property.price >= filters.priceRange.min &&
            property.price <= filters.priceRange.max;

      const matchesSize =
        filters.sizeRange.min === 0 && filters.sizeRange.max === 0
          ? true
          : property.size >= filters.sizeRange.min &&
            property.size <= filters.sizeRange.max;

      const matchesBhk =
        filters.bhkFilter === null || property.bhk === filters.bhkFilter;

      const matchesType =
        filters.typeFilter === null || property.type === filters.typeFilter;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesSize &&
        matchesBhk &&
        matchesType
      );
    });
  }, [properties, searchQuery, filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.bhkFilter !== null ||
      filters.typeFilter !== null ||
      filters.priceRange.min !== 0 ||
      filters.priceRange.max !== 0 ||
      filters.sizeRange.min !== 0 ||
      filters.sizeRange.max !== 0
    );
  }, [filters]);

  // Get active filter labels
  const activeFilterLabels = useMemo(() => {
    const labels: { label: string; key: string }[] = [];

    if (filters.bhkFilter !== null) {
      labels.push({ label: `${filters.bhkFilter} BHK`, key: "bhk" });
    }
    if (filters.typeFilter !== null) {
      labels.push({ label: filters.typeFilter, key: "type" });
    }
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 0) {
      labels.push({
        label: `₹${filters.priceRange.min.toLocaleString(
          "en-IN"
        )} - ₹${filters.priceRange.max.toLocaleString("en-IN")}`,
        key: "price",
      });
    }
    if (filters.sizeRange.min !== 0 || filters.sizeRange.max !== 0) {
      labels.push({
        label: `${filters.sizeRange.min} - ${filters.sizeRange.max} Sq.Ft`,
        key: "size",
      });
    }

    return labels;
  }, [filters]);

  // Remove specific filter
  const removeFilter = (key: string) => {
    const newFilters = { ...filters };

    switch (key) {
      case "bhk":
        newFilters.bhkFilter = null;
        break;
      case "type":
        newFilters.typeFilter = null;
        break;
      case "price":
        newFilters.priceRange = { min: 0, max: 0 };
        break;
      case "size":
        newFilters.sizeRange = { min: 0, max: 0 };
        break;
    }

    setFilters(newFilters);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 pt-20 pb-10 px-4 md:px-8">
      <div className="w-full">
        {/* Header */}

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search properties by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 h-12 text-base rounded-xl border-slate-300 focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col h-full"
                >
                  {/* Image Skeleton */}
                  <div className="relative h-56 bg-slate-200 animate-pulse" />

                  {/* Content Skeleton */}
                  <div className="p-5 flex flex-col grow space-y-3">
                    {/* Name and Price Header */}
                    <div className="flex items-start justify-between gap-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-6 w-16" />
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <Skeleton className="w-4 h-4 mt-0.5" />
                      <Skeleton className="h-4 w-full" />
                    </div>

                    {/* Property Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>

                    {/* Button Skeleton */}
                    <Skeleton className="h-10 w-full rounded-lg mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Error</CardTitle>
              <CardDescription className="text-red-700">
                {error}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <CardTitle>No Properties Found</CardTitle>
              <CardDescription>
                There are no properties to display at the moment.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Filter Button and Active Filters */}
        {!loading && !error && properties.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <FilterDrawer
                properties={properties}
                onFilterChange={setFilters}
              />

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  {activeFilterLabels.map((filter) => (
                    <div
                      key={filter.key}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-full text-sm font-medium"
                    >
                      <span>{filter.label}</span>
                      <button
                        onClick={() => removeFilter(filter.key)}
                        className="hover:bg-slate-800 rounded-full p-0.5 transition-colors"
                        title="Remove filter"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && (
          <PropertyCard properties={filteredProperties} />
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
