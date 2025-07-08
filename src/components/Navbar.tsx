'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import LogOutButton from "@/components/LogOutButton";

const Navbar = () => {
  let user = null;
  let isLoggedIn = false;
  let isLoading = false;
  let showLoginButtons = true; // Default to showing login buttons

  try {
    // Try to import and use the auth context
    const { useAuth } = require("@/contexts/AuthContext");
    const auth = useAuth();
    user = auth.user;
    isLoggedIn = auth.isLoggedIn;
    isLoading = auth.isLoading;
    
    // Only hide login buttons if we're definitely logged in
    if (isLoggedIn && user) {
      showLoginButtons = false;
    }
    
    console.log('Auth working - user:', user, 'isLoggedIn:', isLoggedIn, 'isLoading:', isLoading);
  } catch (error) {
    console.error('Auth not working, showing login buttons:', error);
    showLoginButtons = true;
  }

  const getProjectsPath = () => {
    if (!user) return "/my-projects";
    return user?.user_type === 'contractor' ? "/contractor-projects" : "/my-projects";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="flex items-center justify-between w-full max-w-6xl h-16 px-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/vendle_logo.jpg" alt="Vendle Logo" width={28} height={28} className="h-7 w-7" />
          <span className="text-lg font-semibold text-black">Vendle</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-black transition-colors">Home</Link>
          <Link href="/about" className="text-gray-700 hover:text-black transition-colors">About Us</Link>
          <Link href="/how-it-works" className="text-gray-700 hover:text-black transition-colors">How It Works</Link>
          <Link href="/reverse-auction" className="text-gray-700 hover:text-black transition-colors">Auctions</Link>
          <Link href={getProjectsPath()} className="text-gray-700 hover:text-black transition-colors">My Projects</Link>
          {user?.user_type === "contractor" && (
            <Link href="/reviews" className="text-gray-700 hover:text-black transition-colors">My Reviews</Link>
          )}
          {!user && (
            <Link href="/contractors" className="text-gray-700 hover:text-black transition-colors">Contractors</Link>
          )}
          <Link href="/start-claim" className="text-gray-700 hover:text-black transition-colors">Start Claim</Link>
        </div>

        <div className="flex items-center space-x-4">
          {showLoginButtons ? (
            // ALWAYS show login buttons unless we're definitely logged in
            <>
              <Link href="/login">
                <Button variant="outline" className="text-gray-600 hover:text-gray-900 border-gray-200">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#1a365d] hover:bg-[#112240] text-white">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            // Only show logout when definitely logged in
            <LogOutButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
