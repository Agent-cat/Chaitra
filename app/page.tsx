"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/action/property.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Home, DollarSign, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Dynamic filter data
  const [locations, setLocations] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties and extract unique filter values
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const result = await getProperties();
        if (result.success && result.properties) {
          const props = result.properties;

          // Extract unique locations
          const uniqueLocations = Array.from(
            new Set(props.map((p) => p.location).filter(Boolean))
          ) as string[];
          setLocations(uniqueLocations);
          if (uniqueLocations.length > 0) setLocation(uniqueLocations[0]);

          // Extract unique property types
          const uniqueTypes = Array.from(
            new Set(props.map((p) => p.type).filter(Boolean))
          ) as string[];
          setPropertyTypes(uniqueTypes);
          if (uniqueTypes.length > 0) setPropertyType(uniqueTypes[0]);

          // Generate price ranges based on min/max prices
          const prices = props.map((p) => p.price).sort((a, b) => a - b);
          if (prices.length > 0) {
            const minPrice = prices[0];
            const maxPrice = prices[prices.length - 1];
            const ranges = [
              {
                label: `₹0 - ₹${(minPrice * 2).toLocaleString("en-IN")}`,
                value: `₹0 - ₹${(minPrice * 2).toLocaleString("en-IN")}`,
              },
              {
                label: `₹${(minPrice * 2).toLocaleString("en-IN")} - ₹${(
                  maxPrice / 2
                ).toLocaleString("en-IN")}`,
                value: `₹${(minPrice * 2).toLocaleString("en-IN")} - ₹${(
                  maxPrice / 2
                ).toLocaleString("en-IN")}`,
              },
              {
                label: `₹${(maxPrice / 2).toLocaleString(
                  "en-IN"
                )} - ₹${maxPrice.toLocaleString("en-IN")}`,
                value: `₹${(maxPrice / 2).toLocaleString(
                  "en-IN"
                )} - ₹${maxPrice.toLocaleString("en-IN")}`,
              },
              {
                label: `₹${maxPrice.toLocaleString("en-IN")}+`,
                value: `₹${maxPrice.toLocaleString("en-IN")}+`,
              },
            ];
            setPriceRanges(ranges);
            if (ranges.length > 0) setPriceRange(ranges[0].value);
          }
        }
      } catch (err) {
        console.error("Failed to fetch properties for filters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const handleSearch = () => {
    // Build query params from selected filters
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (propertyType) params.append("type", propertyType);
    if (priceRange) params.append("priceRange", priceRange);

    // Navigate to properties page with filters
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white overflow-x-hidden text-black pt-14">
      {/* Hero Section */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20 gap-8 lg:gap-10">
        {/* Left Content Section */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center space-y-6 lg:space-y-8">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex h-px w-12 bg-gray-300 rounded-full" />
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.5em] text-gray-400 font-semibold">
                Crafted by
              </p>
              <p
                className="text-2xl sm:text-3xl text-gray-900"
                style={{ fontFamily: "var(--font-playfair-display)" }}
              >
                Chitra Homes
              </p>
            </div>
          </div>
          {/* Main Heading */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
              Gateway to{" "}
              <span className="font-extrabold block">Dream Homes</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed max-w-md">
            Discover a curated collection of dream homes at your fingertips,
            simplified and personalized.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-4 pt-6">
            <Link
              href="/properties"
              onClick={handleSearch}
              className="h-12 px-8 bg-black text-center flex items-center justify-center hover:bg-gray-900 text-white rounded-full font-semibold text-base transition-all duration-300"
            >
              Discover Now
            </Link>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:w-7/12 flex items-center justify-center relative h-[300px] sm:h-[460px] scale-150 lg:h-[660px] xl:h-[640px] -mr-4 lg:-mr-12">
          <div className="relative w-full h-full overflow-visible">
            <Image
              src="/home-personal.png"
              alt="Dream Home"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar Section */}
      <div className="relative hidden sm:block z-10 px-6 sm:px-8 lg:px-16 xl:px-24 -mt-10 sm:-mt-12 lg:-mt-16 pb-12 lg:pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
              {/* Location Selector */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <Select
                  value={location}
                  onValueChange={setLocation}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12 rounded-lg border-gray-200 text-base font-medium">
                    <SelectValue
                      placeholder={loading ? "Loading..." : "Select Location"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type Selector */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Home className="w-4 h-4" />
                  Property Type
                </label>
                <Select
                  value={propertyType}
                  onValueChange={setPropertyType}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12 rounded-lg border-gray-200 text-base font-medium">
                    <SelectValue
                      placeholder={loading ? "Loading..." : "Select Type"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Selector */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="w-4 h-4" />
                  Price Range
                </label>
                <Select
                  value={priceRange}
                  onValueChange={setPriceRange}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12 rounded-lg border-gray-200 text-base font-medium">
                    <SelectValue
                      placeholder={loading ? "Loading..." : "Select Price"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex justify-center sm:justify-end">
                <button
                  onClick={handleSearch}
                  className="w-12 h-12 rounded-full bg-black hover:bg-gray-900 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
