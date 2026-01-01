"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Linkedin } from "lucide-react"
import Image from "next/image"
import type { Member } from "@/data/members"

interface TeamMemberPopupProps {
  member: Member
  className?: string
}

export default function TeamMemberPopup({ member, className = "" }: TeamMemberPopupProps) {
  const getRoleBadgeVariant = (role: string) => {
    if (role.includes("Co-Founder")) return "default"
    if (role.includes("Engineer")) return "secondary"
    return "outline"
  }

  return (
    <Card className={`w-80 border-0 shadow-2xl bg-white backdrop-blur-xl overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {/* Large Image Section */}
        <div className="relative h-64 bg-[#2C3E50]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_60%)]" />

          {/* LinkedIn Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-4 left-4 h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10"
            onClick={() => {
              // TODO: Add LinkedIn URL here
              console.log(`LinkedIn for ${member.name}`)
            }}
          >
            <Linkedin className="h-4 w-4" />
          </Button>

          {/* Profile Image */}
          <div className="absolute inset-4 rounded-2xl overflow-hidden">
            <Image src={member.imgUrl || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Name */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">{member.name}</h3>

          {/* Role */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider leading-relaxed">
              {member.role}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 mr-3">
              <MapPin className="h-3 w-3 text-slate-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">{member.location}</span>
          </div>

          {/* Description */}
          {member.description && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">{member.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
