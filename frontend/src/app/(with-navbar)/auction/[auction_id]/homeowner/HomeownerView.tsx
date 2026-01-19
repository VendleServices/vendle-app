import { AuctionDetailsCard } from "./AuctionDetailsCard";
import { BidsList } from "./BidsList";
import { BiddersToolbar } from "../shared/BiddersToolbar";
import { HomeownerViewProps } from "../types";

export function HomeownerView({
  auction,
  bids,
  bidsLoading,
  isPhase1,
  selectedForPhase2,
  onTogglePhase2Selection,
  onAcceptBid,
  onAskAI,
  onCreatePhase2,
  isAskingAI,
  isCreatingPhase2,
  disableAccept
}: HomeownerViewProps) {
  return (
    <div className="space-y-8">
      {/* Project + auction details */}
      <AuctionDetailsCard auction={auction} />

      {/* Enhanced Bidders Section */}
      <div className="space-y-6">
        {/* Toolbar */}
        <BiddersToolbar
          bidCount={bids?.length || 0}
          selectedCount={selectedForPhase2.size}
          isPhase1={isPhase1}
          onAskAI={onAskAI}
          onCreatePhase2={onCreatePhase2}
          isAskingAI={isAskingAI}
          isCreatingPhase2={isCreatingPhase2}
        />

        {/* Bid cards grid */}
        <BidsList
          bids={bids}
          isLoading={bidsLoading}
          isPhase1={isPhase1}
          selectedForPhase2={selectedForPhase2}
          onTogglePhase2Selection={onTogglePhase2Selection}
          onAcceptBid={onAcceptBid}
          disableAccept={disableAccept}
          claimId={auction.claimId}
        />
      </div>
    </div>
  );
}
