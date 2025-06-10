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

  // const isHomepage = location.pathname === '/';

  // const handleStartClaimClick = (e: React.MouseEvent) => {
  //   if (!user) {
  //     e.preventDefault();
  //   }
  // };

  // const handleLogout = () => {
  //
  // };
  
  const getProjectsPath = () => {
    if (!user) return "/my-projects";
    return user?.user_type === 'contractor' ? "/contractor-projects" : "/my-projects";
  };
  
  return (
    <header 
      className={cn(
        `${inter.className} fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-3 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100`,
        // show ? 'translate-y-0' : '-translate-y-full'
      )}
      style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/"
          className="relative z-50 flex items-center gap-2 transition-all"
        >
          <Image
            src="/vendle_logo.jpg"
            alt="Vendle Logo"
            width={40}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            href="/"
            className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
          >
            Home
          </Link>
          <Link 
            href="/about"
            className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
          >
            About Us
          </Link>
          <Link 
            href="/how-it-works"
            className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
          >
            How It Works
          </Link>
          <Link
            href="/reverse-auction"
            className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
          >
            Auctions
          </Link>
          <Link
            href={getProjectsPath()}
            className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
          >
            My Projects
          </Link>
          {user?.user_type === "contractor" && (
            <Link
              href="/reviews"
              className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
            >
              My Reviews
            </Link>
          )}
          {!user && (
            <Link
              href="/contractors"
              className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
            >
              Contractors
            </Link>
          )}
          <Link
            href="/start-claim"
            className="px-4 py-2 text-gray-900 hover:text-purple-700 transition-colors font-medium rounded-md hover:bg-purple-50"
          >
            Start Claim
          </Link>
        </nav>
        
        {/* CTA Buttons and Profile */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline" className="rounded-lg font-medium px-5 py-2 text-sm border-gray-200">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold px-5 py-2 text-sm transition-colors duration-200">
                  Get Started
                </Button>
              </Link>
            </>
          ) : <LogOutButton />}
        </div>
        
        {/* Mobile Menu Button */}
        {/*<button */}
        {/*  className="md:hidden relative z-50 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-vendle-blue/20"*/}
        {/*  onClick={toggleMobileMenu}*/}
        {/*  aria-label="Toggle menu"*/}
        {/*>*/}
        {/*  {isMobileMenuOpen */}
        {/*    ? <X className="h-6 w-6 text-vendle-navy" /> */}
        {/*    : <Menu className="h-6 w-6 text-vendle-navy" />*/}
        {/*  }*/}
        {/*</button>*/}
        
        {/*/!* Mobile Menu *!/*/}
        {/*<div */}
        {/*  className={cn(*/}
        {/*    'fixed inset-0 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out',*/}
        {/*    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'*/}
        {/*  )}*/}
        {/*>*/}
        {/*  <div className="h-full flex flex-col items-center justify-center space-y-8 p-8">*/}
        {/*    <Link */}
        {/*      to="/" */}
        {/*      className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*      onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*    >*/}
        {/*      Home*/}
        {/*    </Link>*/}
        {/*    <Link */}
        {/*      to="/about" */}
        {/*      className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*      onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*    >*/}
        {/*      About Us*/}
        {/*    </Link>*/}
        {/*    <Link */}
        {/*      to="/how-it-works" */}
        {/*      className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*      onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*    >*/}
        {/*      How It Works*/}
        {/*    </Link>*/}
        {/*    {user?.user_type === 'contractor' ? (*/}
        {/*      <>*/}
        {/*        <Link */}
        {/*          to="/reverse-auction" */}
        {/*          className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*          onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*        >*/}
        {/*          Auctions*/}
        {/*        </Link>*/}
        {/*        <Link */}
        {/*          to={getProjectsPath()}*/}
        {/*          className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*          onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*        >*/}
        {/*          My Projects*/}
        {/*        </Link>*/}
        {/*        {user?.user_type === "contractor" && (*/}
        {/*          <Link */}
        {/*            to="/reviews"*/}
        {/*            className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*            onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*          >*/}
        {/*            My Reviews*/}
        {/*          </Link>*/}
        {/*        )}*/}
        {/*      </>*/}
        {/*    ) : (*/}
        {/*      <>*/}
        {/*        {!user && (*/}
        {/*    <Link */}
        {/*      to="/contractors" */}
        {/*      className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*      onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*    >*/}
        {/*      Contractors*/}
        {/*    </Link>*/}
        {/*        )}*/}
        {/*    {user && (*/}
        {/*          <Link */}
        {/*            to={getProjectsPath()}*/}
        {/*            className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*            onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*          >*/}
        {/*            My Projects*/}
        {/*          </Link>*/}
        {/*        )}*/}
        {/*        <Link */}
        {/*          to="/start-claim" */}
        {/*          onClick={(e) => {*/}
        {/*            handleStartClaimClick(e);*/}
        {/*            setIsMobileMenuOpen(false);*/}
        {/*          }}*/}
        {/*          className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*        >*/}
        {/*          Start Claim*/}
        {/*        </Link>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*    {user && (*/}
        {/*      <>*/}
        {/*        <Link */}
        {/*          to="/dashboard" */}
        {/*          className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*          onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*        >*/}
        {/*          Dashboard*/}
        {/*        </Link>*/}
        {/*        <button */}
        {/*          onClick={() => {*/}
        {/*            handleLogout();*/}
        {/*            setIsMobileMenuOpen(false);*/}
        {/*          }}*/}
        {/*          className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*        >*/}
        {/*          Log Out*/}
        {/*        </button>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*    {!user && (*/}
        {/*      <Link */}
        {/*        to="/auth" */}
        {/*        className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"*/}
        {/*        onClick={() => setIsMobileMenuOpen(false)}*/}
        {/*      >*/}
        {/*        Get Started*/}
        {/*      </Link>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </header>
  );
};

export default Navbar;
