"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApiService } from "@/services/api";
import { 
  Building2, 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  Calendar,
  MapPin,
  Wrench
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface DashboardStats {
  totalClaims: number
  activeClaims: number
  completedClaims: number
  totalAuctions: number
  activeAuctions: number
  totalValue: number
}

interface RecentClaim {
  id: string
  street: string
  city: string
  state: string
  projectType: string
  status: string
  createdAt: Date
}

interface RecentAuction {
  auction_id: string
  title: string
  current_bid: number
  end_date: string
  bid_count: number
  status: string
}

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

  // Fetch dashboard data
  const { data: claims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ["getClaims"],
    queryFn: async () => {
      if (!user?.id) return []
      const response: any = await apiService.get('/api/claim');
      return response?.claims;
    },
    enabled: !!user?.id
  })

  const { data: auctions = [], isLoading: auctionsLoading } = useQuery({
    queryKey: ["getAuctions"],
    queryFn: async () => {
      const response: any = await apiService.get('/api/auctions');
      return response?.data;
    },
    enabled: !!user?.id
  })

  // Calculate stats using useMemo to avoid infinite re-renders
  const stats = useMemo(() => {
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

    const activeAuctions = auctions?.filter((auction: any) => {
      const endDate = new Date(auction.end_date)
      return auction.status === 'open' && endDate > new Date()
    })?.length

    const totalValue = claims.reduce((sum: number, claim: any) => 
      sum + (claim.insuranceEstimate || 0), 0
    )

    return {
      totalClaims: claims?.length,
      activeClaims,
      completedClaims,
      totalAuctions: auctions?.length,
      activeAuctions,
      totalValue
    }
  }, [claims, auctions])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  const recentClaims = claims.slice(0, 3)
  const recentAuctions = auctions.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your recovery projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClaims}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeClaims} active, {stats.completedClaims} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAuctions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalAuctions} total auctions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all claims
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/start-claim')}
                  className="w-full text-xs"
                  size="sm"
                >
                  Start New Claim
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="w-full text-xs"
                  size="sm"
                >
                  View All Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentClaims?.length > 0 ? (
                <div className="space-y-4">
                  {recentClaims?.map((claim: any) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">{claim.street}</p>
                          <p className="text-xs text-gray-500">{claim.city}, {claim.state}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {claim.projectType || 'General'}
                      </Badge>
                    </div>
                  ))}
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    variant="outline" 
                    className="w-full"
                  >
                    View All Claims
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No claims yet</p>
                  <Button 
                    onClick={() => router.push('/start-claim')}
                    className="mt-4"
                  >
                    Start Your First Claim
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Auctions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Recent Auctions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAuctions?.length > 0 ? (
                <div className="space-y-4">
                  {recentAuctions?.map((auction: any) => (
                    <div key={auction.auction_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">{auction.title}</p>
                          <p className="text-xs text-gray-500">${auction.current_bid?.toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {auction.bid_count} bids
                      </Badge>
                    </div>
                  ))}
                  <Button 
                    onClick={() => router.push('/reverse-auction')}
                    variant="outline" 
                    className="w-full"
                  >
                    View All Auctions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No auctions yet</p>
                  <Button 
                    onClick={() => router.push('/reverse-auction')}
                    className="mt-4"
                  >
                    Browse Auctions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 