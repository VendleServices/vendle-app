import { ArrowLeft, Gavel, Wrench, Users, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuctionHeaderProps } from "../types";

export function AuctionHeader({
  auction,
  bidsCount,
  lowestBid,
  isPhase1,
  isPhase2,
  onBack
}: AuctionHeaderProps) {
  return (
    <div className="mb-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Auctions</span>
      </button>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left: Title & metadata */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Gavel className="w-3 h-3" />
                Live Auction
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded",
                  isPhase1 ? "bg-gray-100 text-gray-700" : "bg-vendle-teal/10 text-vendle-teal"
                )}
              >
                Phase {auction?.number || 1}
              </span>
            </div>

            <h1 className="text-lg font-semibold text-gray-900">
              {auction.title}
            </h1>

            {auction.reconstructionType && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Wrench className="w-3.5 h-3.5" />
                <span>{auction.reconstructionType}</span>
              </div>
            )}
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-0.5">
                <Users className="w-3 h-3" />
                <span className="uppercase tracking-wide">Bids</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{bidsCount || 0}</p>
            </div>

            <div className="px-3 py-2 rounded bg-vendle-blue/5 border border-vendle-blue/10">
              <div className="flex items-center gap-1.5 text-[10px] text-vendle-blue mb-0.5">
                <DollarSign className="w-3 h-3" />
                <span className="uppercase tracking-wide">Lowest</span>
              </div>
              <p className="text-sm font-semibold text-vendle-blue">
                {lowestBid ? `$${lowestBid.toLocaleString()}` : "N/A"}
              </p>
            </div>

            <div className="px-3 py-2 rounded bg-vendle-teal/5 border border-vendle-teal/10">
              <div className="flex items-center gap-1.5 text-[10px] text-vendle-teal mb-0.5">
                <Clock className="w-3 h-3" />
                <span className="uppercase tracking-wide">Status</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 capitalize">{auction.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
