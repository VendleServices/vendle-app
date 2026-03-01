"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { User, Mail, Calendar, Shield, Building, Globe, Phone } from "lucide-react"
import SplashScreen from "@/components/SplashScreen"

export default function ProfilePage() {
  const { user, isLoggedIn, loading: isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/reviews')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return <SplashScreen />
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
          <p className="text-xs text-gray-500">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-vendle-blue" />
              <h2 className="text-sm font-medium text-gray-900">Personal Information</h2>
            </div>
          </div>

          <div className="p-4">
            {/* Avatar Section */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded bg-vendle-blue flex items-center justify-center text-white text-lg font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {user?.email || 'User'}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded bg-vendle-blue/10 text-[10px] font-medium text-vendle-blue capitalize">
                  {user?.user_metadata?.userType || 'User'}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                <div className="w-8 h-8 rounded bg-vendle-blue/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-vendle-blue" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-gray-900 truncate">{user?.email || 'Not provided'}</p>
                </div>
              </div>

              {/* User Type */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                <div className="w-8 h-8 rounded bg-vendle-blue/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-vendle-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Account Type</p>
                  <p className="text-sm text-gray-900 capitalize">{user?.user_metadata?.userType || 'User'}</p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                <div className="w-8 h-8 rounded bg-vendle-blue/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-vendle-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Member Since</p>
                  <p className="text-sm text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Not available'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contractor Info Card */}
        {user?.user_metadata?.userType === 'contractor' && (
          <div className="bg-white border border-gray-200 rounded mb-4">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-vendle-blue" />
                <h2 className="text-sm font-medium text-gray-900">Contractor Information</h2>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                  <div className="w-8 h-8 rounded bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4 text-vendle-teal" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Company Name</p>
                    <p className="text-sm text-gray-900">{(user as any)?.user_metadata?.companyName || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                  <div className="w-8 h-8 rounded bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-vendle-teal" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Website</p>
                    <p className="text-sm text-gray-900 truncate">{(user as any).user_metadata?.companyWebsite || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                  <div className="w-8 h-8 rounded bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-vendle-teal" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Phone Number</p>
                    <p className="text-sm text-gray-900">{(user as any)?.user_metadata?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="p-3 bg-vendle-blue/5 border border-vendle-blue/10 rounded">
          <p className="text-xs text-gray-600">
            <span className="font-medium text-vendle-blue">Coming Soon:</span> Profile editing and additional settings will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
