"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    <Card className={`w-64 border border-gray-200/50 shadow-2xl bg-white backdrop-blur-xl ${className}`}>
      <CardContent className="p-0 overflow-hidden">
        {/* Header with Image */}
        <div className="relative h-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="absolute -bottom-6 left-4">
            <div className="relative w-12 h-12">
              <Image
                src={member.imgUrl || "/placeholder.svg"}
                alt={member.name}
                fill
                className="rounded-full border-2 border-white shadow-lg object-cover"
              />
            </div>
          </div>

          {/* LinkedIn Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            onClick={() => {
              // TODO: Add LinkedIn URL here
              console.log(`LinkedIn for ${member.name}`)
            }}
          >
            <Linkedin className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="pt-8 px-4 pb-4">
          {/* Name and Role */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">{member.name}</h3>
            <Badge
              variant={getRoleBadgeVariant(member.role)}
              className="text-xs font-semibold px-3 py-1 bg-gray-900 text-white hover:bg-gray-800 border-0"
            >
              {member.role}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 mr-2">
              <MapPin className="h-2.5 w-2.5 text-gray-600" />
            </div>
            <span className="font-medium text-gray-700">{member.location}</span>
          </div>

          {/* Description */}
          {member.description && (
            <p className="text-xs text-gray-600 leading-relaxed font-medium line-clamp-3">{member.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
