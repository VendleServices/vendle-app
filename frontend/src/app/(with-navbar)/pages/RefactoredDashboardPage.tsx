"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useApiService } from "@/services/api";
import { 
  Users, 
  FileText, 
  Archive, 
  Plus, 
  Star,
  ChevronLeft,
  Menu,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActiveAuctionsPage } from "./ActiveAuctionsPage";
import { ClosedAuctionsPage } from "./ClosedAuctionsPage";
import { ClaimsPage } from "./ClaimsPage";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import SplashScreen from "@/components/SplashScreen";
import Image from "next/image";
import vendleLogo from "../../../assets/vendle_logo.jpeg";

interface Claim {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  projectType: string;
  designPlan: string;
  needsAdjuster: boolean;
  insuranceProvider?: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface Auction {
  auction_id: string;
  claim_id: string;
  status: string;
  starting_bid: number;
  current_bid: number;
  bid_count: number;
  end_date: string;
  property_address: string;
  project_type: string;
  design_plan: string;
  title: string;
  winning_bidder?: string;
  total_job_value?: number;
  overhead_and_profit?: number;
  cost_basis?: string;
  materials?: number;
  sales_taxes?: number;
  depreciation?: number;
  reconstruction_type?: string;
  needs_3rd_party_adjuster?: boolean;
  has_deductible_funds?: boolean;
  funding_source?: string;
  description?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  reviewer_role: string;
  date: string;
  project_type: string;
  project_address: string;
}

export default function RefactoredDashboardPage() {
  const apiService = useApiService();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [auctionLoading, setAuctionLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'auctions' | 'claims' | 'reviews' | 'closed-auctions'>('claims');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [closedAuctions, setClosedAuctions] = useState<Auction[]>([]);
  const [closedAuctionLoading, setClosedAuctionLoading] = useState(false);

  const fetchClaims = async () => {
    try {
      console.log('Fetching claims for user:', user?.id);
      const response: any = await apiService.get(`/api/claim`);
      console.log('Claims API response:', response);
      return response?.claims;
    } catch (error) {
      console.log('Error fetching claims:', error);
      throw error;
    }
  }

  const deleteClaim = async (claim: Claim) => {
    try {
      const response = await apiService.delete(`/api/claim/${claim.id}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAuctions = async () => {
    setAuctionLoading(true);
    try {
      const response:any = await apiService.get(`/api/auctions`);
      const data = response?.data;
      console.log('Fetched auctions:', data);
      
      const activeAuctions = data?.filter((auction: Auction) => {
        const endDate = new Date(auction.end_date);
        return auction.status === 'open' && endDate > new Date();
      });
      
      const closedAuctions = data?.filter((auction: Auction) => {
        const endDate = new Date(auction.end_date);
        return auction.status === 'closed' || endDate <= new Date();
      });
      
      setAuctions(activeAuctions);
      setClosedAuctions(closedAuctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast({
        title: "Error",
        description: "Failed to load auctions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setAuctionLoading(false);
      setClosedAuctionLoading(false);
    }
  }

  const { data: claims = [], isLoading, isError, error } = useQuery({
    queryKey: ["getClaims"],
    queryFn: fetchClaims,
    enabled: !!user?.id,
    retry: 1,
  });

  const deleteClaimMutation = useMutation({
    mutationFn: deleteClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getClaims"]
      });
    },
    onError: error => { console.log(error); }
  });

  // Hardcoded reviews data
  const reviews: Review[] = [
    {
      id: "1",
      rating: 5,
      comment: "Excellent work on the water damage restoration. The team was professional, thorough, and completed the job ahead of schedule. Would highly recommend!",
      reviewer_name: "Sarah Johnson",
      reviewer_role: "Homeowner",
      date: "2024-03-15",
      project_type: "Water Damage Restoration",
      project_address: "123 Oak Street, Portland, OR"
    },
    {
      id: "2",
      rating: 4,
      comment: "Good work on the fire damage cleanup. The team was responsive and professional. The only reason for 4 stars instead of 5 is that the timeline was slightly longer than initially estimated.",
      reviewer_name: "Michael Chen",
      reviewer_role: "Property Manager",
      date: "2024-03-10",
      project_type: "Fire Damage Restoration",
      project_address: "456 Pine Avenue, Seattle, WA"
    },
    {
      id: "3",
      rating: 5,
      comment: "Outstanding service! The team handled our mold remediation project with expertise and care. They were very thorough in explaining the process and kept us updated throughout.",
      reviewer_name: "Emily Rodriguez",
      reviewer_role: "Homeowner",
      date: "2024-03-05",
      project_type: "Mold Remediation",
      project_address: "789 Maple Drive, San Francisco, CA"
    },
    {
      id: "4",
      rating: 5,
      comment: "The team did an amazing job with our storm damage repairs. They were quick to respond, professional, and completed the work to the highest standard. Very impressed!",
      reviewer_name: "David Thompson",
      reviewer_role: "Business Owner",
      date: "2024-02-28",
      project_type: "Storm Damage Repair",
      project_address: "321 Cedar Lane, Denver, CO"
    }
  ];

  const handleDeleteClick = (claim: Claim) => {
    deleteClaimMutation.mutate(claim);
  };

  const handleClosedAuctionDelete = (auctionId: string) => {
    // Implementation for deleting closed auctions
    console.log('Delete auction:', auctionId);
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['auctions', 'claims', 'reviews', 'closed-auctions'].includes(tab)) {
      setActiveSection(tab as 'auctions' | 'claims' | 'reviews' | 'closed-auctions');
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoggedIn && !authLoading && (activeSection === 'auctions' || activeSection === 'closed-auctions')) {
      fetchAuctions();
    }
  }, [isLoggedIn, authLoading, activeSection]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, authLoading, router]);

  if (authLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex">
          {/* Sidebar */}
          <div className={`${sidebarExpanded ? 'w-64' : 'w-16'} bg-[#0f172a] min-h-screen transition-all duration-300 ease-in-out flex flex-col`}>
            <div className={`flex-1 ${sidebarExpanded ? 'p-4' : 'p-2'}`}>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  className={`${sidebarExpanded ? 'justify-start' : 'justify-center'} hover:bg-transparent hover:text-white transition-all duration-200 p-2 flex-shrink-0`}
                  onClick={() => router.push("/home")}
                >
                  <div className={`${sidebarExpanded ? 'w-auto' : 'w-8'} flex justify-center`}>
                    <Image
                      src={vendleLogo}
                      alt="Logo"
                      width={sidebarExpanded ? 120 : 32}
                      height={sidebarExpanded ? 40 : 32}
                      className={`${sidebarExpanded ? 'h-8 w-auto' : 'h-8 w-8 object-contain'}`}
                      priority
                    />
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#1e293b] hover:text-white flex-shrink-0"
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                >
                  {sidebarExpanded ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
              
              {/* Quick Stats */}
              {sidebarExpanded && (
                <div className="mb-4 p-3 bg-[#1e293b] rounded-lg">
                  <h3 className="text-white text-xs font-medium mb-2">Quick Stats</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-white text-xs">
                      <span>Active Claims</span>
                      <span>{claims?.filter((c: Claim) => c.id === 'in-progress')?.length}</span>
                    </div>
                    <div className="flex justify-between text-white text-xs">
                      <span>Active Auctions</span>
                      <span>{auctions?.length}</span>
                    </div>
                    <div className="flex justify-between text-white text-xs">
                      <span>Completed</span>
                      <span>{claims?.filter((c: Claim)=> c.id === 'completed')?.length}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1 mb-8">
                {/* Main Navigation */}
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                    activeSection === 'auctions' 
                        ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                        : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                  }`}
                  onClick={() => setActiveSection('auctions')}
                >
                  <Users className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                  {sidebarExpanded && "Active Auctions"}
                </Button>

                <Button
                  variant="ghost"
                  className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                    activeSection === 'closed-auctions' 
                        ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                        : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                  }`}
                  onClick={() => setActiveSection('closed-auctions')}
                >
                  <Archive className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                  {sidebarExpanded && "Closed Auctions"}
                </Button>

                {user?.user_type === "contractor" && (
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                      activeSection === 'reviews' 
                          ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                          : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                    }`}
                    onClick={() => setActiveSection('reviews')}
                  >
                    <Star className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                    {sidebarExpanded && "My Reviews"}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                    activeSection === 'claims' 
                        ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                        : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                  }`}
                  onClick={() => setActiveSection('claims')}
                >
                  <FileText className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                  {sidebarExpanded && "Claims"}
                </Button>
              </div>
            </div>

            <div className="p-2 border-t border-[#1e293b] bg-[#0f172a]">
              <div className={`flex items-center ${sidebarExpanded ? 'space-x-2' : 'justify-center'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.picture || ""} />
                  <AvatarFallback>
                    {(user?.name?.charAt(0) || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {sidebarExpanded && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {user?.name || user?.email || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-[#1e293b] w-6 h-6"
                      onClick={async () => {
                        await logout();
                      }}
                    >
                      <LogOut className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-50 border-l border-gray-200">
            <div className="p-8">
              <div className="max-w-7xl mx-auto">
                {activeSection === 'auctions' && (
                  <ActiveAuctionsPage 
                    auctions={auctions}
                    isLoading={auctionLoading}
                  />
                )}
                
                {activeSection === 'closed-auctions' && (
                  <ClosedAuctionsPage 
                    auctions={closedAuctions}
                    isLoading={closedAuctionLoading}
                    onDeleteAuction={handleClosedAuctionDelete}
                  />
                )}
                
                {activeSection === 'claims' && (
                  <ClaimsPage 
                    claims={claims}
                    isLoading={isLoading}
                    onDeleteClaim={handleDeleteClick}
                  />
                )}
                
                {activeSection === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">My Reviews</h1>
                        <p className="mt-1 text-sm text-gray-600">View and manage your reviews</p>
                      </div>
                    </div>
                    
                    <Card className="shadow-sm border-gray-200 bg-white rounded-lg">
                      <CardContent className="p-6">
                        <div className="grid gap-4">
                          {reviews?.map((review) => (
                            <Card key={review.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white rounded-lg">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{review.project_type}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{review.project_address}</p>
                                  </div>
                                  <div className="flex items-center">
                                    {[...Array(5)]?.map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                          i < review.rating
                                              ? "text-yellow-400 fill-yellow-400"
                                              : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <p className="text-gray-700">{review.comment}</p>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Avatar className="w-8 h-8 mr-2">
                                      <AvatarFallback>
                                        {review.reviewer_name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                                      <p className="text-xs">{review.reviewer_role}</p>
                                    </div>
                                  </div>
                                  <p>{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

