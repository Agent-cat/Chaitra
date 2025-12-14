"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { navLinks } from "@/constants/navconstants";
import { User, LogOut, Heart, Settings } from "lucide-react";
import type { AuthSession } from "@/types/auth";

const Navbar = () => {
  const pathname = usePathname();
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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="shrink-0 z-50 relative">
            <Link
              href="/"
              className="text-2xl font-playfair-display text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chaitra
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm transition-all duration-300 ease-out relative group rounded-lg ${isActive
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                    }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-1 left-1/2 h-0.5 bg-linear-to-r from-transparent via-gray-900 to-transparent transform -translate-x-1/2 transition-all duration-500 ease-out rounded-full ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            {isPending ? (
              <div className="hidden md:block w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
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
                    className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
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

          {/* Mobile menu button */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
            >
              <svg
                className="w-6 h-6 transition-transform duration-300"
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
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 md:hidden transition-all duration-500 ease-in-out transform ${isMobileMenuOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col h-full pt-28 pb-10 px-6">
          <div className="flex-1 flex flex-col justify-center items-center space-y-8 overflow-y-auto">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-3xl font-playfair-display text-gray-900 hover:text-gray-600 transition-all duration-500 transform ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={`mt-auto w-full transition-all duration-700 ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            {isPending ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
              </div>
            ) : session ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-light text-gray-600">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-900">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {session.user.email}
                  </p>
                </div>

                <div className="flex space-x-4 pt-2">
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-red-500 flex items-center space-x-2 mt-4 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/signin"
                  className="w-full text-center py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
