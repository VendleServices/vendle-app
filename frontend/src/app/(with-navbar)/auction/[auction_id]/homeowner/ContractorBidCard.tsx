import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {/* Ranking badge for top 3 */}
      {index < 3 && (
        <div className="absolute -top-3 -right-3 z-10">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-bold text-white text-sm",
              index === 0
                ? "bg-[#2C3E50]"
                : index === 1
                ? "bg-[#4A637D]"
                : "bg-[#5A9E8B]"
            )}
          >
            #{index + 1}
          </div>
        </div>
      )}

      <Card className="border-2 border-vendle-gray/30 hover:border-vendle-blue/50 hover:shadow-2xl transition-all overflow-hidden group-hover:-translate-y-1 duration-300 h-full">
        {/* Header with contractor info */}
        <div className="p-6 bg-vendle-blue/5 border-b-2 border-vendle-gray/20">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-vendle-blue flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {(bid.company_name || bid.contractor_name).charAt(0)}
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-vendle-teal border-2 border-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground truncate mb-1">
                {bid.company_name || "Independent Contractor"}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {bid.contractor_name}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Contact info */}
          <div className="space-y-3">
            <a
              href={`mailto:${bid.email}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/contact"
            >
              <div className="w-9 h-9 rounded-lg bg-vendle-blue/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-vendle-blue" />
              </div>
              <span className="text-sm text-muted-foreground truncate group-hover/contact:text-vendle-blue">
                {bid.email}
              </span>
            </a>

            {bid.phone_number && (
              <a
                href={`tel:${bid.phone_number}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/contact"
              >
                <div className="w-9 h-9 rounded-lg bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-vendle-teal" />
                </div>
                <span className="text-sm text-muted-foreground group-hover/contact:text-vendle-teal">
                  {bid.phone_number}
                </span>
              </a>
            )}
          </div>

          {/* Bid amount - hero section */}
          <div className="p-5 rounded-xl bg-vendle-blue/10 border-2 border-vendle-blue/20">
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Bid Amount
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ${bid.bid_amount.toLocaleString()}
                </p>
              </div>
              {index === 0 && (
                <Badge className="bg-vendle-teal text-white">Lowest Bid</Badge>
              )}
            </div>

            {/* Payment Breakdown Toggle - Only in Phase 2 */}
            {!isPhase1 && (
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center gap-1 text-sm text-vendle-blue hover:text-vendle-blue/80 font-medium mt-2"
              >
                {showBreakdown ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide Payment Breakdown
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    View Payment Breakdown
                  </>
                )}
              </button>
            )}
          </div>

          {/* Payment Breakdown - Expandable in Phase 2 */}
          {!isPhase1 && showBreakdown && (
            <div className="pt-2">
              <PaymentBreakdown
                baseAmount={bid.bid_amount}
                currentStage="DOWN_PAYMENT"
                paidStages={[]}
                compact
              />
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            {isPhase1 ? (
              // Phase 1: Select for Phase 2
              <Button
                size="sm"
                onClick={onToggleSelection}
                className={cn(
                  "w-full font-bold shadow-lg hover:shadow-xl transition-all",
                  isSelected
                    ? "bg-vendle-blue text-white hover:from-vendle-blue/90 hover:to-vendle-teal/90"
                    : "bg-white border-2 border-vendle-blue text-vendle-blue hover:bg-vendle-blue/5"
                )}
              >
                <Check
                  className={cn(
                    "w-4 h-4 mr-2",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                {isSelected ? "Selected for Phase 2" : "Select for Phase 2"}
              </Button>
            ) : (
              // Phase 2: Accept Bid - Pay Down Payment
              <div className="space-y-2">
                <Button
                  size="sm"
                  onClick={handleAcceptBid}
                  disabled={createCheckoutSession.isPending}
                  className="w-full bg-[#4A637D] hover:bg-[#4A637D]/90 text-white font-bold shadow-lg hover:shadow-xl"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {createCheckoutSession.isPending
                    ? "Processing..."
                    : `Pay Down Payment ($${Math.round(downPaymentWithFee).toLocaleString()})`}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  20% of bid + 5% service fee
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
