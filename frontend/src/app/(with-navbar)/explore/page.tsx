"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
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
} from "lucide-react"
import { mockJobs, formatPrice, formatLocation, getTimeAgo, type JobPosting } from "@/data/mockJobs"
import { useApiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export default function ExplorePage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const apiService = useApiService()

  const fetchAuctions = async () => {
    try {
      const response: any = await apiService.get('/api/auctions');
      const data = response?.data;

      const activeAuctions = data?.filter((auction: any) => new Date(auction.end_date) > new Date());
      const mappedAuctions = activeAuctions?.map((auction: any, index: number) => ({
        id: auction.auction_id,
        title: auction.title,
        description: auction.description,
        price: typeof auction.startingBid === "string" ? parseInt(auction?.startingBid || "5000") : 5000,
        location: {
          city: auction?.property_address?.split(", ")?.[1] || "",
          state: auction?.property_address?.split(", ")?.[2] || "",
          zipCode: auction?.property_address?.split(", ")?.[3] || ""
        },
        category: auction.project_type,
        postedAt: new Date(auction.start_date),
        deadline: new Date(auction.end_date),
        status: auction.status,
        homeowner: {
          name: "Unknown",
          rating: 5.0
        }
      })) || [] as JobPosting[];
      return mappedAuctions;
    } catch (error) {
      console.log(error);
    }
  }

  const { data: realAuctions, error, isLoading } = useQuery({
    queryKey: ["realAuctions"],
    queryFn: fetchAuctions,
  });

  const sortedJobs = useMemo(() => {
    const jobs: JobPosting[] = [...(realAuctions || []), ...mockJobs];

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
  }, [realAuctions, sortBy, searchQuery]);

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
      // Keep selectedJob so modal can access it, but panel will be hidden by modal backdrop
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

  // Helper function to get map URL - using a placeholder service
  const getMapUrl = (location: JobPosting['location']) => {
    const query = `${location.city}, ${location.state} ${location.zipCode}`
    // Using OpenStreetMap static map as a fallback (no API key needed)
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(query)}&zoom=13&size=400x300&maptype=mapnik`
  }

  return (
    <>
      {/* Main Layout */}
      <div className="flex min-h-screen bg-muted/30">
        {/* Main Content */}
        <main className={`flex-1 pl-32 transition-all duration-300 ${selectedJob ? 'pr-[480px]' : ''}`}>
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
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
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sortedJobs.map((job) => (
                <Card
                  key={job.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20 cursor-pointer ${
                    selectedJob?.id === job.id ? 'border-primary shadow-lg' : ''
                  }`}
                  onClick={() => handleViewDetails(job)}
                >
                  <CardHeader className="space-y-3 pb-4">
                    {/* Title + Category Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">
                        {job.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
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
                    {/* Budget */}
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-semibold tracking-tight text-primary">
                          {formatPrice(job.price)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                    </div>

                    {/* Meta Info: Location + Posted Date */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm leading-tight text-foreground">
                          {formatLocation(job.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Posted {getTimeAgo(job.postedAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      className="w-full rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(job)
                      }}
                    >
                      View Details
                      <Lock className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Right Side Detail Panel */}
        {selectedJob && !showContractModal && (
          <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-border shadow-2xl z-50 flex flex-col">
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
                      <img
                        src={getMapUrl(selectedJob.location)}
                        alt="Location map"
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
                <Lock className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Contract Signing Modal */}
      {selectedJob && (
        <ContractSigningModal
          isOpen={showContractModal}
          onClose={() => {
            setShowContractModal(false)
            setSelectedJob(null)
          }}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          onContractSigned={handleContractSigned}
        />
      )}

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
