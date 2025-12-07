"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Heart, Edit2, Save, X, Lock, Home, Bed, Square } from "lucide-react";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [likedProperties, setLikedProperties] = useState([
    {
      id: 1,
      price: "$570,000",
      address: "15 S Aurora Ave, Miami",
      bedrooms: 2,
      rooms: 3,
      sqft: 1220,
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      price: "$750,000",
      address: "23 Ocean Drive, Miami Beach",
      bedrooms: 3,
      rooms: 4,
      sqft: 1850,
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    },
  ]);

  useEffect(() => {
    if (session?.user?.name) {
      setTempName(session?.user?.name || "");
    }
  }, [session]);

  const handleSaveName = async () => {
    // In a real app, you would update the user's name here
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(session?.user?.name || "");
    setIsEditingName(false);
  };

  const handleRemoveLike = (propertyId: number) => {
    setLikedProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const getMemberSinceDate = () => {
    if (session?.user?.createdAt) {
      return new Date(session.user.createdAt).getFullYear();
    }
    // Fallback to current year if no creation date
    return new Date().getFullYear();
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto"></div>
          <div className="w-48 h-4 bg-gray-200 rounded mx-auto"></div>
          <div className="w-64 h-4 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-light text-gray-600">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-lg sm:text-xl font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full max-w-xs"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {session?.user?.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-gray-600 text-sm sm:text-base">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-50 space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 text-sm sm:text-base">
                  Email
                </span>
              </div>
              <span className="text-gray-600 text-sm sm:text-base break-all">
                {session?.user?.email}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
              <div className="flex items-center space-x-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 text-sm sm:text-base">
                  Member Since
                </span>
              </div>
              <span className="text-gray-600 text-sm sm:text-base">
                {getMemberSinceDate()}
              </span>
            </div>
          </div>
        </div>

        {/* Liked Properties Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Liked Properties
            </h2>
            <span className="text-sm text-gray-500">
              ({likedProperties.length})
            </span>
          </div>

          {likedProperties.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No liked properties yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Start browsing and like properties you're interested in!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {likedProperties.map((property) => (
                <div
                  key={property.id}
                  className="relative bg-gray-50 rounded-lg overflow-hidden group hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-40 sm:h-32 lg:h-40 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleRemoveLike(property.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {property.price}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      {property.address}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        <span>{property.rooms} rooms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-3 h-3" />
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
