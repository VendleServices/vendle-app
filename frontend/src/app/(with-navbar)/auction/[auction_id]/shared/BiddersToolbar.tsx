import { Users, Gavel, Sparkles, Star, ArrowDown, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-vendle-blue" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Current Bidders</h2>
          <p className="text-sm text-muted-foreground">
            {bidCount || 0} contractors competing for your project
            {isPhase1 && selectedCount > 0 && (
              <span className="ml-2 text-vendle-blue font-semibold">
                • {selectedCount} selected for Phase 2
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Sort dropdown */}
        <Select defaultValue="lowest_bid">
          <SelectTrigger className="w-[220px] h-11 border-2 border-vendle-gray/30 hover:border-vendle-blue/50 bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <SortDesc className="w-4 h-4 text-vendle-blue" />
              <SelectValue placeholder="Sort by..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowest_bid">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-vendle-teal" />
                <span>Lowest Bid First</span>
              </div>
            </SelectItem>
            <SelectItem value="highest_rating">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#E0C9A6]" />
                <span>Highest Rating</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* AI Recommendation button */}
        <Button
          onClick={onAskAI}
          disabled={isAskingAI}
          className="bg-vendle-blue shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isAskingAI ? "Analyzing..." : "Ask Vendle AI"}
        </Button>

        {/* Create Phase 2 Auction button - Homeowners only, Phase 1 only */}
        {isPhase1 && (
          <Button
            onClick={onCreatePhase2}
            disabled={selectedCount === 0 || isCreatingPhase2}
            className="bg-[#5A9E8B] hover:bg-[#5A9E8B]/90 text-white shadow-lg hover:shadow-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Gavel className="w-4 h-4 mr-2" />
            Create Phase 2 Auction
            {selectedCount > 0 && (
              <Badge className="ml-2 bg-white/20 text-white border-white/30">
                {selectedCount}
              </Badge>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
