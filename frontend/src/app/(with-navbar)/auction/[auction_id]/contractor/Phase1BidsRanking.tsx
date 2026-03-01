import { Trophy } from "lucide-react";
import { Phase1BidsRankingProps } from "../types";
import { cn } from "@/lib/utils";

export function Phase1BidsRanking({ phase1Bids }: Phase1BidsRankingProps) {
  // Sort bids by amount (ascending - lowest bid first)
  const sortedBids = [...phase1Bids].sort((a, b) => a.amount - b.amount);

  if (!sortedBids || sortedBids.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-vendle-blue" />
          <h2 className="text-sm font-medium text-gray-900">Phase 1 Bids Ranking</h2>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          Current standing of all Phase 1 participants
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {sortedBids.map((bid, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded border transition-colors",
                index < 3
                  ? "border-vendle-blue/20 bg-vendle-blue/5"
                  : "border-gray-100 bg-gray-50"
              )}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <span
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center text-[10px] font-medium",
                    index === 0
                      ? "bg-vendle-blue text-white"
                      : index < 3
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  #{index + 1}
                </span>
              </div>

              {/* Email */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {bid.user.email}
                </p>
                <p className="text-[10px] text-gray-500">
                  {index === 0 ? "Lowest Bid" : `Rank ${index + 1}`}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${bid.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {sortedBids.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Total Participants</span>
              <span className="font-medium text-gray-900">
                {sortedBids.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
