'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import vendleLogo from "../assets/vendle_logo.jpeg";
import vendleAltLogo from "../assets/Vendle-logo-alt.png";
import { Home, Search, User, LayoutDashboard, LogOut, LogIn, DollarSign, FileText, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavbarProps {
  onProtectedAction?: () => void;
}

const Navbar = ({ onProtectedAction }: NavbarProps = {}) => {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isContractor = user?.user_metadata?.userType === 'contractor';
  const isHomeowner = user?.user_metadata?.userType === 'homeowner' || (!isContractor && isLoggedIn);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!isLoggedIn && onProtectedAction) {
      e.preventDefault();
      onProtectedAction();
    }
  };

  const handleLogout = async () => {
    const { error } = await logout();

    if (!error) {
      router.push("/reviews");
    }
  };

  const handleSignIn = () => {
    setShowLoginModal(true);
  };

  const isStartClaimActive = pathname === '/start-claim';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .vendle-logo-wrapper {
          background: transparent !important;
        }
        .vendle-logo-wrapper img {
          background: transparent !important;
        }
        .vendle-logo-outline {
          filter: grayscale(100%) brightness(0) invert(1);
          opacity: 0.7;
          transition: filter 0.2s ease, opacity 0.2s ease;
        }
        .group:hover .vendle-logo-outline,
        .group:active .vendle-logo-outline {
          filter: none !important;
          opacity: 1 !important;
        }
        /* Ensure the image container doesn't have background */
        .vendle-logo-wrapper::before {
          content: '';
          display: none;
        }
        /* Vendle It button logo hover expand effect */
        .vendle-it-logo {
          transition: transform 0.2s ease;
        }
        .group:hover .vendle-it-logo {
          transform: scale(1.2);
        }
      `}} />

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 border border-gray-200"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Slide-out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col py-6 z-50 lg:hidden shadow-2xl"
          >
            {/* Mobile Logo */}
            <div className="px-6 mb-8">
              <Link href={isContractor ? "/explore" : "/home"} className="inline-block">
                <Image src={vendleLogo} alt="Vendle Logo" width={56} height={56} className="h-14 w-14 rounded-lg" />
              </Link>
            </div>

            {/* Mobile Navigation Items */}
            <div className="flex-1 flex flex-col px-4 space-y-2">
              {/* Explore - Only show for contractors */}
              {isContractor && (
                <Link
                  href="/explore"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === '/explore' ? 'bg-vendle-blue/10 text-vendle-blue' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Search className={`w-5 h-5 ${pathname === '/explore' ? 'text-vendle-blue' : 'text-gray-600'}`} strokeWidth={2} />
                  <span className="text-sm font-medium">Explore</span>
                </Link>
              )}

              {/* Vendle It - Only show for homeowners */}
              {isHomeowner && (
                <Link
                  href="/start-claim"
                  onClick={(e) => handleProtectedClick(e, '/start-claim')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === '/start-claim' ? 'bg-vendle-blue/10 text-vendle-blue' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="w-5 h-5 relative">
                    <Image
                      src={vendleAltLogo}
                      alt="Vendle Logo"
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                      style={{ backgroundColor: 'transparent' }}
                    />
                  </div>
                  <span className="text-sm font-medium">Vendle It</span>
                </Link>
              )}

              {/* Home */}
              <Link
                href="/home"
                onClick={(e) => handleProtectedClick(e, '/home')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === '/home' ? 'bg-vendle-blue/10 text-vendle-blue' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${pathname === '/home' ? 'text-vendle-blue' : 'text-gray-600'}`} strokeWidth={2} />
                <span className="text-sm font-medium">Home</span>
              </Link>

              {/* Profile */}
              <Link
                href="/profile"
                onClick={(e) => handleProtectedClick(e, '/profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === '/profile' ? 'bg-vendle-blue/10 text-vendle-blue' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <User className={`w-5 h-5 ${pathname === '/profile' ? 'text-vendle-blue' : 'text-gray-600'}`} strokeWidth={2} />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            </div>

            {/* Mobile Bottom Section */}
            <div className="px-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center gap-3 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 text-red-600" strokeWidth={2} />
                  <span className="text-sm font-medium text-red-600">Logout</span>
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full px-4 py-3 flex items-center gap-3 rounded-lg bg-vendle-teal text-white hover:bg-vendle-teal/90 transition-all duration-200"
                >
                  <LogIn className="w-5 h-5 text-white" strokeWidth={2} />
                  <span className="text-sm font-medium text-white">Sign In</span>
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-32 bg-white border-r border-gray-200 flex-col items-center py-8 z-50">
      {/* Logo */}
      <Link href={isContractor ? "/explore" : "/home"} className="mb-12">
        <Image src={vendleLogo} alt="Vendle Logo" width={56} height={56} className="h-14 w-14 rounded-lg" />
      </Link>

      {/* Navigation Items - Centered vertically */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Explore - Only show for contractors */}
        {isContractor && (
          <Link
            href="/explore"
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
              pathname === '/explore' ? 'bg-vendle-blue/10 scale-105' : 'hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <Search className={`w-7 h-7 flex-shrink-0 block ${pathname === '/explore' ? 'text-vendle-blue' : 'text-gray-600'}`} strokeWidth={2} />
            <span className={`text-xs font-medium ${pathname === '/explore' ? 'text-vendle-blue' : 'text-gray-600'}`}>
              Explore
            </span>
          </Link>
        )}

        {/* Vendle It - Only show for homeowners */}
        {isHomeowner && (
          <Link
            href="/start-claim"
            onClick={(e) => handleProtectedClick(e, '/start-claim')}
            className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
              pathname === '/start-claim' ? 'bg-vendle-blue/10 scale-105' : 'hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src={vendleAltLogo}
                alt="Vendle Logo"
                width={56}
                height={56}
                className="w-14 h-14 rounded transition-all duration-200 object-contain vendle-it-logo"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
            <span className={`text-xs font-medium ${pathname === '/start-claim' ? 'text-vendle-blue' : 'text-gray-600'}`}>
              Vendle It
            </span>
          </Link>
        )}

        {/* Home */}
        <Link
          href="/home"
          onClick={(e) => handleProtectedClick(e, '/home')}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
            pathname === '/home' ? 'bg-vendle-blue/10 scale-105' : 'hover:bg-gray-50 hover:scale-105'
          }`}
        >
          <LayoutDashboard className={`w-7 h-7 flex-shrink-0 block ${pathname === '/home' ? 'text-vendle-blue' : 'text-gray-600'}`} strokeWidth={2} />
          <span className={`text-xs font-medium ${pathname === '/home' ? 'text-vendle-blue' : 'text-gray-600'}`}>
            Home
          </span>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          onClick={(e) => handleProtectedClick(e, '/profile')}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
            pathname === '/profile' ? 'bg-vendle-blue/10 scale-105' : 'hover:bg-gray-50 hover:scale-105'
          }`}
        >
          <User className={`w-7 h-7 flex-shrink-0 block ${pathname === '/profile' ? 'text-vendle-blue' : 'text-gray-600'}`} strokeWidth={2} />
          <span className={`text-xs font-medium ${pathname === '/profile' ? 'text-vendle-blue' : 'text-gray-600'}`}>
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
            className="w-full p-3 flex flex-col items-center gap-1 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-200 hover:scale-105 group"
          >
            <LogOut className="w-5 h-5 text-red-600 group-hover:text-red-700 block" strokeWidth={2} />
            <span className="text-xs font-medium text-red-600 group-hover:text-red-700">Logout</span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full p-3 flex flex-col items-center gap-1 rounded-xl bg-vendle-teal text-white hover:bg-vendle-teal/90 transition-all duration-200 hover:scale-105 group"
          >
            <LogIn className="w-5 h-5 text-white group-hover:text-white/90 block" strokeWidth={2} />
            <span className="text-xs font-medium text-white group-hover:text-white/90">Sign In</span>
          </button>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </nav>
    </>
  );
};

export default Navbar;
