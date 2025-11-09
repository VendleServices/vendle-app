"use client"

import Image from "next/image"

interface SplashScreenProps {
  className?: string
}

export default function SplashScreen({ className = "" }: SplashScreenProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <Image
            src="/vendle_logo.jpg"
            alt="Vendle Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  )
}

