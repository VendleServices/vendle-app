'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import LogOutButton from "@/components/LogOutButton";
import { useAuth } from "@/contexts/AuthContext";
import vendleLogo from "../assets/vendle_logo.jpeg";

const Navbar = () => {
  const { user, isLoggedIn, isLoading } = useAuth();
  
  // Show login buttons if user is not logged in or still loading
  const showLoginButtons = !isLoggedIn || isLoading;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="flex items-center justify-between w-full max-w-6xl h-16 px-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <Link href={isLoggedIn ? "/home" : "/"} className="flex items-center space-x-2">
          <Image src={vendleLogo} alt="Vendle Logo" width={28} height={28} className="h-7 w-7" />
          <span className="text-lg font-semibold text-black">Vendle</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn && (
            <Link href="/home" className="text-gray-700 hover:text-black transition-colors">Home</Link>
          )}
          {isLoggedIn && (
            <Link href="/dashboard" className="text-gray-700 hover:text-black transition-colors">Dashboard</Link>
          )}
          {user?.user_type === "contractor" ? (
            <Link href="/reviews" className="text-gray-700 hover:text-black transition-colors">My Reviews</Link>
          ) : null}
          {user?.user_type === "homeowner" ? (
              <Link href="/start-claim" className="text-gray-700 hover:text-black transition-colors">Start Claim</Link>
          ) : null}
        </div>

        <div className="flex items-center space-x-4">
          {showLoginButtons ? (
            // ALWAYS show login buttons unless we're definitely logged in
            <>
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
