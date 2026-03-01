"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LoginModal from "@/components/LoginModal"
import ContractSigningModal from "@/components/ContractSigningModal"
import SuccessModal from "@/components/SuccessModal"
import {
  Search,
  MapPin,
  Calendar,
  Lock,
  X,
  Phone,
  MessageSquare,
  Loader2,
  DollarSign,
  ArrowRight,
} from "lucide-react"
import { formatPrice, formatLocation, getTimeAgo, type JobPosting } from "@/data/mockJobs"
import { useApiService } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Map from "@/components/Map";
import Link from "next/link";

export default function ExplorePage() {
  const router = useRouter()
  const { isLoggedIn, user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isMobile, setIsMobile] = useState(false)
  const apiService = useApiService()
  const queryClient = useQueryClient()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchClaims = async () => {
    try {
      const res: any = await apiService.get(`/api/contractor/${user?.id}`);
      const ndaSigned = res?.ndaSigned;

      const response: any = await apiService.get('/api/claim');
      const claims = response?.claims;

      const mappedClaims = claims?.map((claim: any) => ({
        id: claim?.id,
        title: claim?.title,
        description: claim?.aiSummary || claim?.additionalNotes,
        price: claim?.totalJobValue,
        location: {
          city: claim?.city || "",
          state: claim?.state || "",
          zipCode: claim?.zipcode || ""
        },
        category: claim?.projectType,
        postedAt: new Date(claim?.createdAt),
        deadline: new Date(claim?.phase2End),
        status: claim?.status,
        homeowner: {
          name: claim?.user?.email,
          rating: 5.0
        },
        ndaSigned,
        showViewDetails: true,
        showJoinRestoration: ndaSigned && !claim?.claimParticipants?.map((claimParticipant: any) => claimParticipant?.userId)?.includes(user?.id),
      })) || [] as JobPosting[];
      return mappedClaims;
    } catch (error) {
      console.log(error);
    }
  }

  const { data: realClaims, isLoading } = useQuery({
    queryKey: ["realClaims"],
    queryFn: fetchClaims,
  });

  const handleJoinRestoration = async (jobId: string) => {
    try {
      const response: any = await apiService.post(`/api/claimParticipants/${jobId}`, {});
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const joinRestorationMutation = useMutation({
    mutationFn: handleJoinRestoration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realClaims"] });
      router.push("/home");
    }
  });

  const sortedJobs = useMemo(() => {
    const jobs: JobPosting[] = [...(realClaims || [])];
    const filteredJobs = jobs?.filter(job =>
      job.title?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
    );

    switch(sortBy) {
      case "newest":
        return filteredJobs?.sort((a: JobPosting, b: JobPosting) => b.postedAt?.getTime() - a.postedAt?.getTime())
      case "highest-pay":
        return filteredJobs?.sort((a: JobPosting, b: JobPosting) => b.price - a.price)
      default:
        return filteredJobs
    }
  }, [realClaims, sortBy, searchQuery]);

  const handleViewDetails = (job: JobPosting) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setSelectedJob(job)
  }

  const handleViewOpportunity = (ndaSigned: boolean) => {
    if (ndaSigned && selectedJob) {
      router.push(`/claim/${selectedJob.id}`)
    }
    if (selectedJob && !ndaSigned) {
      setShowContractModal(true)
    }
  }

  const handleClosePanel = () => {
    setSelectedJob(null)
  }

  const handleContractSigned = () => {
    setShowSuccessModal(true)
  }

  const handleContinueToProject = () => {
    if (selectedJob) {
      router.push(`/project/${selectedJob.id}`)
      setShowSuccessModal(false)
      setSelectedJob(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <main className={`transition-all duration-200 ${selectedJob ? 'lg:pr-[480px]' : ''}`}>
          <div className="max-w-6xl mx-auto px-4 py-4">
            {/* Header Row: Title + Search + Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <h1 className="text-lg font-semibold text-gray-900 shrink-0">
                Opportunities
              </h1>
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 pr-3 text-sm rounded border-gray-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 w-32 text-sm rounded border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="highest-pay">Highest pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-gray-500 mb-3">
              {sortedJobs?.length || 0} opportunities
            </p>

            {/* Job Cards */}
            {sortedJobs?.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Search className="h-8 w-8 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">No opportunities found</p>
                <p className="text-xs text-gray-500">
                  {searchQuery ? `No results for "${searchQuery}"` : "Check back later for new opportunities"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs text-vendle-blue hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sortedJobs?.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleViewDetails(job)}
                    className={`group relative bg-white border rounded p-3 cursor-pointer transition-all hover:border-gray-300 ${
                      selectedJob?.id === job.id ? 'border-vendle-blue ring-1 ring-vendle-blue/20' : 'border-gray-200'
                    }`}
                  >
                    {/* Category badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                        {job.category}
                      </Badge>
                      <span className="text-[10px] text-gray-400">
                        {getTimeAgo(job.postedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-vendle-blue transition-colors">
                      {job.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    {/* Footer: Price + Location */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(job.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">
                          {job.location.city}, {job.location.state}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons (shown on hover or always on mobile) */}
                    {(job?.showJoinRestoration) && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-xs rounded border-gray-200 hover:bg-vendle-blue hover:text-white hover:border-vendle-blue"
                          disabled={joinRestorationMutation?.isPending}
                          onClick={(e) => {
                            e.stopPropagation()
                            joinRestorationMutation.mutate(job?.id)
                          }}
                        >
                          Join Restoration
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedJob && (
            isMobile ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={handleClosePanel}
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-x-0 bottom-0 top-12 bg-white z-50 flex flex-col lg:hidden rounded-t-lg"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">Details</h2>
                    <button onClick={handleClosePanel} className="p-1 hover:bg-gray-100 rounded">
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <DetailContent job={selectedJob} isLoggedIn={isLoggedIn} />
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <Button
                      className="w-full h-9 text-sm rounded bg-vendle-blue hover:bg-vendle-blue/90"
                      onClick={() => handleViewOpportunity(!!selectedJob?.ndaSigned)}
                    >
                      View Opportunity
                      {!isLoggedIn && <Lock className="ml-1.5 h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.2 }}
                className="fixed right-0 top-14 bottom-0 w-[480px] bg-white border-l border-gray-200 z-40 flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900">Details</h2>
                  <button onClick={handleClosePanel} className="p-1 hover:bg-gray-100 rounded">
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <DetailContent job={selectedJob} isLoggedIn={isLoggedIn} />
                </div>
                <div className="p-3 border-t border-gray-100">
                  <Button
                    className="w-full h-9 text-sm rounded bg-vendle-blue hover:bg-vendle-blue/90"
                    onClick={() => handleViewOpportunity(!!selectedJob?.ndaSigned)}
                  >
                    View Opportunity
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {selectedJob && showContractModal && (
        <ContractSigningModal
          onClose={() => {
            setShowContractModal(false)
            setSelectedJob(null)
          }}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          isSigned={selectedJob?.ndaSigned || false}
          onContractSigned={handleContractSigned}
        />
      )}

      {selectedJob && (
        <SuccessModal
          isOpen={showSuccessModal}
          onContinue={handleContinueToProject}
          projectTitle={selectedJob.title}
        />
      )}
    </>
  )
}

// Extracted detail content component
function DetailContent({ job, isLoggedIn }: { job: JobPosting; isLoggedIn: boolean }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-medium text-gray-900">{job.title}</h3>
          <span className="flex-shrink-0 px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-600">
            {job.category}
          </span>
        </div>
        <p className="text-xs text-gray-500">{job.description}</p>
      </div>

      {/* Budget */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="p-4">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Budget</p>
          <p className="text-xl font-semibold text-gray-900">{formatPrice(job.price)}</p>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="p-4">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">Location</p>
          <div className="flex items-center gap-1.5 text-sm text-gray-700">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {formatLocation(job.location)}
          </div>
        </div>
        {/* Map */}
        <div className="relative border-t border-gray-100 h-32 overflow-hidden">
          <Map address={`${job.location.city}, ${job.location.state} ${job.location.zipCode}`} />
          {!isLoggedIn && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-4 w-4 text-white mx-auto mb-1" />
                <span className="text-[10px] text-white/80">Sign in to view</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Contact Information</p>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded border border-gray-100">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400 blur-sm">
              (555) ***-****
            </span>
            <Lock className="h-3 w-3 text-gray-300 ml-auto" />
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded border border-gray-100">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Chat locked</span>
            <Lock className="h-3 w-3 text-gray-300 ml-auto" />
          </div>
        </div>
      </div>

      {/* Posted */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2">
        <Calendar className="h-3.5 w-3.5" />
        Posted {getTimeAgo(job.postedAt)}
      </div>
    </div>
  )
}
