import { Button } from "@/components/ui/button";
import { MapPin, Users, Rocket, Calendar, ArrowRight } from "lucide-react";

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
    <div className="bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {claim.title || 'Untitled Project'}
          </h3>
          <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-[10px] font-medium text-amber-700 border border-amber-200">
            <Calendar className="h-3 w-3" />
            Pre-Launch
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="line-clamp-1">{claim.street}, {claim.city}, {claim.state} {claim.zipCode}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Project Type */}
        <div className="p-2 bg-gray-50 rounded border border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Project Type</span>
            <span className="font-medium text-gray-900">{claim.projectType || 'N/A'}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs border-gray-200 hover:bg-gray-50"
            onClick={onViewDetails}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-vendle-teal hover:bg-vendle-teal/90"
            onClick={onInviteContractors}
          >
            <Users className="h-3 w-3 mr-1" />
            Invite
          </Button>
        </div>
        <Button
          className="w-full h-8 text-xs bg-vendle-blue hover:bg-vendle-blue/90"
          onClick={onLaunch}
        >
          <Rocket className="h-3 w-3 mr-1.5" />
          Launch Project
        </Button>
      </div>
    </div>
  );
}
