import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Calendar, Clock, MessageSquare, DollarSign, User, Phone, Wrench, ArrowRight } from "lucide-react";
import { Job } from "../types";

interface MyJobCardProps {
  job: Job;
  onManageJob: () => void;
  onOpenChat: () => void;
}

export function MyJobCard({ job, onManageJob, onOpenChat }: MyJobCardProps) {
  const getStatusStyles = () => {
    if (job.status === 'active') return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (job.status === 'completed') return { bg: 'bg-vendle-blue/10', text: 'text-vendle-blue', border: 'border-vendle-blue/20' };
    return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
  };

  const getStatusLabel = () => {
    if (job.status === 'active') return 'Active';
    if (job.status === 'completed') return 'Completed';
    return 'On Hold';
  };

  const status = getStatusStyles();

  return (
    <div className="bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {job.title}
          </h3>
          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded ${status.bg} ${status.text} ${status.border} text-[10px] font-medium border`}>
            <Wrench className="h-3 w-3" />
            {getStatusLabel()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="line-clamp-1">{job.address}, {job.city}, {job.state}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Contract Value & Project Type */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-vendle-blue/5 rounded border border-vendle-blue/10">
            <p className="text-[10px] text-gray-500 mb-0.5">Value</p>
            <p className="text-sm font-semibold text-gray-900">${job.contractValue.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-0.5">Type</p>
            <p className="text-sm font-medium text-gray-900">{job.projectType}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="p-3 bg-gray-50 rounded border border-gray-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-900">{job.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-vendle-teal h-1.5 rounded-full transition-all"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500">
            <span>Milestones: {job.milestonesCompleted}/{job.totalMilestones}</span>
            <span>Due: {new Date(job.expectedCompletion).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Homeowner Info */}
        <div className="p-2 bg-gray-50 rounded border border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-500">
              <User className="h-3 w-3" />
              <span>Homeowner</span>
            </div>
            <span className="font-medium text-gray-900">{job.homeownerName}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs border-gray-200 hover:bg-gray-50"
            onClick={onOpenChat}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-vendle-blue hover:bg-vendle-blue/90"
            onClick={onManageJob}
          >
            Manage
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
