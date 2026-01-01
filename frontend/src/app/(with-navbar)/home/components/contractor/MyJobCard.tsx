import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Calendar, Clock, MessageSquare, Activity, DollarSign, User, Phone, Wrench } from "lucide-react";
import { Job } from "../types";
import { motion } from "framer-motion";

interface MyJobCardProps {
  job: Job;
  onManageJob: () => void;
  onOpenChat: () => void;
}

export function MyJobCard({ job, onManageJob, onOpenChat }: MyJobCardProps) {
  const getStatusColor = () => {
    if (job.status === 'active') return 'bg-[#5A9E8B]/20 text-[#2C3E50] border-[#5A9E8B]';
    if (job.status === 'completed') return 'bg-[#4A637D]/20 text-[#2C3E50] border-[#4A637D]';
    return 'bg-[#D9D9D9]/50 text-[#2C3E50] border-[#D9D9D9]';
  };

  const getStatusLabel = () => {
    if (job.status === 'active') return 'Active';
    if (job.status === 'completed') return 'Completed';
    return 'On Hold';
  };

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
                  <Wrench className="h-4 w-4 text-[#4A637D]" />
                </div>
                <Badge className={`${getStatusColor()} shadow-sm`}>
                  {getStatusLabel()}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mb-2 truncate group-hover:text-[#4A637D] transition-colors">
                {job.title}
              </CardTitle>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#4A637D]" />
                <span className="line-clamp-2">{job.address}, {job.city}, {job.state}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Info Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#D9D9D9]/20 border border-[#D9D9D9]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Wrench className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Project Type</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{job.projectType}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#4A637D]/10 border border-[#4A637D]/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#4A637D]">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Value</span>
                </div>
                <span className="text-sm font-bold text-[#4A637D]">${job.contractValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Homeowner Info */}
          <div className="space-y-2 p-3 rounded-lg bg-[#D9D9D9]/20 border border-[#D9D9D9]">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="font-medium">Homeowner</span>
              </div>
              <span className="font-semibold text-foreground">{job.homeownerName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span className="font-medium">Phone</span>
              </div>
              <span className="font-semibold text-foreground">{job.homeownerPhone || 'N/A'}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-4 rounded-xl bg-[#4A637D]/10 border-2 border-[#4A637D]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Project Progress</span>
              <span className="text-2xl font-bold text-[#4A637D]">{job.progress}%</span>
            </div>
            <div className="w-full bg-[#D9D9D9]/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#4A637D] h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#5A9E8B]/10 border border-[#5A9E8B]/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#5A9E8B]" />
              <span className="text-sm font-medium text-foreground">Milestones</span>
            </div>
            <span className="text-sm font-bold text-[#2C3E50]">
              {job.milestonesCompleted} / {job.totalMilestones}
            </span>
          </div>

          {/* Dates */}
          <div className="space-y-2 p-3 rounded-lg bg-[#D9D9D9]/20 border border-[#D9D9D9]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Started</span>
              </div>
              <span className="font-semibold text-foreground">{new Date(job.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Expected Completion</span>
              </div>
              <span className="font-semibold text-foreground">{new Date(job.expectedCompletion).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              className="border-2 border-[#4A637D]/30 hover:border-[#4A637D] hover:bg-[#4A637D] hover:text-white transition-all shadow-sm"
              onClick={onOpenChat}
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Message
            </Button>
            <Button
              variant="default"
              className="bg-[#4A637D] hover:bg-[#4A637D]/90 shadow-md hover:shadow-lg transition-all font-semibold"
              onClick={onManageJob}
            >
              <Activity className="h-4 w-4 mr-1.5" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
