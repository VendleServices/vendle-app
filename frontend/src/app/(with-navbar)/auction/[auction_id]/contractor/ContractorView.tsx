import { ProjectOverviewCard } from "./ProjectOverviewCard";
import { BidSubmissionForm } from "./BidSubmissionForm";
import { Phase2BidActions } from "./Phase2BidActions";
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
  mockPhase1Bid,
  adjustingBid,
  adjustedBidData,
  onConfirmBid,
  onAdjustBid,
  onSubmitAdjustedBid,
  onWithdraw,
  onCancelAdjust,
  setAdjustedBidData
}: ContractorViewProps) {
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileRemove = () => {
    // This will be handled by parent component through state
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)]">
      {/* LEFT: Project details */}
      <ProjectOverviewCard auction={auction} />

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
          />
        ) : (
          <Phase2BidActions
            mockPhase1Bid={mockPhase1Bid}
            adjustingBid={adjustingBid}
            adjustedBidData={adjustedBidData}
            onConfirmBid={onConfirmBid}
            onAdjustBid={onAdjustBid}
            onSubmitAdjustedBid={onSubmitAdjustedBid}
            onWithdraw={onWithdraw}
            onCancelAdjust={onCancelAdjust}
            setAdjustedBidData={setAdjustedBidData}
          />
        )}
      </div>
    </div>
  );
}
