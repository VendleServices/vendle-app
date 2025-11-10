"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import AuthForm from "@/components/AuthForm"
import SplashScreen from "@/components/SplashScreen"

export default function LoginPage() {
  const { user, isLoading } = useAuth()
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <AuthForm type="login" />
          </div>
        </div>
      </div>
    </div>
  )
} 