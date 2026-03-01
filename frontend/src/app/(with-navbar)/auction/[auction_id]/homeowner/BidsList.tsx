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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">Loading bids...</p>
        </div>
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded bg-gray-100 flex items-center justify-center">
          <Users className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900 mb-1">
          No bids yet
        </p>
        <p className="text-xs text-gray-500">
          Waiting for contractors to submit competitive bids.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
