"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApiService } from "@/services/api";
import { 
  Building2, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Briefcase,
  Handshake,
  MessageSquare,
  Send,
  Users,
  Archive,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  List,
  BarChart3,
  Wrench,
  Activity
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import { AuctionCard } from "@/components/AuctionCard";
import { ClaimCard } from "@/components/ClaimCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { toast } from "sonner";

interface Auction {
  auction_id: string;
  claim_id: string;
  status: string;
  starting_bid: number;
  current_bid: number;
  bid_count: number;
  end_date: string;
  property_address?: string;
  project_type: string;
  design_plan?: string;
  title: string;
  winning_bidder?: string;
}

interface HomeownerProject {
  id: string;
  claimId: string;
  title: string;
  address: string;
  city: string;
  state: string;
  projectType: string;
  contractValue: number;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  expectedCompletion: string;
  progress: number;
  contractorName: string;
  contractorCompany?: string;
  milestonesCompleted: number;
  totalMilestones: number;
}

interface Job {
  id: string;
  contractId: string;
  title: string;
  address: string;
  city: string;
  state: string;
  projectType: string;
  contractValue: number;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  expectedCompletion: string;
  progress: number;
  milestonesCompleted: number;
  totalMilestones: number;
  homeownerName: string;
}

export default function HomePage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const apiService = useApiService();

  // Contractor tab state
  const [contractorTab, setContractorTab] = useState<'auctions' | 'closed-auctions' | 'schedule' | 'my-jobs'>('my-jobs');
  const [scheduleTab, setScheduleTab] = useState<'upcoming' | 'deadlines' | 'visits' | 'milestones'>('upcoming');
  const [contractorAuctions, setContractorAuctions] = useState<Auction[]>([]);
  const [contractorAuctionLoading, setContractorAuctionLoading] = useState(false);
  const [contractorClosedAuctions, setContractorClosedAuctions] = useState<Auction[]>([]);
  const [contractorClosedAuctionLoading, setContractorClosedAuctionLoading] = useState(false);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Homeowner tab state
  const [homeownerTab, setHomeownerTab] = useState<'my-projects' | 'active-auctions' | 'closed-auctions' | 'claims'>('my-projects');
  const [homeownerProjects, setHomeownerProjects] = useState<HomeownerProject[]>([]);
  const [homeownerProjectsLoading, setHomeownerProjectsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, authLoading, router])

  const isContractor = user?.user_type === 'contractor'
  const isHomeowner = user?.user_type === 'homeowner' || !isContractor

  // Mock auction data (same as dashboard)
  const getMockAuctions = () => {
    return [
      {
        auction_id: "mock-auction-1",
        claim_id: "mock-claim-1",
        title: "Restoration Job - Water Damage",
        project_type: "water damage",
        starting_bid: 5000,
        current_bid: 8500,
        bid_count: 3,
        end_date: "2025-02-15",
        status: "open",
        property_address: "123 Oak Street, Austin, TX",
        design_plan: "Full restoration"
      },
      {
        auction_id: "mock-auction-2", 
        claim_id: "mock-claim-2",
        title: "Fire Damage Restoration",
        project_type: "fire damage",
        starting_bid: 8000,
        current_bid: 12500,
        bid_count: 0,
        end_date: "2025-02-20",
        status: "open",
        property_address: "456 Pine Avenue, Houston, TX",
        design_plan: "Partial restoration"
      },
      {
        auction_id: "mock-auction-3",
        claim_id: "mock-claim-3",
        title: "Storm Damage Repair",
        project_type: "storm damage",
        starting_bid: 4000,
        current_bid: 6200,
        bid_count: 2,
        end_date: "2025-02-10",
        status: "open",
        property_address: "789 Elm Drive, Dallas, TX",
        design_plan: "Roof repair"
      }
    ];
  }

  const getMockClosedAuctions = () => {
    return [
      {
        auction_id: "mock-closed-1",
        claim_id: "mock-claim-4",
        title: "Mold Remediation Project",
        project_type: "mold remediation",
        starting_bid: 3000,
        current_bid: 4800,
        bid_count: 1,
        end_date: "2025-01-15",
        status: "closed",
        property_address: "321 Maple Lane, San Antonio, TX",
        design_plan: "Basement cleanup"
      },
      {
        auction_id: "mock-closed-2",
        claim_id: "mock-claim-5",
        title: "Full Home Restoration",
        project_type: "full",
        starting_bid: 15000,
        current_bid: 25000,
        bid_count: 4,
        end_date: "2025-01-10",
        status: "closed",
        property_address: "654 Cedar Court, Fort Worth, TX",
        design_plan: "Complete renovation"
      }
    ];
  }

  const getMockHomeownerProjects = (): HomeownerProject[] => {
    return [
      {
        id: "project-1",
        claimId: "claim-1",
        title: "Water Restoration",
        address: "123 Oak Street",
        city: "Austin",
        state: "TX",
        projectType: "Water Damage",
        contractValue: 18500,
        status: "active",
        startDate: "2025-01-20",
        expectedCompletion: "2025-03-15",
        progress: 45,
        contractorName: "John Smith",
        contractorCompany: "Smith Restoration Co.",
        milestonesCompleted: 1,
        totalMilestones: 3
      },
      {
        id: "project-2",
        claimId: "claim-2",
        title: "Fire Damage Restoration",
        address: "456 Pine Avenue",
        city: "Houston",
        state: "TX",
        projectType: "Fire Damage",
        contractValue: 32000,
        status: "active",
        startDate: "2025-01-15",
        expectedCompletion: "2025-04-10",
        progress: 25,
        contractorName: "Maria Garcia",
        contractorCompany: "Garcia Builders",
        milestonesCompleted: 1,
        totalMilestones: 3
      },
      {
        id: "project-3",
        claimId: "claim-3",
        title: "Storm Damage Repair",
        address: "789 Elm Drive",
        city: "Dallas",
        state: "TX",
        projectType: "Storm Damage",
        contractValue: 12500,
        status: "pending",
        startDate: "2025-02-01",
        expectedCompletion: "2025-03-20",
        progress: 0,
        contractorName: "Robert Williams",
        contractorCompany: "Williams Contracting",
        milestonesCompleted: 0,
        totalMilestones: 3
      }
    ];
  }

  const getMockJobs = (): Job[] => {
    return [
      {
        id: "job-1",
        contractId: "contract-1",
        title: "Water Damage Restoration",
        address: "123 Oak Street",
        city: "Austin",
        state: "TX",
        projectType: "Water Damage",
        contractValue: 18500,
        status: "active",
        startDate: "2025-01-20",
        expectedCompletion: "2025-03-15",
        progress: 45,
        milestonesCompleted: 1,
        totalMilestones: 3,
        homeownerName: "John Smith"
      },
      {
        id: "job-2",
        contractId: "contract-2",
        title: "Fire Damage Restoration",
        address: "456 Pine Avenue",
        city: "Houston",
        state: "TX",
        projectType: "Fire Damage",
        contractValue: 32000,
        status: "active",
        startDate: "2025-01-15",
        expectedCompletion: "2025-04-10",
        progress: 25,
        milestonesCompleted: 1,
        totalMilestones: 3,
        homeownerName: "Maria Garcia"
      },
      {
        id: "job-3",
        contractId: "contract-3",
        title: "Storm Damage Repair",
        address: "789 Elm Drive",
        city: "Dallas",
        state: "TX",
        projectType: "Storm Damage",
        contractValue: 12500,
        status: "active",
        startDate: "2025-02-01",
        expectedCompletion: "2025-03-20",
        progress: 10,
        milestonesCompleted: 0,
        totalMilestones: 3,
        homeownerName: "Robert Williams"
      }
    ];
  }

  const fetchContractorAuctions = async () => {
    setContractorAuctionLoading(true);
    setContractorClosedAuctionLoading(true);
    try {
      // Use mock data (same as dashboard)
      const activeAuctions = getMockAuctions();
      const closedAuctionsData = getMockClosedAuctions();
      
      setContractorAuctions(activeAuctions);
      setContractorClosedAuctions(closedAuctionsData);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast.error("Failed to load auctions. Please try again later.");
    } finally {
      setContractorAuctionLoading(false);
      setContractorClosedAuctionLoading(false);
    }
  }

  // Fetch auctions when contractor tab changes
  useEffect(() => {
    if (isContractor && !authLoading && (contractorTab === 'auctions' || contractorTab === 'closed-auctions')) {
      fetchContractorAuctions();
    }
  }, [isContractor, authLoading, contractorTab]);

  // Fetch homeowner projects when My Projects tab is selected
  useEffect(() => {
    if (isHomeowner && !authLoading && homeownerTab === 'my-projects') {
      setHomeownerProjectsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setHomeownerProjects(getMockHomeownerProjects());
        setHomeownerProjectsLoading(false);
      }, 500);
    }
  }, [isHomeowner, authLoading, homeownerTab]);

  // Fetch jobs when My Jobs tab is selected
  useEffect(() => {
    if (isContractor && !authLoading && contractorTab === 'my-jobs') {
      setJobsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMyJobs(getMockJobs());
        setJobsLoading(false);
      }, 500);
    }
  }, [isContractor, authLoading, contractorTab]);

  // Fetch homeowner data
  const { data: claims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ["getClaims"],
    queryFn: async () => {
      if (!user?.id) return []
      const response: any = await apiService.get('/api/claim');
      return response?.claims;
    },
    enabled: !!user?.id && isHomeowner
  })

  const { data: auctions = [], isLoading: auctionsLoading } = useQuery({
    queryKey: ["getAuctions"],
    queryFn: async () => {
      const response: any = await apiService.get('/api/auctions');
      return response?.data;
    },
    enabled: !!user?.id && isHomeowner
  })

  // Fetch contractor data (only if contractor)
  const { data: contractorMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['contracts', 'metrics'],
    queryFn: async () => {
      const response: any = await apiService.get('/api/contracts/metrics');
      return response;
    },
    enabled: !!user?.id && isContractor
  })

  const { data: activeContracts = [], isLoading: contractsLoading } = useQuery({
    queryKey: ['contracts', 'active'],
    queryFn: async () => {
      const response: any = await apiService.get('/api/contracts?status=active');
      return response?.contracts || [];
    },
    enabled: !!user?.id && isContractor
  })

  // Filter homeowner's active auctions (only auctions for their claims that are open)
  const homeownerActiveAuctions = useMemo(() => {
    console.log('Filtering active auctions - claims:', claims?.length, 'auctions:', auctions?.length);
    if (!auctions || auctions.length === 0) {
      console.log('No auctions available');
      return []
    }

    // If no claims, return empty (or could show all auctions for testing)
    if (!claims || claims.length === 0) {
      console.log('No claims, returning empty array');
      return []
    }

    // Get claim IDs for this homeowner
    const claimIds = claims.map((claim: any) => claim.id)
    console.log('Claim IDs:', claimIds);
    console.log('All auctions sample:', auctions[0]);
    
    // Filter auctions to only those belonging to homeowner's claims and are active/open
    const filtered = auctions.filter((auction: any) => {
      const claimId = auction.claimId || auction.claim_id
      const endDate = new Date(auction.end_date || auction.auctionEndDate)
      const isActive = auction.status === 'open' && endDate > new Date()
      const belongsToClaim = claimIds.includes(claimId)
      
      console.log('Auction:', auction.title || auction.id, 'claimId:', claimId, 'belongsToClaim:', belongsToClaim, 'isActive:', isActive, 'status:', auction.status, 'endDate:', endDate);
      
      return belongsToClaim && isActive
    })
    
    console.log('Filtered active auctions:', filtered.length, filtered);
    return filtered
  }, [claims, auctions])

  // Filter homeowner's closed auctions (only auctions for their claims that are closed)
  const homeownerClosedAuctions = useMemo(() => {
    console.log('Filtering closed auctions - claims:', claims?.length, 'auctions:', auctions?.length);
    if (!auctions || auctions.length === 0) {
      console.log('No auctions available');
      return []
    }

    // If no claims, return empty
    if (!claims || claims.length === 0) {
      console.log('No claims, returning empty array');
      return []
    }

    // Get claim IDs for this homeowner
    const claimIds = claims.map((claim: any) => claim.id)
    
    // Filter auctions to only those belonging to homeowner's claims and are closed
    const filtered = auctions.filter((auction: any) => {
      const claimId = auction.claimId || auction.claim_id
      const endDate = new Date(auction.end_date || auction.auctionEndDate)
      const isClosed = auction.status === 'closed' || endDate <= new Date()
      
      return claimIds.includes(claimId) && isClosed
    })
    
    console.log('Filtered closed auctions:', filtered.length, filtered);
    return filtered
  }, [claims, auctions])

  // Filter homeowner's live auctions (only auctions for their claims)
  const homeownerLiveAuctions = useMemo(() => {
    if (!claims || !auctions || claims.length === 0) {
      return []
    }

    // Get claim IDs for this homeowner
    const claimIds = claims.map((claim: any) => claim.id)
    
    // Filter auctions to only those belonging to homeowner's claims and are live/open
    return auctions.filter((auction: any) => {
      const claimId = auction.claimId || auction.claim_id
      const endDate = new Date(auction.end_date || auction.auctionEndDate)
      const isLive = auction.status === 'open' && endDate > new Date()
      
      return claimIds.includes(claimId) && isLive
    })
  }, [claims, auctions])

  // Calculate homeowner stats
  const homeownerStats = useMemo(() => {
    if (!claims || !auctions) {
      return {
        totalClaims: 0,
        activeClaims: 0,
        completedClaims: 0,
        totalAuctions: 0,
        activeAuctions: 0,
        totalValue: 0
      }
    }

    const activeClaims = claims?.filter((claim: any) => 
      claim.status !== 'completed' && claim.status !== 'closed'
    )?.length
    
    const completedClaims = claims?.filter((claim: any) => 
      claim.status === 'completed' || claim.status === 'closed'
    )?.length

    // Count only live auctions for homeowner's claims
    const activeAuctions = homeownerActiveAuctions.length

    const totalValue = claims.reduce((sum: number, claim: any) => 
      sum + (claim.insuranceEstimate || 0), 0
    )

    return {
      totalClaims: claims?.length,
      activeClaims,
      completedClaims,
      totalAuctions: homeownerLiveAuctions.length,
      activeAuctions,
      totalValue
    }
  }, [claims, auctions, homeownerLiveAuctions])

  // Calculate contractor stats
  const contractorStats = useMemo(() => {
    if (!contractorMetrics) {
      return {
        ioiCount: 0,
        ioiValue: 0,
        loiCount: 0,
        loiValue: 0,
        activeContracts: 0,
        activeValue: 0
      }
    }

    return {
      ioiCount: contractorMetrics.ioiCount || 0,
      ioiValue: (contractorMetrics.ioiValueCents || 0) / 100,
      loiCount: contractorMetrics.loiCount || 0,
      loiValue: (contractorMetrics.loiValueCents || 0) / 100,
      activeContracts: contractorMetrics.activeCount || 0,
      activeValue: (contractorMetrics.activeValueCents || 0) / 100
    }
  }, [contractorMetrics])

  if (authLoading) {
    return <SplashScreen />
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pl-32">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h1>
            {user?.user_type && (
              <Badge 
                variant={user.user_type === 'contractor' ? 'default' : 'secondary'}
                className={
                  user.user_type === 'contractor' 
                    ? 'bg-blue-700 text-white hover:bg-blue-800' 
                    : 'bg-gray-700 text-white hover:bg-gray-800'
                }
              >
                {user.user_type === 'contractor' ? 'Contractor' : 'Homeowner'}
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            {isContractor 
              ? "Here's what's happening with your projects and opportunities"
              : "Here's what's happening with your recovery projects"
            }
          </p>
        </div>

        {/* Stats Grid - Conditional based on user type */}
        {isContractor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IOI Negotiations</CardTitle>
                <Handshake className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractorStats.ioiCount}</div>
                <p className="text-xs text-muted-foreground">
                  ${contractorStats.ioiValue.toLocaleString()} potential value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LOI Negotiations</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractorStats.loiCount}</div>
                <p className="text-xs text-muted-foreground">
                  ${contractorStats.loiValue.toLocaleString()} potential value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractorStats.activeContracts}</div>
                <p className="text-xs text-muted-foreground">
                  ${contractorStats.activeValue.toLocaleString()} active value
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{homeownerStats.totalClaims}</div>
              <p className="text-xs text-muted-foreground">
                  {homeownerStats.activeClaims} active, {homeownerStats.completedClaims} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{homeownerStats.activeAuctions}</div>
              <p className="text-xs text-muted-foreground">
                  {homeownerStats.totalAuctions} total auctions
              </p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Contractor Tabs and Content */}
        {isContractor ? (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setContractorTab('my-jobs')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'my-jobs'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    My Jobs
                  </div>
                </button>
                <button
                  onClick={() => setContractorTab('auctions')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'auctions'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Active Auctions
                  </div>
                </button>
                <button
                  onClick={() => setContractorTab('closed-auctions')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'closed-auctions'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Closed Auctions
                  </div>
                </button>
                <button
                  onClick={() => setContractorTab('schedule')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'schedule'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {contractorTab === 'my-jobs' ? (
                <>
                  {jobsLoading ? (
                    <LoadingSkeleton />
                  ) : myJobs?.length === 0 ? (
                    <EmptyState
                      icon={Wrench}
                      title="No Active Jobs"
                      description="You don't have any active jobs yet. Jobs will appear here once you win an auction and both parties accept the contract."
                    />
                  ) : (
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {myJobs?.map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.address}, {job.city}, {job.state}</span>
                                </div>
                              </div>
                              <Badge className={`${
                                job.status === 'active' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : job.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}>
                                {job.status === 'active' ? 'Active' : job.status === 'completed' ? 'Completed' : 'On Hold'}
                              </Badge>
                            </div>
            </CardHeader>
            <CardContent>
                            <div className="space-y-4">
                              {/* Project Info */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Project Type:</span>
                                  <span className="font-medium">{job.projectType}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Contract Value:</span>
                                  <span className="font-semibold text-blue-600">${job.contractValue.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Homeowner:</span>
                                  <span className="font-medium">{job.homeownerName}</span>
                                </div>
                              </div>

                              {/* Progress Bar */}
              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-medium">{job.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                                    style={{ width: `${job.progress}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Milestones */}
                              <div className="flex items-center justify-between text-sm pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-gray-600">Milestones:</span>
                                </div>
                                <span className="font-medium">
                                  {job.milestonesCompleted} / {job.totalMilestones} completed
                                </span>
                              </div>

                              {/* Dates */}
                              <div className="space-y-1 text-xs text-gray-500 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>Started: {new Date(job.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>Expected Completion: {new Date(job.expectedCompletion).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 pt-2">
                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => router.push(`/contracts/${job.contractId}`)}
                                >
                                  View Details
                </Button>
                <Button 
                                  variant="default"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                                  onClick={() => router.push(`/jobs/${job.id}`)}
                                >
                                  <Activity className="h-4 w-4 mr-2" />
                                  Manage
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'auctions' ? (
                <>
                  {contractorAuctionLoading ? (
                    <LoadingSkeleton />
                  ) : contractorAuctions?.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No Active Auctions"
                      description="There are currently no active auctions to display."
                    />
                  ) : (
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {contractorAuctions?.map((auction) => (
                        <AuctionCard
                          key={auction.auction_id}
                          title={auction.title}
                          scope={auction.project_type}
                          finalBid={auction.current_bid}
                          totalBids={auction.bid_count}
                          endedAt={auction.end_date}
                          status="open"
                          onViewDetails={() => router.push(`/auction/${auction.auction_id}`)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'closed-auctions' ? (
                <>
                  {contractorClosedAuctionLoading ? (
                    <LoadingSkeleton />
                  ) : contractorClosedAuctions?.length === 0 ? (
                    <EmptyState
                      icon={Archive}
                      title="No Closed Auctions"
                      description="There are no closed auctions to display."
                    />
                  ) : (
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {contractorClosedAuctions?.map((auction) => (
                        <AuctionCard
                          key={auction.auction_id}
                          title={auction.title}
                          scope={auction.project_type}
                          finalBid={auction.current_bid}
                          totalBids={auction.bid_count}
                          endedAt={auction.end_date}
                          status="closed"
                          onViewDetails={() => router.push(`/auction/${auction.auction_id}`)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'schedule' ? (
                <div className="space-y-6">
                  {/* Schedule Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Schedule & Calendar</h2>
                      <p className="text-gray-600 mt-1">Manage all deadlines, visits, and milestones</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <List className="h-4 w-4 mr-2" />
                        List
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Calendar
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Gantt
                </Button>
              </div>
        </div>

                  {/* Critical Deadlines Alert */}
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-red-800">Critical Deadlines</h3>
                          <p className="text-sm text-red-700 mt-1">
                            IOI deadline for Bathroom Remodel project due tomorrow at 5:00 PM
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule Tab Navigation */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setScheduleTab('upcoming')}
                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                          scheduleTab === 'upcoming'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Upcoming Events
                      </button>
                      <button
                        onClick={() => setScheduleTab('deadlines')}
                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                          scheduleTab === 'deadlines'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Deadlines
                      </button>
                      <button
                        onClick={() => setScheduleTab('visits')}
                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                          scheduleTab === 'visits'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Site Visits
                      </button>
                      <button
                        onClick={() => setScheduleTab('milestones')}
                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                          scheduleTab === 'milestones'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Milestones
                      </button>
                    </nav>
                  </div>

                  {/* Schedule Tab Content */}
                  <div>
                    {scheduleTab === 'upcoming' && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Next 7 Days</h3>
                        <div className="space-y-4">
                          <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">IOI Deadline - Bathroom Remodel</h4>
                                  <p className="text-xs text-gray-500 mt-1">Tomorrow at 5:00 PM</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 text-xs">Critical</Badge>
                            </div>
                          </Card>
                          <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">Site Visit - Kitchen Renovation</h4>
                                  <p className="text-xs text-gray-500 mt-1">Friday at 10:00 AM</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">Scheduled</Badge>
                            </div>
                          </Card>
                        </div>
                      </>
                    )}

                    {scheduleTab === 'deadlines' && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Critical Deadlines</h3>
                        <div className="space-y-6">
                          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-lg font-semibold text-gray-900">IOI Submission Deadline</h4>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">2/19/2024</p>
                                    <p className="text-sm text-gray-500">5:00 PM</p>
                                  </div>
                                </div>
                                <p className="text-gray-600 mb-3">Bathroom Remodel - Flood Damage</p>
                                <div className="flex items-center space-x-3 mb-4">
                                  <Badge className="bg-red-100 text-red-800 border-red-200">HIGH</Badge>
                                  <span className="text-sm text-gray-600">IOI Deadline</span>
                                </div>
                                <p className="text-gray-700 mb-4">Submit Intent of Interest for bathroom renovation project</p>
                                <div className="flex space-x-3">
                                  <Button variant="outline" size="sm">View Details</Button>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Reschedule</Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-lg font-semibold text-gray-900">LOI Response Due</h4>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">2/27/2024</p>
                                    <p className="text-sm text-gray-500">11:59 PM</p>
                                  </div>
                                </div>
                                <p className="text-gray-600 mb-3">Siding Replacement - Wind Damage</p>
                                <div className="flex items-center space-x-3 mb-4">
                                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">MEDIUM</Badge>
                                  <span className="text-sm text-gray-600">LOI Deadline</span>
                                </div>
                                <p className="text-gray-700 mb-4">Letter of Intent response deadline</p>
                                <div className="flex space-x-3">
                                  <Button variant="outline" size="sm">View Details</Button>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Reschedule</Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                    </div>
                      </>
                    )}

                    {scheduleTab === 'visits' && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Site Visits</h3>
                        <div className="text-center py-8">
                          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No site visits scheduled</p>
                </div>
                      </>
                    )}

                    {scheduleTab === 'milestones' && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Milestones</h3>
                <div className="text-center py-8">
                          <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No milestones scheduled</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
        <div className="space-y-6">
          {/* Homeowner Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setHomeownerTab('my-projects')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'my-projects'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  My Projects
                </div>
              </button>
              <button
                onClick={() => setHomeownerTab('active-auctions')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'active-auctions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Active Auctions
                </div>
              </button>
              <button
                onClick={() => setHomeownerTab('closed-auctions')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'closed-auctions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  Closed Auctions
                </div>
              </button>
              <button
                onClick={() => setHomeownerTab('claims')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'claims'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Claims
                </div>
              </button>
            </nav>
          </div>

          {/* Homeowner Tab Content */}
          <div>
            {homeownerTab === 'my-projects' ? (
              <>
                {homeownerProjectsLoading ? (
                  <LoadingSkeleton />
                ) : homeownerProjects?.length === 0 ? (
                  <EmptyState
                    icon={Building2}
                    title="No Active Projects"
                    description="You don't have any active projects yet. Projects will appear here once you accept a contractor's bid."
                  />
                ) : (
                  <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {homeownerProjects?.map((project) => (
                      <Card key={project.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span>{project.address}, {project.city}, {project.state}</span>
                              </div>
                            </div>
                            <Badge className={`${
                              project.status === 'active' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : project.status === 'completed'
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                              {project.status === 'active' ? 'Active' : project.status === 'completed' ? 'Completed' : 'Pending'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Project Info */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Project Type:</span>
                                <span className="font-medium">{project.projectType}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Contract Value:</span>
                                <span className="font-semibold text-blue-600">${project.contractValue.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Contractor:</span>
                                <span className="font-medium">{project.contractorName}</span>
                              </div>
                              {project.contractorCompany && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Company:</span>
                                  <span className="font-medium text-xs">{project.contractorCompany}</span>
                                </div>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Milestones */}
                            <div className="flex items-center justify-between text-sm pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-gray-600">Milestones:</span>
                              </div>
                              <span className="font-medium">
                                {project.milestonesCompleted} / {project.totalMilestones} completed
                              </span>
                            </div>

                            {/* Dates */}
                            <div className="space-y-1 text-xs text-gray-500 pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>Expected Completion: {new Date(project.expectedCompletion).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => router.push(`/claim/${project.claimId}`)}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="default"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => router.push(`/projects/${project.id}`)}
                              >
                                <Activity className="h-4 w-4 mr-2" />
                                Manage
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : homeownerTab === 'active-auctions' ? (
              <>
                {auctionsLoading ? (
                  <LoadingSkeleton />
                ) : (homeownerActiveAuctions?.length === 0 && auctions?.length > 0) ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Found {auctions.length} auction(s) but none match your claims. Showing all auctions for debugging:
                      </p>
                    </div>
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {auctions.slice(0, 6).map((auction: any) => {
                        console.log('Rendering debug auction card:', auction);
                        return (
                          <AuctionCard
                            key={auction.auction_id || auction.id}
                            title={auction.title || 'Untitled Auction'}
                            scope={auction.project_type || auction.scope || 'N/A'}
                            finalBid={auction.current_bid || auction.currentBid || auction.finalBid || 0}
                            totalBids={auction.bid_count || auction.bidCount || auction.totalBids || 0}
                            endedAt={auction.end_date || auction.auctionEndDate || auction.endedAt}
                            status={auction.status === 'closed' ? 'closed' : 'open'}
                            onViewDetails={() => router.push(`/auction/${auction.auction_id || auction.id}`)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : homeownerActiveAuctions?.length === 0 ? (
                  <EmptyState
                    icon={DollarSign}
                    title="No Active Auctions"
                    description="There are currently no active auctions for your claims. Create a restoration job from your claims to start an auction."
                    actionLabel="View Claims"
                    onAction={() => setHomeownerTab('claims')}
                  />
                ) : (
                  <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {homeownerActiveAuctions?.map((auction: any) => {
                      console.log('Rendering active auction card:', auction);
                      return (
                        <AuctionCard
                          key={auction.auction_id || auction.id}
                          title={auction.title || 'Untitled Auction'}
                          scope={auction.project_type || auction.scope || 'N/A'}
                          finalBid={auction.current_bid || auction.currentBid || auction.finalBid || 0}
                          totalBids={auction.bid_count || auction.bidCount || auction.totalBids || 0}
                          endedAt={auction.end_date || auction.auctionEndDate || auction.endedAt}
                          status="open"
                          onViewDetails={() => router.push(`/auction/${auction.auction_id || auction.id}`)}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            ) : homeownerTab === 'closed-auctions' ? (
              <>
                {auctionsLoading ? (
                  <LoadingSkeleton />
                ) : (homeownerClosedAuctions?.length === 0 && auctions?.length > 0) ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Found {auctions.length} auction(s) but none match your claims. Showing all auctions for debugging:
                      </p>
                    </div>
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {auctions.slice(0, 6).map((auction: any) => {
                        console.log('Rendering debug closed auction card:', auction);
                        return (
                          <AuctionCard
                            key={auction.auction_id || auction.id}
                            title={auction.title || 'Untitled Auction'}
                            scope={auction.project_type || auction.scope || 'N/A'}
                            finalBid={auction.current_bid || auction.currentBid || auction.finalBid || 0}
                            totalBids={auction.bid_count || auction.bidCount || auction.totalBids || 0}
                            endedAt={auction.end_date || auction.auctionEndDate || auction.endedAt}
                            status="closed"
                            onViewDetails={() => router.push(`/auction/${auction.auction_id || auction.id}`)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : homeownerClosedAuctions?.length === 0 ? (
                  <EmptyState
                    icon={Archive}
                    title="No Closed Auctions"
                    description="You don't have any closed auctions yet. Closed auctions will appear here once they end."
                  />
                ) : (
                  <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {homeownerClosedAuctions?.map((auction: any) => {
                      console.log('Rendering closed auction card:', auction);
                      return (
                        <AuctionCard
                          key={auction.auction_id || auction.id}
                          title={auction.title || 'Untitled Auction'}
                          scope={auction.project_type || auction.scope || 'N/A'}
                          finalBid={auction.current_bid || auction.currentBid || auction.finalBid || 0}
                          totalBids={auction.bid_count || auction.bidCount || auction.totalBids || 0}
                          endedAt={auction.end_date || auction.auctionEndDate || auction.endedAt}
                          status="closed"
                          onViewDetails={() => router.push(`/auction/${auction.auction_id || auction.id}`)}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            ) : homeownerTab === 'claims' ? (
              <>
                {claimsLoading ? (
                  <LoadingSkeleton />
                ) : claims?.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No Claims Found"
                    description="You haven't filed any claims yet. Start a new claim to get started with your recovery process."
                    actionLabel="Start New Claim"
                    onAction={() => router.push("/start-claim")}
                  />
                ) : (
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {claims?.map((claim: any) => (
                      <ClaimCard
                        key={claim.id}
                        id={claim.id}
                        street={claim.street}
                        city={claim.city}
                        state={claim.state}
                        zipCode={claim.zipCode}
                        projectType={claim.projectType}
                        designPlan={claim.designPlan}
                        needsAdjuster={claim.needsAdjuster}
                        insuranceProvider={claim.insuranceProvider ? (claim.insuranceProvider === 'statefarm' ? 'State Farm' : claim.insuranceProvider) : 'Not specified'}
                        createdAt={claim.createdAt}
                        updatedAt={claim.updatedAt}
                        onViewDetails={() => router.push(`/claim/${claim.id}`)}
                        onCreateRestoration={() => router.push(`/start-claim/create-restor/${claim.id}`)}
                        onDelete={() => {
                          toast("Delete functionality coming soon");
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
        )}
      </div>
    </div>
  )
} 