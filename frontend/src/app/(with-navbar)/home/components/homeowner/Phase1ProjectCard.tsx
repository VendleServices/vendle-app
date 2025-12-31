import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, TrendingUp, Gavel } from "lucide-react";
import { PhaseProject } from "../types";
import { motion } from "framer-motion";

interface Phase1ProjectCardProps {
  project: PhaseProject;
  onViewDetails: () => void;
}

export function Phase1ProjectCard({ project, onViewDetails }: Phase1ProjectCardProps) {
  const bidCount = (project as any)?.bidCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full shadow-lg border-2 border-[#D9D9D9] hover:border-[#4A637D]/50 hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden group">
        {/* Gradient overlay header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2C3E50] via-[#4A637D] to-[#5A9E8B]" />

        <CardHeader className="pb-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-[#D9D9D9]/30 shadow-sm">
                  <Gavel className="h-4 w-4 text-[#4A637D]" />
                </div>
                <Badge className={`shadow-sm ${
                  project.status === 'Active'
                    ? 'bg-[#5A9E8B]/20 text-[#2C3E50] border-[#5A9E8B]'
                    : 'bg-[#D9D9D9]/50 text-[#2C3E50] border-[#D9D9D9]'
                }`}>
                  {project.status}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mb-2 truncate group-hover:text-[#4A637D] transition-colors">
                {project.title}
              </CardTitle>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#4A637D]" />
                <span className="line-clamp-2">{project.address}, {project.city}, {project.state}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats section */}
          <div className="grid grid-cols-1 gap-3">
            {/* Bidders count - prominent display */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#4A637D]/10 to-[#5A9E8B]/5 border-2 border-[#4A637D]/20 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#4A637D]" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Bidders</span>
                </div>
                <span className="text-2xl font-bold text-[#4A637D]">{bidCount}</span>
              </div>
            </div>

            {/* Dates section */}
            <div className="space-y-2 p-3 rounded-lg bg-[#D9D9D9]/20 border border-[#D9D9D9]">
              {project.phase1StartDate && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="font-medium">Start Date</span>
                  </div>
                  <span className="font-semibold text-foreground">{new Date(project.phase1StartDate).toLocaleDateString()}</span>
                </div>
              )}
              {project.phase1EndDate && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="font-medium">End Date</span>
                  </div>
                  <span className="font-semibold text-foreground">{new Date(project.phase1EndDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full border-2 border-[#4A637D]/30 hover:border-[#4A637D] hover:bg-[#4A637D] hover:text-white transition-all shadow-sm hover:shadow-md font-semibold"
              onClick={onViewDetails}
            >
              View Auction Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
