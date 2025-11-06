"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import LoginModal from "@/components/LoginModal"
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Search
} from "lucide-react"

export default function ExplorePage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Don't show login modal automatically - let users browse freely
  // Modal will be triggered when they try to access protected features

  const handleProtectedAction = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pl-24">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Explore Opportunities</h1>
            <p className="text-gray-600 mt-2">Discover new project opportunities and contracts</p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type to search"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 ml-6">
              <Button variant="outline" size="default" className="gap-2">
                <Users className="h-4 w-4" />
                Job fit
              </Button>
              <Button variant="outline" size="default" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </Button>
              <Button variant="outline" size="default" className="gap-2">
                <Clock className="h-4 w-4" />
                Newest
              </Button>
              <Button variant="outline" size="default" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Most pay
              </Button>
              <Button size="default" className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Star className="h-4 w-4" />
                Refer & earn
              </Button>
            </div>
          </div>

          {/* Empty state */}
          <div className="text-center py-24">
            <Search className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">Explore Opportunities</h3>
            <p className="text-gray-500 text-lg">New project listings will appear here</p>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}
