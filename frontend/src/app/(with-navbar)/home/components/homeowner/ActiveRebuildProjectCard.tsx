import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Calendar, Clock, Wrench, ArrowRight, Building2 } from "lucide-react";
import { HomeownerProject } from "../types";

interface ActiveRebuildProjectCardProps {
  project: HomeownerProject;
  onViewDetails: () => void;
  onManageProject: () => void;
}

export function ActiveRebuildProjectCard({
  project,
  onViewDetails,
  onManageProject
}: ActiveRebuildProjectCardProps) {
  const getStatusStyles = () => {
    if (project.status === 'active') return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (project.status === 'completed') return { bg: 'bg-vendle-blue/10', text: 'text-vendle-blue', border: 'border-vendle-blue/20' };
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  };

  const getStatusLabel = () => {
    if (project.status === 'active') return 'Active';
    if (project.status === 'completed') return 'Completed';
    return 'Pending';
  };

  const status = getStatusStyles();

  return (
    <div className="bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {project.title}
          </h3>
          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded ${status.bg} ${status.text} ${status.border} text-[10px] font-medium border`}>
            <Wrench className="h-3 w-3" />
            {getStatusLabel()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="line-clamp-1">{project.address}, {project.city}, {project.state}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Contract Value */}
        <div className="p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Contract Value</p>
          <p className="text-lg font-semibold text-gray-900">${project.contractValue.toLocaleString()}</p>
        </div>

        {/* Contractor Info */}
        <div className="p-2 bg-gray-50 rounded border border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Building2 className="h-3 w-3" />
              <span>Contractor</span>
            </div>
            <span className="font-medium text-gray-900 truncate max-w-[150px]">
              {project.contractorCompany || project.contractorName}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="p-3 bg-gray-50 rounded border border-gray-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-vendle-teal h-1.5 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-vendle-teal" />
              <span>Milestones: {project.milestonesCompleted}/{project.totalMilestones}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-0.5">Started</p>
            <p className="text-xs font-medium text-gray-900">
              {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="p-2 bg-gray-50 rounded border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-0.5">Due</p>
            <p className="text-xs font-medium text-gray-900">
              {new Date(project.expectedCompletion).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
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
            className="h-8 text-xs bg-vendle-blue hover:bg-vendle-blue/90"
            onClick={onManageProject}
          >
            Manage
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
