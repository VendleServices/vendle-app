import { Button } from "@/components/ui/button";
import { MapPin, File, ArrowRight, Hammer } from "lucide-react";
import { PhaseProject } from "../types";

interface Phase2ProjectCardProps {
  project: PhaseProject;
  onViewDetails: () => void;
}

export function Phase2ProjectCard({ project, onViewDetails }: Phase2ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {project.title}
          </h3>
          <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-vendle-teal/10 text-[10px] font-medium text-vendle-teal">
            <Hammer className="h-3 w-3" />
            Phase 2
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="line-clamp-1">{project.address}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Contract Value */}
        <div className="p-3 bg-vendle-teal/5 rounded border border-vendle-teal/10">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Contract Value</p>
          <p className="text-lg font-semibold text-gray-900">${project.contractValue.toLocaleString()}</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          {project.phase2StartDate && (
            <div className="p-2 bg-gray-50 rounded border border-gray-100">
              <p className="text-[10px] text-gray-500 mb-0.5">Start</p>
              <p className="text-xs font-medium text-gray-900">
                {new Date(project.phase2StartDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {project.phase2EndDate && (
            <div className="p-2 bg-gray-50 rounded border border-gray-100">
              <p className="text-[10px] text-gray-500 mb-0.5">End</p>
              <p className="text-xs font-medium text-gray-900">
                {new Date(project.phase2EndDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* PDF Link */}
        {project.adjustmentPdf && (
          <a
            href={project.adjustmentPdf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <File className="h-3.5 w-3.5 text-vendle-teal" />
            <span className="text-gray-700">Adjustment PDF</span>
            <span className="ml-auto text-vendle-teal text-[10px] font-medium">View</span>
          </a>
        )}

        {/* Action button */}
        <Button
          variant="outline"
          className="w-full h-8 text-xs rounded border-gray-200 hover:bg-vendle-teal hover:text-white hover:border-vendle-teal transition-colors"
          onClick={onViewDetails}
        >
          View Auction
          <ArrowRight className="h-3 w-3 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
