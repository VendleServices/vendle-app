import { Loader2, Users } from "lucide-react";
import { ContractorBidCard } from "./ContractorBidCard";
import { BidsListProps } from "../types";

export function BidsList({
  bids,
  isLoading,
  isPhase1,
  selectedForPhase2,
  onTogglePhase2Selection,
  onAcceptBid,
  disableAccept,
  claimId
}: BidsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-vendle-blue" />
          <p className="text-lg text-foreground">Loading bids...</p>
        </div>
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <div className="py-16 text-center">
        <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
        <p className="mb-1 text-lg font-semibold text-foreground">
          No bids yet
        </p>
        <p className="text-sm text-muted-foreground">
          Waiting for contractors to submit competitive bids.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {bids.map((bid, index) => (
        <ContractorBidCard
          key={bid.contractor_id}
          bid={bid}
          index={index}
          isPhase1={isPhase1}
          isSelected={selectedForPhase2.has(bid.contractor_id)}
          onToggleSelection={() => onTogglePhase2Selection(bid.contractor_id)}
          onAccept={() => onAcceptBid(bid.contractor_id)}
          disableAccept={disableAccept}
          claimId={claimId}
        />
      ))}
    </div>
  );
}
