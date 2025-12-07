"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPropertyById } from "@/action/property.action";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Home,
  Star,
  Bell,
  Camera,
  MoreVertical,
  Phone,
  Mail,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Lock,
  X,
} from "lucide-react";
import Image from "next/image";

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
  video: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertyDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContacts, setShowContacts] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [activeView, setActiveView] = useState<"media" | "map">("media");

  useEffect(() => {
    const fetchProperty = async () => {
      if (params.id && typeof params.id === "string") {
        try {
          setLoading(true);
          const result = await getPropertyById(params.id);
          if (result.success && result.property) {
            setProperty(result.property);
          } else {
            setError(result.error || "Property not found");
          }
        } catch (err) {
          setError("An error occurred while fetching the property");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProperty();
  }, [params.id]);

  const handleNextImage = () => {
    if (property) {
      const allMedia = [...(property.image || []), ...(property.video || [])];
      if (allMedia.length > 0) {
        setCurrentImageIndex((prev) =>
          prev === allMedia.length - 1 ? 0 : prev + 1
        );
      }
    }
  };

  const handlePrevImage = () => {
    if (property) {
      const allMedia = [...(property.image || []), ...(property.video || [])];
      if (allMedia.length > 0) {
        setCurrentImageIndex((prev) =>
          prev === 0 ? allMedia.length - 1 : prev - 1
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-6"></div>

          {/* Image Gallery Skeleton */}
          <div className="relative mb-8">
            <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-2xl overflow-hidden animate-pulse" />

            {/* View All Photos Button Skeleton */}
            <div className="mt-4 flex justify-center">
              <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Rating Skeleton */}
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-5 h-5 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Address Skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>

              {/* Thumbnail Gallery Skeleton */}
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Right Column - Brief Information */}
            <div className="space-y-6">
              {/* Brief Information Card Skeleton */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {/* Title Skeleton */}
                <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>

                {/* Owner Skeleton */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                </div>

                {/* Property Specs Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-8"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rental Prices Skeleton */}
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                      </div>
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                    </div>
                  ))}
                </div>

                {/* Button Skeleton */}
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This property doesn't exist or has been removed."}
          </p>
          <Button onClick={() => router.push("/properties")}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* View Toggle Slider */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveView("media")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === "media"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Photos & Videos
              </button>
              <button
                onClick={() => setActiveView("map")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === "map"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Media Gallery Section (Images + Videos) */}
        {activeView === "media" && (
          <div className="relative mb-8">
            {(() => {
              const allMedia = [
                ...(property.image || []).map((img) => ({
                  type: "image",
                  url: img,
                })),
                ...(property.video || []).map((vid) => ({
                  type: "video",
                  url: vid,
                })),
              ];
              const currentMedia = allMedia[currentImageIndex];
              const hasMedia = allMedia.length > 0;

              return (
                <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-2xl overflow-hidden">
                  {hasMedia && currentMedia ? (
                    <>
                      {currentMedia.type === "image" ? (
                        <Image
                          src={currentMedia.url}
                          alt={property.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={currentMedia.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Property Type Badge - Top Right */}
                      {property.type && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                            {property.type === "APARTMENT" && "Apartment"}
                            {property.type === "VILLA" && "Villa"}
                            {property.type === "PLOT" && "Plot"}
                            {property.type === "INDEPENDENTHOUSE" &&
                              "Independent House"}
                          </Badge>
                        </div>
                      )}

                      {/* Navigation Arrows */}
                      {allMedia.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Media Counter */}
                      {allMedia.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {allMedia.length}
                        </div>
                      )}

                      {/* Media Type Badge - Bottom Left */}
                      {currentMedia.type === "video" && (
                        <div className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          VIDEO
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Home className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })()}

            {/* View All Media Button */}
            {(() => {
              const totalMedia =
                (property.image?.length || 0) + (property.video?.length || 0);
              return totalMedia > 1 ? (
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    View all {totalMedia} media
                  </Button>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Map Section */}
        {activeView === "map" && (
          <div className="relative mb-8">
            <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-2xl overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  property.address
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />

              {/* Map Controls Overlay */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Property Location
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 max-w-xs">
                  {property.address}
                </p>
              </div>

              {/* Get Directions Button */}
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => {
                    window.open(
                      `https://maps.google.com/maps?q=${encodeURIComponent(
                        property.address
                      )}`,
                      "_blank"
                    );
                  }}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.name}
              </h1>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{property.address}</span>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Thumbnail Gallery - Images and Videos */}
            {(() => {
              const allMedia = [
                ...(property.image || []).map((img) => ({
                  type: "image",
                  url: img,
                })),
                ...(property.video || []).map((vid) => ({
                  type: "video",
                  url: vid,
                })),
              ];
              return allMedia.length > 1 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {allMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {media.type === "image" ? (
                        <Image
                          src={media.url}
                          alt={`${property.name} - Media ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                          <span className="text-white text-xs font-bold">
                            VIDEO
                          </span>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : null;
            })()}
          </div>

          {/* Right Column - Brief Information */}
          <div className="space-y-6">
            {/* Brief Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Brief information
              </h2>

              {/* Owner */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Owner</p>
                  <p className="font-medium">Real estate agency</p>
                </div>
              </div>

              {/* Property Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {property.bhk && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold">{property.bhk}</p>
                      <p className="text-xs text-gray-500">BHK</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold">
                      {property.size.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-500">Sq. Ft</p>
                  </div>
                </div>
              </div>

              {/* Full Price */}
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Property Price</p>
                <p className="text-3xl font-bold text-black">
                  ₹{property.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Contact Button */}
              <Button
                className="w-full bg-gray-900 hover:bg-gray-800"
                onClick={() => {
                  if (session?.user) {
                    setShowContacts(!showContacts);
                  } else {
                    setShowLoginPopup(true);
                  }
                }}
              >
                {session?.user
                  ? showContacts
                    ? "Hide contacts"
                    : "View contacts"
                  : "View contacts"}
              </Button>

              {/* Contact Details (shown when button is clicked) */}
              {showContacts && session?.user && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">agency@property.com</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Login Popup Modal */}
        {showLoginPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                <Lock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black text-center mb-2">
                Sign in to view contacts
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Please log in to view the contact information for this property.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    router.push("/signin");
                  }}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
