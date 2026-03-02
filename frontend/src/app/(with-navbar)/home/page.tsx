"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useApiService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import SplashScreen from "@/components/SplashScreen";
import { toast } from "sonner";
import ContractorMailbox from "@/components/ContractorMailbox";
import MessagingDrawer from "@/components/MessagingDrawer";
import {
  getMockHomeownerProjects,
  type HomeownerProject,
  type Job,
  type PendingNDA,
  type PhaseProject
} from "@/data/mockHomeData";
import { createClient } from "@/auth/client";
import { getSupabaseDownloadUrl } from "@/utils/helpers";

// Import new components
import { DashboardHeader } from "./components/shared/DashboardHeader";
import { ChatModal } from "./components/shared/ChatModal";
import { LaunchConfirmationDialog } from "./components/shared/LaunchConfirmationDialog";
import { ContractorDashboard } from "./components/contractor/ContractorDashboard";
import { JobDetailPanel } from "./components/contractor/JobDetailPanel";
import { HomeownerDashboard } from "./components/homeowner/HomeownerDashboard";
import { PreLaunchDetailPanel } from "./components/homeowner/PreLaunchDetailPanel";
import { RecommendedContractorsPanel } from "./components/homeowner/RecommendedContractorsPanel";
import type { ContractorTab, HomeownerTab, ChatMessage } from "./components/types";

export default function HomePage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const router = useRouter()
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Contractor tab state
  const [contractorTab, setContractorTab] = useState<ContractorTab>('pending-ndas');
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Homeowner tab state
  const [homeownerTab, setHomeownerTab] = useState<HomeownerTab>('pre-launch');
  const [homeownerProjects, setHomeownerProjects] = useState<HomeownerProject[]>([]);
  const [homeownerProjectsLoading, setHomeownerProjectsLoading] = useState(false);
  const [selectedPreLaunchClaim, setSelectedPreLaunchClaim] = useState<any | null>(null);
  const [showRecommendedContractors, setShowRecommendedContractors] = useState(false);
  const [selectedClaimForInvite, setSelectedClaimForInvite] = useState<any | null>(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [claimToLaunch, setClaimToLaunch] = useState<any | null>(null);
  const [ndaSignedCount, setNdaSignedCount] = useState(0);
  const [showMailbox, setShowMailbox] = useState(false);
  const [showMessagesDrawer, setShowMessagesDrawer] = useState(false);

  // Chat state
  const [selectedJobForChat, setSelectedJobForChat] = useState<Job | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatAttachments, setChatAttachments] = useState<File[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, authLoading, router])

  const isContractor = user?.user_metadata?.userType === 'contractor'
  const isHomeowner = user?.user_metadata?.userType === 'homeowner' || !isContractor

  // Chat handlers
  const handleSendMessage = () => {
    if (!newMessage.trim() && chatAttachments.length === 0) return;

    const message: ChatMessage = {
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
  };

  const handleAddChatAttachment = (files: File[]) => {
    setChatAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveChatAttachment = (index: number) => {
    setChatAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Job handlers
  const handleManageJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleClosePanel = () => {
    setSelectedJob(null);
  };

  const handleFileClick = (file: any) => {
    if (file.type === 'pdf') {
      window.open(file.url, '_blank');
    } else {
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

  const handleOpenChat = (job: Job) => {
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
  };

  // Fetch homeowner projects when Active Rebuild tab is selected
  useEffect(() => {
    if (isHomeowner && !authLoading && homeownerTab === 'active-rebuild') {
      setHomeownerProjectsLoading(true);
      setTimeout(() => {
        setHomeownerProjects(getMockHomeownerProjects());
        setHomeownerProjectsLoading(false);
      }, 500);
    }
  }, [isHomeowner, authLoading, homeownerTab]);

  // Fetch homeowner data
  const { data: homeownerClaims, isLoading: claimsLoading } = useQuery({
    queryKey: ["getUserClaims"],
    queryFn: async () => {
      if (!user?.id) return [];
      const response: any = await apiService.get('/api/claim/userClaims');
      return response?.claims || [];
    },
    enabled: !!user?.id && isHomeowner
  });

  // Fetch contractor data
  const { data: contractorClaims, isLoading: contractorClaimsLoading } = useQuery({
    queryKey: ["getContractorClaims"],
    queryFn: async () => {
      if (!user?.id) return [];
      const response: any = await apiService.get('/api/claim/contractorClaims');
      return response?.claims || [];
    },
    enabled: !!user?.id && isContractor
  });

  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ["getAuctions"],
    queryFn: async () => {
      if (!user?.id) return [];
      const response: any = await apiService.get('/api/auction');
      return response?.auctions || [];
    },
    enabled: !!user?.id
  })

  const { data: contractorInvitations } = useQuery({
    queryKey: ["getContractorInvitations"],
    queryFn: async () => {
      if (!user?.id) return [];
      const response: any = await apiService.get('/api/claimInvitations');
      return response?.claimInvitations || [];
    },
    enabled: !!user?.id && isContractor
  });

  const { data: homeownerInvitations } = useQuery({
    queryKey: ["getHomeownerInvitations", selectedClaimForInvite?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response: any = await apiService.get(`/api/claimInvitations/${selectedClaimForInvite?.id}`)
      return response?.claimInvitations || []
    },
    enabled: !!user?.id && isHomeowner && selectedClaimForInvite !== null && !!selectedClaimForInvite?.id
  });

  const inviteContractorMutation = useMutation({
    mutationFn: async (contractorId: any) => {
      const response = await apiService.post(`/api/claimInvitations/${selectedClaimForInvite?.id}`, { contractorId });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getHomeownerInvitations", selectedClaimForInvite?.id ]});
    }
  });

  const pendingNDAs = useMemo(() => {
    const pendingNDAs: PendingNDA[] = contractorClaims?.map((claim: any) => ({
      id: claim?.id,
      projectTitle: claim?.title,
      address: `${claim?.street}, ${claim?.city}, ${claim?.state}, ${claim?.zipCode}`,
      homeownerName: claim?.user?.email,
      requestedDate: claim?.createdAt,
      status: claim?.status,
    })) || [];

    return pendingNDAs;
  }, [contractorClaims]);

  const { phase1Projects, phase2Projects } = useMemo(() => {
    const phase1Projects: PhaseProject[] = auctions?.filter((auction: any) => auction?.number === 1)?.map((auction: any) => ({
      id: auction?.id,
      title: auction?.claim?.title,
      address: auction?.claim?.street,
      city: auction?.claim?.city,
      state: auction?.claim?.state,
      contractValue: auction?.claim?.totalJobValue,
      phase1StartDate: auction?.startDate,
      phase1EndDate: auction?.endDate,
      status: auction?.status,
      projectType: auction?.claim?.projectType,
      bidCount: auction?.bids?.length || 0,
      homeownerName: auction?.claim?.user?.email,
      homeownerPhone: '(555) 987-6543',
      description: auction?.claim?.aiSummary || auction?.claim?.additionalNotes,
      adjustmentPdf: {
        name: 'Insurance_Adjustment_Report.pdf',
        url: getSupabaseDownloadUrl(supabase, auction?.claim?.pdfs?.[0]?.supabase_url|| "")
      },
      imageUrls: [],
      files: []
    })) || [];

    const phase2Projects: PhaseProject[] = auctions?.filter((auction: any) => auction?.number === 2)?.map((auction: any) => ({
      id: auction?.id,
      title: auction?.claim?.title,
      address: auction?.claim?.street,
      city: auction?.claim?.city,
      state: auction?.claim?.state,
      contractValue: auction?.claim?.totalJobValue,
      phase2StartDate: auction?.startDate,
      phase2EndDate: auction?.endDate,
      status: auction?.status,
      projectType: auction?.claim?.projectType,
      bidCount: auction?.bids?.length || 0,
      homeownerName: auction?.claim?.user?.email,
      homeownerPhone: '(555) 987-6543',
      description: auction?.claim?.aiSummary || auction?.claim?.additionalNotes,
      adjustmentPdf: {
        name: 'Insurance_Adjustment_Report.pdf',
        url: getSupabaseDownloadUrl(supabase, auction?.claim?.pdfs?.[0]?.supabase_url || "")
      },
      imageUrls: [],
      files: [],
      competingBids: []
    })) || [];

    return { phase1Projects, phase2Projects };
  }, [auctions, supabase]);

  const existingHomeownerInvitedContractors = useMemo(() => {
    const contractorIds = homeownerInvitations?.map((invitation: any) => invitation?.contractorId);
    return contractorIds || [];
  }, [homeownerInvitations]);

  // Calculate contractor stats
  const contractorStats = useMemo(() => {
    if (!isContractor) {
      return {
        phase1Value: 0,
        phase1Count: 0,
        phase2Value: 0,
        phase2Count: 0,
        activeContracts: 0,
        activeValue: 0
      };
    }

    const phase1Value = phase1Projects?.reduce((sum, project) => sum + (project.contractValue || 0), 0);
    const phase2Value = phase2Projects?.reduce((sum, project) => sum + (project.contractValue || 0), 0);

    return {
      phase1Value: phase1Value || 0,
      phase1Count: phase1Projects?.length || 0,
      phase2Value: phase2Value || 0,
      phase2Count: phase2Projects?.length || 0,
      activeContracts: 0,
      activeValue: 0
    }
  }, [phase1Projects, phase2Projects, isContractor])

  const fetchContractors = async () => {
    try {
      const response: any = await apiService.get(`/api/contractor?claimId=${selectedClaimForInvite?.id}`);
      return response?.contractors || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: recommendedContractors } = useQuery({
    queryKey: ['getContractors'],
    queryFn: fetchContractors,
    enabled: !!user?.id && isHomeowner && !!selectedClaimForInvite?.id,
  });

  const fetchInterestedContractors = async () => {
    try {
      const response: any = await apiService.get(`/api/claimParticipants/${selectedPreLaunchClaim?.id}`);
      const allParticipants = response?.claimParticipants || [];

      const approved = allParticipants.filter((p: any) => p.status === "APPROVED");
      const pending = allParticipants.filter((p: any) => p.status === "PENDING" || p.status === "NDA_SIGNED");

      return {
        approved,
        pending,
        all: [...approved, ...pending]
      };
    } catch (error) {
      console.log(error);
      return { approved: [], pending: [], all: [] };
    }
  }

  const { data: contractorsData } = useQuery({
    queryKey: ['getInterestedContractors', selectedPreLaunchClaim?.id],
    queryFn: fetchInterestedContractors,
    enabled: !!user?.id && isHomeowner && selectedPreLaunchClaim !== null && !!selectedPreLaunchClaim?.id
  });

  const approvedContractors = contractorsData?.approved || [];
  const pendingContractors = contractorsData?.pending || [];

  const acceptContractorParticipation = async (participantId: string) => {
    try {
      const response: any = await apiService.put(`/api/claimParticipants/status/${participantId}`, { newStatus: "APPROVED" });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const acceptContractorMutation = useMutation({
    mutationFn: acceptContractorParticipation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getInterestedContractors", selectedPreLaunchClaim?.id] });
      queryClient.invalidateQueries({ queryKey: ["getContractorClaims"] });
    }
  });

  const handleLaunch = async (claim: any) => {
    try {
      const auctionResponse: any = await apiService.post(`/api/auction/${claim.id}`, {
        number: 1,
        startDate: claim.phase1Start,
        endDate: claim.phase1End,
      });
    } catch (error: any) {
      console.error('Error launching project:', error);
      toast.error("Error launching project", {
        description: error?.message || "Failed to launch project. Please try again.",
      });
    }
  };

  const launchAuctionPhaseOneMutation = useMutation({
    mutationFn: handleLaunch,
    onSuccess: () => {
      setShowLaunchModal(false);
      setClaimToLaunch(null);
      setSelectedPreLaunchClaim(null);

      queryClient.invalidateQueries({ queryKey: ["getUserClaims"] });
      queryClient.invalidateQueries({ queryKey: ["getAuctions"] });
      queryClient.invalidateQueries({ queryKey: ["getContractorClaims"] });

      setHomeownerTab('phase-1');
    }
  })

  // Homeowner handlers
  const handleViewPreLaunchDetails = (claim: any) => {
    setShowRecommendedContractors(false);
    setSelectedClaimForInvite(null);
    setSelectedPreLaunchClaim(claim);
  };

  const handleInviteContractors = (claim: any) => {
    setSelectedPreLaunchClaim(null);
    setSelectedClaimForInvite(claim);
    setShowRecommendedContractors(true);
  };

  const handleLaunchClaim = (claim: any) => {
    setClaimToLaunch(claim);
    launchAuctionPhaseOneMutation.mutate(claim);
  };

  if (authLoading) {
    return <SplashScreen />
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Job Detail Panel (Contractor) */}
      {selectedJob && (
        <JobDetailPanel
          job={selectedJob}
          onClose={handleClosePanel}
          getMapUrl={getMapUrl}
          onFileClick={handleFileClick}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${selectedJob ? 'pr-[50%]' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Header */}
          <DashboardHeader
            user={user!}
            isContractor={isContractor}
            contractorInvitationCount={contractorInvitations?.filter((inv: any) => inv.status === 'PENDING').length || 0}
            onShowMailbox={() => setShowMailbox(true)}
            onShowMessages={() => setShowMessagesDrawer(true)}
          />

          {/* Contractor Dashboard */}
          {isContractor && (
            <ContractorDashboard
              contractorStats={contractorStats}
              pendingNDAs={pendingNDAs}
              phase1Projects={phase1Projects}
              phase2Projects={phase2Projects}
              myJobs={myJobs}
              jobsLoading={jobsLoading}
              activeTab={contractorTab}
              hasJobDetailPanelOpen={!!selectedJob}
              onTabChange={setContractorTab}
              onNavigateToAuction={(auctionId) => router.push(`/auction/${auctionId}`)}
              onManageJob={handleManageJob}
              onOpenChat={handleOpenChat}
            />
          )}

          {/* Homeowner Dashboard */}
          {isHomeowner && (
            <HomeownerDashboard
              preLaunchClaims={homeownerClaims || []}
              phase1Projects={phase1Projects}
              phase2Projects={phase2Projects}
              activeRebuildProjects={homeownerProjects}
              claimsLoading={claimsLoading}
              auctionsLoading={auctionsLoading}
              homeownerProjectsLoading={homeownerProjectsLoading}
              activeTab={homeownerTab}
              hasDetailPanelOpen={!!selectedPreLaunchClaim || showRecommendedContractors}
              onTabChange={setHomeownerTab}
              onNavigateToStartClaim={() => router.push('/start-claim')}
              onNavigateToAuction={(auctionId) => router.push(`/auction/${auctionId}`)}
              onViewPreLaunchDetails={handleViewPreLaunchDetails}
              onInviteContractors={handleInviteContractors}
              onLaunchClaim={handleLaunchClaim}
              onNavigateToProject={(projectId) => router.push(`/projects/${projectId}`)}
              onNavigateToClaim={(claimId) => router.push(`/claim/${claimId}`)}
            />
          )}
        </div>
      </div>

      {/* Pre-Launch Detail Panel (Homeowner) */}
      {selectedPreLaunchClaim && (
        <PreLaunchDetailPanel
          claim={selectedPreLaunchClaim}
          approvedContractors={approvedContractors}
          pendingContractors={pendingContractors}
          onClose={() => setSelectedPreLaunchClaim(null)}
          onAcceptContractor={(participantId) => acceptContractorMutation.mutate(participantId)}
        />
      )}

      {/* Recommended Contractors Panel (Homeowner) */}
      {showRecommendedContractors && selectedClaimForInvite && (
        <RecommendedContractorsPanel
          claim={selectedClaimForInvite}
          contractors={recommendedContractors || []}
          existingInvitedContractorIds={existingHomeownerInvitedContractors}
          onClose={() => {
            setShowRecommendedContractors(false);
            setSelectedClaimForInvite(null);
          }}
          onInviteContractor={(contractorId) => inviteContractorMutation.mutate(contractorId)}
        />
      )}

      {/* Chat Modal (Contractor) */}
      <ChatModal
        job={selectedJobForChat}
        messages={chatMessages}
        newMessage={newMessage}
        attachments={chatAttachments}
        hasJobDetailPanel={!!selectedJob}
        onClose={() => setSelectedJobForChat(null)}
        onSendMessage={handleSendMessage}
        onMessageChange={setNewMessage}
        onAddAttachment={handleAddChatAttachment}
        onRemoveAttachment={handleRemoveChatAttachment}
      />

      {/* Launch Confirmation Dialog (Homeowner) */}
      <LaunchConfirmationDialog
        isOpen={showLaunchModal}
        ndaSignedCount={ndaSignedCount}
        onClose={() => setShowLaunchModal(false)}
        onLaunchWithoutInviting={() => {
          if (claimToLaunch) {
            handleLaunch(claimToLaunch);
          }
        }}
        onInviteMore={() => {
          setShowLaunchModal(false);
          if (claimToLaunch) {
            setSelectedPreLaunchClaim(null);
            setSelectedClaimForInvite(claimToLaunch);
            setShowRecommendedContractors(true);
          }
        }}
      />

      {/* Contractor Mailbox */}
      <ContractorMailbox
        isOpen={showMailbox}
        onClose={() => setShowMailbox(false)}
      />

      {/* Homeowner Messages Drawer */}
      <MessagingDrawer
        isOpen={showMessagesDrawer}
        onClose={() => setShowMessagesDrawer(false)}
      />
    </div>
  )
}
