"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { navLinks } from "@/constants/navconstants";
import { User, LogOut, Heart, Settings } from "lucide-react";
import type { AuthSession } from "@/types/auth";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession() as {
    data: AuthSession | null;
    isPending: boolean;
  };

  const dropdownRef = useOnClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  }, isDropdownOpen);

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-playfair-display text-gray-900"
            >
              Chaitra
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-light transition-all duration-300 ease-out relative group rounded-lg hover:bg-gray-50/50"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-linear-to-r from-transparent via-gray-900 to-transparent transform -translate-x-1/2 group-hover:w-full group-hover:transition-all group-hover:duration-500 group-hover:ease-out rounded-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {isPending ? (
              <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none rounded-full p-1 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-light text-gray-600">
                        {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-light text-gray-700">
                    {session.user.name}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-sm border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {session.user.email}
                      </p>
                    </div>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={handleDropdownClick}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={handleDropdownClick}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/signin"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-light transition-all duration-300 ease-out relative group rounded-lg hover:bg-gray-50/50"
                >
                  Sign In
                  <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-linear-to-r from-transparent via-gray-900 to-transparent transform -translate-x-1/2 group-hover:w-full group-hover:transition-all group-hover:duration-500 group-hover:ease-out rounded-full"></span>
                </Link>
                <Link
                  href="/signup"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 text-sm font-light rounded-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-gray-900/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - only show when not logged in or for navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-50 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl text-sm font-light transition-all duration-300 ease-out relative group transform hover:translate-x-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.label}</span>
                      <svg
                        className="w-4 h-4 text-gray-400 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <span className="absolute bottom-2 left-4 w-0 h-0.5 bg-linear-to-r from-gray-900 to-transparent transform transition-all duration-500 ease-out group-hover:w-12 rounded-full"></span>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-4 space-y-3 border-t border-gray-100">
                {isPending ? (
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ) : session ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-light text-gray-600">
                            {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl text-sm font-light transition-all duration-300 ease-out relative group transform hover:translate-x-1"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl text-sm font-light transition-all duration-300 ease-out relative group transform hover:translate-x-1"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/signin"
                      className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl text-sm font-light transition-all duration-300 ease-out relative group transform hover:translate-x-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span>Sign In</span>
                        <svg
                          className="w-4 h-4 text-gray-400 transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      <span className="absolute bottom-2 left-4 w-0 h-0.5 bg-linear-to-r from-gray-900 to-transparent transform transition-all duration-500 ease-out group-hover:w-12 rounded-full"></span>
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-sm font-light transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-gray-900/25"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span>Sign Up</span>
                        <svg
                          className="w-4 h-4 transform transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
