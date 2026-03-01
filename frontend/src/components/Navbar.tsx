'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import vendleLogo from "../assets/vendle_logo.jpeg";
import { Search, User, LayoutDashboard, LogOut, LogIn, Menu, X, MessageSquare, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUnreadCount } from "@/hooks/useMessaging";
import MessagingDrawer from "@/components/MessagingDrawer";
import ContractorMailbox from "@/components/ContractorMailbox";

interface NavbarProps {
  onProtectedAction?: () => void;
}

const Navbar = ({ onProtectedAction }: NavbarProps = {}) => {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMessagesDrawer, setShowMessagesDrawer] = useState(false);
  const [showMailbox, setShowMailbox] = useState(false);
  const router = useRouter();
  const { data: unreadCount = 0 } = useUnreadCount();

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

  const isActive = (path: string) => pathname === path;

  const navLinkClasses = (path: string) =>
    `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
      isActive(path)
        ? 'text-gray-900 bg-gray-100'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href={isContractor ? "/explore" : "/home"} className="flex items-center gap-2">
            <Image src={vendleLogo} alt="Vendle" width={32} height={32} className="h-8 w-8 rounded" />
            <span className="font-semibold text-gray-900">Vendle</span>
          </Link>

          {/* Center: Navigation */}
          <div className="flex items-center gap-1">
            {isContractor && (
              <Link href="/explore" className={navLinkClasses('/explore')}>
                <span className="flex items-center gap-1.5">
                  <Search className="h-4 w-4" />
                  Explore
                </span>
              </Link>
            )}
            {isHomeowner && (
              <Link
                href="/start-claim"
                onClick={(e) => handleProtectedClick(e, '/start-claim')}
                className={navLinkClasses('/start-claim')}
              >
                Start Claim
              </Link>
            )}
            <Link
              href="/home"
              onClick={(e) => handleProtectedClick(e, '/home')}
              className={navLinkClasses('/home')}
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                Home
              </span>
            </Link>
            <Link
              href="/profile"
              onClick={(e) => handleProtectedClick(e, '/profile')}
              className={navLinkClasses('/profile')}
            >
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Profile
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <>
                {/* Messages/Mailbox Button */}
                <button
                  onClick={() => isContractor ? setShowMailbox(true) : setShowMessagesDrawer(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md relative"
                >
                  {isContractor ? (
                    <Mail className="h-5 w-5" />
                  ) : (
                    <MessageSquare className="h-5 w-5" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-vendle-blue text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Type Badge */}
                <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded">
                  {isContractor ? 'Contractor' : 'Homeowner'}
                </span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && !loading && (
              <button
                onClick={handleSignIn}
                className="px-3 py-1.5 text-sm font-medium bg-vendle-blue text-white hover:bg-vendle-blue/90 rounded-md flex items-center gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-3 left-3 z-[60] lg:hidden w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
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
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
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
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col py-4 z-50 lg:hidden"
          >
            {/* Mobile Logo */}
            <div className="px-4 mb-6 flex items-center gap-2">
              <Link href={isContractor ? "/explore" : "/home"} className="flex items-center gap-2">
                <Image src={vendleLogo} alt="Vendle" width={32} height={32} className="h-8 w-8 rounded" />
                <span className="font-semibold text-gray-900">Vendle</span>
              </Link>
            </div>

            {/* Mobile Navigation Items */}
            <div className="flex-1 flex flex-col px-3 space-y-1">
              {isContractor && (
                <Link
                  href="/explore"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/explore') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Explore
                </Link>
              )}

              {isHomeowner && (
                <Link
                  href="/start-claim"
                  onClick={(e) => handleProtectedClick(e, '/start-claim')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/start-claim') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Start Claim
                </Link>
              )}

              <Link
                href="/home"
                onClick={(e) => handleProtectedClick(e, '/home')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/home') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Home
              </Link>

              <Link
                href="/profile"
                onClick={(e) => handleProtectedClick(e, '/profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>

              {/* Messages/Mailbox for mobile */}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    isContractor ? setShowMailbox(true) : setShowMessagesDrawer(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  {isContractor ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  {isContractor ? 'Mailbox' : 'Messages'}
                  {unreadCount > 0 && (
                    <span className="ml-auto h-5 w-5 bg-vendle-blue text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Bottom Section */}
            <div className="px-3 pt-3 border-t border-gray-100">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 flex items-center gap-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full px-3 py-2 flex items-center gap-2 rounded-md text-sm font-medium bg-vendle-blue text-white hover:bg-vendle-blue/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Messages Drawer (Homeowner) */}
      <MessagingDrawer
        isOpen={showMessagesDrawer}
        onClose={() => setShowMessagesDrawer(false)}
      />

      {/* Contractor Mailbox */}
      <ContractorMailbox
        isOpen={showMailbox}
        onClose={() => setShowMailbox(false)}
      />
    </>
  );
};

export default Navbar;
