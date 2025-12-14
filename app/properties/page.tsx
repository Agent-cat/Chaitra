"use client";

import { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getProperties } from "@/action/property.action";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/PropertyCard";
import {
  FilterDrawer,
  type FilterState,
  type FilterStats,
} from "@/components/FilterDrawer";
import { Search, X } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 0 },
    sizeRange: { min: 0, max: 0 },
    bhkFilter: null,
    typeFilter: null,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<FilterStats | undefined>(undefined);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery !== debouncedSearchQuery) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  // Parse query params on mount
  useEffect(() => {
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const priceRange = searchParams.get("priceRange");

    let shouldReset = false;

    if (location) {
      setLocationFilter(location);
      shouldReset = true;
    }
    if (type) {
      setTypeFilter(type);
      setFilters((prev) => ({ ...prev, typeFilter: type }));
      shouldReset = true;
    }
    if (priceRange) {
      setPriceRangeFilter(priceRange);
      shouldReset = true;
    }

    if (shouldReset) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [searchParams]);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProperties({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchQuery,
        location: locationFilter || undefined,
        type: typeFilter || undefined,
        minPrice: filters.priceRange.min || undefined,
        maxPrice: filters.priceRange.max || undefined,
        minSize: filters.sizeRange.min || undefined,
        maxSize: filters.sizeRange.max || undefined,
        bhk: filters.bhkFilter || undefined,
      });

      if (result.success && result.properties) {
        setProperties(result.properties as any);
        if (result.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
          }));
        }
        if (result.stats) {
          setStats(result.stats);
        }
      } else {
        setError(result.error || "Failed to fetch properties");
      }
    } catch (err) {
      setError("An error occurred while fetching properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearchQuery,
    locationFilter,
    typeFilter,
    filters,
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.bhkFilter !== null ||
      filters.typeFilter !== null ||
      filters.priceRange.min !== 0 ||
      filters.priceRange.max !== 0 ||
      filters.sizeRange.min !== 0 ||
      filters.sizeRange.max !== 0 ||
      locationFilter !== null
    );
  }, [filters, locationFilter]);

  // Get active filter labels
  const activeFilterLabels = useMemo(() => {
    const labels: { label: string; key: string }[] = [];

    // Add location filter from query params
    if (locationFilter) {
      labels.push({ label: locationFilter, key: "location" });
    }

    // Add type filter from query params or internal filters
    if (typeFilter) {
      labels.push({ label: typeFilter, key: "type" });
    }

    // Add price range from query params
    if (priceRangeFilter) {
      labels.push({ label: priceRangeFilter, key: "price" });
    }

    if (filters.bhkFilter !== null) {
      labels.push({ label: `${filters.bhkFilter} BHK`, key: "bhk" });
    }
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 0) {
      labels.push({
        label: `₹${filters.priceRange.min.toLocaleString(
          "en-IN"
        )} - ₹${filters.priceRange.max.toLocaleString("en-IN")}`,
        key: "priceRange",
      });
    }
    if (filters.sizeRange.min !== 0 || filters.sizeRange.max !== 0) {
      labels.push({
        label: `${filters.sizeRange.min} - ${filters.sizeRange.max} Sq.Ft`,
        key: "size",
      });
    }

    return labels;
  }, [filters, locationFilter, typeFilter, priceRangeFilter]);

  // Remove specific filter
  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    let shouldReset = true;

    switch (key) {
      case "location":
        setLocationFilter(null);
        break;
      case "type":
        setTypeFilter(null);
        newFilters.typeFilter = null;
        break;
      case "price":
        setPriceRangeFilter(null);
        break;
      case "bhk":
        newFilters.bhkFilter = null;
        break;
      case "priceRange":
        newFilters.priceRange = { min: 0, max: 0 };
        break;
      case "size":
        newFilters.sizeRange = { min: 0, max: 0 };
        break;
      default:
        shouldReset = false;
    }

    if (shouldReset) {
      setFilters(newFilters);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleFilterDrawerChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Determine if type filter changed specifically to update state
    if (newFilters.typeFilter !== typeFilter) {
      setTypeFilter(newFilters.typeFilter);
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  }

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

        {/* Loading State - Skeleton */}
        {loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col h-full"
                >
                  <div className="relative h-56 bg-slate-200 animate-pulse" />
                  <div className="p-5 flex flex-col grow space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-full" />
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
                Try adjusting your search or filters to find what you're looking for.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Filter Button and Active Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <FilterDrawer
              properties={properties}
              stats={stats}
              onFilterChange={handleFilterDrawerChange}
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

        {/* Properties Grid with Fade In */}
        {!loading && !error && properties.length > 0 && (
          <div className="animate-fade-in">
            <style jsx global>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in {
                animation: fadeIn 0.5s ease-out forwards;
              }
            `}</style>
            <PropertyCard properties={properties} />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page > 1) handlePageChange(pagination.page - 1);
                        }}
                        className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                      // Simple logic to show limited pages if too many
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === pagination.page}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return <PaginationEllipsis key={page} />;
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page < pagination.totalPages) handlePageChange(pagination.page + 1);
                        }}
                        className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
};

export default function PropertiesPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesPage />
    </Suspense>
  );
}
