import { DollarSign, Clock } from "lucide-react";
import { ProjectOverviewCardProps } from "../types";

export function ProjectOverviewCard({ auction }: ProjectOverviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-900">Project Overview</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">
            Description
          </h3>
          <p className="text-sm text-gray-900">
            {auction?.aiSummary || auction?.additionalNotes || "No description available"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Starting Bid</p>
            <p className="text-lg font-semibold text-gray-900">
              ${auction?.totalJobValue?.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">Minimum opening bid</p>
          </div>

          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Auction Ends</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(auction?.endDate).toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">No bids after this time</p>
          </div>
        </div>

        {/* Scope of Work */}
        {auction?.reconstructionType && (
          <div>
            <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">
              Scope of Work
            </h3>
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <p className="text-sm text-gray-900">{auction?.reconstructionType}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
