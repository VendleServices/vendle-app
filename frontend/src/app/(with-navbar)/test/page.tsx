"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestTube, CheckCircle, User } from "lucide-react"
import SplashScreen from "@/components/SplashScreen"

export default function TestPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not a homeowner
  useEffect(() => {
    if (!authLoading && (!isLoggedIn || user?.user_metadata?.userType === 'contractor')) {
      router.push('/')
    }
  }, [isLoggedIn, authLoading, router, user])

  if (authLoading) {
    return <SplashScreen />
  }

  if (!isLoggedIn || user?.user_metadata?.userType === 'contractor') {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Page - Homeowner Dashboard</h1>
          <p className="text-gray-600 mt-2">This page is only visible to homeowners/clients (not contractors)</p>
        </div>

        {/* Test Information Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border bg-card shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Dashboard Test Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Homeowner Dashboard Active</p>
                  <p className="text-sm text-green-600">You are viewing the homeowner-specific interface</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">User Type Verification</p>
                  <p className="text-sm text-blue-600">Current user type: {user?.user_metadata?.userType || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <Badge variant="outline">{user?.email || 'N/A'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <Badge variant="outline">{user?.email || 'N/A'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User Type:</span>
                  <Badge variant={user?.user_metadata?.userType === 'homeowner' ? 'default' : 'secondary'}>
                    {user?.user_metadata?.userType || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User ID:</span>
                  <Badge variant="outline" className="text-xs">
                    {user?.id?.substring(0, 8)}...
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 rounded-2xl border bg-card shadow-md">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>✅ If you see this page:</strong> You are successfully logged in as a homeowner/client</p>
              <p><strong>📍 Navigation Test:</strong> Check the navbar - you should see: Home, Dashboard, Start Claim, Test</p>
              <p><strong>🔄 Contractor Test:</strong> Log out and create/login with a contractor account</p>
              <p><strong>🎯 Expected Result:</strong> Contractors should go to /contractor-dashboard and NOT see this Test tab</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
