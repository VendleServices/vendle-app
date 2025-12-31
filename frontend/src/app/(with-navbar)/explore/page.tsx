"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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

  // Mobile detection
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

      const mappedClaims = claims?.map((claim: any, index: number) => ({
        id: claim?.id,
        title: claim?.title,
        description: claim?.additionalNotes,
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
        showViewDetails: !ndaSigned,
        showJoinRestoration: ndaSigned && !claim?.claimParticipants?.map((claimParticipant: any) => claimParticipant?.userId)?.includes(user?.id),
      })) || [] as JobPosting[];
      return mappedClaims;
    } catch (error) {
      console.log(error);
    }
  }

  const { data: realClaims, error, isLoading } = useQuery({
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

  const handleViewOpportunity = () => {
    if (selectedJob) {
      setShowContractModal(true)
    }
  }

  const handleClosePanel = () => {
    setSelectedJob(null)
  }

  const handleContractSigned = () => {
    // Show success modal after contract is signed
    setShowSuccessModal(true)
  }

  const handleContinueToProject = () => {
    if (selectedJob) {
      // Redirect to project details page
      router.push(`/project/${selectedJob.id}`)
      // Reset state
      setShowSuccessModal(false)
      setSelectedJob(null)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 lg:pl-32">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[hsl(217,64%,23%)]" />
          <p className="text-lg text-foreground">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Layout */}
      <div className="flex min-h-screen bg-muted/30">
        {/* Main Content */}
        <main className={`flex-1 lg:pl-32 transition-all duration-300 ${selectedJob ? 'lg:pr-[520px]' : ''}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Explore Opportunities
                </h1>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] rounded-lg border-border focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="highest-pay">Highest pay</SelectItem>
                    {/*<SelectItem value="closest">Closest</SelectItem>*/}
                    {/*<SelectItem value="job-fit">Job fit</SelectItem>*/}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-lg border-border bg-background pl-10 pr-4"
                />
              </div>
            </div>

            {/* Opportunities Grid */}
            {sortedJobs?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No opportunities found
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    {searchQuery
                        ? `No results match "${searchQuery}". Try adjusting your search.`
                        : "There are no opportunities available at the moment. Check back later!"}
                  </p>
                  {searchQuery && (
                      <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setSearchQuery("")}
                      >
                        Clear search
                      </Button>
                  )}
                </div>
            ) : (<div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 transition-all duration-300">
              {sortedJobs?.map((job) => (
                  <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                  >
                  <Card
                      className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl ${
                          selectedJob?.id === job.id ? 'border-[#4A637D] shadow-2xl' : 'border-[#D9D9D9] hover:border-[#4A637D]/50'
                      }`}
                  >
                    {/* Gradient overlay header */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2C3E50] via-[#4A637D] to-[#5A9E8B]" />

                    <CardHeader className="space-y-3 pb-4 pt-6">
                      {/* Title + Category Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight group-hover:text-[#4A637D] transition-colors">
                          {job.title}
                        </h3>
                        <Badge
                            variant="secondary"
                            className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-[#4A637D] to-[#5A9E8B] shadow-sm"
                        >
                          {job.category}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {job.description}
                      </p>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4 pb-4">
                      {/* Budget - Highlighted */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#4A637D]/10 to-[#5A9E8B]/5 border-2 border-[#4A637D]/20 shadow-sm">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Budget</p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-bold tracking-tight text-[#4A637D]">
                            {formatPrice(job.price)}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info: Location + Posted Date */}
                      <div className="space-y-3 p-3 rounded-lg bg-[#D9D9D9]/20 border border-[#D9D9D9]">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4A637D]"/>
                          <span className="text-sm leading-tight text-foreground font-medium">
                            {formatLocation(job.location)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-[#4A637D]"/>
                          <span className="text-sm text-muted-foreground">
                            Posted {getTimeAgo(job.postedAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      {job?.showViewDetails ? (
                          <Button
                              className="w-full rounded-lg bg-gradient-to-r from-[#2C3E50] via-[#4A637D] to-[#5A9E8B] hover:from-[#2C3E50]/90 hover:via-[#4A637D]/90 hover:to-[#5A9E8B]/90 shadow-md hover:shadow-lg transition-all font-semibold"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetails(job)
                              }}
                          >
                            View Details
                            {!isLoggedIn && <Lock className="ml-2 h-4 w-4"/>}
                          </Button>
                      ) : (
                          job?.showJoinRestoration ? (
                              <Button
                                  className="w-full rounded-lg border-2 border-[#4A637D]/30 hover:border-[#4A637D] hover:bg-[#4A637D] hover:text-white transition-all shadow-sm font-semibold"
                                  variant="outline"
                                  disabled={joinRestorationMutation?.isPending}
                                  onClick={() => joinRestorationMutation.mutate(job?.id)}
                              >
                                Join Restoration
                              </Button>
                          ) : (
                              <Button asChild className="w-full rounded-lg bg-gradient-to-r from-[#2C3E50] via-[#4A637D] to-[#5A9E8B] hover:from-[#2C3E50]/90 hover:via-[#4A637D]/90 hover:to-[#5A9E8B]/90 shadow-md hover:shadow-lg transition-all font-semibold">
                                <Link href={`/claim/${job?.id}`}>
                                  Claim Details
                                </Link>
                              </Button>
                          )
                      )}
                    </CardFooter>
                  </Card>
                  </motion.div>
              ))}
            </div>)}
          </div>
        </main>

        {/* Right Side Detail Panel / Mobile Modal */}
        <AnimatePresence>
          {selectedJob && (
            isMobile ? (
              /* Mobile Full-Screen Modal */
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                  onClick={handleClosePanel}
                />
                {/* Modal Content */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="fixed inset-0 bg-white z-50 flex flex-col lg:hidden"
                >
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-border px-4 py-4 flex items-center justify-between z-10 shadow-sm">
                      <h2 className="text-lg font-bold text-foreground">Job Details</h2>
                      <button
                        onClick={handleClosePanel}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-6 space-y-6">
                      {/* Title */}
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {selectedJob.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        >
                          {selectedJob.category}
                        </Badge>
                      </div>

                      {/* Budget */}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatPrice(selectedJob.price)}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base font-medium text-foreground">
                            {formatLocation(selectedJob.location)}
                          </p>
                        </div>
                      </div>

                      {/* Job Image - Pixelized */}
                      {selectedJob.imageUrl && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Job Photos</p>
                          <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
                            <div className="relative w-full h-64 overflow-hidden">
                              <img
                                src={selectedJob.imageUrl}
                                alt={selectedJob.title}
                                className="w-full h-full object-cover"
                                style={{
                                  filter: 'blur(20px) brightness(0.6)',
                                  imageRendering: 'pixelated',
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="flex flex-col items-center gap-2">
                                  <Lock className="h-8 w-8 text-white/90" />
                                  <span className="text-xs text-white/80 font-medium">Locked</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Map - Pixelized */}
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Location Map</p>
                        <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
                          <div className="relative w-full h-64 overflow-hidden">
                            <Map address={`${selectedJob.location.city}, ${selectedJob.location.state} ${selectedJob.location.zipCode}`}/>
                            {!isLoggedIn ? (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="flex flex-col items-center gap-2">
                                  <Lock className="h-8 w-8 text-white/90"/>
                                  <span className="text-xs text-white/80 font-medium">Locked</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information - Locked */}
                      <div className="space-y-3 pt-4 border-t border-border">
                        <p className="text-sm font-semibold text-foreground">Contact Homeowner</p>

                        {/* Phone Number */}
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                          <div className="p-2 bg-muted rounded-lg">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-medium text-foreground blur-sm">
                                {selectedJob.homeowner.phone || '(555) ***-****'}
                              </span>
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        {/* Chat */}
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                          <div className="p-2 bg-muted rounded-lg">
                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">Chat</p>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-medium text-muted-foreground">
                                Locked
                              </span>
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2 pt-4 border-t border-border">
                        <p className="text-sm font-semibold text-foreground">Description</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedJob.description}
                        </p>
                      </div>

                      {/* Posted Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {getTimeAgo(selectedJob.postedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Bottom Panel */}
                  <div className="sticky bottom-0 bg-white border-t border-border px-4 py-4 shadow-lg">
                    <Button
                      className="w-full rounded-lg h-12 text-base font-medium"
                      onClick={handleViewOpportunity}
                    >
                      View Opportunity
                      {!isLoggedIn && <Lock className="ml-2 h-4 w-4"/>}
                    </Button>
                  </div>
                </motion.div>
              </>
            ) : (
              /* Desktop Side Panel */
              <div className="fixed right-0 top-0 h-screen w-[480px] lg:w-[520px] xl:w-[560px] bg-white border-l border-border shadow-2xl z-50 flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-foreground">Job Details</h2>
                <button
                  onClick={handleClosePanel}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {selectedJob.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  >
                    {selectedJob.category}
                  </Badge>
                </div>

                {/* Budget */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(selectedJob.price)}
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-medium text-foreground">
                      {formatLocation(selectedJob.location)}
                    </p>
                  </div>
                </div>

                {/* Job Image - Pixelized */}
                {selectedJob.imageUrl && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Job Photos</p>
                    <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
                      <div className="relative w-full h-64 overflow-hidden">
                        <img
                          src={selectedJob.imageUrl}
                          alt={selectedJob.title}
                          className="w-full h-full object-cover"
                          style={{
                            filter: 'blur(20px) brightness(0.6)',
                            imageRendering: 'pixelated',
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="flex flex-col items-center gap-2">
                            <Lock className="h-8 w-8 text-white/90" />
                            <span className="text-xs text-white/80 font-medium">Locked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Map - Pixelized */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Location Map</p>
                  <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
                    <div className="relative w-full h-64 overflow-hidden">
                      <Map address={`${selectedJob.location.city}, ${selectedJob.location.state} ${selectedJob.location.zipCode}`}/>
                      {!isLoggedIn ? (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="flex flex-col items-center gap-2">
                              <Lock className="h-8 w-8 text-white/90"/>
                              <span className="text-xs text-white/80 font-medium">Locked</span>
                            </div>
                          </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Contact Information - Locked */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Contact Homeowner</p>
                  
                  {/* Phone Number */}
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="p-2 bg-muted rounded-lg">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-foreground blur-sm">
                          {selectedJob.homeowner.phone || '(555) ***-****'}
                        </span>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Chat */}
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="p-2 bg-muted rounded-lg">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Chat</p>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-muted-foreground">
                          Locked
                        </span>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Posted Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {getTimeAgo(selectedJob.postedAt)}</span>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Panel */}
            <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 shadow-lg">
              <Button
                className="w-full rounded-lg h-12 text-base font-medium"
                onClick={handleViewOpportunity}
              >
                View Opportunity
                {!isLoggedIn && <Lock className="ml-2 h-4 w-4"/>}
              </Button>
            </div>
          </div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Contract Signing Modal */}
      {selectedJob && showContractModal ? (
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
      ) : null}

      {/* Success Modal */}
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
