import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Rocket, Calendar, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface PreLaunchProjectCardProps {
  claim: any;
  onViewDetails: () => void;
  onInviteContractors: () => void;
  onLaunch: () => void;
}

export function PreLaunchProjectCard({
  claim,
  onViewDetails,
  onInviteContractors,
  onLaunch
}: PreLaunchProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full shadow-lg border-2 border-[#D9D9D9] hover:border-[#4A637D]/50 hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden group">
        {/* Gradient overlay header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#4A637D]" />

        <CardHeader className="pb-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-[#D9D9D9]/30 shadow-sm">
                  <Building2 className="h-4 w-4 text-[#4A637D]" />
                </div>
                <Badge className="bg-[#D9D9D9]/40 text-[#2C3E50] border-[#D9D9D9] shadow-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  Pre-Launch
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mb-2 truncate group-hover:text-[#4A637D] transition-colors">
                {claim.title || 'Untitled Project'}
              </CardTitle>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#4A637D]" />
                <span className="line-clamp-2">{claim.street}, {claim.city}, {claim.state} {claim.zipCode}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Project info section */}
          <div className="p-4 rounded-xl bg-[#D9D9D9]/20 border border-[#D9D9D9]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Type</span>
              <span className="font-bold text-foreground">{claim.projectType || 'N/A'}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-[#D9D9D9] hover:border-[#4A637D] hover:bg-[#4A637D]/5 transition-all shadow-sm"
                onClick={onViewDetails}
              >
                View Details
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-[#5A9E8B] hover:from-[#4A637D]/90 hover:to-[#5A9E8B]/90 shadow-md hover:shadow-lg transition-all"
                onClick={onInviteContractors}
              >
                <Users className="h-4 w-4 mr-1" />
                Invite
              </Button>
            </div>
            <Button
              variant="default"
              className="w-full bg-[#4A637D] hover:bg-[#4A637D]/90 shadow-md hover:shadow-lg transition-all font-bold"
              onClick={onLaunch}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Launch Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
