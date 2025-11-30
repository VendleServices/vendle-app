"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  Activity,
  X,
  Phone,
  ChevronDown,
  Download,
  File,
  Image as ImageIcon,
  Bookmark,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import { AuctionCard } from "@/components/AuctionCard";
import { ClaimCard } from "@/components/ClaimCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { toast } from "sonner";
import { mockSavedOpportunities, mockIoiOpportunities, mockLoiOpportunities, type BiddingOpportunity } from "@/data/mockBiddingOpportunities";

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
  homeownerPhone?: string;
  description?: string;
  imageUrl?: string;
  files?: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'document';
  }>;
}

export default function HomePage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const router = useRouter()
  const apiService = useApiService();

  // Contractor tab state
  const [contractorTab, setContractorTab] = useState<'saved-opportunities' | 'iois' | 'lois' | 'active-contracts'>('saved-opportunities');
  const [scheduleTab, setScheduleTab] = useState<'upcoming' | 'deadlines' | 'visits' | 'milestones'>('upcoming');
  const [contractorAuctions, setContractorAuctions] = useState<Auction[]>([]);
  const [contractorAuctionLoading, setContractorAuctionLoading] = useState(false);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilesDropdown, setShowFilesDropdown] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState<BiddingOpportunity[]>([]);
  const [ioiOpportunities, setIoiOpportunities] = useState<BiddingOpportunity[]>([]);
  const [loiOpportunities, setLoiOpportunities] = useState<BiddingOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<BiddingOpportunity | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const isContractor = user?.user_metadata?.userType === 'contractor'
  const isHomeowner = user?.user_metadata?.userType === 'homeowner' || !isContractor

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
        homeownerName: "John Smith",
        homeownerPhone: "(555) 123-4567",
        description: "Extensive water damage from burst pipe affecting kitchen and basement. Need immediate restoration work including drywall repair, flooring replacement, and mold remediation.",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
        files: [
          { id: "file-1", name: "Contract_Agreement.pdf", url: "/files/contract.pdf", type: "pdf" },
          { id: "file-2", name: "Insurance_Estimate.pdf", url: "/files/estimate.pdf", type: "pdf" },
          { id: "file-3", name: "Damage_Photos.jpg", url: "/files/photos.jpg", type: "image" },
          { id: "file-4", name: "Design_Plan.pdf", url: "/files/design.pdf", type: "pdf" },
          { id: "file-5", name: "Inspection_Report.pdf", url: "/files/inspection.pdf", type: "pdf" }
        ]
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
        homeownerName: "Maria Garcia",
        homeownerPhone: "(555) 234-5678",
        description: "Fire damage restoration needed for living room and attic area. Includes smoke damage cleanup, structural repairs, and complete interior restoration.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        files: [
          { id: "file-6", name: "Contract_Agreement.pdf", url: "/files/contract2.pdf", type: "pdf" },
          { id: "file-7", name: "Fire_Report.pdf", url: "/files/fire-report.pdf", type: "pdf" },
          { id: "file-8", name: "Before_Photos.jpg", url: "/files/before.jpg", type: "image" }
        ]
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
        homeownerName: "Robert Williams",
        homeownerPhone: "(555) 345-6789",
        description: "Complete roof replacement needed after severe storm damage. Includes removal of old shingles, inspection of roof deck, and installation of new roofing system.",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        files: [
          { id: "file-9", name: "Contract_Agreement.pdf", url: "/files/contract3.pdf", type: "pdf" },
          { id: "file-10", name: "Roof_Assessment.pdf", url: "/files/roof-assessment.pdf", type: "pdf" }
        ]
      }
    ];
  }


  const handleManageJob = (job: Job) => {
    setSelectedOpportunity(null); // Close opportunity panel if open
    setSelectedJob(job);
  };

  const handleOpenImageModal = (images: string[], startIndex: number = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setImageModalOpen(true);
  };

  const handleViewOpportunity = (opportunity: BiddingOpportunity) => {
    setSelectedJob(null); // Close job panel if open
    setSelectedOpportunity(opportunity);
  };

  const handleCloseOpportunityPanel = () => {
    setSelectedOpportunity(null);
  };

  const handleClosePanel = () => {
    setSelectedJob(null);
    setShowFilesDropdown(false);
  };

  const handleFileClick = (file: any) => {
    if (file.type === 'pdf') {
      // Open PDF in new tab
      window.open(file.url, '_blank');
    } else {
      // Download other file types
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getMapUrl = (address: string, city: string, state: string) => {
    const query = `${address}, ${city}, ${state}`;
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(query)}&zoom=13&size=400x300&maptype=mapnik`;
  };

  // Helper function to render bidding opportunity card
  const renderBiddingOpportunityCard = (opportunity: BiddingOpportunity, stage: 'saved' | 'ioi' | 'loi') => {
    const getStatusBadge = () => {
      if (stage === 'ioi' && opportunity.ioiPhase?.status) {
        const status = opportunity.ioiPhase.status;
        if (status === 'submitted') return { label: 'IOI Submitted', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        if (status === 'accepted') return { label: 'IOI Accepted', color: 'bg-green-100 text-green-800 border-green-200' };
        if (status === 'rejected') return { label: 'IOI Rejected', color: 'bg-red-100 text-red-800 border-red-200' };
        return { label: 'IOI Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      }
      if (stage === 'loi' && opportunity.loiPhase?.status) {
        const status = opportunity.loiPhase.status;
        if (status === 'submitted') return { label: 'LOI Submitted', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        if (status === 'accepted') return { label: 'LOI Accepted', color: 'bg-green-100 text-green-800 border-green-200' };
        if (status === 'rejected') return { label: 'LOI Rejected', color: 'bg-red-100 text-red-800 border-red-200' };
        return { label: 'LOI Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      }
      return null;
    };

    const statusBadge = getStatusBadge();
    const isSelected = selectedOpportunity?.id === opportunity.id;

    return (
      <Card key={opportunity.id} className={`hover:shadow-lg transition-all cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50/30' 
          : 'shadow-sm'
      }`} onClick={() => handleViewOpportunity(opportunity)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{opportunity.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{opportunity.address}, {opportunity.city}, {opportunity.state}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                {opportunity.projectType}
              </Badge>
              {statusBadge && (
                <Badge className={`${statusBadge.color} rounded-full px-2.5 py-0.5 text-xs font-medium`}>
                  {statusBadge.label}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Project Type */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Project Type:</span>
              <span className="font-medium">{opportunity.projectType}</span>
            </div>

            {/* Images */}
            {opportunity.images && opportunity.images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Property Images</p>
                <div 
                  className="relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenImageModal(opportunity.images, 0);
                  }}
                >
                  <img
                    src={opportunity.images[0]}
                    alt={opportunity.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  {opportunity.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      +{opportunity.images.length - 1} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Insurance Adjustment PDF */}
            {opportunity.insuranceAdjustmentPdf && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Insurance Adjustment</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start hover:bg-blue-700 hover:text-white overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(opportunity.insuranceAdjustmentPdf!.url, '_blank');
                  }}
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate flex-1 min-w-0">{opportunity.insuranceAdjustmentPdf.name}</span>
                  <Download className="h-4 w-4 ml-2 flex-shrink-0" />
                </Button>
              </div>
            )}

            {/* IOI Phase Timeline */}
            {opportunity.ioiPhase && (
              <div className="space-y-1 text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium text-gray-700">IOI Phase:</span>
                </div>
                <div className="pl-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Start: {new Date(opportunity.ioiPhase.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>End: {new Date(opportunity.ioiPhase.endDate).toLocaleDateString()}</span>
                  </div>
                  {opportunity.ioiPhase.submittedDate && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span>Submitted: {new Date(opportunity.ioiPhase.submittedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {stage === 'ioi' && opportunity.ioiPhase.initialBid && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <DollarSign className="h-3 w-3" />
                      <span>Initial Bid: ${opportunity.ioiPhase.initialBid.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LOI Phase Timeline */}
            {opportunity.loiPhase && (
              <div className="space-y-1 text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-3 w-3" />
                  <span className="font-medium text-gray-700">LOI Phase:</span>
                </div>
                <div className="pl-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Start: {new Date(opportunity.loiPhase.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>End: {new Date(opportunity.loiPhase.endDate).toLocaleDateString()}</span>
                  </div>
                  {opportunity.loiPhase.submittedDate && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span>Submitted: {new Date(opportunity.loiPhase.submittedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {stage === 'loi' && opportunity.loiPhase.contractValue && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <DollarSign className="h-3 w-3" />
                      <span>Contract Value: ${opportunity.loiPhase.contractValue.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Schedule Site Visit Button (IOI only) */}
            {stage === 'ioi' && (
              <div className="pt-2">
                <Button 
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open Calendly in a new window
                    // Replace with actual Calendly URL
                    const calendlyUrl = `https://calendly.com/your-calendly-link?text=${encodeURIComponent(`Site Visit - ${opportunity.title}`)}`;
                    window.open(calendlyUrl, '_blank');
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Site Visit
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <Button 
                variant="default"
                className="w-full bg-blue-600 hover:bg-blue-700 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewOpportunity(opportunity);
                }}
              >
                <Activity className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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

  // Fetch jobs when Active Contracts tab is selected
  useEffect(() => {
    if (isContractor && !authLoading && contractorTab === 'active-contracts') {
      setJobsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMyJobs(getMockJobs());
        setJobsLoading(false);
      }, 500);
    }
  }, [isContractor, authLoading, contractorTab]);

  // Fetch saved opportunities
  useEffect(() => {
    if (isContractor && !authLoading && contractorTab === 'saved-opportunities') {
      setTimeout(() => {
        setSavedOpportunities(mockSavedOpportunities);
      }, 300);
    }
  }, [isContractor, authLoading, contractorTab]);

  // Fetch IOI opportunities
  useEffect(() => {
    if (isContractor && !authLoading && contractorTab === 'iois') {
      setTimeout(() => {
        setIoiOpportunities(mockIoiOpportunities);
      }, 300);
    }
  }, [isContractor, authLoading, contractorTab]);

  // Fetch LOI opportunities
  useEffect(() => {
    if (isContractor && !authLoading && contractorTab === 'lois') {
      setTimeout(() => {
        setLoiOpportunities(mockLoiOpportunities);
      }, 300);
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
    <div className={`min-h-screen bg-gray-50 pl-32 transition-all duration-300 ${selectedJob || selectedOpportunity ? 'pr-[33.333%]' : ''}`}>
      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Property Images</DialogTitle>
          </DialogHeader>
          <div className="relative px-6 py-4">
            {selectedImages.length > 0 && (
              <>
                <div className="relative w-full h-[60vh] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImages[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  {selectedImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : selectedImages.length - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev < selectedImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>
                {selectedImages.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-sm text-gray-600">
                      {currentImageIndex + 1} of {selectedImages.length}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Right Side Detail Panel for Opportunities */}
      {selectedOpportunity && (
        <div className="fixed right-0 top-0 h-screen w-1/3 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Opportunity Details</h2>
              <button
                onClick={handleCloseOpportunityPanel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedOpportunity.title}
                </h3>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {selectedOpportunity.projectType}
                </Badge>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <p className="text-base font-medium text-gray-900">
                    {selectedOpportunity.address}, {selectedOpportunity.city}, {selectedOpportunity.state}
                  </p>
                </div>
              </div>

              {/* Images */}
              {selectedOpportunity.images && selectedOpportunity.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Property Images</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOpportunity.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
                        onClick={() => handleOpenImageModal(selectedOpportunity.images!, index)}
                      >
                        <img
                          src={image}
                          alt={`${selectedOpportunity.title} - Image ${index + 1}`}
                          className="w-full h-32 object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insurance Adjustment PDF */}
              {selectedOpportunity.insuranceAdjustmentPdf && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Insurance Adjustment Document</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-700 hover:text-white overflow-hidden"
                    onClick={() => window.open(selectedOpportunity.insuranceAdjustmentPdf!.url, '_blank')}
                  >
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate flex-1 min-w-0">{selectedOpportunity.insuranceAdjustmentPdf.name}</span>
                    <Download className="h-4 w-4 ml-2 flex-shrink-0" />
                  </Button>
                </div>
              )}

              {/* IOI Phase */}
              {selectedOpportunity.ioiPhase && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">IOI Phase</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(selectedOpportunity.ioiPhase.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{new Date(selectedOpportunity.ioiPhase.endDate).toLocaleDateString()}</span>
                    </div>
                    {selectedOpportunity.ioiPhase.submittedDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium text-green-600">{new Date(selectedOpportunity.ioiPhase.submittedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedOpportunity.ioiPhase.status && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={`${
                          selectedOpportunity.ioiPhase.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                          selectedOpportunity.ioiPhase.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          selectedOpportunity.ioiPhase.status === 'submitted' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {selectedOpportunity.ioiPhase.status.charAt(0).toUpperCase() + selectedOpportunity.ioiPhase.status.slice(1)}
                        </Badge>
                      </div>
                    )}
                    {selectedOpportunity.ioiPhase.initialBid && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Initial Bid:</span>
                        <span className="font-semibold text-blue-600">${selectedOpportunity.ioiPhase.initialBid.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Schedule Site Visit Button */}
                  <div className="pt-3">
                    <Button 
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      onClick={() => {
                        // Open Calendly in a new window
                        // Replace with actual Calendly URL
                        const calendlyUrl = `https://calendly.com/your-calendly-link?text=${encodeURIComponent(`Site Visit - ${selectedOpportunity.title}`)}`;
                        window.open(calendlyUrl, '_blank');
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Site Visit
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* LOI Phase */}
              {selectedOpportunity.loiPhase && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">LOI Phase</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(selectedOpportunity.loiPhase.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{new Date(selectedOpportunity.loiPhase.endDate).toLocaleDateString()}</span>
                    </div>
                    {selectedOpportunity.loiPhase.submittedDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium text-green-600">{new Date(selectedOpportunity.loiPhase.submittedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedOpportunity.loiPhase.status && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={`${
                          selectedOpportunity.loiPhase.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                          selectedOpportunity.loiPhase.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          selectedOpportunity.loiPhase.status === 'submitted' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {selectedOpportunity.loiPhase.status.charAt(0).toUpperCase() + selectedOpportunity.loiPhase.status.slice(1)}
                        </Badge>
                      </div>
                    )}
                    {selectedOpportunity.loiPhase.contractValue && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Contract Value:</span>
                        <span className="font-semibold text-blue-600">${selectedOpportunity.loiPhase.contractValue.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Details (if available) */}
              {selectedOpportunity.description && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedOpportunity.description}
                  </p>
                </div>
              )}

              {selectedOpportunity.contractValue && (
                <div className="space-y-1 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Contract Value</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${selectedOpportunity.contractValue.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Contact Homeowner</p>
                
                {/* Phone Number */}
                {selectedOpportunity.homeownerPhone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedOpportunity.homeownerPhone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Name (if phone not available, show name in a card) */}
                {selectedOpportunity.homeownerName && !selectedOpportunity.homeownerPhone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Homeowner Name</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedOpportunity.homeownerName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Chat - Always available */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Chat</p>
                    <Button variant="outline" size="sm" className="w-full hover:bg-blue-700 hover:text-white">
                      Open Chat
                    </Button>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Location Map</p>
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getMapUrl(selectedOpportunity.address, selectedOpportunity.city, selectedOpportunity.state)}
                    alt="Location map"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Side Detail Panel for Jobs */}
      {selectedJob && (
        <div className="fixed right-0 top-0 h-screen w-1/3 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
              <button
                onClick={handleClosePanel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedJob.title}
                </h3>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {selectedJob.projectType}
                </Badge>
              </div>

              {/* Contract Value */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Contract Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${selectedJob.contractValue.toLocaleString()}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <p className="text-base font-medium text-gray-900">
                    {selectedJob.address}, {selectedJob.city}, {selectedJob.state}
                  </p>
                </div>
              </div>

              {/* Job Image */}
              {selectedJob.imageUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Job Photos</p>
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={selectedJob.imageUrl}
                      alt={selectedJob.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Location Map</p>
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getMapUrl(selectedJob.address, selectedJob.city, selectedJob.state)}
                    alt="Location map"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Contact Homeowner</p>
                
                {/* Phone Number */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedJob.homeownerPhone || '(555) ***-****'}
                    </p>
                  </div>
                </div>

                {/* Chat */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Chat</p>
                    <Button variant="outline" size="sm" className="w-full hover:bg-blue-700 hover:text-white">
                      Open Chat
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedJob.description && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>
              )}

              {/* Project Info */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Project Information</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{selectedJob.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${selectedJob.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-gray-600">Milestones:</span>
                    <span className="font-medium">
                      {selectedJob.milestonesCompleted} / {selectedJob.totalMilestones} completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {new Date(selectedJob.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Expected Completion: {new Date(selectedJob.expectedCompletion).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Related Files Dropdown */}
              {selectedJob.files && selectedJob.files.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-between hover:bg-blue-700 hover:text-white"
                      onClick={() => setShowFilesDropdown(!showFilesDropdown)}
                    >
                      <span className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        Related Files ({selectedJob.files.length})
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showFilesDropdown ? 'rotate-180' : ''}`} />
                    </Button>
                    {showFilesDropdown && (
                      <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg">
                        <div className="max-h-64 overflow-y-auto">
                          {selectedJob.files.map((file) => (
                            <button
                              key={file.id}
                              onClick={() => handleFileClick(file)}
                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              {file.type === 'pdf' ? (
                                <File className="h-5 w-5 text-red-600" />
                              ) : file.type === 'image' ? (
                                <ImageIcon className="h-5 w-5 text-blue-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-gray-600" />
                              )}
                              <span className="flex-1 text-left text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </span>
                              {file.type === 'pdf' ? (
                                <span className="text-xs text-gray-500">View</span>
                              ) : (
                                <Download className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.email || 'User'}!</h1>
            {user?.user_metadata?.userType && (
              <Badge 
                variant={user?.user_metadata?.userType === 'contractor' ? 'default' : 'secondary'}
                className={
                  user?.user_metadata?.userType === 'contractor'
                    ? 'bg-blue-700 text-white hover:bg-blue-800 hover:text-white' 
                    : 'bg-gray-700 text-white hover:bg-gray-800 hover:text-white'
                }
              >
                {user?.user_metadata?.userType === 'contractor' ? 'Contractor' : 'Homeowner'}
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${contractorStats.ioiValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {contractorStats.ioiCount} contract{contractorStats.ioiCount !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LOI Negotiations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${contractorStats.loiValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {contractorStats.loiCount} contract{contractorStats.loiCount !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${contractorStats.activeValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {contractorStats.activeContracts} contract{contractorStats.activeContracts !== 1 ? 's' : ''}
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
          <div className="space-y-6 transition-all duration-300">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex items-center">
                {/* Section 1: Saved Bidding Opportunities */}
                <button
                  onClick={() => setContractorTab('saved-opportunities')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'saved-opportunities'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Saved Bidding Opportunities
                    {savedOpportunities.length > 0 && (
                      <Badge className="ml-1 bg-blue-100 text-blue-800 border-blue-200 text-xs px-1.5 py-0">
                        {savedOpportunities.length}
                      </Badge>
                    )}
                  </div>
                </button>
                
                {/* Visual Separator */}
                <div className="h-6 w-px bg-gray-300 mx-4"></div>
                
                {/* Section 2: Live Bidding Opportunities */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400 font-medium mr-2">Live Bidding:</span>
                  <button
                    onClick={() => setContractorTab('iois')}
                    className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                      contractorTab === 'iois'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      IOIs
                      {contractorStats.ioiCount > 0 && (
                        <Badge className="ml-1 bg-blue-100 text-blue-800 border-blue-200 text-xs px-1.5 py-0">
                          {contractorStats.ioiCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setContractorTab('lois')}
                    className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                      contractorTab === 'lois'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      LOIs
                      {contractorStats.loiCount > 0 && (
                        <Badge className="ml-1 bg-blue-100 text-blue-800 border-blue-200 text-xs px-1.5 py-0">
                          {contractorStats.loiCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                </div>
                
                {/* Visual Separator */}
                <div className="h-6 w-px bg-gray-300 mx-4"></div>
                
                {/* Section 3: Active Contracts */}
                <button
                  onClick={() => setContractorTab('active-contracts')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'active-contracts'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Active Contracts
                    {contractorStats.activeContracts > 0 && (
                      <Badge className="ml-1 bg-blue-100 text-blue-800 border-blue-200 text-xs px-1.5 py-0">
                        {contractorStats.activeContracts}
                      </Badge>
                    )}
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {contractorTab === 'saved-opportunities' ? (
                <>
                  {savedOpportunities.length === 0 ? (
                    <EmptyState
                      icon={Bookmark}
                      title="No Saved Opportunities"
                      description="Save bidding opportunities you're interested in to track them here."
                    />
                  ) : (
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {savedOpportunities.map((opportunity) => renderBiddingOpportunityCard(opportunity, 'saved'))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'iois' ? (
                <>
                  {ioiOpportunities.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title="No IOI Negotiations"
                      description="You don't have any active Intent of Interest negotiations at the moment."
                    />
                  ) : (
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {ioiOpportunities.map((opportunity) => renderBiddingOpportunityCard(opportunity, 'ioi'))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'lois' ? (
                <>
                  {loiOpportunities.length === 0 ? (
                    <EmptyState
                      icon={FileCheck}
                      title="No LOI Negotiations"
                      description="You don't have any active Letter of Intent negotiations at the moment."
                    />
                  ) : (
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {loiOpportunities.map((opportunity) => renderBiddingOpportunityCard(opportunity, 'loi'))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'active-contracts' ? (
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
                      {myJobs?.map((job) => {
                        const isSelected = selectedJob?.id === job.id;
                        return (
                        <Card 
                          key={job.id} 
                          className={`hover:shadow-lg transition-all cursor-pointer ${
                            isSelected 
                              ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50/30' 
                              : 'shadow-sm'
                          }`}
                          onClick={() => handleManageJob(job)}
                        >
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
                              <div className="pt-2">
                <Button 
                                  variant="default"
                                  className="w-full bg-blue-600 hover:bg-blue-700 hover:text-white"
                                  onClick={() => handleManageJob(job)}
                                >
                                  <Activity className="h-4 w-4 mr-2" />
                                  Manage
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        );
                      })}
                    </div>
                  )}
                </>
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
                                className="flex-1 hover:bg-blue-700 hover:text-white"
                                onClick={() => router.push(`/claim/${project.claimId}`)}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="default"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 hover:text-white"
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