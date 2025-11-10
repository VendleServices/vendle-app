"use client"

import { useEffect, useMemo } from "react"
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
  Plus,
  Briefcase,
  Handshake
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const apiService = useApiService();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, authLoading, router])

  const isContractor = user?.user_type === 'contractor'
  const isHomeowner = user?.user_type === 'homeowner' || !isContractor

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

  const { data: availableAuctions = [], isLoading: availableAuctionsLoading } = useQuery({
    queryKey: ['auctions', 'open'],
    queryFn: async () => {
      const response: any = await apiService.get('/api/auctions?status=open');
      return response?.data || [];
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
    const activeAuctions = homeownerLiveAuctions.length

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
        availableAuctions: 0,
        availableValue: 0,
        ioiCount: 0,
        ioiValue: 0,
        loiCount: 0,
        loiValue: 0,
        activeContracts: 0,
        activeValue: 0
      }
    }

    return {
      availableAuctions: contractorMetrics.availableToBidCount || 0,
      availableValue: (contractorMetrics.availableToBidValueCents || 0) / 100,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Auctions</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractorStats.availableAuctions}</div>
                <p className="text-xs text-muted-foreground">
                  ${contractorStats.availableValue.toLocaleString()} total value
                </p>
              </CardContent>
            </Card>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${homeownerStats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all claims
              </p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Quick Actions for Contractors */}
        {isContractor && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    size="sm"
                  >
                    Browse Available Auctions
                  </Button>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    size="sm"
                  >
                    View Active Contracts
                  </Button>
                  <Button 
                    onClick={() => router.push('/contractor-projects')}
                    variant="outline"
                    size="sm"
                  >
                    My Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity - Conditional based on user type */}
        {isContractor ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Auctions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Available Auctions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableAuctionsLoading ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500">Loading auctions...</p>
                  </div>
                ) : availableAuctions?.length > 0 ? (
                  <div className="space-y-4">
                    {availableAuctions.slice(0, 3).map((auction: any) => (
                      <div key={auction.id || auction.auction_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <Link 
                              href={`/auction/${auction.id || auction.auction_id}`} 
                              className="font-medium text-sm hover:text-blue-500"
                            >
                              {auction.title || 'Untitled Auction'}
                            </Link>
                            <p className="text-xs text-gray-500">
                              ${(auction.startingBid || auction.current_bid || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {auction.bidCount || auction.bid_count || 0} bids
                        </Badge>
                      </div>
                    ))}
                    {availableAuctions.length > 3 && (
                      <Button 
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        className="w-full mt-2"
                        size="sm"
                      >
                        View All Auctions
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No available auctions</p>
                    <Button 
                      onClick={() => router.push('/dashboard')}
                      className="mt-4"
                      size="sm"
                    >
                      Browse Auctions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Active Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contractsLoading ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500">Loading contracts...</p>
                  </div>
                ) : activeContracts?.length > 0 ? (
                  <div className="space-y-4">
                    {activeContracts.slice(0, 3).map((contract: any) => (
                      <div key={contract.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <Link 
                              href={`/contracts/${contract.id}`} 
                              className="font-medium text-sm hover:text-blue-500"
                            >
                              {contract.claim?.street || 'Contract'}
                            </Link>
                            <p className="text-xs text-gray-500">
                              ${((contract.valueCents || 0) / 100).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {contract.status || 'Active'}
                        </Badge>
                      </div>
                    ))}
                    {activeContracts.length > 3 && (
                      <Button 
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        className="w-full mt-2"
                        size="sm"
                      >
                        View All Contracts
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active contracts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Live Auctions */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Live Auctions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auctionsLoading ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500">Loading auctions...</p>
                  </div>
                ) : homeownerLiveAuctions?.length > 0 ? (
                  <div className="space-y-4">
                    {homeownerLiveAuctions.slice(0, 3).map((auction: any) => (
                      <div key={auction.auction_id || auction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <Link 
                              href={`/auction/${auction.auction_id || auction.id}`} 
                              className="font-medium text-sm hover:text-blue-500"
                            >
                              {auction.title}
                            </Link>
                            <p className="text-xs text-gray-500">
                              ${(auction.current_bid || auction.currentBid || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {auction.bid_count || auction.bidCount || 0} bids
                        </Badge>
                      </div>
                    ))}
                    {homeownerLiveAuctions.length > 3 && (
                      <Button 
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        className="w-full mt-2"
                        size="sm"
                      >
                        View All Live Auctions
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No live auctions</p>
                    <p className="text-xs text-gray-400 mt-2">Auctions will appear here when you create them from your claims</p>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
        )}
      </div>
    </div>
  )
} 