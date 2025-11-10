"use client"

import { useState } from "react"
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
} from "lucide-react"
import { mockJobs, formatPrice, formatLocation, getTimeAgo, type JobPosting } from "@/data/mockJobs"

export default function ExplorePage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const handleViewDetails = (job: JobPosting) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setSelectedJob(job)
    setShowContractModal(true)
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

  return (
    <>
      {/* Main Layout */}
      <div className="flex min-h-screen bg-muted/30">
        {/* Main Content */}
        <main className="flex-1 pl-32">
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
                    <SelectItem value="closest">Closest</SelectItem>
                    <SelectItem value="job-fit">Job fit</SelectItem>
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
              {mockJobs.map((job) => (
                <Card
                  key={job.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20"
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
                      onClick={() => handleViewDetails(job)}
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
