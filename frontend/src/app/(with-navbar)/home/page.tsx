"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useApiService } from "@/services/api";
import { 
  Building2, 
  FileText, 
  DollarSign,
  Clock, 
  Briefcase,
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
  Shield,
  FileCheck
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import SplashScreen from "@/components/SplashScreen";
import { AuctionCard } from "@/components/AuctionCard";
import { ClaimCard } from "@/components/ClaimCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getMockHomeownerProjects,
  type HomeownerProject,
  type Job, PendingNDA,
  type PhaseProject
} from "@/data/mockHomeData";
import { getContractorInitials } from "@/utils/helpers";

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

export default function HomePage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const router = useRouter()
  const apiService = useApiService();

  // Contractor tab state
  const [contractorTab, setContractorTab] = useState<'pending-ndas' | 'phase-1' | 'phase-2' | 'my-jobs'>('pending-ndas');
  const [scheduleTab, setScheduleTab] = useState<'upcoming' | 'deadlines' | 'visits' | 'milestones'>('upcoming');
  const [contractorAuctions, setContractorAuctions] = useState<Auction[]>([]);
  const [contractorAuctionLoading, setContractorAuctionLoading] = useState(false);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedPhaseProject, setSelectedPhaseProject] = useState<PhaseProject | null>(null);
  const [showFilesDropdown, setShowFilesDropdown] = useState(false);

  // Homeowner tab state
  const [homeownerTab, setHomeownerTab] = useState<'pre-launch' | 'phase-1' | 'phase-2' | 'active-rebuild'>('pre-launch');
  const [homeownerProjects, setHomeownerProjects] = useState<HomeownerProject[]>([]);
  const [homeownerProjectsLoading, setHomeownerProjectsLoading] = useState(false);
  const [selectedPreLaunchClaim, setSelectedPreLaunchClaim] = useState<any | null>(null);
  const [showRecommendedContractors, setShowRecommendedContractors] = useState(false);
  const [selectedClaimForInvite, setSelectedClaimForInvite] = useState<any | null>(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [claimToLaunch, setClaimToLaunch] = useState<any | null>(null);
  const [ndaSignedCount, setNdaSignedCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, authLoading, router])

  const isContractor = user?.user_metadata?.userType === 'contractor'
  const isHomeowner = user?.user_metadata?.userType === 'homeowner' || !isContractor

  const [selectedJobForChat, setSelectedJobForChat] = useState<Job | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'contractor' | 'homeowner';
    message: string;
    timestamp: Date;
    attachments?: Array<{ name: string; url: string; type: string }>;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const [chatAttachments, setChatAttachments] = useState<File[]>([]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && chatAttachments.length === 0) return;
    
    const message: typeof chatMessages[0] = {
      id: Date.now().toString(),
      sender: 'contractor',
      message: newMessage.trim(),
      timestamp: new Date(),
      attachments: chatAttachments.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'document'
      }))
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    setChatAttachments([]);
    if (chatFileInputRef.current) {
      chatFileInputRef.current.value = '';
    }
  };

  const handleChatFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setChatAttachments(prev => [...prev, ...files]);
  };

  const removeChatAttachment = (index: number) => {
    setChatAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleManageJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleClosePanel = () => {
    setSelectedJob(null);
    setSelectedPhaseProject(null);
    setShowFilesDropdown(false);
  };

  const handleLaunch = (claim: any) => {
    // Launch the project - create auction from claim
    toast.success("Project launched successfully!", {
      description: "Your project is now live and visible to contractors.",
    });
    setShowLaunchModal(false);
    setClaimToLaunch(null);
    // In real implementation, this would call an API to create the auction
    router.push(`/start-claim/create-restor/${claim.id}`);
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

  // Fetch homeowner projects when Active Rebuild tab is selected
  useEffect(() => {
    if (isHomeowner && !authLoading && homeownerTab === 'active-rebuild') {
      setHomeownerProjectsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setHomeownerProjects(getMockHomeownerProjects());
        setHomeownerProjectsLoading(false);
      }, 500);
    }
  }, [isHomeowner, authLoading, homeownerTab]);

  // Fetch homeowner data
  const { data: claims, isLoading: claimsLoading } = useQuery({
    queryKey: ["getClaims"],
    queryFn: async () => {
      if (!user?.id) return []
      const response: any = await apiService.get('/api/claim');
      return response?.claims || [];
    },
    enabled: !!user?.id && isHomeowner
  })

  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ["getAuctions"],
    queryFn: async () => {
      const response: any = await apiService.get('/api/auctions');
      return response?.data || [];
    },
    enabled: !!user?.id
  })

  const { pendingNDAs, phase1Projects, phase2Projects } = useMemo(() => {
    const pendingNDAs: PendingNDA[] = auctions?.filter((auction: any) => auction?.ndas?.some((nda: any) => nda?.userId === user?.id && !nda?.accepted))?.map((auction: any)=> (
        {
          id: auction?.auction_id,
          projectTitle: auction?.title,
          address: auction?.property_address,
          homeownerName: auction?.userEmail,
          requestedDate: auction?.start_date,
          status: auction?.status,
        }
    )) || [];

    // For homeowners: filter by their claim IDs, for contractors: filter by accepted NDAs
    const claimIds = claims?.map((claim: any) => claim.id) || [];
    const filterFunction = isHomeowner 
      ? (auction: any) => claimIds.includes(auction?.claim_id)
      : (auction: any) => auction?.ndas?.find((nda: any) => nda?.userId === user?.id && nda?.accepted);

    const phase1Projects: PhaseProject[] = auctions?.filter(filterFunction)?.map((auction: any) => ({
      id: auction?.auction_id,
      title: auction?.title,
      address: auction?.property_address?.split(", ")?.[0],
      city: auction?.property_address?.split(", ")?.[1],
      state: auction?.property_address?.split(", ")?.[2],
      contractValue: auction?.starting_bid,
      phase1StartDate: auction?.phase1StartDate,
      phase1EndDate: auction?.phase1EndDate,
      status: auction?.phase1StartDate && auction?.phase1EndDate 
        ? (new Date() > new Date(auction?.phase1StartDate) && new Date() < new Date(auction?.phase1EndDate) ? "Active" : "Inactive")
        : "Pending",
      projectType: auction?.project_type,
      bidCount: auction?.bid_count || auction?.bidCount || 0,
      homeownerName: auction?.homeownerName,
      homeownerPhone: '(555) 987-6543',
      description: auction?.description,
      adjustmentPdf: {
        name: 'Insurance_Adjustment_Report.pdf',
        url: auction?.insuranceEstimatePdf
      },
      imageUrls: [],
      files: []
    })) || [];

    const phase2Projects: PhaseProject[] = auctions?.filter(filterFunction)?.map((auction: any) => ({
      id: auction?.auction_id,
      title: auction?.title,
      address: auction?.property_address?.split(", ")?.[0],
      city: auction?.property_address?.split(", ")?.[1],
      state: auction?.property_address?.split(", ")?.[2],
      contractValue: auction?.starting_bid,
      phase2StartDate: auction?.phase2StartDate,
      phase2EndDate: auction?.phase2EndDate,
      status: auction?.phase2StartDate && auction?.phase2EndDate 
        ? (new Date() > new Date(auction?.phase2StartDate) && new Date() < new Date(auction?.phase2EndDate) ? "Active" : "Inactive")
        : "Pending",
      projectType: auction?.project_type,
      homeownerName: auction?.homeownerName,
      homeownerPhone: '(555) 987-6543',
      description: auction?.description,
      adjustmentPdf: {
        name: 'Insurance_Adjustment_Report.pdf',
        url: auction?.insuranceEstimatePdf
      },
      imageUrls: [],
      files: [],
      competingBids: []
    })) || [];

    return { pendingNDAs, phase1Projects, phase2Projects };
  }, [auctions, user?.id, claims, isHomeowner]);

  // Fetch contractor data (only if contractor)
  const { data: contractorMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['contracts', 'metrics'],
    queryFn: async () => {
      const response: any = await apiService.get('/api/contracts/metrics');
      return response;
    },
    enabled: !!user?.id && isContractor
  })

  // Fetch Phase 1 bids for Phase 2 projects
  const { data: phase1Bids, isLoading: phase1BidsLoading } = useQuery({
    queryKey: ['phase1Bids', selectedPhaseProject?.id, auctions],
    queryFn: async () => {
      if (!selectedPhaseProject?.id || !selectedPhaseProject?.phase2StartDate || !auctions) return null;
      
      // Find the current Phase 2 auction
      const currentAuction = auctions?.find((auction: any) => auction?.auction_id === selectedPhaseProject.id);
      if (!currentAuction?.claim_id) return null;
      
      // Find Phase 1 auction for this project (same claim_id, has phase1StartDate but no phase2StartDate)
      const phase1Auction = auctions?.find((auction: any) => 
        auction?.claim_id === currentAuction.claim_id &&
        auction?.phase1StartDate &&
        !auction?.phase2StartDate &&
        auction?.auction_id !== selectedPhaseProject.id
      );
      
      if (!phase1Auction?.auction_id) return null;
      
      try {
        const response: any = await apiService.get(`/api/bids/${phase1Auction.auction_id}`);
        return response?.expandedBidInfo || [];
      } catch (error) {
        console.error('Error fetching Phase 1 bids:', error);
        return [];
      }
    },
    enabled: !!selectedPhaseProject?.id && !!selectedPhaseProject?.phase2StartDate && !!auctions && auctions.length > 0
  });

  // Calculate contractor stats
  const contractorStats = useMemo(() => {
    // Calculate Phase 1 and Phase 2 contract values from projects
    const phase1Value = phase1Projects?.reduce((sum, project) => sum + (project.contractValue || 0), 0);
    const phase2Value = phase2Projects?.reduce((sum, project) => sum + (project.contractValue || 0), 0);
    
    if (!contractorMetrics) {
      return {
        phase1Value,
        phase2Value,
        activeContracts: 0,
        activeValue: 0
      }
    }

    return {
      phase1Value,
      phase2Value,
      activeContracts: contractorMetrics.activeCount || 0,
      activeValue: (contractorMetrics.activeValueCents || 0) / 100
    }
  }, [contractorMetrics, phase1Projects, phase2Projects])

  const fetchContractors = async () => {
    try {
      const response: any = await apiService.get('/api/contractor');
      return response?.contractors || [];
    } catch (error) {
      console.log(error);
    }
  }

  const { data: recommendedContractors } = useQuery({
    queryKey: ['getContractors'],
    queryFn: fetchContractors,
    enabled: !!user?.id && isHomeowner,
  });

  if (authLoading) {
    return <SplashScreen />
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pl-32 overflow-x-hidden">
      {/* Right Side Detail Panel */}
      {selectedJob && (
        <div className="fixed right-0 top-0 h-screen w-1/2 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
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
                    <Button variant="outline" size="sm" className="w-full">
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
                      className="w-full justify-between"
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

      {/* Phase Project Detail Panel */}
      {selectedPhaseProject && (
        <div className="fixed right-0 top-0 h-screen w-1/2 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedPhaseProject.phase1StartDate ? 'Phase 1' : 'Phase 2'} Project Details
              </h2>
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
                  {selectedPhaseProject.title}
                </h3>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {selectedPhaseProject.projectType}
                </Badge>
              </div>

              {/* Phase 1 Bidders - Only for Phase 2 projects */}
              {selectedPhaseProject.phase2StartDate && phase1Bids && phase1Bids.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Phase 1 Bidders (Ranked from Phase 1 End)</h4>
                  <div className="space-y-3">
                    {phase1Bids
                      .sort((a: any, b: any) => a.bid_amount - b.bid_amount)
                      .map((bid: any, index: number) => (
                        <div 
                          key={bid.contractor_id || index} 
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                              #{index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {bid.company_name || bid.contractor_name || `Contractor ${index + 1}`}
                              </p>
                              {bid.contractor_name && bid.contractor_name !== bid.company_name && (
                                <p className="text-xs text-gray-500">{bid.contractor_name}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              ${bid.bid_amount?.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs text-gray-500">Phase 1 Proposal</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Phase 2 Dashboard - Only for Phase 2 */}
              {selectedPhaseProject.phase2StartDate && selectedPhaseProject.competingBids && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Current Phase 2 Bidders</h4>
                  
                  {/* Analytics Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Mean Bid</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${Math.round(
                          selectedPhaseProject.competingBids?.reduce((sum, bid) => sum + bid.bidAmount, 0) /
                          selectedPhaseProject.competingBids.length
                        )?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Total Bidders</p>
                      <p className="text-xl font-bold text-gray-900">
                        {selectedPhaseProject.competingBids.length}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-xs text-blue-600 mb-1">Your Rank</p>
                      <p className="text-xl font-bold text-blue-600">
                        #{selectedPhaseProject.competingBids
                          .sort((a, b) => a.bidAmount - b.bidAmount)
                          .findIndex(bid => bid.isCurrentContractor) + 1}
                      </p>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">Bid Comparison</p>
                    {selectedPhaseProject.competingBids
                      .sort((a, b) => a.bidAmount - b.bidAmount)
                      .map((bid, index) => {
                        const maxBid = Math.max(...selectedPhaseProject.competingBids!.map(b => b.bidAmount));
                        const percentage = (bid.bidAmount / maxBid) * 100;
                        const contractorNumber = index + 1;
                        return (
                          <div key={bid.contractorId} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-medium ${bid.isCurrentContractor ? 'text-blue-600' : 'text-gray-600'}`}>
                                Contractor #{contractorNumber} {bid.isCurrentContractor && '(You)'}
                              </span>
                              <span className={`font-semibold ${bid.isCurrentContractor ? 'text-blue-600' : 'text-gray-900'}`}>
                                ${bid.bidAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6 relative">
                              <div
                                className={`h-6 rounded-full flex items-center justify-end pr-2 ${
                                  bid.isCurrentContractor
                                    ? 'bg-blue-600'
                                    : 'bg-gray-400'
                                }`}
                                style={{ width: `${percentage}%` }}
                              >
                                {bid.isCurrentContractor && (
                                  <span className="text-xs text-white font-medium">
                                    #{index + 1}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Contract Value */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Contract Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${selectedPhaseProject.contractValue.toLocaleString()}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <p className="text-base font-medium text-gray-900">
                    {selectedPhaseProject.address}, {selectedPhaseProject.city}, {selectedPhaseProject.state}
                  </p>
                </div>
              </div>

              {/* Phase Dates */}
              {selectedPhaseProject.phase1StartDate && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Phase 1 Timeline</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">
                        Start: {new Date(selectedPhaseProject.phase1StartDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">
                        End: {new Date(selectedPhaseProject.phase1EndDate!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {selectedPhaseProject.phase2StartDate && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Phase 2 Timeline</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">
                        Start: {new Date(selectedPhaseProject.phase2StartDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">
                        End: {new Date(selectedPhaseProject.phase2EndDate!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Images */}
              {selectedPhaseProject.imageUrls && selectedPhaseProject.imageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Project Photos</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPhaseProject.imageUrls.map((url, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={url}
                          alt={`Project photo ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendly Scheduler - Only for Phase 1 */}
              {selectedPhaseProject.phase1StartDate && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Schedule Site Visit</p>
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => window.open('https://calendly.com/vendle/site-visit', '_blank')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule with Calendly
                  </Button>
                </div>
              )}

              {/* Related Files */}
              {selectedPhaseProject.files && selectedPhaseProject.files.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Related Files</p>
                  <div className="space-y-2">
                    {selectedPhaseProject.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <File className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Adjustment PDF */}
              {selectedPhaseProject.adjustmentPdf && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Insurance Adjustment Document</p>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {selectedPhaseProject.adjustmentPdf.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedPhaseProject.adjustmentPdf!.url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Contact Homeowner</p>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Homeowner Name</p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedPhaseProject.homeownerName}
                    </p>
                  </div>
                </div>
                {selectedPhaseProject.homeownerPhone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedPhaseProject.homeownerPhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedPhaseProject.description && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedPhaseProject.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`transition-all duration-300 ${selectedJob || selectedPhaseProject ? 'pr-[50%]' : ''}`}>
        <div className="container mx-auto px-4 py-8 max-w-full">
          {/* Header */}
          <div className="mb-8">
          <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.email || 'User'}!</h1>
            {user?.user_metadata?.userType && (
              <Badge 
                variant={user?.user_metadata?.userType === 'contractor' ? 'default' : 'secondary'}
                className={
                  user?.user_metadata?.userType === 'contractor'
                    ? 'bg-blue-700 text-white hover:bg-blue-800' 
                    : 'bg-gray-700 text-white hover:bg-gray-800'
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
                <CardTitle className="text-sm font-medium">Phase 1 Contract Value</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${contractorStats.phase1Value?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {phase1Projects?.length} active project{phase1Projects?.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phase 2 Contract Value</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${contractorStats.phase2Value?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {phase2Projects?.length} active project{phase2Projects?.length !== 1 ? 's' : ''}
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
        ) : null}

        {/* Contractor Tabs and Content */}
        {isContractor ? (
          <div className={`space-y-6 transition-all duration-300 ${selectedJob || selectedPhaseProject ? 'pr-[480px]' : ''}`}>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {/* Section 1: Pending NDAs */}
                <button
                  onClick={() => setContractorTab('pending-ndas')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'pending-ndas'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Pending NDAs
                  </div>
                </button>

                {/* Separator */}
                <div className="border-l border-gray-300 h-8 my-auto"></div>

                {/* Section 2: Phase 1 and Phase 2 */}
                <button
                  onClick={() => setContractorTab('phase-1')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'phase-1'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Phase 1
                  </div>
                </button>
                <button
                  onClick={() => setContractorTab('phase-2')}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    contractorTab === 'phase-2'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Phase 2
                  </div>
                </button>

                {/* Separator */}
                <div className="border-l border-gray-300 h-8 my-auto"></div>

                {/* Section 3: My Jobs */}
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
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {contractorTab === 'pending-ndas' ? (
                <>
                  {pendingNDAs?.length === 0 ? (
                    <EmptyState
                      icon={Shield}
                      title="No Pending NDAs"
                      description="You don't have any pending NDAs at this time."
                    />
                  ) : (
                    <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                      selectedJob 
                        ? 'grid-cols-1 md:grid-cols-1' 
                        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    }`}>
                      {pendingNDAs?.map((nda: any) => (
                        <Card key={nda.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">{nda.projectTitle}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{nda.address}</span>
                                </div>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                Pending
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Homeowner:</span>
                                  <span className="font-medium">{nda.homeownerName}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Requested:</span>
                                  <span className="font-medium">{new Date(nda.requestedDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="pt-2">
                                <Button 
                                  variant="default"
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                  onClick={() => {
                                    toast("NDA review functionality coming soon");
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Review NDA
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'phase-1' ? (
                <>
                  {phase1Projects?.length === 0 ? (
                    <EmptyState
                      icon={FileCheck}
                      title="No Phase 1 Projects"
                      description="You don't have any active Phase 1 projects at this time."
                    />
                  ) : (
                    <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                      selectedJob || selectedPhaseProject
                        ? 'grid-cols-1 md:grid-cols-1' 
                        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    }`}>
                      {phase1Projects?.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{project.address}</span>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                Phase 1
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Contract Value:</span>
                                  <span className="font-semibold text-blue-600">${project.contractValue.toLocaleString()}</span>
                                </div>
                                {project.phase1StartDate && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Phase 1 Start:</span>
                                    <span className="font-medium">{new Date(project.phase1StartDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {project.phase1EndDate && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Phase 1 End:</span>
                                    <span className="font-medium">{new Date(project.phase1EndDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {project.adjustmentPdf && (
                                  <div className="flex items-center justify-between text-sm pt-1">
                                    <span className="text-gray-600">Adjustment PDF:</span>
                                    <a
                                      href={project.adjustmentPdf.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <File className="h-3 w-3" />
                                      View
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="pt-2">
                                <Button 
                                  variant="default"
                                  className="w-full bg-blue-600 hover:bg-blue-700 hover:text-white transition-colors"
                                  onClick={() => setSelectedPhaseProject(project)}
                                >
                                  <Activity className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'phase-2' ? (
                <>
                  {phase2Projects?.length === 0 ? (
                    <EmptyState
                      icon={FileCheck}
                      title="No Phase 2 Projects"
                      description="You don't have any active Phase 2 projects at this time."
                    />
                  ) : (
                    <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                      selectedJob || selectedPhaseProject
                        ? 'grid-cols-1 md:grid-cols-1' 
                        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    }`}>
                      {phase2Projects?.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{project.address}</span>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Phase 2
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Contract Value:</span>
                                  <span className="font-semibold text-blue-600">${project.contractValue.toLocaleString()}</span>
                                </div>
                                {project.phase2StartDate && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Phase 2 Start:</span>
                                    <span className="font-medium">{new Date(project.phase2StartDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {project.phase2EndDate && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Phase 2 End:</span>
                                    <span className="font-medium">{new Date(project.phase2EndDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {project.adjustmentPdf && (
                                  <div className="flex items-center justify-between text-sm pt-1">
                                    <span className="text-gray-600">Adjustment PDF:</span>
                                    <a
                                      href={project.adjustmentPdf.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <File className="h-3 w-3" />
                                      View
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="pt-2">
                                <Button 
                                  variant="default"
                                  className="w-full bg-blue-600 hover:bg-blue-700 hover:text-white transition-colors"
                                  onClick={() => setSelectedPhaseProject(project)}
                                >
                                  <Activity className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : contractorTab === 'my-jobs' ? (
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
                    <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                      selectedJob 
                        ? 'grid-cols-1 md:grid-cols-1' 
                        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    }`}>
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
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="font-medium">{job.homeownerPhone || 'N/A'}</span>
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
                              <div className="space-y-2 pt-2">
                                <Button 
                                  variant="outline"
                                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                  onClick={() => {
                                    setSelectedJobForChat(job);
                                    // Load mock chat history
                                    setChatMessages([
                                      {
                                        id: '1',
                                        sender: 'homeowner',
                                        message: 'Hi, I wanted to check on the progress of the restoration work.',
                                        timestamp: new Date(Date.now() - 86400000),
                                      },
                                      {
                                        id: '2',
                                        sender: 'contractor',
                                        message: 'Hello! We\'re making great progress. We\'ve completed the drywall repairs and are moving on to flooring next.',
                                        timestamp: new Date(Date.now() - 82800000),
                                      },
                                      {
                                        id: '3',
                                        sender: 'homeowner',
                                        message: 'That sounds great! When do you expect to finish?',
                                        timestamp: new Date(Date.now() - 79200000),
                                      },
                                    ]);
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </Button>
                                <Button 
                                  variant="default"
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleManageJob(job)}
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
        <div className={`space-y-6 transition-all duration-300 px-4 py-8 max-w-full ${selectedPreLaunchClaim || showRecommendedContractors ? 'pr-[480px]' : ''}`}>
          {/* Homeowner Tab Navigation - Horizontal Layout */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {/* Section 1: Pre-Launch */}
              <button
                onClick={() => setHomeownerTab('pre-launch')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'pre-launch'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Pre-Launch
                </div>
              </button>

              {/* Separator */}
              <div className="border-l border-gray-300 h-8 my-auto"></div>

              {/* Section 2: Phase 1 and Phase 2 */}
              <button
                onClick={() => setHomeownerTab('phase-1')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'phase-1'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Phase 1
                </div>
              </button>
              <button
                onClick={() => setHomeownerTab('phase-2')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'phase-2'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Phase 2
                </div>
              </button>

              {/* Separator */}
              <div className="border-l border-gray-300 h-8 my-auto"></div>

              {/* Section 3: Active Rebuild */}
              <button
                onClick={() => setHomeownerTab('active-rebuild')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  homeownerTab === 'active-rebuild'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Active Rebuild
                </div>
              </button>
            </nav>
          </div>

          {/* Homeowner Tab Content */}
          <div>
            {homeownerTab === 'pre-launch' ? (
              <>
                {claimsLoading ? (
                  <LoadingSkeleton />
                ) : claims?.length === 0 ? (
                  <EmptyState
                    icon={Building2}
                    title="No Pre-Launch Projects"
                    description="Complete the Vendle It process to create a pre-launch project. Once submitted, it will appear here and be visible to contractors."
                    actionLabel="Start Vendle It"
                    onAction={() => router.push('/start-claim')}
                  />
                ) : (
                  <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                    selectedPreLaunchClaim || showRecommendedContractors
                      ? 'grid-cols-1 md:grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  }`}>
                    {claims?.map((claim: any) => (
                      <Card key={claim.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">
                                {claim.title || 'Untitled Project'}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span>{claim.street}, {claim.city}, {claim.state} {claim.zipCode}</span>
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Pre-Launch
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Project Type:</span>
                                <span className="font-medium">{claim.projectType || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  className="flex-1 hover:text-white transition-colors"
                                  onClick={() => {
                                    setShowRecommendedContractors(false);
                                    setSelectedClaimForInvite(null);
                                    setSelectedPreLaunchClaim(claim);
                                  }}
                                >
                                  View Details
                                </Button>
                                <Button 
                                  variant="default"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                                  onClick={() => {
                                    setSelectedPreLaunchClaim(null);
                                    setSelectedClaimForInvite(claim);
                                    setShowRecommendedContractors(true);
                                  }}
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Invite Contractors
                                </Button>
                              </div>
                              <Button 
                                variant="default"
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  // Get count of contractors who signed NDA for this claim
                                  const claimAuction = auctions?.find((auction: any) => auction?.claim_id === claim.id);
                                  const signedNdaCount = claimAuction?.ndas?.filter((nda: any) => nda?.accepted === true)?.length || 0;
                                  
                                  setNdaSignedCount(signedNdaCount);
                                  setClaimToLaunch(claim);
                                  
                                  if (signedNdaCount < 5) {
                                    setShowLaunchModal(true);
                                  } else {
                                    handleLaunch(claim);
                                  }
                                }}
                              >
                                Launch
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : homeownerTab === 'phase-1' ? (
              <>
                {auctionsLoading ? (
                  <LoadingSkeleton />
                ) : phase1Projects?.length === 0 ? (
                  <EmptyState
                    icon={Activity}
                    title="No Phase 1 Projects"
                    description="You don't have any Phase 1 projects at this time. Phase 1 projects will appear here once contractors accept NDAs and begin work."
                  />
                ) : (
                  <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                    selectedPreLaunchClaim || showRecommendedContractors
                      ? 'grid-cols-1 md:grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  }`}>
                    {phase1Projects?.map((project) => (
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
                              project.status === 'Active' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {project.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Number of Bidders:</span>
                                <span className="font-semibold text-blue-600">{(project as any).bidCount || 0}</span>
                              </div>
                              {project.phase1StartDate && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Start Date:</span>
                                  <span className="font-medium">{new Date(project.phase1StartDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {project.phase1EndDate && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">End Date:</span>
                                  <span className="font-medium">{new Date(project.phase1EndDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => router.push(`/auction/${project.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : homeownerTab === 'phase-2' ? (
              <>
                {auctionsLoading ? (
                  <LoadingSkeleton />
                ) : phase2Projects?.length === 0 ? (
                  <EmptyState
                    icon={Activity}
                    title="No Phase 2 Projects"
                    description="You don't have any Phase 2 projects at this time. Phase 2 projects will appear here once Phase 1 is completed."
                  />
                ) : (
                  <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                    selectedPreLaunchClaim || showRecommendedContractors
                      ? 'grid-cols-1 md:grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  }`}>
                    {phase2Projects?.map((project) => (
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
                              project.status === 'Active' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {project.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Project Type:</span>
                                <span className="font-medium">{project.projectType}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Contract Value:</span>
                                <span className="font-semibold text-blue-600">${project.contractValue?.toLocaleString() || '0'}</span>
                              </div>
                              {project.phase2StartDate && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Start Date:</span>
                                  <span className="font-medium">{new Date(project.phase2StartDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {project.phase2EndDate && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">End Date:</span>
                                  <span className="font-medium">{new Date(project.phase2EndDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => router.push(`/auction/${project.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : homeownerTab === 'active-rebuild' ? (
              <>
                {homeownerProjectsLoading ? (
                  <LoadingSkeleton />
                ) : homeownerProjects?.length === 0 ? (
                  <EmptyState
                    icon={Wrench}
                    title="No Active Rebuild Projects"
                    description="Projects that have completed all phases will appear here once construction begins."
                  />
                ) : (
                  <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
                    selectedPreLaunchClaim || showRecommendedContractors
                      ? 'grid-cols-1 md:grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  }`}>
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
            ) : null}
          </div>
        </div>
        )}

        {/* Pre-Launch View Details Panel */}
        {selectedPreLaunchClaim && (
          <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">Pre-Launch Project Details</h2>
                <button
                  onClick={() => setSelectedPreLaunchClaim(null)}
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
                    {selectedPreLaunchClaim.title || 'Untitled Project'}
                  </h3>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {selectedPreLaunchClaim.projectType || 'N/A'}
                  </Badge>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <p className="text-base font-medium text-gray-900">
                      {selectedPreLaunchClaim.street}, {selectedPreLaunchClaim.city}, {selectedPreLaunchClaim.state} {selectedPreLaunchClaim.zipCode}
                    </p>
                  </div>
                </div>

                {/* Phase Dates - Placeholder for now */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Project Timeline</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Phase 1 Timeline</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-500">Start: {selectedPreLaunchClaim.phase1Start}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-500">End: {selectedPreLaunchClaim.phase1End}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Phase 2 Timeline</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-500">Start: {selectedPreLaunchClaim.phase2Start}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-500">End: {selectedPreLaunchClaim.phase2End}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendly Scheduler */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Schedule Site Visit</p>
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => window.open('https://calendly.com/vendle/site-visit', '_blank')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule with Calendly
                  </Button>
                </div>

                {/* Chat Section */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Project Chat</p>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chat functionality coming soon</p>
                    </div>
                  </div>
                </div>

                {/* Contractors who signed NDA */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Contractors with Signed NDAs</p>
                  <div className="space-y-2">
                    {/* Mock NDA contractors - replace with actual data */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          AC
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">ABC Construction</p>
                          <p className="text-xs text-gray-500">NDA signed on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => toast.success("Contractor accepted! They can now see project details.")}
                      >
                        Accept
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                          XY
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">XYZ Builders</p>
                          <p className="text-xs text-gray-500">NDA signed on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => toast.success("Contractor accepted! They can now see project details.")}
                      >
                        Accept
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center pt-2">No other contractors have signed NDAs yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Contractors Panel */}
        {showRecommendedContractors && selectedClaimForInvite && (
          <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">Recommended Contractors</h2>
                <button
                  onClick={() => {
                    setShowRecommendedContractors(false);
                    setSelectedClaimForInvite(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Based on project type: <span className="font-medium">{selectedClaimForInvite.projectType || 'N/A'}</span>
                  </p>
                </div>

                {/* Mock recommended contractors - replace with actual data */}
                <div className="space-y-3">
                  {recommendedContractors?.map((contractor: any) => (
                      <Card className="hover:shadow-md transition-shadow" key={contractor.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                {getContractorInitials(contractor?.companyName)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{contractor?.companyName}</p>
                                <p className="text-xs text-gray-500">Specializes in {selectedClaimForInvite.projectType || 'restoration'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-yellow-600">★★★★★</span>
                                  <span className="text-xs text-gray-500">(24 reviews)</span>
                                </div>
                              </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => toast.success(`Invitation sent to ${contractor?.companyName}`)}
                            >
                              Invite to Bid
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Launch Confirmation Modal */}
        <Dialog open={showLaunchModal} onOpenChange={setShowLaunchModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ready to Launch?</DialogTitle>
              <DialogDescription>
                You currently have {ndaSignedCount} provider{ndaSignedCount !== 1 ? 's' : ''} working with you.
                {ndaSignedCount < 5 && (
                  <span className="block mt-2 font-medium text-gray-900">
                    We recommend inviting {5 - ndaSignedCount} more to make a competitive process.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  if (claimToLaunch) {
                    handleLaunch(claimToLaunch);
                  }
                }}
                className="w-full sm:w-auto"
              >
                Continue without inviting more
              </Button>
              <Button
                onClick={() => {
                  setShowLaunchModal(false);
                  if (claimToLaunch) {
                    setSelectedPreLaunchClaim(null);
                    setSelectedClaimForInvite(claimToLaunch);
                    setShowRecommendedContractors(true);
                  }
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                Invite more
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Chat Modal - Bottom Right */}
        {selectedJobForChat && (
          <div className={`fixed bottom-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-[60] flex flex-col transition-all duration-300 ${selectedJob ? 'right-[calc(50%+24px)]' : 'right-6'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Chat with {selectedJobForChat?.homeownerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJobForChat(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 pr-4 min-h-0">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'contractor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'contractor'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.attachments.map((attachment, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs opacity-90"
                            >
                              <File className="h-3 w-3" />
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:no-underline"
                              >
                                {attachment.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'contractor' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Attachments Preview */}
            {chatAttachments.length > 0 && (
              <div className="border-t pt-2">
                <div className="flex flex-wrap gap-2">
                  {chatAttachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-sm"
                    >
                      <File className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeChatAttachment(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="border-t pt-4 flex gap-2">
              <input
                type="file"
                ref={chatFileInputRef}
                className="hidden"
                multiple
                onChange={handleChatFileSelect}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => chatFileInputRef.current?.click()}
                className="flex-shrink-0"
              >
                <File className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && chatAttachments.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
} 