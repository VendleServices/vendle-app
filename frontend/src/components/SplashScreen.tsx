"use client"

import Image from "next/image"

interface SplashScreenProps {
  className?: string
}

export default function SplashScreen({ className = "" }: SplashScreenProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#2C3E50] ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-2xl flex items-center justify-center">
          <Image
            src="/vendle_logo.jpg"
            alt="Vendle Logo"
            fill
            className="object-contain p-2"
            priority
            sizes="(max-width: 768px) 128px, 160px"
          />
        </div>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:200ms]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:400ms]"></div>
        </div>
      </div>
    </div>
  )
}

