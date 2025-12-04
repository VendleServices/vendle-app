"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import SplashScreen from "@/components/SplashScreen"

export default function RootPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If user is logged in, redirect to home
        router.replace("/home")
      } else {
        // If user is not logged in, redirect to login
        router.replace("/login")
      }
    }
  }, [user, isLoading, router])

  return <SplashScreen />
}
