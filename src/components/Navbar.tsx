"use client";

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Menu, X, User, LogOut, Home, Info, Briefcase, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  
  const isHomepage = location.pathname === '/';
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleStartClaimClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast({
        title: "Authentication Required",
        description: "Please log in to start a claim",
        variant: "destructive"
      });
      navigate('/auth?mode=login');
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const getProjectsPath = () => {
    if (!user) return "/my-projects";
    return user.user_type === 'contractor' ? "/contractor-projects" : "/my-projects";
  };
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 lg:px-8',
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-lg shadow-subtle' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="relative z-50 flex items-center gap-2 transition-all"
        >
          <span className="text-3xl font-bold text-vendle-navy/80">Vendle</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/" 
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            About Us
          </Link>
          <Link 
            to="/how-it-works" 
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            How It Works
          </Link>
          {user?.user_type === 'contractor' ? (
            <>
              <Link 
                to="/reverse-auction" 
                className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
              >
                Auctions
              </Link>
              <Link 
                to={getProjectsPath()}
                className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
              >
                My Projects
              </Link>
            </>
          ) : (
            <>
              {!user && (
                <Link 
                  to="/contractors" 
                  className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
                >
                  Contractors
                </Link>
              )}
              {user && (
                <Link 
                  to={getProjectsPath()}
                  className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
                >
                  My Projects
                </Link>
              )}
              <Link 
                to="/start-claim" 
                onClick={handleStartClaimClick}
                className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
              >
                Start Claim
              </Link>
            </>
          )}
        </nav>
        
        {/* CTA Buttons and Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/auth?mode=login">
                <Button variant="outline" size="md">
                  Log In
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="primary" size="md">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-vendle-blue flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium text-vendle-navy/70">
                  {user?.email}
                </div>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden relative z-50 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-vendle-blue/20"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen 
            ? <X className="h-6 w-6 text-vendle-navy" /> 
            : <Menu className="h-6 w-6 text-vendle-navy" />
          }
        </button>
        
        {/* Mobile Menu */}
        <div 
          className={cn(
            'fixed inset-0 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="h-full flex flex-col items-center justify-center space-y-8 p-8">
            <Link 
              to="/" 
              className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            {user?.user_type === 'contractor' ? (
              <>
                <Link 
                  to="/reverse-auction" 
                  className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Auctions
                </Link>
                <Link 
                  to={getProjectsPath()}
                  className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Projects
                </Link>
              </>
            ) : (
              <>
                {!user && (
                  <Link 
                    to="/contractors" 
                    className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contractors
                  </Link>
                )}
                {user && (
                  <Link 
                    to={getProjectsPath()}
                    className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Projects
                  </Link>
                )}
                <Link 
                  to="/start-claim" 
                  onClick={(e) => {
                    handleStartClaimClick(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                >
                  Start Claim
                </Link>
              </>
            )}
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                >
                  Log Out
                </button>
              </>
            )}
            {!user && (
              <Link 
                to="/auth" 
                className="text-xl font-medium text-vendle-navy hover:text-vendle-blue transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
