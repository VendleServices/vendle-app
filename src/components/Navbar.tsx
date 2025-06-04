import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import LogOutButton from "@/components/LogOutButton";
import { getUser } from "@/auth/server";

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 lg:px-8 py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/"
          className="relative z-50 flex items-center gap-2 transition-all"
        >
          <span className="text-3xl font-bold text-vendle-navy/80">Vendle</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            href="/"
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            Home
          </Link>
          <Link 
            href="/about"
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            About Us
          </Link>
          <Link 
            href="/how-it-works"
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            How It Works
          </Link>
          {user?.user_type === 'contractor' ? (
            <>
              <Link 
                href="/reverse-auction"
                className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
              >
                Auctions
              </Link>
              <Link 
                href={getProjectsPath()}
                className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
              >
                My Projects
              </Link>
              {user?.user_type === "contractor" && (
                <Link 
                  href="/reviews"
                  className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
                >
                  My Reviews
                </Link>
              )}
            </>
          ) : (
            <>
        {!user && (
          <Link
            href="/contractors"
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            Contractors
          </Link>
        )}
          {user && (
            <Link
              href={getProjectsPath()}
              className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
            >
              My Projects
            </Link>
          )}
          <Link
            href="/start-claim"
            // onClick={handleStartClaimClick}
            className="px-4 py-2 text-vendle-navy/90 hover:text-vendle-blue transition-colors font-medium rounded-md hover:bg-vendle-blue/5"
          >
            Start Claim
          </Link>
            </>
          )}
        </nav>
        
        {/* CTA Buttons and Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button>
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
