import { ProjectOverviewCard } from "./ProjectOverviewCard";
import { BidSubmissionForm } from "./BidSubmissionForm";
import { Phase2BidActions } from "./Phase2BidActions";
import { Phase1BidsRanking } from "./Phase1BidsRanking";
import { ContractorViewProps } from "../types";

export function ContractorView({
  auction,
  isPhase1,
  isPhase2,
  bidData,
  uploadedFile,
  onBidDataChange,
  onFileUpload,
  onSubmitBid,
  isSubmitting,
  fileInputRef,
  contractorPhase1Bid,
  adjustingBid,
  adjustedBidData,
  phase1Bids,
  onConfirmBid,
  onAdjustBid,
  onSubmitAdjustedBid,
  onWithdraw,
  onCancelAdjust,
  setAdjustedBidData,
  disableWithdrawBid,
  disableConfirmBid,
  disableAdjustBid,
  disableSubmit
}: ContractorViewProps) {
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileRemove = () => {
    // This will be handled by parent component through state
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)]">
      {/* LEFT: Project details and Phase 1 bids ranking */}
      <div className="space-y-6">
        <ProjectOverviewCard auction={auction} />

        {/* Phase 1 Bids Ranking - Only show in Phase 2 */}
        {isPhase2 && <Phase1BidsRanking phase1Bids={phase1Bids} />}
      </div>

      {/* RIGHT: Bid submission or Phase 2 actions */}
      <div className="sticky top-6 h-fit">
        {isPhase1 ? (
          <BidSubmissionForm
            bidData={bidData}
            uploadedFile={uploadedFile}
            onBidDataChange={onBidDataChange}
            onFileUpload={onFileUpload}
            onSubmit={onSubmitBid}
            isSubmitting={isSubmitting}
            fileInputRef={fileInputRef}
            onFileClick={handleFileClick}
            onFileRemove={handleFileRemove}
            disableSubmit={disableSubmit}
          />
        ) : (
          <Phase2BidActions
            contractorPhase1Bid={contractorPhase1Bid}
            adjustingBid={adjustingBid}
            adjustedBidData={adjustedBidData}
            onConfirmBid={onConfirmBid}
            onAdjustBid={onAdjustBid}
            onSubmitAdjustedBid={onSubmitAdjustedBid}
            onWithdraw={onWithdraw}
            onCancelAdjust={onCancelAdjust}
            setAdjustedBidData={setAdjustedBidData}
            disableConfirmBid={disableConfirmBid}
            disableAdjustBid={disableAdjustBid}
            disableWithdrawBid={disableWithdrawBid}
          />
        )}
      </div>
    </div>
  );
}
