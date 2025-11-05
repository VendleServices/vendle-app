'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import LogOutButton from "@/components/LogOutButton";
import { useAuth } from "@/contexts/AuthContext";
import vendleLogo from "../assets/vendle_logo.jpeg";
import { Home, Search, Users, DollarSign, User, Bell, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const pathname = usePathname();

  // Show login buttons if user is not logged in or still loading
  const showLoginButtons = !isLoggedIn || isLoading;

  // If not logged in, show the old top navbar
  if (showLoginButtons) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <div className="flex items-center justify-between w-full max-w-6xl h-16 px-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={vendleLogo} alt="Vendle Logo" width={28} height={28} className="h-7 w-7" />
            <span className="text-lg font-semibold text-black">Vendle</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="text-gray-600 hover:text-gray-900 border-gray-200">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#1a365d] hover:bg-[#112240] text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Left sidebar for logged-in users
  return (
    <nav className="fixed left-0 top-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <Link href="/home" className="mb-8">
        <Image src={vendleLogo} alt="Vendle Logo" width={48} height={48} className="h-12 w-12 rounded-lg" />
      </Link>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col items-center space-y-6">
        {/* Explore */}
        <Link
          href="/explore"
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
            pathname === '/explore' ? 'bg-indigo-50' : 'hover:bg-gray-50'
          }`}
        >
          <Search className={`w-6 h-6 ${pathname === '/explore' ? 'text-indigo-600' : 'text-gray-600'}`} />
          <span className={`text-xs ${pathname === '/explore' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
            Explore
          </span>
        </Link>

        {/* Home */}
        <Link
          href="/home"
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
            pathname === '/home' ? 'bg-indigo-50' : 'hover:bg-gray-50'
          }`}
        >
          <Home className={`w-6 h-6 ${pathname === '/home' ? 'text-indigo-600' : 'text-gray-600'}`} />
          <span className={`text-xs ${pathname === '/home' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
            Home
          </span>
        </Link>

        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
            pathname === '/dashboard' ? 'bg-indigo-50' : 'hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className={`w-6 h-6 ${pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-600'}`} />
          <span className={`text-xs ${pathname === '/dashboard' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
            Dashboard
          </span>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
            pathname === '/profile' ? 'bg-indigo-50' : 'hover:bg-gray-50'
          }`}
        >
          <User className={`w-6 h-6 ${pathname === '/profile' ? 'text-indigo-600' : 'text-gray-600'}`} />
          <span className={`text-xs ${pathname === '/profile' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
            Profile
          </span>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar / Logout */}
        <div className="pt-4 border-t border-gray-200">
          <LogOutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
