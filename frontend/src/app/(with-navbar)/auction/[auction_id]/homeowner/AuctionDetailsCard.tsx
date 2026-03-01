import { Users, DollarSign, Clock } from "lucide-react";
import { AuctionDetailsCardProps } from "../types";

export function AuctionDetailsCard({ auction }: AuctionDetailsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            {auction?.title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-50 border border-gray-100 text-xs text-gray-600">
              <Users className="h-3 w-3" />
              {auction?.bids?.length} bids
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-vendle-blue/5 border border-vendle-blue/10 text-xs text-vendle-blue">
              <DollarSign className="h-3 w-3" />
              ${auction?.bids?.[0]?.amount}
            </span>
            <span className="px-2 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700 capitalize">
              {auction?.status}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project Description */}
          <div>
            <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">
              Project Description
            </h3>
            <div className="p-3 bg-gray-50 rounded border border-gray-100 space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Description</p>
                <p className="text-sm text-gray-900">
                  {auction?.aiSummary || auction?.additionalNotes || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Project Type</p>
                <p className="text-sm text-gray-900">
                  {auction?.reconstructionType || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Auction Details */}
          <div>
            <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">
              Auction Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
                <div className="w-9 h-9 rounded bg-vendle-blue/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-vendle-blue" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Starting Bid</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${auction?.totalJobValue?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                <div className="w-9 h-9 rounded bg-gray-200 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Auction Ends</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(auction?.endDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
