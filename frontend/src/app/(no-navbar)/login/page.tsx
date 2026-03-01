"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import AuthForm from "@/components/AuthForm"
import SplashScreen from "@/components/SplashScreen"

export default function LoginPage() {
  const { user, loading: isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Everyone goes to /home after login, regardless of user type
      router.push('/home')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <SplashScreen />
  }

  // If user is not logged in, show login page
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto">
          <AuthForm type="login" />
        </div>
      </div>
    </div>
  )
} 