"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/explore')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pl-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pl-24">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {user?.user_type || 'User'}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                </div>
              </div>

              {/* User Type */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Type</p>
                  <p className="text-gray-900 capitalize">{user?.user_type || 'User'}</p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not available'
                    }
                  </p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-gray-900 font-mono text-sm truncate">
                    {user?.id?.substring(0, 8) || 'Not available'}...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        {user?.user_type === 'contractor' && (
          <Card>
            <CardHeader>
              <CardTitle>Contractor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Company Name</p>
                  <p className="text-gray-900">{(user as any).company_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Company Website</p>
                  <p className="text-gray-900">{(user as any).company_website || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-gray-900">{(user as any).phone_number || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Coming Soon:</span> Profile editing and additional settings will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
