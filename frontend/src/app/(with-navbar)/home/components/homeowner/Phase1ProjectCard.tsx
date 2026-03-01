import { Button } from "@/components/ui/button";
import { MapPin, Users, Gavel, ArrowRight } from "lucide-react";
import { PhaseProject } from "../types";

interface Phase1ProjectCardProps {
  project: PhaseProject;
  onViewDetails: () => void;
}

export function Phase1ProjectCard({ project, onViewDetails }: Phase1ProjectCardProps) {
  const bidCount = (project as any)?.bidCount || 0;

  return (
    <div className="bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {project.title}
          </h3>
          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
            project.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            <Gavel className="h-3 w-3" />
            {project.status}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="line-clamp-1">{project.address}, {project.city}, {project.state}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Active Bidders */}
        <div className="p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              <span>Active Bidders</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">{bidCount}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          {project.phase1StartDate && (
            <div className="p-2 bg-gray-50 rounded border border-gray-100">
              <p className="text-[10px] text-gray-500 mb-0.5">Start</p>
              <p className="text-xs font-medium text-gray-900">
                {new Date(project.phase1StartDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {project.phase1EndDate && (
            <div className="p-2 bg-gray-50 rounded border border-gray-100">
              <p className="text-[10px] text-gray-500 mb-0.5">End</p>
              <p className="text-xs font-medium text-gray-900">
                {new Date(project.phase1EndDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Action button */}
        <Button
          variant="outline"
          className="w-full h-8 text-xs rounded border-gray-200 hover:bg-vendle-blue hover:text-white hover:border-vendle-blue transition-colors"
          onClick={onViewDetails}
        >
          View Auction
          <ArrowRight className="h-3 w-3 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
