'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import vendleLogo from "../assets/vendle_logo.jpeg";
import { Home, Search, User, LayoutDashboard, LogOut, LogIn, DollarSign } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onProtectedAction?: () => void;
}

const Navbar = ({ onProtectedAction }: NavbarProps = {}) => {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!isLoggedIn && onProtectedAction) {
      e.preventDefault();
      onProtectedAction();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSignIn = () => {
    setShowLoginModal(true);
  };

  // Always show left sidebar
  return (
    <nav className="fixed left-0 top-0 h-screen w-32 bg-white border-r border-gray-200 flex flex-col items-center py-8 z-50">
      {/* Logo */}
      <Link href="/explore" className="mb-12">
        <Image src={vendleLogo} alt="Vendle Logo" width={56} height={56} className="h-14 w-14 rounded-lg" />
      </Link>

      {/* Navigation Items - Centered vertically */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Explore */}
        <Link
          href="/explore"
          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
            pathname === '/explore' ? 'bg-indigo-50 scale-105' : 'hover:bg-gray-50 hover:scale-105'
          }`}
        >
          <Search className={`w-7 h-7 flex-shrink-0 block ${pathname === '/explore' ? 'text-indigo-600' : 'text-gray-600'}`} strokeWidth={2} />
          <span className={`text-xs font-medium ${pathname === '/explore' ? 'text-indigo-600' : 'text-gray-600'}`}>
            Explore
          </span>
        </Link>

        {/* Home */}
        <Link
          href="/home"
          onClick={(e) => handleProtectedClick(e, '/home')}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
            pathname === '/home' ? 'bg-indigo-50 scale-105' : 'hover:bg-gray-50 hover:scale-105'
          }`}
        >
          <Home className={`w-7 h-7 flex-shrink-0 block ${pathname === '/home' ? 'text-indigo-600' : 'text-gray-600'}`} strokeWidth={2} />
          <span className={`text-xs font-medium ${pathname === '/home' ? 'text-indigo-600' : 'text-gray-600'}`}>
            Home
          </span>
        </Link>

        {/* Dashboard */}
        <Link
          href="/dashboard"
          onClick={(e) => handleProtectedClick(e, '/dashboard')}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
            pathname === '/dashboard' ? 'bg-indigo-50 scale-105' : 'hover:bg-gray-50 hover:scale-105'
          }`}
        >
          <LayoutDashboard className={`w-7 h-7 flex-shrink-0 block ${pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-600'}`} strokeWidth={2} />
          <span className={`text-xs font-medium ${pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-600'}`}>
            Dashboard
          </span>
        </Link>

        {/* Earnings - Only for contractors when logged in */}
        {isLoggedIn && user?.user_metadata?.userType === 'contractor' && (
          <Link
            href="/earnings"
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
              pathname === '/earnings' ? 'bg-indigo-50 scale-105' : 'hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <DollarSign className={`w-7 h-7 flex-shrink-0 block ${pathname === '/earnings' ? 'text-indigo-600' : 'text-gray-600'}`} strokeWidth={2} />
            <span className={`text-xs font-medium ${pathname === '/earnings' ? 'text-indigo-600' : 'text-gray-600'}`}>
              Earnings
            </span>
          </Link>
        )}

        {/* Profile */}
        <Link
          href="/profile"
          onClick={(e) => handleProtectedClick(e, '/profile')}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
            pathname === '/profile' ? 'bg-indigo-50 scale-105' : 'hover:bg-gray-50 hover:scale-105'
          }`}
        >
          <User className={`w-7 h-7 flex-shrink-0 block ${pathname === '/profile' ? 'text-indigo-600' : 'text-gray-600'}`} strokeWidth={2} />
          <span className={`text-xs font-medium ${pathname === '/profile' ? 'text-indigo-600' : 'text-gray-600'}`}>
            Profile
          </span>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-4 w-full px-3">
        {/* Sign In / Logout Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full p-3 flex flex-col items-center gap-1 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all hover:scale-105 group"
          >
            <LogOut className="w-5 h-5 text-red-600 group-hover:text-red-700 block" strokeWidth={2} />
            <span className="text-xs font-medium text-red-600 group-hover:text-red-700">Logout</span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full p-3 flex flex-col items-center gap-1 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all hover:scale-105 group"
          >
            <LogIn className="w-5 h-5 text-green-600 group-hover:text-green-700 block" strokeWidth={2} />
            <span className="text-xs font-medium text-green-600 group-hover:text-green-700">Sign In</span>
          </button>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </nav>
  );
};

export default Navbar;
