"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import SplashScreen from "@/components/SplashScreen"

export default function RootPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    // Add a small delay to ensure proper rendering
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/home")
      } else {
        router.replace("/login")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, loading, router, mounted])

  // Show splash screen while mounting or loading
  if (!mounted || loading) {
    return <SplashScreen />
  }

  return <SplashScreen />
}
