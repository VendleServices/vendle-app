import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Phase1BidsRankingProps } from "../types";
import { cn } from "@/lib/utils";

export function Phase1BidsRanking({ phase1Bids }: Phase1BidsRankingProps) {
  // Sort bids by amount (ascending - lowest bid first)
  const sortedBids = [...phase1Bids].sort((a, b) => a.amount - b.amount);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeClass = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!sortedBids || sortedBids.length === 0) {
    return null;
  }

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="border-b border-border pb-5">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-vendle-blue" />
          Phase 1 Bids Ranking
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Current standing of all Phase 1 participants
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {sortedBids.map((bid, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                index < 3
                  ? "border-vendle-blue/30 bg-gradient-to-r from-vendle-blue/5 to-transparent"
                  : "border-border bg-muted/30"
              )}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <Badge
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    getRankBadgeClass(index)
                  )}
                >
                  {index < 3 ? getRankIcon(index) : `#${index + 1}`}
                </Badge>
              </div>

              {/* Email */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {bid.user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {index === 0 ? "Lowest Bid" : `Rank ${index + 1}`}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  ${bid.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {sortedBids.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Participants</span>
              <span className="font-semibold text-foreground">
                {sortedBids.length}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
