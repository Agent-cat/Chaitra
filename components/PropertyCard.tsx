"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize2, Bed, Bath } from "lucide-react";

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
}

interface PropertyCardProps {
  properties: Property[];
}

export const PropertyCard = ({ properties }: PropertyCardProps) => {
  return (
    <div className="space-y-8">
      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <MapPin className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Properties Found
          </h3>
          <p className="text-slate-600">
            No properties available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative h-56 bg-slate-200 overflow-hidden">
                {property.image && property.image.length > 0 ? (
                  <>
                    <Image
                      src={property.image[0]}
                      alt={property.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Image Count Badge */}
                    {property.image.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {property.image.length} photos
                      </div>
                    )}
                    {/* Carousel Dots */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                      {Array.from({
                        length: Math.min(property.image.length, 4),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${
                            i === 0 ? "bg-white w-6" : "bg-white/50 w-1.5"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
                    <MapPin className="w-16 h-16 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col grow">
                {/* Name and Price Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-1 flex-1">
                    {property.name}
                  </p>
                  <p className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                    ₹{property.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-black" />
                  <p className="text-xs text-slate-600 font-medium line-clamp-2">
                    {property.address}
                  </p>
                </div>

                {/* Property Details - BHK */}
                <div className="mb-4 grow">
                  {/* BHK */}
                  <div className="flex items-center gap-2 mb-3">
                    <Bed className="w-4 h-4 text-black shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">
                      {property.bhk || 0} BHK
                    </span>
                  </div>
                  {/* Size */}
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-black shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">
                      {property.size.toLocaleString("en-IN")} Sq. Ft
                    </span>
                  </div>
                </div>

                {/* View Button */}
                <Button className="w-full h-10 rounded-lg font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white">
                  View Property
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
