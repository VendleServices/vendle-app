"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import AuthForm from "@/components/AuthForm"
import { 
  Shield, 
  Users, 
  Zap, 
  Building2, 
  Home, 
  Wrench, 
  FileText, 
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowRight,
  Play
} from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to dashboard instead of my-projects
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not logged in, show marketing landing page
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left */}
        <Shield className="absolute top-20 left-20 text-blue-200/30 w-12 h-12 animate-pulse" />
        <Users className="absolute top-32 left-32 text-indigo-200/40 w-8 h-8 animate-pulse delay-1000" />
        
        {/* Top right */}
        <Zap className="absolute top-16 right-24 text-purple-200/30 w-10 h-10 animate-pulse delay-500" />
        <Building2 className="absolute top-40 right-16 text-blue-200/40 w-9 h-9 animate-pulse delay-1500" />
        
        {/* Middle left */}
        <Home className="absolute top-1/3 left-12 text-indigo-200/25 w-14 h-14 animate-pulse delay-2000" />
        <Wrench className="absolute top-1/2 left-8 text-purple-200/35 w-7 h-7 animate-pulse delay-3000" />
        
        {/* Middle right */}
        <FileText className="absolute top-1/3 right-8 text-blue-200/30 w-11 h-11 animate-pulse delay-2500" />
        <CheckCircle className="absolute top-1/2 right-12 text-indigo-200/40 w-10 h-10 animate-pulse delay-3500" />
        
        {/* Bottom left */}
        <MapPin className="absolute bottom-32 left-16 text-purple-200/25 w-9 h-9 animate-pulse delay-4000" />
        <Phone className="absolute bottom-20 left-32 text-blue-200/35 w-8 h-8 animate-pulse delay-4500" />
        
        {/* Bottom right */}
        <Mail className="absolute bottom-24 right-20 text-indigo-200/30 w-10 h-10 animate-pulse delay-5000" />
        <Star className="absolute bottom-36 right-8 text-purple-200/40 w-6 h-6 animate-pulse delay-5500" />
        
        {/* Center area (smaller, more subtle) */}
        <Shield className="absolute top-1/4 left-1/4 text-blue-100/20 w-6 h-6 animate-pulse delay-6000" />
        <Users className="absolute top-3/4 right-1/4 text-indigo-100/25 w-5 h-5 animate-pulse delay-6500" />
        <Zap className="absolute bottom-1/4 left-1/3 text-purple-100/20 w-7 h-7 animate-pulse delay-7000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Marketing content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Rebuild Your Home
                  <span className="text-blue-600"> With Confidence</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with trusted contractors, manage your recovery projects, and get the best value for your insurance claims.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Happy Families</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$2M+</div>
                  <div className="text-sm text-gray-600">Claims Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Trusted Contractors</div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div id="login-section" className="bg-white rounded-2xl shadow-xl p-8">
              <AuthForm type="login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
