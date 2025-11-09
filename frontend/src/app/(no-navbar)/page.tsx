"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SplashScreen from "@/components/SplashScreen"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect everyone to /explore
    router.replace('/explore')
  }, [router])

  return <SplashScreen />
}
