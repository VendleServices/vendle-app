import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import LogOutButton from "@/components/LogOutButton";
import { getUser } from "@/auth/server";
import { Inter } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const Navbar = async () => {
  const user = await getUser();

  const getProjectsPath = () => {
    if (!user) return "/my-projects";
    return user?.user_type === 'contractor' ? "/contractor-projects" : "/my-projects";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/vendle_logo.jpg"
              alt="Vendle Logo"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About Us
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="/reverse-auction" className="text-gray-600 hover:text-gray-900 transition-colors">
              Auctions
            </Link>
            <Link href={getProjectsPath()} className="text-gray-600 hover:text-gray-900 transition-colors">
              My Projects
            </Link>
            {user?.user_type === "contractor" && (
              <Link href="/reviews" className="text-gray-600 hover:text-gray-900 transition-colors">
                My Reviews
              </Link>
            )}
            {!user && (
              <Link href="/contractors" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contractors
              </Link>
            )}
            <Link href="/start-claim" className="text-gray-600 hover:text-gray-900 transition-colors">
              Start Claim
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="text-gray-600 hover:text-gray-900 border-gray-200">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-purple-700 hover:bg-purple-800 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <LogOutButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
