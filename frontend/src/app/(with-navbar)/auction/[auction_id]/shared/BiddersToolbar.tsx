import { Users, Gavel, Sparkles, ArrowDown, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BiddersToolbarProps } from "../types";

export function BiddersToolbar({
  bidCount,
  selectedCount,
  isPhase1,
  onAskAI,
  onCreatePhase2,
  isAskingAI,
  isCreatingPhase2
}: BiddersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-vendle-blue/10 flex items-center justify-center">
          <Users className="w-4 h-4 text-vendle-blue" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-900">Current Bidders</h2>
          <p className="text-xs text-gray-500">
            {bidCount || 0} contractors competing
            {isPhase1 && selectedCount > 0 && (
              <span className="ml-1.5 text-vendle-blue font-medium">
                · {selectedCount} selected
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort dropdown */}
        <Select defaultValue="lowest_bid">
          <SelectTrigger className="w-[130px] h-8 text-xs border-gray-200 bg-white">
            <div className="flex items-center gap-1.5">
              <SortDesc className="w-3 h-3 text-gray-400" />
              <SelectValue placeholder="Sort by..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowest_bid" className="text-xs">
              Lowest Bid
            </SelectItem>
            <SelectItem value="highest_rating" className="text-xs">
              Highest Rating
            </SelectItem>
          </SelectContent>
        </Select>

        {/* AI Recommendation button */}
        <Button
          onClick={onAskAI}
          disabled={isAskingAI || !bidCount || bidCount === 0}
          size="sm"
          className="h-8 px-3 text-xs bg-vendle-blue hover:bg-vendle-blue/90"
        >
          <Sparkles className="w-3 h-3 mr-1.5" />
          {isAskingAI ? "Analyzing..." : "Ask AI"}
        </Button>

        {/* Create Phase 2 Auction button - Homeowners only, Phase 1 only */}
        {isPhase1 && (
          <Button
            onClick={onCreatePhase2}
            disabled={selectedCount === 0 || isCreatingPhase2}
            size="sm"
            className="h-8 px-3 text-xs bg-vendle-teal hover:bg-vendle-teal/90 text-white disabled:opacity-50"
          >
            <Gavel className="w-3 h-3 mr-1.5" />
            Create Phase 2
            {selectedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">
                {selectedCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
