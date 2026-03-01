import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContractorBidCardProps } from "../types";
import { useCreateCheckoutSession } from "@/hooks/usePayment";
import { PaymentBreakdown } from "@/components/PaymentBreakdown";

export function ContractorBidCard({
  bid,
  index,
  isPhase1,
  isSelected,
  onToggleSelection,
  onAccept,
  disableAccept,
  claimId
}: ContractorBidCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const createCheckoutSession = useCreateCheckoutSession();

  const handleAcceptBid = () => {
    createCheckoutSession.mutate({
      bidId: bid?.id || "",
      claimId,
      milestoneStage: "DOWN_PAYMENT"
    });
  };

  const downPaymentAmount = bid.bid_amount * 0.20;
  const downPaymentWithFee = downPaymentAmount * 1.05;

  return (
    <div className="bg-white border border-gray-200 rounded h-full">
      {/* Header with contractor info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded bg-vendle-blue flex items-center justify-center text-white text-sm font-medium">
              {(bid.company_name || bid.contractor_name).charAt(0)}
            </div>
            {/* Verified badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-vendle-teal border border-white flex items-center justify-center">
              <Check className="w-2 h-2 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {bid.company_name || "Independent Contractor"}
              </h3>
              {index < 3 && (
                <span className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded",
                  index === 0
                    ? "bg-vendle-blue/10 text-vendle-blue"
                    : "bg-gray-100 text-gray-600"
                )}>
                  #{index + 1}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {bid.contractor_name}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Contact info */}
        <div className="space-y-1.5">
          <a
            href={`mailto:${bid.email}`}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-vendle-blue transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span className="truncate">{bid.email}</span>
          </a>

          {bid.phone_number && (
            <a
              href={`tel:${bid.phone_number}`}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-vendle-teal transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{bid.phone_number}</span>
            </a>
          )}
        </div>

        {/* Bid amount */}
        <div className="p-3 rounded bg-vendle-blue/5 border border-vendle-blue/10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                Bid Amount
              </p>
              <p className="text-xl font-semibold text-gray-900">
                ${bid.bid_amount.toLocaleString()}
              </p>
            </div>
            {index === 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-vendle-teal/10 text-vendle-teal">
                Lowest
              </span>
            )}
          </div>

          {/* Payment Breakdown Toggle - Only in Phase 2 */}
          {!isPhase1 && (
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-1 text-xs text-vendle-blue hover:text-vendle-blue/80 font-medium mt-2"
            >
              {showBreakdown ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Hide breakdown
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  View breakdown
                </>
              )}
            </button>
          )}
        </div>

        {/* Payment Breakdown - Expandable in Phase 2 */}
        {!isPhase1 && showBreakdown && (
          <div>
            <PaymentBreakdown
              baseAmount={bid.bid_amount}
              currentStage="DOWN_PAYMENT"
              paidStages={[]}
              compact
            />
          </div>
        )}

        {/* Action button */}
        <div className="pt-1">
          {isPhase1 ? (
            // Phase 1: Select for Phase 2
            <Button
              size="sm"
              onClick={onToggleSelection}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "w-full h-8 text-xs font-medium",
                isSelected
                  ? "bg-vendle-blue text-white hover:bg-vendle-blue/90"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              {isSelected && <Check className="w-3 h-3 mr-1.5" />}
              {isSelected ? "Selected for Phase 2" : "Select for Phase 2"}
            </Button>
          ) : (
            // Phase 2: Accept Bid - Pay Down Payment
            <div className="space-y-1.5">
              <Button
                size="sm"
                onClick={handleAcceptBid}
                disabled={createCheckoutSession.isPending}
                className="w-full h-8 bg-vendle-blue hover:bg-vendle-blue/90 text-white text-xs font-medium"
              >
                <Check className="w-3 h-3 mr-1.5" />
                {createCheckoutSession.isPending
                  ? "Processing..."
                  : `Pay Down Payment ($${Math.round(downPaymentWithFee).toLocaleString()})`}
              </Button>
              <p className="text-[10px] text-center text-gray-500">
                20% of bid + 5% service fee
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
