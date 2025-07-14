"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const router = useRouter()

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
      const response = await fetch(`http://localhost:3001/api/claim?user_id=${user.id}`)
      if (!response.ok) throw new Error('Failed to fetch claims')
      return response.json()
    },
    enabled: !!user?.id
  })

  const { data: auctions = [], isLoading: auctionsLoading } = useQuery({
    queryKey: ["getAuctions"],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/auctions')
      if (!response.ok) throw new Error('Failed to fetch auctions')
      return response.json()
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

    const activeClaims = claims.filter((claim: any) => 
      claim.status !== 'completed' && claim.status !== 'closed'
    ).length
    
    const completedClaims = claims.filter((claim: any) => 
      claim.status === 'completed' || claim.status === 'closed'
    ).length

    const activeAuctions = auctions.filter((auction: any) => {
      const endDate = new Date(auction.end_date)
      return auction.status === 'open' && endDate > new Date()
    }).length

    const totalValue = claims.reduce((sum: number, claim: any) => 
      sum + (claim.insuranceEstimate || 0), 0
    )

    return {
      totalClaims: claims.length,
      activeClaims,
      completedClaims,
      totalAuctions: auctions.length,
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
              <Button 
                onClick={() => router.push('/start-claim')}
                className="w-full"
                size="sm"
              >
                Start New Claim
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Claims</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/my-projects?tab=claims')}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {claimsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentClaims.length > 0 ? (
                <div className="space-y-4">
                  {recentClaims.map((claim: any) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{claim.street}</div>
                        <div className="text-sm text-gray-500">{claim.city}, {claim.state}</div>
                        <div className="text-xs text-gray-400">{claim.projectType}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={claim.status === 'completed' ? 'default' : 'secondary'}>
                          {claim.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/claim/${claim.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No claims yet</p>
                  <Button 
                    onClick={() => router.push('/start-claim')}
                    className="mt-2"
                    size="sm"
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
              <div className="flex items-center justify-between">
                <CardTitle>Active Auctions</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/my-projects?tab=auctions')}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {auctionsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentAuctions.length > 0 ? (
                <div className="space-y-4">
                  {recentAuctions.map((auction: any) => (
                    <div key={auction.auction_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{auction.title}</div>
                        <div className="text-sm text-gray-500">
                          Current Bid: ${auction.current_bid?.toLocaleString() || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {auction.bid_count} bids • Ends {new Date(auction.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={auction.status === 'open' ? 'default' : 'secondary'}>
                          {auction.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/auction/${auction.auction_id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No active auctions</p>
                  <Button 
                    onClick={() => router.push('/reverse-auction')}
                    className="mt-2"
                    size="sm"
                  >
                    Browse Auctions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/start-claim')}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Plus className="w-6 h-6" />
              <span>Start New Claim</span>
            </Button>
            
            <Button 
              onClick={() => router.push('/reverse-auction')}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <DollarSign className="w-6 h-6" />
              <span>Browse Auctions</span>
            </Button>
            
            <Button 
              onClick={() => router.push('/contractors')}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Users className="w-6 h-6" />
              <span>Find Contractors</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 